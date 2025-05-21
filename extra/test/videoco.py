from flask import Flask, render_template, jsonify, request
import requests
import os
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///events.db'
db = SQLAlchemy(app)

DAILY_API_KEY = "8d8e7134abcaaf9c8fb0695ae130da8dec441747c3900a69796a746212ac9774"

class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120))
    description = db.Column(db.Text)
    meeting_url = db.Column(db.String(500))
    date = db.Column(db.String(50))  # Pour simplifier, sinon utiliser DateTime
    heure = db.Column(db.String(20))
    image = db.Column(db.String(500))  # URL ou cheminvide de l'image


@app.route("/")
def index():
    return render_template("videoco.html")

@app.route("/create-room", methods=["POST"])
def create_room():
    title = request.json.get("title")
    description = request.json.get("description")
    date = request.json.get("date")
    heure = request.json.get("heure")
    image = request.json.get("image")
    headers = {
        "Authorization": f"Bearer {DAILY_API_KEY}",
        "Content-Type": "application/json"
    }
    data = {
        "properties": {
            "exp": 3600,
            "enable_chat": True
        }
    }
    response = requests.post("https://api.daily.co/v1/rooms", json=data, headers=headers)
    room_data = response.json()
    url = room_data.get("url")
    # Sauvegarde dans la base
    event = Event(title=title, description=description, meeting_url=url, date=date, heure=heure, image=image)
    db.session.add(event)
    db.session.commit()
    return jsonify(room_data)

@app.route('/join-call')
def join_call():
    return render_template('call.html')  # call.html est la page de visioconférence

@app.route("/events")
def list_events():
    events = Event.query.all()
    return render_template("events.html", events=events)

@app.route('/call/<int:event_id>')
def call(event_id):
    event = Event.query.get_or_404(event_id)
    return render_template('call.html', event=event)

if __name__ == "__main__":
    db.create_all()
    app.run(debug=True)

db.create_all()