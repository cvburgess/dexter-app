import { useEffect, useState } from "react";
import {
  CheckCircle,
  GoogleLogo,
  PaperPlaneRight,
  XCircle,
} from "@phosphor-icons/react";
import { useNavigate } from "react-router";
import classNames from "classnames";

import appIconUrl from "../assets/app-icon.png";

import {
  signInWithEmail,
  signInWithGoogle,
  useAuth,
} from "../hooks/useAuth.tsx";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { session } = useAuth();
  const navigate = useNavigate();

  // Detect session after login redirect
  useEffect(() => {
    if (session) navigate("/");
  }, [session]);

  const handleError = (error: unknown) => {
    setMessage(
      `Error: ${error instanceof Error ? error.message : "Something went wrong"}`,
    );
  };

  const handleEmailAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { error } = await signInWithEmail(email);
      if (error) throw error;

      setMessage("Check your email for a login link");
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

  return (
    <div
      className="flex flex-1 items-center justify-center"
      data-theme="dexter"
    >
      <div className="w-full desktop:h-14 top-0 absolute app-draggable" />
      <div className="max-desktop:h-screen card w-full max-w-lg bg-base-100 desktop:shadow-xl max-desktop:p-8 desktop:p-16 rounded-box">
        <div className="card-body max-desktop:justify-center">
          <div className="card-title flex-col mb-8 justify-center">
            <img className="size-24 mb-4" src={appIconUrl} />
            <h2 className="text-2xl font-bold text-center">
              Dexter Day Planner
            </h2>
          </div>

          {message && (
            <div
              className={classNames(
                "alert alert-soft alert-info mb-4 text-center",
                {
                  "!alert-error": message.includes("Error"),
                  "!alert-success": message.includes("Success"),
                },
              )}
            >
              {message.includes("Error") && <XCircle />}
              {message.includes("Success") && <CheckCircle />}
              {message.includes("email") && <PaperPlaneRight />}
              <span>{message}</span>
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

          <form onSubmit={handleEmailAuth}>
            <label className="floating-label">
              <span className="ml-1">Email</span>
              <input
                className="input input-md w-full rounded-box px-6 pb-0.5 focus:outline-none"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                type="email"
                value={email}
              />
            </label>

            <div className="form-control mt-8 max-desktop:mb-10">
              <button
                className="btn bg-base-content text-base-100 w-full"
                disabled={loading}
                type="submit"
              >
                {loading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Continue with Email"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
