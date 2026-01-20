import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MyAppAccount } from "@/schema";
import { authClient } from "@/utils/auth-client";

const registerRedirectSchema = z.object({
  redirect: z.string().catch("/"),
});

export const Route = createFileRoute("/register")({
  component: RegisterComponent,
  validateSearch: (search) => registerRedirectSchema.parse(search),
});

function RegisterComponent() {
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [registerError, setRegisterError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError("");

    const result = await authClient.signUp.email(
      { email, password, name },
      {
        onSuccess: async () => {
          const me = await MyAppAccount.getMe().$jazz.ensureLoaded({
            resolve: { profile: true },
          });
          me.profile.$jazz.set("name", name);
          me.profile.$jazz.set("email", email);
        },
      },
    );
    if (result.data) {
      navigate({ to: redirect });
    } else {
      setRegisterError(result.error.message || "Registration failed");
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Create an account</CardTitle>
              <CardDescription>
                Enter your information below to create your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                  {registerError && (
                    <div className="text-red-600 text-sm">{registerError}</div>
                  )}

                  <div className="grid gap-3">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button type="submit" className="w-full">
                      Create Account
                    </Button>
                  </div>
                </div>
                <div className="mt-4 text-center text-sm">
                  Already have an account?
                  <a href="/login" className="underline underline-offset-4">
                    Sign in
                  </a>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
