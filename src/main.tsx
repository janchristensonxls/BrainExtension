import { createRouter, RouterProvider } from "@tanstack/react-router";
import { AuthProvider } from "jazz-tools/better-auth/auth/react";
import { JazzInspector } from "jazz-tools/inspector";
import { JazzReactProvider, useAccount, useIsAuthenticated } from "jazz-tools/react";
import ReactDOM from "react-dom/client";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import reportWebVitals from "@/reportWebVitals.ts";
import { routeTree } from "./routeTree.gen";
import { MyAppAccount } from "./schema";
import { authClient } from "./utils/auth-client";
import "./styles.css";

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    isAuthenticated: false,
  },
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <ErrorBoundary>
      <JazzReactProvider
        sync={{
          peer: `wss://cloud.jazz.tools/?key=${import.meta.env.VITE_JAZZ_API_KEY}`,
          when: "never", // When to sync: "always", "never", or "signedUp"
        }}
        AccountSchema={MyAppAccount}
        authSecretStorageKey="jazz-logged-in-secret-v4"
      >
        <AuthProvider betterAuthClient={authClient}>
          <JazzInspector />
          <InnerApp />
        </AuthProvider>
      </JazzReactProvider>
    </ErrorBoundary>,
  );
}

export function InnerApp() {
  const isAuthenticated = useIsAuthenticated();
  const account = useAccount(MyAppAccount, {
    resolve: { profile: {}, root: { myProjects: true } },
  });
  account.$isLoaded && console.log("Logged in as:", account.profile.name);

  return <RouterProvider router={router} context={{ isAuthenticated }} />;
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
if (import.meta.env.DEV) {
  reportWebVitals(console.log);
}
