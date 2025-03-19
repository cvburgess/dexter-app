import { useState } from "react";
import { GoogleLogo } from "@phosphor-icons/react";
import { useNavigate } from "react-router";
import classNames from "classnames";

import { View } from "../components/View.tsx";
import { useAuth } from "../hooks/useAuth.tsx";

export const Login = () => {
  const { signIn, signInWithGoogle, signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleError = (error: unknown) => {
    setMessage(
      `Error: ${error instanceof Error ? error.message : "An error occurred"}`,
    );
  };

  const handleEmailPasswordAuth = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (isLogin) {
        const { error } = await signIn({ email, password });

        if (error) throw error;
        setMessage("Login successful!");
        navigate("/");
      } else {
        const { error } = await signUp({ email, password });

        if (error) throw error;
        setMessage("Success! Check your email for verification");
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setMessage("");

    try {
      const { data, error } = await signInWithGoogle();
      window.open(data.url, "_blank");

      if (error) throw error;
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <View>
      <div className="flex items-center justify-center">
        <div className="card w-full max-w-md bg-base-100 shadow-xl p-8 rounded-box">
          <div className="card-body">
            <h2 className="card-title text-2xl font-bold text-center mb-8 flex justify-center">
              {isLogin ? "Login" : "Sign Up"}
            </h2>

            {message && (
              <div
                className={classNames(
                  "alert mb-4",
                  message.includes("Error") ? "alert-error" : "alert-success",
                )}
              >
                {message}
              </div>
            )}

            <button
              id="open-in-browser"
              className="btn btn-outline rounded-box"
              disabled={loading}
              onClick={handleGoogleLogin}
              type="button"
            >
              <GoogleLogo className="mr-2" size={18} weight="bold" />
              Continue with Google
            </button>

            <div className="divider mt-5 mb-4">OR</div>

            <form onSubmit={handleEmailPasswordAuth}>
              <label className="floating-label">
                <span className="ml-1">Email</span>
                <input
                  type="email"
                  placeholder="Email"
                  className="input input-md w-full rounded-box px-6 pb-0.5"
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
                  className="input input-md w-full rounded-box px-6 pb-0.5"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>

              <div className="form-control mt-8">
                <button
                  type="submit"
                  className="btn btn-primary w-full rounded-box"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="loading loading-spinner"></span>
                  ) : isLogin ? (
                    "Login"
                  ) : (
                    "Sign Up"
                  )}
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
                className={classNames("link link-hover", {
                  invisible: isLogin,
                })}
                onClick={() => {
                  // TODO: Forgot password
                }}
              >
                Forgot password
              </button>
            </div>
          </div>
        </div>
      </div>
    </View>
  );
};
