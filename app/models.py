from flask_login import UserMixin
from . import db

"""class Message(db.Model, UserMixin):
    __tablename__ = 'messages'
    
    id = db.Column(db.Integer, primary_key=True)
    contenu = db.Column(db.Text, nullable=False)
    date_envoi = db.Column(db.DateTime, default=datetime.utcnow)
    
    #relationships
    sender_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    sender = db.relationship('User', foreign_keys=[sender_id], backref='messages_envoyes')
    receiver = db.relationship('User', foreign_keys=[receiver_id], backref='messages_recus')"""
    
"""class Idee(db.Model, UserMixin):
    __tablename__ = 'idees'
    
    id = db.Column(db.Integer, primary_key=True)
    titre = db.Column(db.String(150), nullable=False)
    contenu = db.Column(db.Text, nullable=False)
    
    #relationships
    auteur_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    auteur = db.relationship('User', backref='idees')"""
    
class Event(db.Model, UserMixin):
    __tablename__ = 'events'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.String(150), nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    heure = db.Column(db.String(50), nullable=False)
    img = db.Column(db.LargeBinary)
    rh_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
class Document(db.Model, UserMixin):
    __tablename__ = 'documents'
    
    id = db.Column(db.Integer, primary_key=True)
    emp_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    filename = db.Column(db.String(150), nullable=False)
    data = db.Column(db.LargeBinary, nullable=False)
    file_ext = db.Column(db.String(50), nullable=False)
      
    #relationships
    proprietaire = db.relationship('User', backref='documents')
    
class User(db.Model, UserMixin):
    __tablename__ = 'users'

    #auth
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True)
    mdp = db.Column(db.String(150), nullable=False)
    status = db.Column(db.Integer, default=0) # 0 = pending, 1 = approved
    
    #profile
    img = db.Column(db.LargeBinary)
    nom = db.Column(db.String(150))
    prenom = db.Column(db.String(150))
    pays = db.Column(db.String(150))
    role = db.Column(db.String(50), default='employee')
    secteur = db.Column(db.String(150))
    poste = db.Column(db.String(150))
    
    __mapper_args__ = {
        'polymorphic_on': role,
        'polymorphic_identity': 'employee'
    }
    
class Admin(User):
    __mapper_args__ = {'polymorphic_identity': "admin"}
    
    def __init__(self, **kwargs):
        super().__init__()
        self.status=1
    
    def activate_user(self, user):
        user.status = 1
        db.session.commit()
   
    def deactivate_user(self, user):
        user.status = 0
        db.session.commit()

    def delete_user(self, user):
        if user:
            db.session.delete(user)
            db.session.commit()

class RH(User):
    __mapper_args__ = {'polymorphic_identity': 'rh'}
    
    def __init__(**kwargs):
        super().__init__()
        
    def create_event(self, event):
        db.session.add(event)
        db.session.commit()
    
    def delete_event(self, event):
        if event:
            db.session.delete(event)
            db.session.commit()
            
    #relationships
    events = db.relationship('Event', backref='organisateur', lazy=True)