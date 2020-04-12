# Copyright: Henrik Skov Midtiby 2019.
import collections
import logging
from flask import Flask, render_template, request, session, redirect, url_for, send_from_directory
import html
from flask_socketio import SocketIO, join_room, leave_room
from flask_login import LoginManager, login_user, logout_user, login_required, UserMixin, current_user
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash, check_password_hash
import os
import base64
import time
import datetime

basedir = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__, static_folder='build')
app.config['SECRET_KEY'] = os.urandom(20)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL') or \
                                        'sqlite:///' + os.path.join(basedir, 'app.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

gunicorn_logger = logging.getLogger("gunicorn.error")
app.logger.handlers = gunicorn_logger.handlers
app.logger.setLevel(gunicorn_logger.level)

db = SQLAlchemy(app)
migrate = Migrate(app, db)

socketio = SocketIO(app)

if __name__ == '__main__':
    socketio.run(app, debug=True)


@app.route('/')
def index():
    app.logger.info("index()")
    return render_template('hero_stats.html')


@socketio.on('hero_state_changed_message_to_server')
def handle_hero_state_changed(msg):
    socketio.emit('hero_state_changed_from_server', msg, 
            broadcast=True)



