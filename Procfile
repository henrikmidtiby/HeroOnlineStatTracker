release: npn install && polymer build
web: pipenv run gunicorn --worker-class eventlet -w 1 app:app --log-level=DEBUG --log-file=- --log-level=info
