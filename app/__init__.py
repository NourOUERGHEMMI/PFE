from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager

db = SQLAlchemy()
login_manager = LoginManager()
login_manager.login_view = 'auth.login'

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')
    db.init_app(app)
    login_manager.init_app(app)
    
    # create databases and tables if they do not exist
    from .forms import create_admin
    with app.app_context():
        db.drop_all()
        db.create_all()
        create_admin(db)
    
    #import and register blueprints
    from .views import auth, routes, admin, rh
    app.register_blueprint(auth.bp)
    app.register_blueprint(routes.bp)   
    app.register_blueprint(admin.bp) 
    app.register_blueprint(rh.bp)  
 
    #return active session
    from .models import User
    @login_manager.user_loader
    def load_user(id):
        return User.query.get(int(id))

    return app