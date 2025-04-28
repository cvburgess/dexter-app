import { useState } from "react";
import classNames from "classnames";

import { cardColors } from "./Card.tsx";
import { ListButton } from "./ListButton.tsx";
import { PriorityButton } from "./PriorityButton.tsx";

import { useTemplates } from "../hooks/useTemplates.tsx";

import { TTemplate, TUpdateTemplate } from "../api/templates.ts";

type TCardProps = {
  template: TTemplate;
};

export const Card = ({ template }: TCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [, { updateTemplate }] = useTemplates({ skipQuery: true });

  const onTemplateUpdate = (diff: Omit<TUpdateTemplate, "id">) =>
    updateTemplate({ id: template.id, ...diff });

  const updateTitle = (title: string) => {
    if (title !== template.title) onTemplateUpdate({ title });
    setIsEditing(false);
  };

  const colors = cardColors[template.priority];

  return (
    <div
      className={classNames(
        "rounded-field p-4 border border-current/10 flex",
        colors.incomplete,
        "w-standard min-h-standard",
      )}
    >
      <div className="flex items-center justify-start gap-2 w-full">
        <p
          className="text-sm font-medium focus:outline-none mx-0.5 cursor-text flex-grow"
          contentEditable={isEditing}
          onBlur={(e) => updateTitle(e.currentTarget.innerText)}
          onClick={() => setIsEditing(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              updateTitle(e.currentTarget.innerText);
              (e.target as HTMLParagraphElement).blur(); // Unfocus the input
            }
          }}
          suppressContentEditableWarning
        >
          {template.title}
        </p>
        <ListButton
          listId={template.listId}
          onUpdate={onTemplateUpdate}
          template={template}
        />
        <PriorityButton onUpdate={onTemplateUpdate} template={template} />
      </div>
    </div>
  );
};
