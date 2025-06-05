"""add_target_stage_name_to_flashoffer

Revision ID: 695039d3c129
Revises: 9356e020932d
Create Date: 2025-06-05 07:32:56.415846

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '695039d3c129'
down_revision: Union[str, None] = '9356e020932d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('flash_offers', sa.Column('target_stage_name', sa.String(length=50), nullable=False, server_default="Full"))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('flash_offers', 'target_stage_name')
