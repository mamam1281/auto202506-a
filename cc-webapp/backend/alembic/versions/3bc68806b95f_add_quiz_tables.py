"""add_quiz_tables

Revision ID: 3bc68806b95f
Revises: c298f11cabed
Create Date: 2025-06-15 20:38:06.743435

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3bc68806b95f'
down_revision: Union[str, None] = 'c298f11cabed'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Create quizzes table
    op.create_table(
        'quizzes',
        sa.Column('id', sa.Integer, primary_key=True, index=True),
        sa.Column('title', sa.String(200), nullable=False, index=True),
        sa.Column('description', sa.Text),
        sa.Column('category', sa.String(100), index=True),
        sa.Column('difficulty', sa.String(20), default='easy'),
        sa.Column('is_active', sa.Boolean, default=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), onupdate=sa.func.now())
    )
    
    # Create quiz_questions table
    op.create_table(
        'quiz_questions',
        sa.Column('id', sa.Integer, primary_key=True, index=True),
        sa.Column('quiz_id', sa.Integer, sa.ForeignKey('quizzes.id'), nullable=False),
        sa.Column('question', sa.Text, nullable=False),
        sa.Column('question_type', sa.String(20), default='multiple_choice'),
        sa.Column('order', sa.Integer, default=0),
        sa.Column('points', sa.Integer, default=1),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now())
    )
    
    # Create quiz_options table
    op.create_table(
        'quiz_options',
        sa.Column('id', sa.Integer, primary_key=True, index=True),
        sa.Column('question_id', sa.Integer, sa.ForeignKey('quiz_questions.id'), nullable=False),
        sa.Column('option_text', sa.Text, nullable=False),
        sa.Column('is_correct', sa.Boolean, default=False),
        sa.Column('order', sa.Integer, default=0)
    )
    
    # Create quiz_results table
    op.create_table(
        'quiz_results',
        sa.Column('id', sa.Integer, primary_key=True, index=True),
        sa.Column('user_id', sa.Integer, sa.ForeignKey('users.id'), nullable=False),
        sa.Column('quiz_id', sa.Integer, sa.ForeignKey('quizzes.id'), nullable=False),
        sa.Column('score', sa.Integer, default=0),
        sa.Column('max_score', sa.Integer, nullable=False),
        sa.Column('percentage', sa.Integer, default=0),
        sa.Column('time_taken', sa.Integer),
        sa.Column('completed_at', sa.DateTime(timezone=True), server_default=sa.func.now())
    )
    
    # Create quiz_user_answers table
    op.create_table(
        'quiz_user_answers',
        sa.Column('id', sa.Integer, primary_key=True, index=True),
        sa.Column('result_id', sa.Integer, sa.ForeignKey('quiz_results.id'), nullable=False),
        sa.Column('question_id', sa.Integer, sa.ForeignKey('quiz_questions.id'), nullable=False),
        sa.Column('selected_option_id', sa.Integer, sa.ForeignKey('quiz_options.id')),
        sa.Column('text_answer', sa.Text),
        sa.Column('is_correct', sa.Boolean, default=False),
        sa.Column('answered_at', sa.DateTime(timezone=True), server_default=sa.func.now())
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table('quiz_user_answers')
    op.drop_table('quiz_results')
    op.drop_table('quiz_options')
    op.drop_table('quiz_questions')
    op.drop_table('quizzes')
