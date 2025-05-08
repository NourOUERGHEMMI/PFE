import google.generativeai as genai
import os
from dotenv import load_dotenv

#generative AI
load_dotenv()
genai.configure(api_key=os.getenv('API_KEY'))
model = genai.GenerativeModel('gemini-1.5-flash')

def generativeai(input: str):
    response = model.generate_content(input)
    return response.text