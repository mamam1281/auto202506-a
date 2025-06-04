"""Initial tables"""

from alembic import op
import sqlalchemy as sa

revision = '0001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('email', sa.String(), unique=True, nullable=True),
        sa.Column('nickname', sa.String(50), unique=True),
        sa.Column('password_hash', sa.String(255)),
        sa.Column('invite_code', sa.String(20)),
        sa.Column('cyber_token_balance', sa.Integer(), default=200),
        sa.Column('created_at', sa.DateTime(), default=sa.func.now()),
        sa.Column('segment_label', sa.String(20), default='Low'),
    )

    op.create_table(
        'user_actions',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('action_type', sa.String(), nullable=False),
        sa.Column('timestamp', sa.DateTime(), default=sa.func.now()),
        sa.Column('value', sa.Float(), default=0.0),
    )

    op.create_table(
        'user_rewards',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('reward_type', sa.String(50), nullable=False),
        sa.Column('reward_value', sa.String(255), nullable=False),
        sa.Column('awarded_at', sa.DateTime(), default=sa.func.now()),
        sa.Column('trigger_action_id', sa.Integer(), nullable=True),
    )

    op.create_table(
        'adult_content',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('stage', sa.Integer(), unique=True, nullable=False),
        sa.Column('name', sa.String(100)),
        sa.Column('description', sa.String(255)),
        sa.Column('thumbnail_url', sa.String(255)),
        sa.Column('media_url', sa.String(255)),
        sa.Column('required_segment_level', sa.Integer(), default=1),
    )

    op.create_table(
        'user_segments',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('user_id', sa.Integer(), unique=True, nullable=False),
        sa.Column('rfm_group', sa.String()),
        sa.Column('risk_profile', sa.String()),
        sa.Column('streak_count', sa.Integer(), default=0),
        sa.Column('last_updated', sa.DateTime(), default=sa.func.now()),
    )

    op.create_table(
        'invite_codes',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('code', sa.String(20), unique=True, nullable=False),
        sa.Column('is_used', sa.Boolean(), default=False, nullable=False),
        sa.Column('created_at', sa.DateTime(), default=sa.func.now()),
    )


def downgrade() -> None:
    op.drop_table('invite_codes')
    op.drop_table('user_segments')
    op.drop_table('adult_content')
    op.drop_table('user_rewards')
    op.drop_table('user_actions')
    op.drop_table('users')
