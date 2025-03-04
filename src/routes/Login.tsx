// deno-lint-ignore-file
import { FormEventHandler, useState } from "react";
import { GoogleLogo } from "@phosphor-icons/react";

import { View } from "../components/View.tsx";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleEmailPasswordAuth = async (event: FormEventHandler) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (isLogin) {
        // Sign in with email and password
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        setMessage("Login successful!");
        console.log("User logged in:", data);
      } else {
        // Sign up with email and password
        const { data, error } = await supabase.auth
          .signUp({
            email,
            password,
          });

        if (error) throw error;
        setMessage(
          "Sign up successful! Please check your email for verification.",
        );
        console.log("User signed up:", data);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setMessage("");

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) throw error;
      console.log("Google auth initiated:", data);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
      setLoading(false);
    }
  };

  return (
    <View className="flex items-center justify-center">
      <div className="card w-full max-w-md bg-base-100 shadow-xl p-8 rounded-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold text-center mb-8 flex justify-center">
            {isLogin ? "Login" : "Sign Up"}
          </h2>

          {message && (
            <div
              className={`alert mb-4 ${
                message.includes("Error") ? "alert-error" : "alert-success"
              }`}
            >
              {message}
            </div>
          )}

          <button
            onClick={handleGoogleLogin}
            className="btn btn-outline rounded-full"
            disabled={loading}
          >
            <GoogleLogo size={24} weight="bold" />
            Continue with Google
          </button>

          <div className="divider mt-5 mb-4">OR</div>

          <form onSubmit={handleEmailPasswordAuth}>
            <label className="floating-label">
              <span className="ml-1">Email</span>
              <input
                type="email"
                placeholder="Email"
                className="input input-md w-full rounded-full px-6 pb-0.5"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label className="floating-label mt-6">
              <span className="ml-1">Password</span>
              <input
                type="password"
                placeholder="Password"
                className="input input-md w-full rounded-full px-6 pb-0.5"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            <div className="form-control mt-8">
              <button
                type="submit"
                className="btn btn-primary w-full rounded-full"
                disabled={loading}
              >
                {loading
                  ? <span className="loading loading-spinner"></span>
                  : isLogin
                  ? "Login"
                  : "Sign Up"}
              </button>
            </div>
          </form>

          <div className="flex flex-col mt-4 gap-4">
            <button
              type="button"
              className="link link-hover"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Login"}
            </button>

            <button
              type="button"
              className={`link link-hover ${isLogin ? "" : "invisible"}`}
              onClick={() => {}}
            >
              Forgot password
            </button>
          </div>
        </div>
      </div>
    </View>
  );
};
