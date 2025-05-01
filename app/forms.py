from flask import flash
from werkzeug.security import check_password_hash, generate_password_hash
from .models import User

def verify_email(email):
    pass

def valid_sign_up(request):
    email = request.form['email']
    nom = request.form['nom']
    prenom = request.form['prenom']
    mdp = request.form['mdp']
    confirm_mdp = request.form['confirm_mdp']
    pays = request.form['pays']
    img = request.files['img'].read()
    
    user = User.query.filter_by(email=email).first()
    if user:
        flash("email already used")
    elif verify_email(email):
        flash ("verify email")
    else:
        new_user = User(
            email = email,
            mdp = generate_password_hash(mdp),
            img = img,
            nom = nom,
            prenom = prenom,
            pays = pays
            )
        return new_user
    return False
        
def valid_login(request):
    email = request.form['email']
    mdp = request.form['mdp']
    
    user = User.query.filter_by(email=email).first()
    if user:
        if check_password_hash(user.mdp, mdp):
            return user
        else:
            flash('Incorrect mdp, try again.')
    else:
        flash('email does not exist.')
    return False