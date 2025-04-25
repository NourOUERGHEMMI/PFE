from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

# Replace this with your actual Gemini API key
API_KEY = 'YOUR_GEMINI_API_KEY'

GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message')

    headers = {
        'Content-Type': 'application/json'
    }
    params = {
        'key': API_KEY
    }
    data = {
        "contents": [
            {"parts": [{"text": user_message}]}
        ]
    }

    response = requests.post(GEMINI_URL, headers=headers, params=params, json=data)
    gemini_response = response.json()
    
    try:
        reply = gemini_response['candidates'][0]['content']['parts'][0]['text']
    except:
        reply = "Sorry, I couldn't understand that."

    return jsonify({'reply': reply})

if __name__ == '__main__':
    app.run(debug=True)

