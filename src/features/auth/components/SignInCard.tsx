import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { SignInFlow } from "../types";
import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { TriangleAlert } from "lucide-react";

interface SignInCardProps {
  setState: (state: SignInFlow) => void;
}

export const SignInCard = ({ setState }: SignInCardProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { signIn } = useAuthActions();
  const handleProviderSignIn = (value: "google" | "github") => {
    setIsLoading(true);
    signIn(value).finally(() => {
      setIsLoading(false);
    });
  };
  const handlePasswordSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    signIn("password", {
      email,
      password,
      flow: "signUp",
    })
      .catch((error) => {
        setError("Invalid email or password");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Card className="h-full w-md p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-2xl font-[650]">Login to continue</CardTitle>
        <CardDescription>
          Use your email or another service to login to your account
        </CardDescription>
        {!!error && (
          <div className="bg-destructive/15 p-3 rounded-md flex items-center text-sm text-destructive mt-2">
            <TriangleAlert className="size-4 mr-2" />
            <p>{error}</p>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-5 px-0 pb-0">
        <form onSubmit={handlePasswordSignIn} className="space-y-4">
          <Input
            disabled={isLoading}
            placeholder="Try 'test@test.com'"
            type="email"
            className="h-10"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            disabled={isLoading}
            placeholder="Try 'Test@123'"
            type="password"
            className="h-10"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            disabled={isLoading}
            type="submit"
            className="w-full p-5"
            variant="default"
          >
            Login
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col gap-y-2.5">
          <Button
            disabled={isLoading}
            variant="outline"
            onClick={() => {
              handleProviderSignIn("google");
            }}
            size="lg"
            className="w-full relative"
          >
            <FcGoogle className="size-5 absolute left-2 top-1/2 -translate-y-1/2" />
            Continue with Google
          </Button>
          <Button
            disabled={isLoading}
            variant="outline"
            onClick={() => {
              handleProviderSignIn("github");
            }}
            size="lg"
            className="w-full relative"
          >
            <FaGithub className="size-5 absolute left-2 top-1/2 -translate-y-1/2" />
            Continue with Github
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <span
            onClick={() => setState("signUp")}
            className="text-sky-950 hover:underline cursor-pointer"
          >
            Sign up
          </span>
        </p>
      </CardContent>
    </Card>
  );
};
