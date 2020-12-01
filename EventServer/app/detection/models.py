import datetime as dt
from sqlalchemy import (
    Table, Column,
    String, DateTime, Numeric
)

from app.db_meta import meta


detections = Table(
    'detections', meta,
    Column('ts', DateTime, nullable=False, default=dt.datetime.utcnow),
    Column('hubId', String(80), nullable=False), #token
    Column('objectId', String(80), nullable=False), #uuid
    Column('distance', Numeric, nullable=False),
    Column('major', Numeric, nullable=False),
    Column('minor', Numeric, nullable=False),
    Column('rssi', Numeric, nullable=False),
    Column('rxpower', Numeric, nullable=False)
)


async def create_detection(data, conn):
    return await conn.execute(detections.insert().values(**data))


tables = [detections]
