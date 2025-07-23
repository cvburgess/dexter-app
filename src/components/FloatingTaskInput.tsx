import React, { useRef, useEffect, useState } from "react";
import { Temporal } from "@js-temporal/polyfill";
import { Plus } from "@phosphor-icons/react";
import classNames from "classnames";
import { InputWithIcon } from "./InputWithIcon";
import { useTasks } from "../hooks/useTasks";
import { useLists } from "../hooks/useLists";
import { parseTaskShorthand } from "../utils/parseTaskShorthand";

type FloatingTaskInputProps = {
  isVisible: boolean;
  onClose: () => void;
};

export const FloatingTaskInput: React.FC<FloatingTaskInputProps> = ({
  isVisible,
  onClose,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [_, { createTask }] = useTasks({ skipQuery: true });
  const [lists] = useLists();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Focus input when visible
  useEffect(() => {
    if (isVisible) {
      // Small delay to ensure the element is rendered and visible
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isVisible) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isVisible, onClose]);

  const handleSubmit = async (taskTitle: string) => {
    if (!taskTitle.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Parse shorthand syntax for priorities, lists, and due dates
      const { title, priority, listId, dueOn } = parseTaskShorthand(
        taskTitle,
        lists,
      );

      await createTask({
        title,
        scheduledFor: Temporal.Now.plainDateISO().toString(),
        ...(dueOn !== undefined && { dueOn }),
        ...(priority !== undefined && { priority }),
        ...(listId !== undefined && { listId }),
      });

      // Clear input and close
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      onClose();
    } catch (error) {
      console.error("Failed to create task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black opacity-50 z-40"
        onClick={onClose}
      />

      {/* Floating Input */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-xl px-4">
        <div className="bg-base-100 rounded-lg shadow-xl border border-base-300 p-4">
          <InputWithIcon
            disabled={isSubmitting}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.currentTarget.value.trim()) {
                handleSubmit(e.currentTarget.value.trim());
              } else if (e.key === "Escape") {
                onClose();
              }
            }}
            placeholder="New task"
            ref={inputRef}
            type="text"
            wrapperClassName={classNames({
              "opacity-50": isSubmitting,
            })}
          >
            <Plus
              className={classNames("text-base-content", {
                "animate-spin": isSubmitting,
              })}
              size={20}
            />
          </InputWithIcon>

          <div className="flex mt-3 text-sm text-base-content/70">
            <p className="mr-auto">
              Shortcuts: <code>!</code>, <code>#list-name</code>,{" "}
              <code>due:7</code>
            </p>
            <p>
              Press <kbd className="kbd kbd-xs">Enter</kbd> to create •{" "}
              <kbd className="kbd kbd-xs">Esc</kbd> to cancel
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
