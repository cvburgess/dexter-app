import { useState } from "react";
import type { User } from "@supabase/supabase-js";

import { ConfirmModal } from "../../components/ConfirmModal.tsx";

import { deleteAccount, signOut, useAuth } from "../../hooks/useAuth.tsx";

export const Account = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { session } = useAuth();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <UserProfile user={session.user} />

      <div className="flex gap-4 mt-auto">
        <button
          className="btn flex-1"
          onClick={async () => await signOut()}
          type="button"
        >
          Sign out
        </button>
        <button
          className="btn btn-soft btn-error"
          onClick={openModal}
          type="button"
        >
          Delete account
        </button>
      </div>
      <ConfirmModal
        isOpen={isModalOpen}
        message={
          <>
            This will{" "}
            <span className="font-bold text-error">permanently delete</span>
            <br /> your account and all your data <br /> <br />
            This cannot be undone
          </>
        }
        onClose={closeModal}
        options={[
          {
            action: deleteAccount,
            buttonClass: "btn-error",
            title: "Goodbye",
          },
        ]}
        title={"Delete account"}
      />
    </>
  );
};

const UserProfile = ({ user }: { user: User }) => {
  return (
    <div className="card bg-base-200 shadow-md">
      <div className="card-body">
        <div className="flex items-center gap-6">
          {user.user_metadata.avatar_url ? (
            <div className="avatar">
              <div className="w-16 rounded-full">
                <img alt="User avatar" src={user.user_metadata.avatar_url} />
              </div>
            </div>
          ) : (
            <div className="avatar avatar-placeholder">
              <div className="bg-neutral text-neutral-content rounded-full w-16">
                <span className="text-3xl">
                  {user.email?.charAt(0)?.toUpperCase() ?? "😄"}
                </span>
              </div>
            </div>
          )}

          <div>
            <h3 className="text-lg font-bold">
              {user.user_metadata.full_name || user.user_metadata.user_name}
            </h3>
            <p className="text-base-content/70">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
