import { ReactElement, useRef } from "react";
import { DraggableBlockPlugin_EXPERIMENTAL } from "@lexical/react/LexicalDraggableBlockPlugin";
import { DotsSixVertical } from "@phosphor-icons/react";

const DRAGGABLE_BLOCK_MENU_CLASSNAME = "draggable-block-menu";

function isOnMenu(element: HTMLElement): boolean {
  return !!element.closest(`.${DRAGGABLE_BLOCK_MENU_CLASSNAME}`);
}

type TDraggableBlockPluginProps = {
  anchorElem?: HTMLElement;
};

export default function DraggableBlockPlugin({
  anchorElem = document.body,
}: TDraggableBlockPluginProps): ReactElement {
  const menuRef = useRef<HTMLDivElement>(null);
  const targetLineRef = useRef<HTMLDivElement>(null);

  return (
    <DraggableBlockPlugin_EXPERIMENTAL
      anchorElem={anchorElem}
      isOnMenu={isOnMenu}
      menuComponent={
        <div
          className="draggable-block-menu rounded py-0.5 px-[1px] cursor-grab opacity-0 absolute left-[385px] top-0 will-change-transform flex gap-[2px] text-gray-900"
          ref={menuRef}
        >
          <div className="w-4 h-4 opacity-30 icon">
            <DotsSixVertical size={16} />
          </div>
        </div>
      }
      menuRef={menuRef}
      targetLineComponent={
        <div
          className="pointer-events-none bg-info h-1 !w-100 absolute left-[385px] top-0 opacity-0 will-change-transform draggable-block-target-line"
          ref={targetLineRef}
        />
      }
      targetLineRef={targetLineRef}
    />
  );
}
