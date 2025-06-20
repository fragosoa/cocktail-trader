# Cocktail trader

This is an application to trade cocktails

## Initialize backend

Activate .venv

from cocktal-trader/backend run: 

source .venv/bin/activate

Load dummy data:

from cocktal-trader/backend run: 

python -m scripts.init_db

This will initialize the db and create dummy data

Run the application: 

from cocktal-trader/backend run: 

python -m app.run

This will initialize the Flask app

Run kafka consumer 

from cocktal-trader/backend/scripts run: 

python kafka_consumer.py