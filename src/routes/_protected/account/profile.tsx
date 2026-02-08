import { createFileRoute } from "@tanstack/react-router";
import { createImage } from "jazz-tools/media";
import { SaveIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Item, ItemContent } from "@/components/ui/item";
import { Label } from "@/components/ui/label";
import { useImage } from "@/hooks/use-image";
import { useSubscribeToCoValue } from "@/hooks/use-subscribe-to-co-value";

export const Route = createFileRoute("/_protected/account/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  const data = Route.useRouteContext();
  const user = useSubscribeToCoValue(data.me);
  const name = user.profile.name;

  const avatarImage = useImage({
    imageId: user.$isLoaded ? user.profile.avatar?.$jazz.id : undefined,
  });

  const userInitials = user.profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Item variant="outline">
      <ItemContent>
        <form
          className="grid gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            user.profile.$jazz.set("name", name);
          }}
        >
          <div className="flex justify-center gap-4 mb-4">
            <label htmlFor="avatar" className="cursor-pointer relative">
              <Avatar className="w-40 h-40 hover:opacity-80 transition-opacity">
                <AvatarImage src={avatarImage} alt={user.profile.name} />
                <AvatarFallback className="rounded-lg">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <input
                id="avatar"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) {
                    return;
                  }

                  const image = await createImage(file, {
                    owner: user.$jazz.owner,
                    maxSize: 1024,
                    placeholder: "blur",
                    progressive: true,
                  });
                  user.profile.$jazz.set("avatar", image);
                }}
              />
            </label>
          </div>
          <Label htmlFor="name">Name</Label>
          <InputGroup>
            <InputGroupInput
              id="name"
              placeholder="John doe"
              defaultValue={name}
              onChange={(e) => user.profile.$jazz.set("name", e.target.value)}
            />
            {name !== user.profile.name && (
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  aria-label="Save"
                  title="Save"
                  size="icon-xs"
                  onClick={() => {
                    console.log("Save clicked");
                  }}
                >
                  <SaveIcon />
                </InputGroupButton>
              </InputGroupAddon>
            )}
          </InputGroup>
        </form>
      </ItemContent>
    </Item>
  );
}
