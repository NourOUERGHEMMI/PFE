from flask import Blueprint, redirect, render_template, request, url_for, abort
from flask_login import login_user, logout_user, login_required, current_user
from .models import User
from . import db

bp = Blueprint('admin', __name__, url_prefix='/admin')

#ADMIN 
@bp.route('/')
def admin():
    if current_user.is_authenticated:
        if current_user.role != "admin":
            abort(404)
        else:
            users = User.query.all()
            return render_template('admin.html', users=users)
    else:
        return redirect(url_for("auth.login"))
    
@bp.route('/activate/<int:user_id>', methods=['POST'])
@login_required
def activate_user(user_id):
    if current_user.role != "admin":
        abort(403)
    user = User.query.get_or_404(user_id)
    current_user.activate_user(user)
    
    return redirect(url_for('admin.admin'))