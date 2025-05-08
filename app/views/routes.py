from flask import Blueprint, redirect, render_template, request, url_for, session
from flask_login import login_required, current_user
from ..API import generativeai

bp = Blueprint('main', __name__)

@bp.route('/', methods=('GET', 'POST')) 
def index():
    """
    INDEX PAGE
    PAGE INDEX
    """
    return '<h2>INDEX PAGE</h2>'

@bp.route('/dashboard', methods=('GET', 'POST')) 
@login_required
def dashboard():
    if current_user.role == 'admin':
        return redirect(url_for('admin.admin'))

    # GEMINI
    if 'answers' not in session:
        session['answers'] = []
    if request.method == 'POST':
        msg = request.form['msg']
        if msg:
            ans = generativeai(input=msg)
            session['answers'].append((msg, ans))
            session.modified=True
    
    if current_user.role == 'rh':
        pass # create events etc...
    
    return render_template('user.html', user=current_user, answers=session['answers'])

