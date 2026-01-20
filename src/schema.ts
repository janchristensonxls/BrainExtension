import { co, Group, z } from "jazz-tools";
import { Project } from "./coTypes/data";

// const Item = co.map({
//   name: z.string(),
// });

// const ListOfItems = co.list(Item);

// export const Project = co.map({
//   name: z.string(),
//   items: ListOfItems,
// });

const MyAppRoot = co.map({
  myProjects: co.list(Project),
});

export const MyAppProfile = co.profile({
  name: z.string(), // compatible with default Profile schema
  email: z.email(),
  avatar: co.optional(co.image()),
});

export const MyAppAccount = co
  .account({
    root: MyAppRoot,
    profile: MyAppProfile,
  })
  .withMigration((account, creationProps) => {
    if (!account.$jazz.has("root")) {
      account.$jazz.set("root", {
        myProjects: [],
      });
    }

    if (!account.$jazz.has("profile")) {
      const profileGroup = Group.create();
      // Unlike the root, we want the profile to be publicly readable.
      profileGroup.makePublic();

      account.$jazz.set(
        "profile",
        MyAppProfile.create(
          {
            name: creationProps?.name ?? "New User",
            email: "not@provided.com",
            avatar: undefined,
          },
          profileGroup,
        ),
      );
    }
  });
