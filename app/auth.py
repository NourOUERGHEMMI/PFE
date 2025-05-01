# prevent browser back button
from flask_login import current_user

from flask import Blueprint, redirect, render_template, request, url_for, abort
from flask_login import login_user, logout_user, login_required
from .forms import valid_sign_up, valid_login
from . import db

bp = Blueprint('auth', __name__, url_prefix='/')

# SIGN UP
@bp.route('/sign_up', methods=('GET', 'POST'))
def sign_up():
    if current_user.is_authenticated:
        return redirect(url_for("main.index"))
    
    if request.method == 'POST':
        new_user = valid_sign_up(request)
        if new_user:
            db.session.add(new_user)
            db.session.commit()
            login_user(new_user)
            return redirect(url_for('main.index'))
    
    return render_template('auth/sign_up.html')

#LOGIN PAGE
@bp.route('/login', methods=('GET', 'POST'))
def login():
    if current_user.is_authenticated:
        return redirect(url_for("main.index"))
    
    if request.method == 'POST':
        user = valid_login(request)
        if user:
            login_user(user)
            return redirect(url_for("main.index"))

    return render_template('auth/login.html')

#LOG OUT        
@login_required
@bp.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('auth.login'))

#ADMIN PAGE
@bp.route('/admin')
@login_required
def user_status(user_id):
    if current_user.role != 'admin':
        abort(403)
    
    # get user.status and change it
    # db.session.commit()
    return redirect(url_for('admin'))