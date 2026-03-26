from flask import Blueprint, request, jsonify
from backend import db
from backend.models.user import User
from backend.utils.auth_helper import generate_token

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')
@auth_bp.route('/register', methods=['POST'])
def register():
    data=request.get_json()
    email,password= data.get('email'), data.get('password')
    if not email or not password:
        return jsonify({'error': 'Email and Password required'}),400
    if User.query.filter_by(email=email).first():
        return jsonify({'error' : 'Email already registered'}),409
    user= User(email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    token = generate_token(user.id)
    return jsonify({'status': 'success', 'token': token,'user': user.to_dict()}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email,password = data.get('email'), data.get('password')
    user= User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'error': 'Invalid email or password'}), 401
    token= generate_token(user.id)
    return jsonify({'status': 'success', 'token': token, 'user': user.to_dict()}), 200