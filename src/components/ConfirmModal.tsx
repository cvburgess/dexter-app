import { useRef, useEffect } from "react";

type TConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string | React.ReactNode;
  confirmButtonText: string;
};

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmation",
  message,
  confirmButtonText,
}: TConfirmModalProps) => {
  const dialogRef = useRef(null);

  // Control modal open/close state
  useEffect(() => {
    if (dialogRef.current) {
      isOpen ? dialogRef.current.showModal() : dialogRef.current.close();
    }
  }, [isOpen]);

  // Handle dialog close event
  useEffect(() => {
    const dialog = dialogRef.current;

    if (dialog) {
      dialog.addEventListener("close", onClose);
      return () => dialog.removeEventListener("close", onClose);
    }
  }, [onClose]);

  const handleConfirm = () => {
    onConfirm();
    dialogRef.current?.close();
  };

  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box w-xs">
        <h3 className="font-bold text-lg text-center">{title}</h3>

        <p className="py-4 text-center text-sm">{message}</p>

        <div className="modal-action flex justify-center mt-3">
          <form method="dialog">
            <button className="btn mr-2 bg-base-300"> Cancel </button>
          </form>

          <button className="btn btn-error" onClick={handleConfirm}>
            {confirmButtonText}
          </button>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};
