import google.generativeai as genai

genai.configure(api_key="AIzaSyBGzbotmSZkQR6NbE-vGIzRfddIqQxnrK0")
model = genai.GenerativeModel("gemini-1.5-flash")
response = model.generate_content("Explain how AI works")
print(response.text)