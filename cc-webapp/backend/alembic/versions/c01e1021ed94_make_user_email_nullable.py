"""make_user_email_nullable

Revision ID: c01e1021ed94
Revises: 
Create Date: 2025-06-04 16:13:13.380090

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c01e1021ed94'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.alter_column('users', 'email', existing_type=sa.String(), nullable=True)


def downgrade() -> None:
    """Downgrade schema."""
    op.alter_column('users', 'email', existing_type=sa.String(), nullable=False)
