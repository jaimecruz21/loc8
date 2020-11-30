from sqlalchemy import (
    MetaData, Table, Column, ForeignKey,
    Integer, String, Date, DateTime, Numeric
)

from app.db_meta import meta


detections = Table(
    'detections', meta,
    Column('id', Integer, primary_key=True),
    Column('ts', DateTime),
    Column('hubId', ForeignKey('hubs'), nullable=False),
    Column('objectId', ForeignKey('objects'), nullable=False),
    Column('distance', Numeric, nullable=False)
)

tables = [detections]
