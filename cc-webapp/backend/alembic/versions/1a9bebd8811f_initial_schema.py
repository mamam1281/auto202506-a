"""initial_schema

Revision ID: 1a9bebd8811f
Revises: 
Create Date: 2025-06-05 18:06:21.402848

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1a9bebd8811f'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Create users table
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(), nullable=False, index=True),
        sa.Column('nickname', sa.String(50), nullable=True),
        sa.Column('password_hash', sa.String(255), nullable=True),
        sa.Column('invite_code', sa.String(6), nullable=True),
        sa.Column('cyber_token_balance', sa.Integer(), default=200),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('segment_label', sa.String(20), default="Low"),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email'),
        sa.UniqueConstraint('nickname')
    )
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)

    # Create user_actions table
    op.create_table(
        'user_actions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False, index=True),
        sa.Column('action_type', sa.String(), nullable=False, index=True),
        sa.Column('timestamp', sa.DateTime(), nullable=True, index=True),
        sa.Column('value', sa.Float(), default=0.0),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_user_actions_id'), 'user_actions', ['id'], unique=False)

    # Create user_segments table
    op.create_table(
        'user_segments',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False, index=True),
        sa.Column('name', sa.String(50), nullable=True),
        sa.Column('rfm_group', sa.String(), nullable=True, index=True),
        sa.Column('risk_profile', sa.String(), nullable=True, index=True),
        sa.Column('streak_count', sa.Integer(), default=0),
        sa.Column('recency_score', sa.Integer(), default=0),
        sa.Column('frequency_score', sa.Integer(), default=0),
        sa.Column('monetary_score', sa.Integer(), default=0),
        sa.Column('last_updated', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id')
    )
    op.create_index(op.f('ix_user_segments_id'), 'user_segments', ['id'], unique=False)

    # Create site_visits table
    op.create_table(
        'site_visits',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False, index=True),
        sa.Column('source', sa.String(50), nullable=False),
        sa.Column('visit_timestamp', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_site_visits_id'), 'site_visits', ['id'], unique=False)

    # Create invite_codes table
    op.create_table(
        'invite_codes',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('code', sa.String(6), nullable=False, index=True),
        sa.Column('is_used', sa.Boolean(), default=False, index=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('code')
    )
    op.create_index(op.f('ix_invite_codes_id'), 'invite_codes', ['id'], unique=False)

    # Create user_rewards table
    op.create_table(
        'user_rewards',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False, index=True),
        sa.Column('reward_type', sa.String(50), nullable=False, index=True),
        sa.Column('reward_value', sa.String(255), nullable=False),
        sa.Column('source_description', sa.String(255), nullable=True),
        sa.Column('awarded_at', sa.DateTime(), nullable=True, index=True),
        sa.Column('trigger_action_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.ForeignKeyConstraint(['trigger_action_id'], ['user_actions.id']),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_user_rewards_id'), 'user_rewards', ['id'], unique=False)

    # Create adult_content table
    op.create_table(
        'adult_content',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('stage', sa.Integer(), nullable=False, index=True),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('description', sa.String(255), nullable=True),
        sa.Column('thumbnail_url', sa.String(255), nullable=True),
        sa.Column('media_url', sa.String(255), nullable=True),
        sa.Column('required_segment_level', sa.Integer(), default=1, nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('stage')
    )
    op.create_index(op.f('ix_adult_content_id'), 'adult_content', ['id'], unique=False)

    # Create notifications table
    op.create_table(
        'notifications',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False, index=True),
        sa.Column('message', sa.String(500), nullable=False),
        sa.Column('is_sent', sa.Boolean(), default=False, index=True),
        sa.Column('created_at', sa.DateTime(), nullable=True, index=True),
        sa.Column('sent_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_notifications_id'), 'notifications', ['id'], unique=False)

    # Create flash_offers table
    op.create_table(
        'flash_offers',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('content_id', sa.Integer(), nullable=False),
        sa.Column('original_price', sa.Integer(), nullable=False),
        sa.Column('discounted_price', sa.Integer(), nullable=False),
        sa.Column('discount_rate', sa.Float(), nullable=False),
        sa.Column('trigger_reason', sa.String(100), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('expires_at', sa.DateTime(), nullable=False),
        sa.Column('is_purchased', sa.Boolean(), nullable=True),
        sa.Column('purchased_at', sa.DateTime(), nullable=True),
        sa.Column('target_stage_name', sa.String(50), nullable=False, default="Full"),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.ForeignKeyConstraint(['content_id'], ['adult_content.id']),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_flash_offers_id'), 'flash_offers', ['id'], unique=False)

    # Create vip_access_logs table
    op.create_table(
        'vip_access_logs',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('content_id', sa.Integer(), nullable=False),
        sa.Column('access_tier', sa.String(20), nullable=True),
        sa.Column('tokens_spent', sa.Integer(), nullable=True),
        sa.Column('accessed_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.ForeignKeyConstraint(['content_id'], ['adult_content.id']),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_vip_access_logs_id'), 'vip_access_logs', ['id'], unique=False)

    # Create age_verification_records table
    op.create_table(
        'age_verification_records',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('verification_method', sa.String(50), nullable=True),
        sa.Column('verified_at', sa.DateTime(), nullable=True),
        sa.Column('verification_data', sa.JSON(), nullable=True),
        sa.Column('is_valid', sa.Boolean(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_age_verification_records_id'), 'age_verification_records', ['id'], unique=False)

    # Create game_logs table
    op.create_table(
        'game_logs',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False, index=True),
        sa.Column('game_type', sa.String(50), nullable=False),
        sa.Column('result', sa.String(50), nullable=False),
        sa.Column('tokens_spent', sa.Integer(), default=0),
        sa.Column('reward_given', sa.String(255), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True, index=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_game_logs_id'), 'game_logs', ['id'], unique=False)

    # Create user_streaks table
    op.create_table(
        'user_streaks',
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('win_streak', sa.Integer(), default=0),
        sa.Column('loss_streak', sa.Integer(), default=0),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.PrimaryKeyConstraint('user_id')
    )

    # Create token_transfers table
    op.create_table(
        'token_transfers',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('from_user_id', sa.Integer(), nullable=True),
        sa.Column('to_user_id', sa.Integer(), nullable=True),
        sa.Column('amount', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True, index=True),
        sa.ForeignKeyConstraint(['from_user_id'], ['users.id']),
        sa.ForeignKeyConstraint(['to_user_id'], ['users.id']),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_token_transfers_id'), 'token_transfers', ['id'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    pass
