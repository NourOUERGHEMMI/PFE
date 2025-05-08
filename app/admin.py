from flask import Blueprint, redirect, render_template, url_for, abort, flash
from flask_login import login_required, current_user
from .models import User

bp = Blueprint('admin', __name__, url_prefix='/admin')

#ADMIN 
@bp.route('/')
def admin():
    if current_user.is_authenticated:
        if current_user.role != "admin":
            abort(404)
        else:
            users = User.query.all()
            return render_template('admin.html', users=users, admin=current_user)
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

@bp.route('/deactivate/<int:user_id>', methods=['POST'])
@login_required
def deactivate_user(user_id):
    if current_user.role != "admin":
        abort(403)
    user = User.query.get_or_404(user_id)
    current_user.deactivate_user(user)
    
    return redirect(url_for('admin.admin'))

@bp.route('/delete_user/<int:user_id>', methods=['POST'])
@login_required
def delete_user(user_id):
    if current_user.role != "admin":
        abort(403)
    user = User.query.get_or_404(user_id)
    current_user.delete_user(user)
    flash(f"User {user.email} deleted.", "success")
    
    return redirect(url_for('admin.admin'))