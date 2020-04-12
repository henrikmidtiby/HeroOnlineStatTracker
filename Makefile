activate_virtual_environment: 
	source env/bin/activate

install_requirements:
	pip3 install -r requirements.txt

rundevelopmentserver:
	# FLASK_APP=app.py FLASK_ENV=development flask run
	FLASK_APP=app.py flask run

rundevelopmentserverexternal:
	FLASK_APP=app.py flask run --host=0.0.0.0

dev_server_unicorn_internal:
	gunicorn --worker-class eventlet -w 1 app:app --log-level=debug

rungunicornserver:
	# Use this for logfile logs
	#pipenv run gunicorn --worker-class eventlet -w 1 app:app -b 0.0.0.0:8000 --log-level=DEBUG --no-sendfile --log-file logfile.txt --log-level=info

	# Use this for console logs
	pipenv run gunicorn --worker-class eventlet -w 1 app:app -b 0.0.0.0:8000 --log-level=DEBUG --no-sendfile --log-file=- --log-level=info
