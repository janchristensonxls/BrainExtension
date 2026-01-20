import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useAccount } from "jazz-tools/react";
import { ChevronRight, User } from "lucide-react";
import { ButtonLink } from "@/components/elements/ButtonLink";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Item, ItemContent } from "@/components/ui/item";
import { MyAppAccount } from "@/schema";

export const Route = createFileRoute("/_protected/account")({
  component: RouteComponent,
});

function RouteComponent() {
  const user = useAccount(MyAppAccount, {
    resolve: {
      profile: true,
    },
  });

  if (!user.$isLoaded) return null;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>
      <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
        <Item variant="outline">
          <ItemContent className="lg:w-64">
            <aside>
              <nav className="flex flex-col space-y-0.5 space-x-2 lg:space-x-0">
                <ButtonLink
                  variant="ghost"
                  to="/account/profile"
                  className="justify-start"
                >
                  <User />
                  Profile
                </ButtonLink>

                <Collapsible
                  defaultOpen
                  className="group/collapsible flex flex-col"
                >
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="justify-start">
                      test
                      <ChevronRight className="ml-auto" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="flex flex-col">
                    <ButtonLink
                      variant="ghost"
                      to="/account/profile"
                      className="justify-start px-6"
                    >
                      test
                    </ButtonLink>
                  </CollapsibleContent>
                </Collapsible>
              </nav>
            </aside>
          </ItemContent>
        </Item>
        <div className="flex-1 lg:max-w-2xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
