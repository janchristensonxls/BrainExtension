import { createLink, useLocation, useNavigate } from "@tanstack/react-router";
import { useAccount, useLogOut } from "jazz-tools/react";
import { CircleUser, EllipsisVertical, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useImage } from "@/hooks/use-image";
import { MyAppAccount } from "@/schema";
import { authClient } from "@/utils/auth-client";

const AccountLink = createLink(DropdownMenuItem);

export function NavUser() {
  const { isMobile } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();
  const logOut = useLogOut();

  const user = useAccount(MyAppAccount, {
    resolve: {
      profile: true,
    },
  });

  const signOut = async () => {
    await authClient.signOut();
    logOut();
    navigate({
      to: "/login",
      search: {
        redirect: location.href,
      },
    });
  };

  const avatarImage = useImage({
    imageId: user.$isLoaded ? user.profile.avatar?.$jazz.id : undefined,
  });

  if (!user.$isLoaded) return null;

  const userInitials = user.profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={avatarImage} alt={user.profile.name} />
                <AvatarFallback className="rounded-lg">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {user.profile.name}
                </span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.profile.email}
                </span>
              </div>
              <EllipsisVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={avatarImage} alt={user.profile.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {user.profile.name}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.profile.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <AccountLink to="/account">
                <CircleUser />
                Account
              </AccountLink>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
