from flask import flash
from werkzeug.security import check_password_hash, generate_password_hash
from .models import User

def create_admin(db):
    admin = User(
         email='admin@admin',
         mdp=generate_password_hash('admin'),
         role='admin',
         status=1
    )
    # active USERs for testing
    for i in "123456789":
        user = User(
            email=f"user{i}@user",
            mdp=generate_password_hash('user'),
            nom="HERO",
            prenom="BOKA",
            status=1
        ) 
        db.session.add(user)
    
    db.session.add(admin)
    db.session.commit()

def verif_signup(signup_req):
    user = User.query.filter_by(email=signup_req['email']).first()
    if user:
        flash("email already used")
        return False
    #verify mdp and all
    return True

def valid_signup(request):
    signup_req = {
        'email': request.form['email'],
        'nom': request.form['nom'],
        'prenom': request.form['prenom'],
        'mdp': request.form['mdp'],
        'confirm_mdp': request.form['confirm_mdp'],
        'pays': request.form['pays'],
        'img': request.files['img'].read()
    }

    if verif_signup(signup_req):
        del signup_req['confirm_mdp']
        signup_req['mdp']=generate_password_hash(signup_req['mdp'])
        new_user = User(**signup_req)
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