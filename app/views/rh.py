from flask import Blueprint, redirect, render_template, request, url_for, flash
from flask_login import login_required, current_user
from ..forms import valid_event
from ..models import Event

bp = Blueprint('rh', __name__, url_prefix='/rh')

@bp.route('/', methods=['GET', 'POST']) 
@login_required
def index():
    return "<h1>RH INDEX</h1>"

@bp.route('/create_event', methods=['GET', 'POST']) 
@login_required
def create_event():
    if current_user.role != 'employee':
        return redirect(
            url_for(
                "admin.admin" if current_user.role == "admin" else
                "rh.index" if current_user.role == "rh" else
                "main.dashboard"
            )
        )
    
    if request.method == 'POST':
        event = valid_event(request, current_user.id)
        current_user.create_event(event)
        flash("Event created successfully")
        
    return redirect(url_for('rh.index'))

@bp.route('/delete_event/<int:event_id>', methods=['GET', 'POST'])
@login_required
def delete_event(event_id):
    if current_user.role != 'employee':
        return redirect(
            url_for(
                "admin.admin" if current_user.role == "admin" else
                "rh.index" if current_user.role == "rh" else
                "main.dashboard"
            )
        )
    
    event = Event.query.get_or_404(event_id)
    current_user.delete_event(event)
    flash(f"Event {event.name} deleted.", "success")
    
    return redirect(url_for('rh.index'))

    