""" services/users/manage.py """

import unittest
import coverage

from flask.cli import FlaskGroup
from project import create_app, db
from project.api.models import User

app = create_app()
cli = FlaskGroup(create_app=create_app)

COV = coverage.coverage(
    branch=True,
    include='project/*',
    omit=[
        'project/tests/*'
    ]
)
COV.start()


@cli.command()
def recreate_db():
    """ recreate the database """
    db.drop_all()
    db.create_all()
    db.session.commit()


@cli.command()
def seed_db():
    """seed the database"""
    db.session.add(User(
        username='shepard',
        email='jshepard@nasa.gov',
        password='murica'))
    db.session.add(User(
        username='glenn',
        email='jglenn@nasa.gov',
        password='usausa'))
    db.session.commit()


@cli.command()
def test():
    """test the users service without code coverage"""
    tests = unittest.TestLoader().discover('project/tests', pattern='test*.py')
    result = unittest.TextTestRunner(verbosity=2).run(tests)
    if result.wasSuccessful():
        return 0
    return 1


@cli.command()
def cov():
    """test the users service with code coverage"""
    tests = unittest.TestLoader().discover('project/tests', pattern='test*.py')
    result = unittest.TextTestRunner(verbosity=2).run(tests)
    if result.wasSuccessful():
        COV.stop()
        COV.save()
        print('Coverage Summary:')
        COV.report()
        COV.html_report()
        COV.erase()
        return 0
    return 1


if __name__ == '__main__':
    cli()
