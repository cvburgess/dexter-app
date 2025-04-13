import classNames from "classnames";
import { useRef, useEffect } from "react";

type TConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  options: {
    title: string;
    action: () => void;
    buttonClass?: string;
  }[];
  title: string;
  message: string | React.ReactNode;
};

export const ConfirmModal = ({
  isOpen,
  onClose,
  options,
  title = "Confirmation",
  message,
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

  return (
    <dialog className="modal" ref={dialogRef}>
      <div className="modal-box w-xs">
        <h3 className="font-bold text-lg text-center">{title}</h3>

        <p className="py-4 text-center text-sm">{message}</p>

        <div className="modal-action flex flex-col justify-center mt-3">
          {options.map((option) => (
            <button
              className={classNames("btn w-full", option.buttonClass)}
              key={option.title}
              onClick={() => {
                option.action();
                dialogRef.current?.close();
              }}
            >
              {option.title}
            </button>
          ))}

          <form method="dialog">
            <button className="btn w-full"> Cancel </button>
          </form>
        </div>
      </div>

      <form className="modal-backdrop" method="dialog">
        <button>close</button>
      </form>
    </dialog>
  );
};
