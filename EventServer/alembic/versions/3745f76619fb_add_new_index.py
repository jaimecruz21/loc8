"""add new index

Revision ID: 3745f76619fb
Revises: 0387fb37182e
Create Date: 2020-12-15 22:10:50.503442

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3745f76619fb'
down_revision = '0387fb37182e'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_index('detections_index', 'detections', [sa.text('ts DESC'), 'hubId', 'hubId'], unique=False)
    op.drop_index('detections_ts_idx', table_name='detections')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_index('detections_ts_idx', 'detections', ['ts'], unique=False)
    op.drop_index('detections_index', table_name='detections')
    # ### end Alembic commands ###