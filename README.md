# Online hero status tracker


# Getting started

Installing javascript dependencies
```
npm install
npm run build
cp node_modules/socket.io-client/dist/socket.io.min.js dist/
```

Create a python virtual environment
```
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
```


Running the server
```
source env/bin/activate
gunicorn --worker-class eventlet -w 1 app:app --log-level=DEBUG --log-file=- --log-level=info
```

# Host temporary using ngrok


In a terminal write the following
```
ngrok http 8000
```

