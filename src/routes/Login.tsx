import { useEffect, useState } from "react";
import { GoogleLogo } from "@phosphor-icons/react";
import { useNavigate } from "react-router";
import classNames from "classnames";

import {
  resetPassword,
  signIn,
  signInWithGoogle,
  signUp,
  updatePassword,
  useAuth,
} from "../hooks/useAuth.tsx";

export const Login = () => {
  const { resetInProgress } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (resetInProgress) {
      setMessage("Success! Please enter a new password");
    }
  }, [resetInProgress]);

  const handleError = (error: unknown) => {
    setMessage(
      `Error: ${error instanceof Error ? error.message : "Something went wrong"}`,
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
        if (resetInProgress) {
          const { error } = await updatePassword({ password });

          if (error) throw error;
          setMessage("Password saved successfully");
          navigate("/");
        } else {
          const { error } = await signIn({ email, password });

          if (error) throw error;
          navigate("/");
        }
      } else {
        const { error } = await signUp({ email, password });

        if (error) throw error;
        setMessage("Check your email for a verification link");
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);

    try {
      const { data, error } = await signInWithGoogle();
      window.open(data.url, "_blank");

      if (error) throw error;
    } catch (error) {
      handleError(error);
    }
  };

  let buttonText: string | React.ReactNode = "";

  if (loading) {
    buttonText = <span className="loading loading-spinner"></span>;
  } else if (isLogin) {
    if (resetInProgress) {
      buttonText = "Save Password and Login";
    } else {
      buttonText = "Login";
    }
  } else {
    buttonText = "Sign Up";
  }

  return (
    <div
      className="flex flex-1 items-center justify-center"
      data-theme="dexter"
    >
      <div className="w-full h-14 top-0 absolute app-draggable" />
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
            className="btn btn-outline rounded-box"
            disabled={loading}
            id="open-in-browser"
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
                className="input input-md w-full rounded-box px-6 pb-0.5"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                type="email"
                value={email}
              />
            </label>

            <label className="floating-label mt-6">
              <span className="ml-1">Password</span>
              <input
                className="input input-md w-full rounded-box px-6 pb-0.5"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                type="password"
                value={password}
              />
            </label>

            <div className="form-control mt-8">
              <button
                className="btn btn-primary w-full rounded-box" // bg-base-content text-base-100
                disabled={loading}
                type="submit"
              >
                {buttonText}
              </button>
            </div>
          </form>

          <div className="flex flex-col mt-4 gap-4">
            <button
              className="link link-hover"
              onClick={() => setIsLogin(!isLogin)}
              type="button"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Login"}
            </button>

            <button
              className={classNames("link link-hover", {
                invisible: !isLogin,
              })}
              onClick={async () => {
                if (email) {
                  const { error } = await resetPassword({ email });
                  if (error) {
                    handleError(error);
                  } else {
                    setMessage("Check your email for a reset link");
                  }
                }
              }}
              type="button"
            >
              Forgot password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
