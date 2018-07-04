""" services/users/tests/utils.py """

import json

from project import db
from project.api.models import User


def add_user(username, email, password):
    user = User(
        username=username,
        email=email,
        password=password
    )
    db.session.add(user)
    db.session.commit()
    return user

def auth_with_user(client, user, password):
    resp_login = client.post(
        '/auth/login',
        data=json.dumps({
            'email': user.email,
            'password': password
        }),
        content_type='application/json'
    )
    token = json.loads(resp_login.data.decode())['auth_token']
    return token