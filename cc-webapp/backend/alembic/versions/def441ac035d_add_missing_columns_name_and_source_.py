"""add_missing_columns_name_and_source_description

Revision ID: def441ac035d
Revises: 695039d3c129
Create Date: 2025-06-05 17:44:19.728153

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'def441ac035d'
down_revision: Union[str, None] = '695039d3c129'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Add source_description column to user_rewards table
    op.add_column('user_rewards', sa.Column('source_description', sa.String(255), nullable=True))
    
    # Add name column to user_segments table  
    op.add_column('user_segments', sa.Column('name', sa.String(50), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    # Remove the added columns
    op.drop_column('user_rewards', 'source_description')
    op.drop_column('user_segments', 'name')
