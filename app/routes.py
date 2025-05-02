from flask import Blueprint, redirect, render_template, request, url_for, flash
from flask_login import login_required, current_user
from .models import User

bp = Blueprint('main', __name__)

@bp.route('/dashboard', methods=('GET', 'POST')) 
@login_required
def dashboard():
    """
    if not current_user.status:
        flash("Your account is not active yet.")
        return redirect(url_for('auth.login'))
"""
    return render_template('user.html')

