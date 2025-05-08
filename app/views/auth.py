from flask import Blueprint, redirect, render_template, request, url_for, flash
from flask_login import login_user, logout_user, login_required, current_user
from ..forms import valid_signup, valid_login
from ..models import User
from app import db

bp = Blueprint('auth', __name__, url_prefix='/')

#SIGN UP
@bp.route('/sign_up', methods=('GET', 'POST'))
def sign_up():
    if current_user.is_authenticated:
        return redirect(url_for("main.dashboard"))
    
    if request.method == 'POST':
        new_user = valid_signup(request)
        if new_user:
            db.session.add(new_user)
            db.session.commit()
            flash("AWAITING APPROVAL")
            return redirect(url_for("auth.login"))
    return render_template('sign_up.html')

#LOGIN PAGE
@bp.route('/login', methods=('GET', 'POST'))
def login():
    if current_user.is_authenticated:
        return redirect(url_for("admin.admin" if current_user.role=="admin" else "main.dashboard"))

    if request.method == 'POST':
        user = valid_login(request)
        if user: #instance of User class
            user = User.query.filter(User.email==user.email).first()
            if user.status == 1:
                login_user(user)
                return redirect(url_for("admin.admin" if user.role=="admin" else "main.dashboard"))
            else:
                flash("Your account is not active yet.")
                return redirect(url_for('auth.login'))
    return render_template('login.html')

#LOG OUT        
@login_required
@bp.route('/logout', methods=['POST'])
def logout():
    logout_user()
    return redirect(url_for('auth.login'))