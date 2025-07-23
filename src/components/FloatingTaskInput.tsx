import React, { useRef, useEffect, useState } from "react";
import { Temporal } from "@js-temporal/polyfill";
import { Plus } from "@phosphor-icons/react";
import classNames from "classnames";
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
  const [inputValue, setInputValue] = useState("");

  // Focus input when visible and clear when hidden
  useEffect(() => {
    if (isVisible) {
      // Small delay to ensure the element is rendered and visible
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      // Clear input when modal closes
      setInputValue("");
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
      setInputValue("");
      onClose();
    } catch (error) {
      console.error("Failed to create task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const highlightShorthandText = (text: string) => {
    if (!text) return text;

    type TextPart = {
      text: string;
      highlighted: boolean;
      className?: string;
    };

    // Define regex patterns for shorthand syntax
    const patterns = [
      {
        regex: /(#[a-zA-Z0-9-]+)(?=\s|$)/g,
        className: "text-primary font-bold",
      }, // List
      { regex: /(due:\d+)(?=\s|$)/g, className: "text-primary font-bold" }, // Due date
    ];

    let parts: TextPart[] = [{ text, highlighted: false }];

    // Handle priority patterns with specific colors
    const priorityRegex = /(?:^|\s)(!{1,4})(?=\s|$)/g;
    const priorityNewParts: TextPart[] = [];
    parts.forEach((part) => {
      if (part.highlighted) {
        priorityNewParts.push(part);
        return;
      }

      const matches = [...part.text.matchAll(priorityRegex)];
      if (matches.length === 0) {
        priorityNewParts.push(part);
        return;
      }

      let lastIndex = 0;
      matches.forEach((match) => {
        const matchStart = match.index || 0;
        const matchEnd = matchStart + match[0].length;
        const exclamationCount = match[1].length;

        // Add text before match
        if (matchStart > lastIndex) {
          priorityNewParts.push({
            text: part.text.slice(lastIndex, matchStart),
            highlighted: false,
          });
        }

        // Add highlighted match with priority-specific color
        let priorityClassName = "text-primary font-bold";
        switch (exclamationCount) {
          case 1:
            priorityClassName = "text-error font-bold";
            break;
          case 2:
            priorityClassName = "text-info font-bold";
            break;
          case 3:
            priorityClassName = "text-warning font-bold";
            break;
          case 4:
            priorityClassName = "text-base-content font-bold";
            break;
        }

        priorityNewParts.push({
          text: match[0],
          highlighted: true,
          className: priorityClassName,
        });

        lastIndex = matchEnd;
      });

      // Add remaining text
      if (lastIndex < part.text.length) {
        priorityNewParts.push({
          text: part.text.slice(lastIndex),
          highlighted: false,
        });
      }
    });
    parts = priorityNewParts;

    // Handle other patterns (list and due date)
    patterns.forEach(({ regex, className }) => {
      const newParts: TextPart[] = [];
      parts.forEach((part) => {
        if (part.highlighted) {
          newParts.push(part);
          return;
        }

        const matches = [...part.text.matchAll(regex)];
        if (matches.length === 0) {
          newParts.push(part);
          return;
        }

        let lastIndex = 0;
        matches.forEach((match) => {
          const matchStart = match.index || 0;
          const matchEnd = matchStart + match[0].length;

          // Add text before match
          if (matchStart > lastIndex) {
            newParts.push({
              text: part.text.slice(lastIndex, matchStart),
              highlighted: false,
            });
          }

          // Add highlighted match
          newParts.push({
            text: match[0],
            highlighted: true,
            className,
          });

          lastIndex = matchEnd;
        });

        // Add remaining text
        if (lastIndex < part.text.length) {
          newParts.push({
            text: part.text.slice(lastIndex),
            highlighted: false,
          });
        }
      });
      parts = newParts;
    });

    return parts.map((part, i) =>
      part.highlighted && part.className ? (
        <span className={part.className} key={i}>
          {part.text}
        </span>
      ) : (
        <span key={i}>{part.text}</span>
      ),
    );
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
          <div
            className={classNames(
              "relative group input input-ghost w-full p-4 bg-base-200 rounded-field h-standard",
              "focus-within:bg-base-100 focus-within:border-1 focus-within:border-base-300 focus-within:outline-none",
              { "opacity-50": isSubmitting },
            )}
          >
            <Plus
              className={classNames(
                "absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content z-10",
                {
                  "animate-spin": isSubmitting,
                },
              )}
              size={20}
            />

            {/* Highlighted overlay */}
            <div className="absolute left-12 top-1/2 transform -translate-y-1/2 pointer-events-none whitespace-pre-wrap break-words z-5">
              {highlightShorthandText(inputValue)}
            </div>

            {/* Actual input */}
            <input
              className="w-full bg-transparent border-none outline-none pl-8 text-transparent caret-black relative z-10"
              disabled={isSubmitting}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && inputValue.trim()) {
                  handleSubmit(inputValue.trim());
                } else if (e.key === "Escape") {
                  onClose();
                }
              }}
              placeholder="New task"
              ref={inputRef}
              style={{ caretColor: "currentColor" }}
              type="text"
              value={inputValue}
            />
          </div>

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
