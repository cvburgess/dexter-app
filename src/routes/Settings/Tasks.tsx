import { useEffect, useState } from "react";
import { Trash } from "@phosphor-icons/react";
import { useDebounce } from "use-debounce";
import classNames from "classnames";

// import { ButtonWithPopover } from "../../components/ButtonWithPopover";
import { Card } from "../../components/CardTemplate";
import { ConfirmModal } from "../../components/ConfirmModal";

import { useTemplates } from "../../hooks/useTemplates";

import { TTemplate, TUpdateTemplate } from "../../api/templates";

export const Tasks = () => {
  const [templates, { updateTemplate, deleteTemplate }] = useTemplates();

  return (
    <fieldset className="fieldset w-full">
      <legend className="fieldset-legend ml-2 text-base">Repeat Tasks</legend>
      <div className="flex flex-col gap-2">
        {templates.map((template) => (
          <div className="flex flex-wrap gap-2" key={template.id}>
            <Card template={template} />
            <TemplateInput
              deleteTemplate={deleteTemplate}
              template={template}
              updateTemplate={updateTemplate}
            />
          </div>
        ))}
      </div>
    </fieldset>
  );
};

type TTemplateInputProps = {
  deleteTemplate: (id: string) => void;
  template: TTemplate;
  updateTemplate: (template: TUpdateTemplate) => void;
};

const inputClasses =
  "input join-item bg-base-100 focus-within:outline-none shadow-none focus-within:shadow-none h-full border-1 border-base-200 text-base";

const TemplateInput = ({
  deleteTemplate,
  template,
  updateTemplate,
}: TTemplateInputProps) => {
  const [title, setTitle] = useState<string>(template.title);
  const [debouncedTitle] = useDebounce(title, 1000);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (debouncedTitle !== template.title) {
      updateTemplate({ id: template.id, title: debouncedTitle });
    }
  }, [debouncedTitle]);

  const onChangeTitle = ({
    currentTarget: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(value);
  };

  const onEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && title) {
      updateTemplate({ id: template.id, title });
    }
  };

  const _onNumberInputOnly = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Check if the key is not a number
    if (
      !/^[0-9]$/.test(e.key) &&
      ![
        "Backspace",
        "Tab",
        "Enter",
        "ArrowLeft",
        "ArrowRight",
        "Delete",
        "Home",
        "End",
      ].includes(e.key)
    ) {
      e.preventDefault();
      return false;
    }
    return true;
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div className="join flex-1 min-w-standard min-h-standard h-auto">
        <input
          className={classNames(inputClasses, "pl-4 grow")}
          onChange={onChangeTitle}
          onKeyDown={onEnter}
          type="text"
          value={title}
        />

        <span
          className="btn join-item h-full bg-base-100 text-base-content/60 hover:text-error"
          onClick={openModal}
        >
          <Trash />
        </span>
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        message={
          <>
            Deleting this template will prevent Dexter from
            <br /> automatically creating any new tasks
            <br /> based on this schedule.
          </>
        }
        onClose={closeModal}
        options={[
          {
            action: () => deleteTemplate(template.id),
            buttonClass: "btn-error",
            title: "Delete",
          },
        ]}
        title={`Delete ${template.title}?`}
      />
    </>
  );
};
