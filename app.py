# Copyright: Henrik Skov Midtiby 2019.
import logging
from flask import Flask, render_template
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy
import os

basedir = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__, static_folder='dist')
app.config['SECRET_KEY'] = os.urandom(20)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

gunicorn_logger = logging.getLogger("gunicorn.error")
app.logger.handlers = gunicorn_logger.handlers
app.logger.setLevel(gunicorn_logger.level)

socketio = SocketIO(app)

if __name__ == '__main__':
    socketio.run(app, debug=True)


@app.route('/')
def index():
    app.logger.info("index()")
    return render_template('hero_stats.html')


memory = {}

@socketio.on('hero_state_changed_message_to_server')
def handle_hero_state_changed(msg):
    app.logger.info("hero_state_changed_message_to_server")
    memory[msg['data']['hero_id']] = msg
    socketio.emit('hero_state_changed_from_server', msg, 
            broadcast=True)

@socketio.on('request_saved_state')
def handle_request_saved_state(msg):
    app.logger.info("request_saved_state")
    socketio.emit('saved_state_of_heroes', memory, 
            broadcast=True)



