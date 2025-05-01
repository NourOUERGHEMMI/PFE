from . import db
from flask_login import UserMixin

class User(db.Model, UserMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True, nullable=False)
    mdp = db.Column(db.String(150), nullable=False)  # Hashed password
    img = db.Column(db.LargeBinary)
    nom = db.Column(db.String(150))
    prenom = db.Column(db.String(150))
    pays = db.Column(db.String(150))
    role = db.Column(db.String(50), nullable=False, default='employee')  # 'admin', 'rh', 'employee'
    status = db.Column(db.String(50), nullable=False, default='pending')  # 'pending', 'active', 'deactivated'

    def is_active_account(self):
        return self.status == 'active'

    def participate_event(self, event):
        pass
    
    def to_dict(self):
        return {
            "id": self.id, 
            "email": self.email,
            "nom": self.nom,
            "prenom": self.prenom,
            "pays": self.pays,
            "role": self.role,
            "status": self.status
        }

    
    
class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, default="")
    name = db.Column(db.String(150), nullable=False)
    place = db.Column(db.String(150), nullable=False)

    def __repr__(self):
        return f'<Event {self.name} at {self.place}>'
    
class Admin(User):
    __mapper_args__ = {'polymorphic_identity': 'admin'}
    
    def accept_user(user_id):
        user = User.query.get(user_id)
        if user and user.status == 'pending':
            user.status = 'active'
            db.session.commit()

    def refuse_user(user_id):
        user = User.query.get(user_id)
        if user:
            db.session.delete(user)
            db.session.commit()
            
    def deactivate_user(user_id):
        user = User.query.get(user_id)
        if user:
            user.status = 'deactivated'
            db.session.commit()
            
    def reactivate_user(user_id):
        user = User.query.get(user_id)
        if user and user.status == 'deactivated':
            user.status = 'active'
            db.session.commit()
            return True
        return False


    def delete_user(self, user_id):
        pass

class RH(User):
    __mapper_args__ = {'polymorphic_identity': 'rh'}

    def make_event(self):
        pass

    def delete_event(self, event_id):
        pass
    
    