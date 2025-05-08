from . import db
from flask_login import UserMixin

class User(db.Model, UserMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True)
    mdp = db.Column(db.String(150), nullable=False)
    img = db.Column(db.LargeBinary)
    nom = db.Column(db.String(150))
    prenom = db.Column(db.String(150))
    pays = db.Column(db.String(150))
    role = db.Column(db.String(50), nullable=False, default='employee')
    status = db.Column(db.Integer, default=0) # 0 = pending, 1 = approved
    
    __mapper_args__ = {
        'polymorphic_on': role,
        'polymorphic_identity': 'employee'
    }
    
    def join_event(self, event):
        pass
    
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

    def make_event(self):
        pass

    def delete_event(self, event_id):
        pass
    
class Event(db.Model):
    __tablename__ = 'events'
    
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, default="")
    name = db.Column(db.String(150), nullable=False)
    place = db.Column(db.String(150), nullable=False)

    def __repr__(self):
        return f'<Event {self.name} at {self.place}>' 