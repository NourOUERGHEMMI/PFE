import os

class Config:
    SECRET_KEY = os.urandom(24)
    SQLALCHEMY_DATABASE_URI = 'sqlite:///database.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    CACH_TYPE = 'simple'
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB
