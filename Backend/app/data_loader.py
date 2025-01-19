import pandas as pd

def load_csv_data(filepath):
    # Load the CSV file
    data = pd.read_csv(filepath)
    
    # Ensure numeric columns are correctly parsed
    data['quality_rating'] = pd.to_numeric(data['quality_rating'], errors='coerce')
    data['difficulty_rating'] = pd.to_numeric(data['difficulty_rating'], errors='coerce')
    
    return data
