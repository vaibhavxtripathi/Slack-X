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
import { TriangleAlert } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";

interface SignUpCardProps {
  setState: (state: SignInFlow) => void;
}

export const SignUpCard = ({ setState }: SignUpCardProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { signIn } = useAuthActions();
  const handleProviderSignUp = (value: "google" | "github") => {
    setIsLoading(true);
    signIn(value).finally(() => {
      setIsLoading(false);
    });
  };

  const handlePasswordSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }
    signIn("password", {
      name,
      email,
      password,
      flow: "signUp",
    })
      .catch((error) => {
        setError(
          "Password must contain a capital letter, a number and a special character"
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <Card className="h-full w-md p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-2xl font-[650]">Create an account</CardTitle>
        <CardDescription>
          Use your email or another service to create an account
        </CardDescription>
        {!!error && (
          <div className="bg-destructive/15 p-3 rounded-md flex items-center text-sm text-destructive mt-2">
            <TriangleAlert className="size-4 mr-2" />
            <p>{error}</p>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-5 px-0 pb-0">
        <form onSubmit={handlePasswordSignUp} className="space-y-2.5">
          <Input
            disabled={isLoading}
            placeholder="Full Name"
            type="text"
            className="h-10"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            disabled={isLoading}
            placeholder="Email"
            type="email"
            className="h-10"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            disabled={isLoading}
            placeholder="Password"
            type="password"
            className="h-10"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            disabled={isLoading}
            placeholder="Confirm Password"
            type="password"
            className="h-10"
            autoComplete="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <Button disabled={isLoading} type="submit" className="w-full p-5">
            Create account
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col gap-y-2.5">
          <Button
            disabled={isLoading}
            variant="outline"
            onClick={() => {
              handleProviderSignUp("google");
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
              handleProviderSignUp("github");
            }}
            size="lg"
            className="w-full relative"
          >
            <FaGithub className="size-5 absolute left-2 top-1/2 -translate-y-1/2" />
            Continue with Github
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <span
            onClick={() => setState("signIn")}
            className="text-sky-950 hover:underline cursor-pointer"
          >
            Sign in
          </span>
        </p>
      </CardContent>
    </Card>
  );
};
