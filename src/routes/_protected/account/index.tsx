import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/account/")({
  component: RouteComponent,
  beforeLoad: async () => {
    throw redirect({ to: "/account/profile" });
  },
});

function RouteComponent() {
  return <div>Hello "/_protected/account/"!</div>;
}
