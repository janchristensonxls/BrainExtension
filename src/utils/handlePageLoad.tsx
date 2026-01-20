import { notFound } from "@tanstack/react-router";
import type { CoValueBase, MaybeLoaded } from "jazz-tools";

function PageLoading() {
  return <div>Loading...</div>;
}

export const handlePageLoad = <T extends CoValueBase>(
  coValue: MaybeLoaded<T>,
  loadComponent?: React.ReactNode,
) => {
  if (coValue.$jazz.loadingState === "loading") {
    return loadComponent ?? <PageLoading />;
  }

  throw notFound();
};
