import google.generativeai as genai
import os
from dotenv import load_dotenv

api_key=os.getenv('API_KEY')

# generative AI ####
load_dotenv()
genai.configure(api_key)
model = genai.GenerativeModel('gemini-1.5-flash')

def generativeai(input: str):
    response = model.generate_content(input)
    return response.text

# GOOGLE MEET