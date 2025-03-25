import { useState } from "react";

import { ConfirmModal } from "../../components/ConfirmModal.tsx";
import { Panel } from "../../components/Panel.tsx";

import { deleteAccount, useAuth } from "../../hooks/useAuth.tsx";

export const Account = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { signOut } = useAuth();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <Panel>
      <button
        type="button"
        className="btn"
        onClick={async () => await signOut()}
      >
        Sign out
      </button>
      <button type="button" className="btn" onClick={openModal}>
        Delete account
      </button>
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={deleteAccount}
        title={"Delete account"}
        message={
          <>
            This will{" "}
            <span className="font-bold text-error">permanently delete</span>
            <br /> your account and all your data <br /> <br />
            This cannot be undone
          </>
        }
        confirmButtonText="Goodbye"
      />
    </Panel>
  );
};
