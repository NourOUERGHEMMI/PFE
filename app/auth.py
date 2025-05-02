# prevent browser back button
from flask_login import current_user

from flask import Blueprint, redirect, render_template, request, url_for, abort
from flask_login import login_user, logout_user, login_required
from sqlalchemy.orm import with_polymorphic
from .forms import valid_signup, valid_login
from .models import User, Admin, RH
from . import db

bp = Blueprint('auth', __name__, url_prefix='/')

# ensure SQLAlchemy returns the correct subclass based on role
UserPoly = with_polymorphic(User, [Admin, RH])

# SIGN UP
@bp.route('/sign_up', methods=('GET', 'POST'))
def sign_up():
    if current_user.is_authenticated:
        return redirect(url_for("main.dashboard"))
    
    if request.method == 'POST':
        new_user = valid_signup(request)
        if new_user:
            db.session.add(new_user)
            db.session.commit()
            login_user(new_user)
            return redirect(url_for('main.dashboard'))
    
    return render_template('sign_up.html')

#LOGIN PAGE
@bp.route('/login', methods=('GET', 'POST'))
def login():
    if current_user.is_authenticated:
        return redirect(url_for("auth.admin" if current_user.role=="admin" else "main.dashboard"))

    if request.method == 'POST':
        user = valid_login(request)
        # create class object based on role
        if user:
            user = db.session.query(UserPoly).filter(UserPoly.email == user.email).first()
            login_user(user)
            return redirect(url_for("auth.admin" if current_user.role=="admin" else "main.dashboard"))
    return render_template('login.html')

#LOG OUT        
@login_required
@bp.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('auth.login'))

#ADMIN 
@bp.route('/admin')
def admin():
    if current_user.is_authenticated:
        if current_user.role != "admin":
            abort(404)
        else:
            return render_template('admin.html')
    else:
        return redirect(url_for("auth.login"))