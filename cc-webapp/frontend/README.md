# CC Webapp - Frontend

This directory contains the Next.js frontend for the CC Webapp.

## Prerequisites
- Node.js (version 18.x or as specified in `.nvmrc` if present, or `frontend/Dockerfile`)
- npm (comes with Node.js)

## Local Development

1.  Navigate to the `frontend` directory:
    ```bash
    cd cc-webapp/frontend
    # Or from project root: cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    # Or 'npm ci' for cleaner installs if package-lock.json is up-to-date and you want to match it exactly
    ```
3.  Run the Next.js development server:
    ```bash
    npm run dev
    ```
The frontend will be available at `http://localhost:3000`. It expects the backend to be running, typically on `http://localhost:8000`.

## Building for Production
To create a production build:
```bash
npm run build
```
To serve the production build locally (after running `npm run build`):
```bash
npm start
# (This usually runs 'next start')
```

## Testing

The frontend includes both unit tests (Jest & React Testing Library) and end-to-end tests (Cypress).

-   **Unit/Component Tests (Jest):**
    ```bash
    npm test
    ```
    To run in watch mode:
    ```bash
    npm run test:watch
    ```
    Coverage reports are generated if configured in Jest setup.

-   **End-to-End Tests (Cypress):**
    *   To open the Cypress Test Runner (interactive mode):
        ```bash
        npm run cy:open
        ```
    *   To run Cypress tests headlessly (e.g., for CI):
        ```bash
        npm run cy:run
        ```
    *   Note: E2E tests expect the backend and frontend development servers to be running.

To run tests via Docker Compose (ensure services are up, e.g., `docker-compose up -d frontend backend` or the full stack):
-   **Unit/Component Tests (Jest):**
    ```bash
    # From the project root (cc-webapp directory)
    docker-compose exec frontend npm test -- --watchAll=false
    ```
-   **End-to-End Tests (Cypress):**
    Cypress tests require a running application. Ensure the full stack is up:
    ```bash
    # From the project root (cc-webapp directory)
    docker-compose up --build -d
    # Then open Cypress runner (from cc-webapp/frontend directory):
    # npm run cy:open
    # Or run headlessly via Docker Compose:
    docker-compose exec frontend npm run cy:run
    # Note: Running Cypress headlessly inside `docker-compose exec` might require
    # the frontend container to have browser dependencies (see frontend/Dockerfile comments)
    # or for Cypress to be configured to connect to a browser elsewhere.
    # For simplicity, `npm run cy:open` on the host against `http://localhost:3000` is often easiest for local E2E.
    ```

### Vulnerability Scanning (Frontend)

To check for known vulnerabilities in frontend dependencies, run the following command from the `cc-webapp/frontend` directory:

```bash
npm audit
```

For a CI environment, you might want the command to fail if vulnerabilities of a certain level are found:
```bash
npm audit --audit-level=high # Example: Fails if 'high' or 'critical' severity vulnerabilities are found
```
Alternatively, tools like `audit-ci` or `better-npm-audit` can be integrated into CI pipelines for more configurable behavior.

Regularly review the audit output and update packages as necessary, paying attention to breaking changes.

## Backend Interaction

The frontend application interacts with the backend services, which are expected to be running on `http://localhost:8000` during local development when the frontend is run via `npm run dev`.

The backend provides various API endpoints for game logic, user data, actions, rewards, content unlocking, recommendations, notifications, etc. Key backend monitoring endpoints that the frontend might indirectly benefit from (or that developers should be aware of) include:

-   `GET /health`: Provides the health status of the backend API.
-   `GET /metrics`: Exposes application metrics in Prometheus format for monitoring the backend.

Frontend API calls are generally directed to `http://localhost:8000/api/...`. Refer to backend documentation or OpenAPI schema (`http://localhost:8000/docs`) for full API details.

## Project Structure

-   `app/`: Contains page components (App Router structure).
-   `components/`: Shared React components used across pages.
-   `hooks/`: Custom React hooks.
-   `utils/`: Utility functions.
-   `public/`: Static assets (images, sounds, etc.).
-   `__tests__/`: Jest unit/component tests.
-   `cypress/`: Cypress E2E tests.
-   `jest.config.js`, `jest.setup.js`: Configuration for Jest.
-   `cypress.json` (or `cypress.config.js`): Configuration for Cypress.
-   `tailwind.config.js`, `postcss.config.js`: Configuration for Tailwind CSS.
