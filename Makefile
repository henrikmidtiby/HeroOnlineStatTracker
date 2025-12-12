rundevelopmentserver:
	# FLASK_APP=app.py FLASK_ENV=development flask run
	uv run FLASK_APP=app.py flask run

rundevelopmentserverexternal:
	uv run FLASK_APP=app.py flask run --host=0.0.0.0

dev_server_unicorn_internal:
	uv run gunicorn --worker-class eventlet -w 1 app:app --log-level=debug

rungunicornserver:
	# Use this for logfile logs
	#gunicorn --worker-class eventlet -w 1 app:app -b 0.0.0.0:8000 --log-level=DEBUG --no-sendfile --log-file logfile.txt --log-level=info

	# Use this for console logs
	uv run gunicorn --worker-class eventlet -w 1 app:app -b 0.0.0.0:8000 --log-level=DEBUG --no-sendfile --log-file=- --log-level=info
