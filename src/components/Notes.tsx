// import { useEffect } from "react";
// import { $getRoot, $getSelection } from "lexical";
import { EditorState } from "lexical";

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS,
} from "@lexical/markdown";

const markdown = `
# Notes

This is a *simple* note-taking app that uses [Lexical](https://lexical.dev/) to provide a rich text editing **experience**.

You can use the toolbar above to format text, or use the Markdown shortcuts below.

- One
- Two
- Three
`;

const theme = {
  // Theme styling goes here
  //...
};

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: Error) {
  console.error(error);
}

function onChange(editorState: EditorState) {
  editorState.read(() => {
    const md = $convertToMarkdownString(TRANSFORMERS);
    console.log(md);
  });
}

export const Notes = () => {
  const initialConfig = {
    editorState: () => $convertFromMarkdownString(markdown, TRANSFORMERS),
    namespace: "Notes",
    nodes: [
      AutoLinkNode,
      CodeHighlightNode,
      CodeNode,
      HeadingNode,
      HorizontalRuleNode,
      LinkNode,
      ListItemNode,
      ListNode,
      QuoteNode,
    ],
    theme,
    onError,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <RichTextPlugin
        ErrorBoundary={LexicalErrorBoundary}
        contentEditable={
          <ContentEditable
            aria-placeholder={"Enter some text..."}
            placeholder={<div>Enter some text...</div>}
          />
        }
      />
      <OnChangePlugin onChange={onChange} />
      <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
      <HistoryPlugin />
      <AutoFocusPlugin />
    </LexicalComposer>
  );
};
