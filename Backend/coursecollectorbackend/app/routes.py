from flask import Blueprint, jsonify, request
from flask_cors import CORS
from app.data_loader import load_csv_data
import google.generativeai as genai
from flask import Flask, request, jsonify
import pdfplumber
from bs4 import BeautifulSoup
import re

main = Blueprint('main', __name__)
CORS(main)
# Load the data at application startup
ratings_data = load_csv_data('data/professor_reviews_with_classnames.csv')

def format_course_details(raw_text):
    """
    Dynamically formats course details into a clean, structured output for the frontend.
    Ensures more detailed and context-aware extraction of policies and rules.

    :param raw_text: The raw Gemini output containing course details.
    :return: A formatted string suitable for display.
    """
    # Use regex to split into sections based on likely headers
    sections = re.split(r"(?<=\n)([A-Z][A-Za-z\s]+:)", raw_text)

    # Create a dictionary of sections with their content
    formatted_sections = {}
    for i in range(1, len(sections), 2):
        header = sections[i].strip().replace(":", "")
        content = sections[i + 1].strip()
        formatted_sections[header] = content

    # Add extra handling for common topics like calculators, policies, etc.
    if "Late Submissions" in formatted_sections:
        formatted_sections["Late Submissions"] = (
            formatted_sections["Late Submissions"] +
            "\n\nImportant: Extensions are generally not allowed unless explicitly stated. Ensure timely submissions."
        )

    if "Academic Integrity" in formatted_sections:
        formatted_sections["Academic Integrity"] = (
            formatted_sections["Academic Integrity"] +
            "\n\nCalculator Usage: Only non-programmable calculators are permitted during exams unless otherwise stated."
        )

    # Format all sections into readable text
    formatted_output = ""
    for header, content in formatted_sections.items():
        formatted_output += f"### {header} ###\n{content}\n\n"

    return formatted_output

def remove_markdown_formatting(text):
    """
    Removes Markdown formatting from a given text.

    :param text: The input text with Markdown formatting.
    :return: Cleaned text without Markdown formatting.
    """
    # Remove headers (e.g., # Header, ## Subheader)
    text = re.sub(r"^#{1,6}\s", "", text, flags=re.MULTILINE)

    # Remove bold and italic (e.g., **bold**, __bold__, *italic*, _italic_)
    text = re.sub(r"(\*\*|__)(.*?)\1", r"\2", text)
    text = re.sub(r"(\*|_)(.*?)\1", r"\2", text)

    # Remove inline code (e.g., `code`)
    text = re.sub(r"`(.*?)`", r"\1", text)

    # Remove links (e.g., [text](url))
    text = re.sub(r"\[([^\]]+)\]\([^\)]+\)", r"\1", text)

    # Remove unordered lists (e.g., - item, * item)
    text = re.sub(r"^(\s*[-*]\s)", "", text, flags=re.MULTILINE)

    # Remove ordered lists (e.g., 1. item, 2. item)
    text = re.sub(r"^\d+\.\s", "", text, flags=re.MULTILINE)

    # Remove blockquotes (e.g., > quote)
    text = re.sub(r"^>\s", "", text, flags=re.MULTILINE)

    # Remove code blocks (e.g., triple backticks ``` or ~~~)
    text = re.sub(r"(```|~~~)[\s\S]*?\1", "", text)

    # Remove extra newlines and trim whitespace
    text = re.sub(r"\n{2,}", "\n", text).strip()
    text = re.sub(r"\s*\n+\s*", " ", text)

    return text
@main.route('/api/courses/<course_code>/professors', methods=['GET'])
def get_professors_by_course(course_code):
    course_data = ratings_data[ratings_data['classname'] == course_code]
    
    if course_data.empty:
        return jsonify({"error": f"No professors found for course {course_code}"}), 404
    
    professors = course_data.groupby('professor_name').agg(
        avg_quality=('quality_rating', 'mean'),
        avg_difficulty=('difficulty_rating', 'mean'),
        review_count=('comments', 'count')
    ).reset_index()
    
    professors_list = professors.to_dict(orient='records')
    return jsonify({"course_code": course_code, "professors": professors_list})

@main.route('/api/professors/<professor_name>', methods=['GET'])
def get_professor_details(professor_name):
    professor_data = ratings_data[ratings_data['professor_name'] == professor_name]
    
    if professor_data.empty:
        return jsonify({"error": f"No details found for professor {professor_name}"}), 404
    
    avg_quality = professor_data['quality_rating'].mean()
    avg_difficulty = professor_data['difficulty_rating'].mean()
    recent_reviews = professor_data[['date', 'comments']].sort_values(by='date', ascending=False).head(5)
    
    details = {
        "professor_name": professor_name,
        "avg_quality": round(avg_quality, 2),
        "avg_difficulty": round(avg_difficulty, 2),
        "recent_reviews": recent_reviews.to_dict(orient='records')
    }
    return jsonify(details)

genai.configure(api_key="AIzaSyCxDrK7bqtYiLzOiIZo5JEUvM5PdJkkmGk")  # Replace with your actual API key
model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    system_instruction="You are an assistant that summarizes the most important details. You will be given a course syllabus, and you will need to summarize all of the important points into bullet points. Give special emphasis on grading schemes, office hours, and relevant information. Assume that academic integrity is common sense. Keep responses under 200 words. Make it readable with proper formatting please. Don't use MD formatting, and don't use stars or \n in your result. Furthermore, Please don't mention "
)

# Function to parse the PDF and extract text
def parse_pdf(file):
    file.seek(0)
    with pdfplumber.open(file) as pdf:
        text = "".join(page.extract_text() for page in pdf.pages)
    return text

# Function to clean the text using BeautifulSoup
def clean_text_with_bs4(raw_text):
    soup = BeautifulSoup("<html><body></body></html>", "html.parser")
    for paragraph in raw_text.split("\n\n"):
        p_tag = soup.new_tag("p")
        p_tag.string = paragraph.strip()
        soup.body.append(p_tag)
    return soup.get_text(separator="\n")

# Function to process text using the Google Gemini API
def parse_with_gemini(cleaned_text):
    response = model.generate_content(cleaned_text)
    if response.candidates:
        return response.candidates[0].content.parts[0].text
    else:
        return "No response generated."

# Route for PDF upload and processing
@main.route('/upload', methods=['POST'])
def process_pdf():
    if not request.files:
        return jsonify({"error": "No files uploaded"}), 400

    # Store all parsed outputs
    parsed_outputs = {}
    try:
        for key, uploaded_file in request.files.items():
            if uploaded_file.filename == '':
                parsed_outputs[key] = "No file selected"
                continue

            # Step 1: Extract text from the PDF
            raw_text = parse_pdf(uploaded_file)

            # Step 2: Clean the text
            cleaned_text = clean_text_with_bs4(raw_text)

            # Step 3: Process the cleaned text with Google Gemini
            parsed_output = parse_with_gemini(cleaned_text)

            # Step 4: Remove Markdown formatting from parsed output
            cleaned_output = remove_markdown_formatting(parsed_output)

            # Add the cleaned output to the results
            parsed_outputs[key] = cleaned_output

        return jsonify(parsed_outputs), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500