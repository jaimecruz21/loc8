EventServer
===========

AIOHTTP service makes communication with beacons


Preparations
------------

Run Postgres-TimescaleDB server:
```bash
docker-compose up -d
```

Run
---
Run application::
```bash
pip install -r requirements.txt
# init db
PYTHONPATH=. python app/init_db.py
# apply migrations
PYTHONPATH=. alembic upgrade head
python -m app
```


Migrations
__________
Create migration:

```bash
PYTHONPATH=. alembic revision -m "migration info" --autogenerate
PYTHONPATH=. alembic upgrade head
```

Load test
_________
Once you are started the server you can start data filling process
```bash
# please, use this for demo
molotov tests/load_tests.py -w 1 -d 36000  -p 1 --delay 2

# for load testing
molotov tests/load_tests.py -w 200 -d 120  -p 1
```
