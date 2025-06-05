"""add_source_description_to_userreward

Revision ID: 9356e020932d
Revises: 2f4cfa9e6549
Create Date: 2025-06-05 07:29:00.868934

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9356e020932d'
down_revision: Union[str, None] = '2f4cfa9e6549'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('user_rewards', sa.Column('source_description', sa.String(length=255), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('user_rewards', 'source_description')
