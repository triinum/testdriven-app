""" services/users/manage.py """

import unittest

from flask.cli import FlaskGroup
from project import create_app, db
from project.api.models import User

app = create_app()
cli = FlaskGroup(create_app=create_app)

@cli.command()
def recreate_db():
    """ recreate the database """
    db.drop_all()
    db.create_all()
    db.session.commit()

@cli.command()
def seed_db():
    """seed the database"""
    db.session.add(User(username='shepard', email='jshepard@nasa.gov'))
    db.session.add(User(username='glenn', email='jglenn@nasa.gov'))
    db.session.commit()

@cli.command()
def test():
    """test the users service without code coverage"""
    tests = unittest.TestLoader().discover('project/tests', pattern='test*.py')
    result = unittest.TextTestRunner(verbosity=2).run(tests)
    if result.wasSuccessful():
        return 0
    return 1

if __name__ == '__main__':
    cli()
