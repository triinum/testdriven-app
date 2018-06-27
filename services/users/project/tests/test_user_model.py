""" services/users/project/tests/test_user_model.py """

import unittest

from project import db
from project.api.models import User
from project.tests.base import BaseTestCase

from sqlalchemy.exc import IntegrityError
from project.tests.utils import add_user


class TestUserModel(BaseTestCase):
    """ Exercises the User Model """

    def test_add_user(self):
        user = add_user('justatest', 'test@example.com', 'passw0rd')

        self.assertTrue(user.id)
        self.assertEqual(user.username, 'justatest')
        self.assertEqual(user.email, 'test@example.com')
        self.assertTrue(user.active)
        self.assertTrue(user.password)

    def test_add_user_duplicate_username(self):
        add_user('justatest', 'test@example.com', 'randomness')

        dupe_user = User(
            username='justatest',
            email='test2@example.com',
            password='testpassword'
        )
        db.session.add(dupe_user)
        with self.assertRaises(IntegrityError):
            db.session.commit()

    def test_add_user_duplicate_email(self):
        add_user('justatest', 'test@example.com', 'anotherrandompassword')

        dupe_user = User(
            username='justatest2',
            email='test@example.com',
            password='testpassword'
        )
        db.session.add(dupe_user)
        with self.assertRaises(IntegrityError):
            db.session.commit()

    def test_to_json(self):
        user = add_user('justatest', 'test@example.com', 'arandompassword')
        self.assertTrue(isinstance(user.to_json(), dict))

    def test_passwords_are_random(self):
        user_one = add_user('justatest', 'test@test.com', 'greaterthaneight')
        user_two = add_user('justatest2', 'test2@test.com', 'greaterthaneight')
        self.assertNotEqual(user_one.password, user_two.password)

    def test_encode_auth_token(self):
        user = add_user('testuser', 'test@test.com', 'password')
        auth_token = user.encode_auth_token(user.id)
        self.assertTrue(isinstance(auth_token, bytes))

    def test_decode_auth_token(self):
        user = add_user('testuser', 'test@test.com', 'password')
        auth_token = user.encode_auth_token(user.id)
        self.assertTrue(isinstance(auth_token, bytes))
        self.assertEqual(User.decode_auth_token(auth_token), user.id)


if __name__ == '__main__':
    unittest.main()
