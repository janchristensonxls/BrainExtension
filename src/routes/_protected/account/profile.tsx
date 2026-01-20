import { createFileRoute } from "@tanstack/react-router";
import { createImage } from "jazz-tools/media";
import { SaveIcon } from "lucide-react";
import { useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Item, ItemContent } from "@/components/ui/item";
import { Label } from "@/components/ui/label";
import { useSubscribeToCoValue } from "@/hooks/use-subscribe-to-co-value";

export const Route = createFileRoute("/_protected/account/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  const data = Route.useRouteContext();
  const user = useSubscribeToCoValue(data.me);
  const [name, setName] = useState(user.profile.name);
  const [avatar, setAvatar] = useState<File | null>(null);

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
          <Label htmlFor="name">Name</Label>
          <InputGroup>
            <InputGroupInput
              id="name"
              placeholder="John doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
        <form className="grid gap-3 mt-4">
          <Label htmlFor="avatar">Avatar</Label>
          <InputGroup>
            <InputGroupInput
              id="avatar"
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) {
                  setAvatar(null);
                  return;
                }
                setAvatar(file);
              }}
            />
            {avatar && (
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  aria-label="Save"
                  title="Save"
                  size="icon-xs"
                  onClick={async (e) => {
                    const image = await createImage(avatar, {
                      owner: user.$jazz.owner,
                      maxSize: 1024,
                      placeholder: "blur",
                      progressive: true,
                    });

                    if (e.target instanceof HTMLButtonElement)
                      e.target.closest("form")?.reset();

                    user.profile.$jazz.set("avatar", image);
                    setAvatar(null);
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
