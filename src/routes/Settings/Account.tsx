import { useState } from "react";

import { ConfirmModal } from "../../components/ConfirmModal.tsx";

import { deleteAccount, signOut } from "../../hooks/useAuth.tsx";

export const Account = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <button
        className="btn"
        onClick={async () => await signOut()}
        type="button"
      >
        Sign out
      </button>
      <button className="btn" onClick={openModal} type="button">
        Delete account
      </button>
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
