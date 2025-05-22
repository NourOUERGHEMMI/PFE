""" FOR HANDLING REQUESTS """

from flask import flash
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename
from .models import User, Document, Event

# EVENT Configuration
def valid_event(request, id):
    return Event(
        title=request.form['title'],
        description=request.form['description'],
        date=request.form['date'],
        heure=request.form['heure'],
        img=request.files['img'].read(),
        rh_id=id
    )

# FILE UPLOAD Configuration (SERVER SIDE VALIDATION FOR EXTRA SECURITY)
def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg', 'doc', 'docx', 'txt'}
    #MIME validation
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def valid_file(request, id):
    uploaded_file = request.files.get('file')
    if not uploaded_file or uploaded_file.filename == '':
        flash('No selected file', 'error')
        return False
    
    filename = secure_filename(uploaded_file.filename)
    
    if not allowed_file(filename):
        flash('File type not allowed', 'error')
        return False
    
    new_document = Document(
            filename=filename,
            file_ext=filename.rsplit('.', 1)[1].lower(),
            data=uploaded_file.read(),
            emp_id=id
        )
    return new_document
    
def create_admin(db):
    admin = User(
         email='admin@admin',
         mdp=generate_password_hash('admin'),
         role='admin',
         status=1
    )
    # active USERs for testing
    rh = User(
        email=f"rh@user",
        mdp=generate_password_hash('user'),
        role="rh",
        status=1
    ) 
    user = User(
        email=f"user@user",
        mdp=generate_password_hash('user'),
        role="employee",
        status=1
    ) 
    db.session.add(rh)
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
        'role': request.form['role'],
        'email': request.form['email'],
        'nom': request.form['nom'],
        'prenom': request.form['prenom'],
        'mdp': request.form['mdp'],
        'confirm_mdp': request.form['confirm_mdp'],
        'pays': request.form['pays'],
        'secteur': request.form['secteur'],
        'poste': request.form['poste']
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