"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PenTool } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        toast.error("Invalid credentials or too many attempts");
      } else {
        toast.success("Login successful");
        router.push("/admin");
        router.refresh();
      }
    } catch (err) {
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface-card border border-border-default rounded-productframes shadow-card p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-moss text-pure-white rounded-full flex items-center justify-center mb-4">
            <PenTool className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-display font-bold text-heading">பேனாக்கள் Admin</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-ui text-body-sm font-medium mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-2 bg-surface-page border border-border-default rounded-buttons focus:outline-none focus:border-moss transition-colors"
            />
          </div>
          <div>
            <label className="block font-ui text-body-sm font-medium mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-2 bg-surface-page border border-border-default rounded-buttons focus:outline-none focus:border-moss transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-moss text-pure-white font-ui font-bold py-2 rounded-buttons hover:bg-moss/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
