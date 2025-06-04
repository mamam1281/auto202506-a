# auto202506-a

Jules AI agent를 활용하여 개발하는 web app.

This repository contains the `cc-webapp` project which is split into two main applications:

- **Frontend**: `cc-webapp/frontend` (Next.js/Node)
- **Backend**: `cc-webapp/backend` (FastAPI/Python)

Each application manages its own dependencies through `package.json` and `requirements.txt` respectively. Previously there were additional `package.json` and `pyproject.toml` files in the repository root, but these have been removed to avoid confusion. Use the dependency files within the `frontend` and `backend` directories when installing packages or running CI.

See `cc-webapp/README.md` for full setup instructions.
