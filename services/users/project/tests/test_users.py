""" services/users/project/tests/test_users.py """

import json
import unittest

from project.tests.base import BaseTestCase
from project import db
from project.api.models import User

def add_user(username, email):
    user = User(username=username, email=email)
    db.session.add(user)
    db.session.commit()
    return user

class TestUserService(BaseTestCase):
    """Tests for the Users Service"""

    def test_users(self):
        """Ensure the /ping bahaves correctly"""
        response = self.client.get('/users/ping')
        data = json.loads(response.data.decode())
        
        self.assertEqual(response.status_code, 200)
        self.assertIn('pong', data['message'])
        self.assertIn('success', data['status'])

    def test_add_user(self):
        """Ensure a new user can be added to the database"""
        response = self.client.post(
            '/users',
            data=json.dumps({
                'username': 'narmstrong',
                'email': 'narmstrong@nasa.gov'
            }),
            content_type='application/json'
        )
        data = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 201)
        self.assertIn('narmstrong@nasa.gov was added!', data['message'])
        self.assertIn('success', data['status'])

    def test_add_user_invalid_json(self):
        """Ensure that sending nothing to new user throws error"""
        with self.client:
            response = self.client.post(
                '/users',
                data=json.dumps({}),
                content_type='application/json'
            )
            data = json.loads(response.data.decode())

            self.assertEqual(response.status_code, 400)
            self.assertIn('Invalid payload', data['message'])
            self.assertIn('fail', data['status'])

    def test_add_user_invalid_json_keys(self):
        """Ensure that error is thrown if username key is missing"""
        with self.client:
            response = self.client.post(
                '/users',
                data=json.dumps({ 'email': 'baldrin@nasa.gov' }),
                content_type='application/json'
            )
            data = json.loads(response.data.decode())

            self.assertEqual(response.status_code, 400)
            self.assertIn('Invalid payload', data['message'])
            self.assertIn('fail', data['status'])

    def test_add_user_duplicate_email(self):
        """Ensure an error is thrown in edge case of duplicate email"""
        with self.client:
            self.client.post(
                '/users',
                data=json.dumps({
                    'username': 'narmstrong',
                    'email': 'narmstrong@nasa.gov'
                }),
                content_type='application/json'
            )
            response = self.client.post(
                '/users',
                data=json.dumps({
                    'username': 'narmstrong',
                    'email': 'narmstrong@nasa.gov'
                }),
                content_type='application/json'
            )
            data = json.loads(response.data.decode())

            self.assertEqual(response.status_code, 400)
            self.assertIn('Sorry, That email already exists.', data['message'])
            self.assertIn('fail', data['status'])

    def test_single_user(self):
        """Ensure that you can get a single user"""
        user = add_user('jglenn', 'jglenn@nasa.gov')
        with self.client:
            response = self.client.get(f'/users/{user.id}')
            data = json.loads(response.data.decode())

            self.assertEqual(response.status_code, 200)
            self.assertIn('jglenn', data['data']['username'])
            self.assertIn('jglenn@nasa.gov', data['data']['email'])
            self.assertIn('success', data['status'])

    def test_single_user_no_id(self):
        """Ensure sending no id throws 404"""
        with self.client:
            response = self.client.get('/users/foo')
            data = json.loads(response.data.decode())

            self.assertEqual(response.status_code, 404)
            self.assertIn('User does not exist', data['message'])
            self.assertIn('fail', data['status'])

    def test_single_user_bad_id(self):
        """Ensure sending no id throws 404"""
        with self.client:
            response = self.client.get('/users/999')
            data = json.loads(response.data.decode())

            self.assertEqual(response.status_code, 404)
            self.assertIn('User does not exist', data['message'])
            self.assertIn('fail', data['status'])

    def test_all_users(self):
        """Ensure get all users behaves correctly"""
        add_user('ride', 'sride@nasa.gov')
        add_user('glenn', 'jglenn@nasa.gov')
        with self.client:
            response = self.client.get('/users')
            data = json.loads(response.data.decode())

            self.assertEqual(response.status_code, 200)
            self.assertEqual(len(data['data']['users']), 2)
            self.assertIn('ride', data['data']['users'][0]['username'])
            self.assertIn('sride@nasa.gov', data['data']['users'][0]['email'])

            self.assertIn('glenn', data['data']['users'][1]['username'])
            self.assertIn('jglenn@nasa.gov', data['data']['users'][1]['email'])

            self.assertIn('success', data['status'])


if __name__ == '__main__':
    unittest.main()