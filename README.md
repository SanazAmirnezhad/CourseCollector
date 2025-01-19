# Professor Overview Website

## Project Overview
The **Professor Overview Website** is designed to help first-year engineering students make informed decisions about their courses and professors. Organized by course, this platform provides a holistic rating for professors, considering multiple factors such as the date reviews were posted and common sentiments expressed by students. Additionally, it offers an AI-powered feature that allows students to upload their course syllabus to extract key information like important dates, guidelines, and submission policies.

## Features
### 1. **Professor Ratings by Course**
- Holistic ratings that take into account:
  - Date of reviews
  - Common sentiments from student feedback
- Short summaries of what students typically say about the professor.

### 2. **AI-Powered Syllabus Summarization**
- Upload a course syllabus to:
  - Extract important dates (e.g., assignment deadlines, exam schedules).
  - Summarize submission guidelines and course policies.

### 3. **User-Friendly Interface**
- Simple and intuitive navigation for first-year students.
- Organized information by course for quick access.

## Technology Stack
- **Backend**: Python Flask
- **Frontend**: React
- **AI Integration**: NLP models for summarization
- **Database**: [Insert your database solution, e.g., PostgreSQL, MongoDB]
- **APIs**: [Specify APIs used, if any]

## Getting Started

### Prerequisites
- Python 3.x
- Flask
- Node.js and npm

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/professor-overview.git
   cd professor-overview
   ```

2. Set up the backend:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. Set up the frontend:
   ```bash
   cd ../frontend
   npm install
   ```

4. Run the backend server:
   ```bash
   cd ../backend
   python3 app.py
   ```

5. Run the frontend server:
   ```bash
   cd ../frontend
   npm start
   ```

### Usage
1. Visit `http://localhost:3000` to access the platform.
2. Browse professor ratings organized by course.
3. Upload a syllabus to extract and summarize key details.
