import { createHashHistory } from "@tanstack/history";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import "./i18n";
import "./routes/styles/router.scss";

function DefaultErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="router-error">
      <div className="router-error__content">
        <div className="router-error__icon-wrap">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="router-error__icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
        </div>
        <h1 className="router-error__title">Something went wrong</h1>
        <p className="router-error__desc">An unexpected error occurred. Please try again.</p>
        {import.meta.env.DEV && error.message && (
          <pre className="router-error__dev-message">{error.message}</pre>
        )}
        <div className="router-error__actions">
          <button
            onClick={() => {
              reset();
            }}
            className="router-error__btn router-error__btn--primary"
          >
            Try again
          </button>
          <a href={`${import.meta.env.BASE_URL}#/`} className="router-error__btn router-error__btn--secondary">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const getRouter = () => {
  const router = createRouter({
    routeTree,
    context: {},
    // hash routing
    ...(typeof document !== "undefined" ? { history: createHashHistory() } : {}),
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: DefaultErrorComponent,
  });

  return router;
};
