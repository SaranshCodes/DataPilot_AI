from backend import db, bcrypt
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key = True)
    email = db.Column(db.String(120), unique = True, nullable=  False)
    password= db.Column(db.String(255), nullable= False)
    created_at= db.Column(db.DateTime, default= datetime.utcnow)
    jobs = db.relationship('TrainingJob', backref='user', lazy =True)
    
    def set_password(self, plain_password):
        self.password = bcrypt.generate_password_hash(plain_password).decode('utf-8')
    def check_password(self, plain_password):
        return bcrypt.check_password_hash(self.password,plain_password)
    def to_dict(self):
        return {'id': self.id, 'email': self.email, 'created_at':self.created_at.isoformat()}
    