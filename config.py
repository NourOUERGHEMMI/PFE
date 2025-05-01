import os

class Config:
    SECRET_KEY = os.urandom(24)
    SQLALCHEMY_DATABASE_URI = 'sqlite:///users.db'
    SQLALCHEMY_BINDS = {
        'data': 'sqlite:///database.db'
    }
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    CACH_TYPE = 'simple'