import { useEffect, useState } from "react";
import { GoogleLogo } from "@phosphor-icons/react";
import { useNavigate } from "react-router";
import classNames from "classnames";

import { useAuth } from "../hooks/useAuth.tsx";

export const Login = () => {
  const {
    resetPassword,
    resetPasswordState,
    signIn,
    signInWithGoogle,
    signUp,
    updatePassword,
  } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (resetPasswordState === "recovered") {
      setMessage("Success! Please enter a new password");
    }
  }, [resetPasswordState]);

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
        if (resetPasswordState === "recovered") {
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
    if (resetPasswordState === "recovered") {
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
                {buttonText}
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
            >
              Forgot password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
