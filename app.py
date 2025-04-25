from flask import Flask, render_template, request
from dotenv import load_dotenv
import google.generativeai as genai
import requests, os

#### generative AI ####
load_dotenv()
genai.configure(api_key=os.getenv('API_KEY'))
model = genai.GenerativeModel('gemini-1.5-flash')

app = Flask(__name__)

historique = [] # les messages & reponses

def generativeai(input: str):
    response = model.generate_content(input)
    return response.text

@app.route('/', methods=['GET', 'POST'])
def home():
    message = ''
    answer = ''
    if request.method == 'POST':
        message = request.form.get('send', '')
        if message:
            answer = generativeai(message)
            historique.append((message, answer))
    return render_template('index.html', liste=historique)

if __name__ == '__main__':
    app.run(debug=True)
