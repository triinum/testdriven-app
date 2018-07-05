""" services/users/project/tests/test_users.py """

import json
import unittest

from project.tests.base import BaseTestCase
from project.tests.utils import add_user, auth_with_user
from project import db
from project.api.models import User


class TestUserService(BaseTestCase):
    """Tests for the Users Service"""

    def test_main_no_users(self):
        """Ensure the main route behaves correctly when no users have been
        added to the database."""
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'<h1>All Users</h1>', response.data)
        self.assertIn(b'<p>No users!</p>', response.data)

    def test_main_with_users(self):
        """Ensure the main route behaves correctly when some users
           have been added"""
        add_user('ride', 'sride@nasa.gov', 'spacerace')
        add_user('glenn', 'jglenn@nasa.gov', 'spaceracer')
        with self.client:
            response = self.client.get('/')
            self.assertEqual(response.status_code, 200)
            self.assertIn(b'<h1>All Users</h1>', response.data)
            self.assertNotIn(b'<p>No users!</p>', response.data)
            self.assertIn(b'ride', response.data)
            self.assertIn(b'glenn', response.data)

    def test_main_add_user(self):
        """Ensure a new user can be added to the database"""
        with self.client:
            response = self.client.post(
                '/',
                data=dict(
                    username='shepard',
                    email='jshepard@nasa.gov',
                    password='arandompassword'
                ),
                follow_redirects=True
            )
            self.assertEqual(response.status_code, 200)
            self.assertIn(b'<h1>All Users</h1>', response.data)
            self.assertNotIn(b'<p>No users!</p>', response.data)
            self.assertIn(b'shepard', response.data)

    def test_users(self):
        """Ensure the /ping bahaves correctly"""
        response = self.client.get('/users/ping')
        data = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 200)
        self.assertIn('pong', data['message'])
        self.assertIn('success', data['status'])

    def test_add_user(self):
        """Ensure a new user can be added to the database"""
        user = add_user('testuser', 'test@test.com', 'password')
        auth_token = auth_with_user(self.client, user, 'password')
        response = self.client.post(
            '/users',
            data=json.dumps({
                'username': 'narmstrong',
                'email': 'narmstrong@nasa.gov',
                'password': 'arandompassword'
            }),
            content_type='application/json',
            headers={'Authorization': f'Bearer {auth_token}'}
        )
        data = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 201)
        self.assertIn('narmstrong@nasa.gov was added!', data['message'])
        self.assertIn('success', data['status'])

    def test_add_user_invalid(self):
        add_user('test', 'test@test.com', 'test')
        # update user
        user = User.query.filter_by(email='test@test.com').first()
        user.active = False
        db.session.commit()

        with self.client:
            auth_token = auth_with_user(self.client, user, 'test')
            response = self.client.post(
                '/users',
                data=json.dumps({
                    'username': 'michael',
                    'email': 'michael@sonotreal.com',
                    'password': 'test'
                }),
                content_type='application/json',
                headers={'Authorization': f'Bearer {auth_token}'}
            )
            data = json.loads(response.data.decode())
            self.assertTrue(data['status'] == 'fail')
            self.assertTrue(data['message'] == 'Provide a valid auth token')
            self.assertEqual(response.status_code, 401)

    def test_add_user_invalid_json(self):
        """Ensure that sending nothing to new user throws error"""
        user = add_user('test', 'test@test.com', 'test')

        with self.client:
            auth_token = auth_with_user(self.client, user, 'test')
            response = self.client.post(
                '/users',
                data=json.dumps({}),
                content_type='application/json',
                headers={'Authorization': f'Bearer {auth_token}'}
            )
            data = json.loads(response.data.decode())

            self.assertEqual(response.status_code, 400)
            self.assertIn('Invalid payload', data['message'])
            self.assertIn('fail', data['status'])

    def test_add_user_invalid_request_no_username(self):
        """Ensure that error is thrown if username key is missing"""
        with self.client:
            user = add_user('testuser', 'test@test.com', 'test')
            auth_token = auth_with_user(self.client, user, 'test')
            response = self.client.post(
                '/users',
                data=json.dumps({
                    'email': 'baldrin@nasa.gov',
                    'password': 'onestep'
                }),
                content_type='application/json',
                headers={'Authorization': f'Bearer {auth_token}'}
            )
            data = json.loads(response.data.decode())

            self.assertEqual(response.status_code, 400)
            self.assertIn('Invalid payload', data['message'])
            self.assertIn('fail', data['status'])

    def test_add_user_invalid_request_no_email(self):
        """Ensure that error is thrown if email key is missing"""
        with self.client:
            user = add_user('testuser', 'test@test.com', 'test')
            auth_token = auth_with_user(self.client, user, 'test')
            response = self.client.post(
                '/users',
                data=json.dumps({
                    'username': 'buzz',
                    'password': 'onestep'}),
                content_type='application/json',
                headers={'Authorization': f'Bearer {auth_token}'}
            )
            data = json.loads(response.data.decode())

            self.assertEqual(response.status_code, 400)
            self.assertIn('Invalid payload', data['message'])
            self.assertIn('fail', data['status'])

    def test_add_user_invalid_request_no_password(self):
        """Ensure that error is thrown if password key is missing"""
        with self.client:
            user = add_user('testuser', 'test@test.com', 'test')
            auth_token = auth_with_user(self.client, user, 'test')
            response = self.client.post(
                '/users',
                data=json.dumps({
                    'email': 'baldrin@nasa.gov',
                    'username': 'buzz'
                }),
                content_type='application/json',
                headers={'Authorization': f'Bearer {auth_token}'}
            )
            data = json.loads(response.data.decode())

            self.assertEqual(response.status_code, 400)
            self.assertIn('Invalid payload', data['message'])
            self.assertIn('fail', data['status'])

    def test_add_user_duplicate_email(self):
        """Ensure an error is thrown in edge case of duplicate email"""
        with self.client:
            user = add_user('testuser', 'test@test.com', 'test')
            auth_token = auth_with_user(self.client, user, 'test')
            self.client.post(
                '/users',
                data=json.dumps({
                    'username': 'narmstrong',
                    'email': 'narmstrong@nasa.gov',
                    'password': 'arandompassword'
                }),
                content_type='application/json',
                headers={'Authorization': f'Bearer {auth_token}'}
            )
            response = self.client.post(
                '/users',
                data=json.dumps({
                    'username': 'narmstrong',
                    'email': 'narmstrong@nasa.gov',
                    'password': 'anotherrandompassword'
                }),
                content_type='application/json',
                headers={'Authorization': f'Bearer {auth_token}'}
            )
            data = json.loads(response.data.decode())

            self.assertEqual(response.status_code, 400)
            self.assertIn('Sorry, That email already exists.', data['message'])
            self.assertIn('fail', data['status'])

    def test_single_user(self):
        """Ensure that you can get a single user"""
        user = add_user('jglenn', 'jglenn@nasa.gov', 'spaceforce1')
        with self.client:
            response = self.client.get(f"/users/{user.id}")
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
        add_user('ride', 'sride@nasa.gov', 'spacerace')
        add_user('glenn', 'jglenn@nasa.gov', 'spaceforce')
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
