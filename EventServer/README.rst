EventServer
===========

AIOHTTP service makes communication with beacons


Preparations
------------

Run Postgres-TimescaleDB server::

    $ docker-compose up -d

Run
---
Run application::

    $ pip install -r requirements.txt
    # init db
    $ PYTHONPATH=. python app/init_db.py
    # apply migrations
    $ PYTHONPATH=. alembic upgrade head
    $ python -m app


Migrations
__________
Create migration:
```bash
```