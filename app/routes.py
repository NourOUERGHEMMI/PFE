from flask import Blueprint, redirect, render_template, request, url_for, flash
from flask_login import login_required, current_user
from .models import User

bp = Blueprint('main', __name__)

@bp.route('/', methods=('GET', 'POST')) 
@login_required
def index():
    user = current_user.to_dict()
    
    if user['status'] != 'active':
        flash("Your account is not active yet.")
        return redirect(url_for('auth.login'))

    return render_template('filter/index.html')
