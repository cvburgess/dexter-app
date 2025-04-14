import { ReactElement, useRef, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { DraggableBlockPlugin_EXPERIMENTAL } from "@lexical/react/LexicalDraggableBlockPlugin";
import { $createParagraphNode, $getNearestNodeFromDOMNode } from "lexical";
import { DotsSixVertical, Plus } from "@phosphor-icons/react";

const DRAGGABLE_BLOCK_MENU_CLASSNAME = "draggable-block-menu";

function isOnMenu(element: HTMLElement): boolean {
  return !!element.closest(`.${DRAGGABLE_BLOCK_MENU_CLASSNAME}`);
}

export default function DraggableBlockPlugin({
  anchorElem = document.body,
}: {
  anchorElem?: HTMLElement;
}): ReactElement {
  const [editor] = useLexicalComposerContext();
  const menuRef = useRef<HTMLDivElement>(null);
  const targetLineRef = useRef<HTMLDivElement>(null);
  const [draggableElement, setDraggableElement] = useState<HTMLElement | null>(
    null,
  );

  function insertBlock(e: React.MouseEvent) {
    if (!draggableElement || !editor) {
      return;
    }

    editor.update(() => {
      const node = $getNearestNodeFromDOMNode(draggableElement);
      if (!node) {
        return;
      }

      const pNode = $createParagraphNode();
      if (e.altKey || e.ctrlKey) {
        node.insertBefore(pNode);
      } else {
        node.insertAfter(pNode);
      }
      pNode.select();
    });
  }

  return (
    <DraggableBlockPlugin_EXPERIMENTAL
      anchorElem={anchorElem}
      isOnMenu={isOnMenu}
      menuComponent={
        <div
          className="rounded py-0.5 px-[1px] cursor-grab opacity-0 absolute left-0 top-0 will-change-transform flex gap-[2px] draggable-block-menu"
          ref={menuRef}
        >
          <button
            className="inline-block border-none cursor-pointer bg-transparent w-4 h-4 icon-plus"
            onClick={insertBlock}
            title="Click to add below"
          >
            <Plus size={16} />
          </button>
          <div className="w-4 h-4 opacity-30 hover:bg-gray-100 icon">
            <DotsSixVertical size={16} />
          </div>
        </div>
      }
      menuRef={menuRef}
      onElementChanged={setDraggableElement}
      targetLineComponent={
        <div
          className="pointer-events-none bg-sky-500 h-1 absolute left-0 top-0 opacity-0 will-change-transform draggable-block-target-line"
          ref={targetLineRef}
        />
      }
      targetLineRef={targetLineRef}
    />
  );
}
