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
        user = add_user('justatest', 'test@example.com')

        self.assertTrue(user.id)
        self.assertEqual(user.username, 'justatest')
        self.assertEqual(user.email, 'test@example.com')
        self.assertTrue(user.active)

    def test_add_user_duplicate_username(self):
        add_user('justatest', 'test@example.com')

        dupe_user = User(
            username='justatest',
            email='test2@example.com'
        )
        db.session.add(dupe_user)
        with self.assertRaises(IntegrityError):
            db.session.commit()

    def test_add_user_duplicate_email(self):
        add_user('justatest', 'test@example.com')

        dupe_user = User(
            username='justatest2',
            email='test@example.com'
        )
        db.session.add(dupe_user)
        with self.assertRaises(IntegrityError):
            db.session.commit()

    def test_to_json(self):
        user = add_user('justatest', 'test@example.com')
        self.assertTrue(isinstance(user.to_json(), dict))


if __name__ == '__main__':
    unittest.main()
