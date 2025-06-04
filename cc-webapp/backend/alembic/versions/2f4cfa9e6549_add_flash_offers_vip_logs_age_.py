"""add_flash_offers_vip_logs_age_verification_tables

Revision ID: 2f4cfa9e6549
Revises:
Create Date: 2025-06-04 17:33:05.683119

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = '2f4cfa9e6549'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        'flash_offers',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('content_id', sa.Integer(), nullable=False),
        sa.Column('original_price', sa.Integer(), nullable=False),
        sa.Column('discounted_price', sa.Integer(), nullable=False),
        sa.Column('discount_rate', sa.Float(), nullable=False),
        sa.Column('trigger_reason', sa.String(length=100), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
        sa.Column('expires_at', sa.DateTime(), nullable=False),
        sa.Column('is_purchased', sa.Boolean(), server_default=sa.false(), nullable=True),
        sa.Column('purchased_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['content_id'], ['adult_content.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_flash_offers_id'), 'flash_offers', ['id'], unique=False)

    op.create_table(
        'vip_access_logs',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('content_id', sa.Integer(), nullable=False),
        sa.Column('access_tier', sa.String(length=20), nullable=True),
        sa.Column('tokens_spent', sa.Integer(), nullable=True),
        sa.Column('accessed_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['content_id'], ['adult_content.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_vip_access_logs_id'), 'vip_access_logs', ['id'], unique=False)

    op.create_table(
        'age_verification_records',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('verification_method', sa.String(length=50), nullable=True),
        sa.Column('verified_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
        sa.Column('verification_data', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('is_valid', sa.Boolean(), server_default=sa.true(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_age_verification_records_id'), 'age_verification_records', ['id'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f('ix_age_verification_records_id'), table_name='age_verification_records')
    op.drop_table('age_verification_records')
    op.drop_index(op.f('ix_vip_access_logs_id'), table_name='vip_access_logs')
    op.drop_table('vip_access_logs')
    op.drop_index(op.f('ix_flash_offers_id'), table_name='flash_offers')
    op.drop_table('flash_offers')
