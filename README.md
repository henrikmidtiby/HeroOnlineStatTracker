# Online hero status tracker


# Getting started

Installing dependencies
```
npm install
polymer build
```

Running the server
```
pipenv run gunicorn --worker-class eventlet -w 1 app:app --log-level=DEBUG --log-file=- --log-level=info
```

# Host temporary using ngrok


In a terminal write the following
```
ngrok http 8000
```

