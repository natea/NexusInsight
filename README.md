# NexusInsight

NexusInsight is a React and TypeScript application designed for intelligent search, comprehensive item display, and interactive visual exploration of connections. This project is bootstrapped with Vite.

## Project Structure

The `src` folder contains the main application code, organized as follows:

-   `assets/`: For static assets like images, fonts, etc.
-   `components/`: Shared UI components used across multiple features or pages.
-   `features/`: Feature-specific modules, each containing its own components, hooks, and potentially services.
    -   `search/`: Components related to the search functionality.
    -   `visual-explorer/`: Components related to the graph visualization.
-   `hooks/`: Custom React hooks shared across the application.
-   `pages/`: Top-level page components that correspond to application routes.
-   `services/`: Modules for API interactions, data fetching, or other business logic.
-   `styles/`: Global styles, theme files, or shared SASS/CSS modules. (`App.css` and `index.css` are here).
-   `utils/`: Utility functions and helpers.
-   `App.tsx`: The main application component.
-   `main.tsx`: The entry point of the application, renders the App component.
-   `Router.tsx`: Defines the application's routing structure.
-   `index.css`: Global CSS reset and base styles.

## Key Features (Initial Placeholders)

1.  **Intelligent Search & Comprehensive Item Display**:
    -   Search input and results display.
    -   Detailed view for selected items.
2.  **Interactive Visual Exploration of Connections**:
    -   Canvas for graph rendering (Cytoscape.js integration planned).
    -   Panel for displaying information about selected nodes/edges.

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in development mode using Vite.
Open [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal) to view it in the browser.
The page will reload if you make edits. You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `dist` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.
The build is minified and the filenames include the hashes.

### `npm run preview`

Serves the production build locally. This is useful for testing the build before deploying.

## Learn More

-   [React Documentation](https://reactjs.org/)
-   [Vite Documentation](https://vitejs.dev/)
-   [TypeScript Documentation](https://www.typescriptlang.org/)
-   [React Router DOM](https://reactrouter.com/)
-   [Cytoscape.js](https://js.cytoscape.org/) (for visual exploration)

## Linting and Formatting

This project uses ESLint and Prettier for code linting and formatting. Ensure you have the relevant editor extensions installed for the best experience.
-   ESLint configuration: `.eslintrc.json`
-   Prettier configuration: `.prettierrc.json`

You can run lint checks manually if needed, or integrate them into your CI/CD pipeline.
(Add specific lint/format commands here if not part of `dev` or `build` implicitly)