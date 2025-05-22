from flask import Blueprint, redirect, render_template, request, url_for, session, flash
from flask_login import login_required, current_user
from ..API import generativeai
from ..forms import valid_file
from ..models import Document, Event
from app import db

bp = Blueprint('main', __name__)

@bp.route('/') 
def index():
    """
    INDEX PAGE
    PAGE INDEX
    """
    return render_template('index.html')

@bp.route('/dashboard', methods=('GET', 'POST')) 
@login_required
def dashboard():
    if current_user.role != 'employee':
        return redirect(
            url_for(
                "admin.admin" if current_user.role == "admin" else
                "rh.index" if current_user.role == "rh" else
                "main.dashboard"
            )
        )

    # GEMINI
    if 'answers' not in session:
        session['answers'] = []
    if request.method == 'POST':
        msg = request.form['msg']
        if msg:
            ans = generativeai(input=msg)
            session['answers'].append((msg, ans))
            session.modified=True
            
    # UPLOAD FILES
    files = Document.query.filter_by(emp_id=current_user.id).all()
    return render_template('user.html', user=current_user, answers=session['answers'], files=files)

@bp.route('/events', methods=['GET', 'POST']) 
@login_required
def events():
    if current_user.role == 'admin':
        return redirect(url_for("admin.admin"))
    
    events = Event.query.filter_by(rh_id=current_user.id).all() if current_user.role == 'rh' else []
    all_events = Event.query.all()
    return render_template('events.html', user=current_user, events=events, all_events=all_events)

@bp.route('/upload', methods=['POST'])
@login_required
def upload():
    if current_user.role != 'employee':
        return redirect(
            url_for(
                "admin.admin" if current_user.role == "admin" else
                "rh.index" if current_user.role == "rh" else
                "main.dashboard"
            )
        )
    
    if request.method == 'POST':
        doc = valid_file(request, current_user.id)
        if doc:
            db.session.add(doc)
            db.session.commit()
            flash("File uploaded successfully")
            
    return redirect(url_for('main.dashboard'))

