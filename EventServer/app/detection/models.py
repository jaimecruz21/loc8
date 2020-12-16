import datetime as dt
from sqlalchemy import (
    Table, Column,
    String, DateTime, Numeric, Index, and_
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

Index('detections_index', detections.c.ts.desc(), detections.c.hubId, detections.c.hubId)


async def create_detection(data, conn):
    return await conn.execute(detections.insert().values(**data))


async def get_detections(conn, hubs=None, devices=None, start=None,
                         end=None, limit=10000):
    return await conn.execute(detections.select().where(
        and_(
            detections.c.ts >= start, detections.c.ts <= end,
            detections.c.hubId.in_(hubs),
            detections.c.objectId.in_(devices)
        )
    ).limit(limit))

tables = [detections]
