from sqlalchemy import (
    MetaData, Table, Column, ForeignKey,
    Integer, String, Date, DateTime, Numeric
)

from app.db_meta import meta


detections = Table(
    'detections', meta,
    Column('ts', DateTime, nullable=False),
    Column('hubId', ForeignKey('hubs.id'), nullable=False),
    Column('objectId', ForeignKey('objects.id'), nullable=False),
    Column('distance', Numeric, nullable=False)
)

tables = [detections]
