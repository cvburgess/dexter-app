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
# Markdown syntax guide

## Headers

# This is a Heading h1
## This is a Heading h2
###### This is a Heading h6

## Emphasis

*This text will be italic*  
_This will also be italic_

**This text will be bold**  
__This will also be bold__

_You **can** combine them_

## Lists

### Unordered

* Item 1
* Item 2
* Item 2a
* Item 2b
    * Item 3a
    * Item 3b

### Ordered

1. Item 1
2. Item 2
3. Item 3
    1. Item 3a
    2. Item 3b

## Images

![This is an alt text.](/image/sample.webp "This is a sample image.")

## Links

You may be using [Markdown Live Preview](https://markdownlivepreview.com/).

## Blockquotes

> Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.
>
>> Markdown is often used to format readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.

## Tables

| Left columns  | Right columns |
| ------------- |:-------------:|
| left foo      | right foo     |
| left bar      | right bar     |
| left baz      | right baz     |

## Blocks of code

\`\`\`javascript
let message = 'Hello world';
alert(message);
\`\`\`

## Inline code

This web site is using \`markedjs/marked\`.
`;

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
            aria-placeholder=""
            className="w-full h-full outline-none"
            placeholder={<div className="w-full h-full outline-none"></div>}
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

const theme = {
  ltr: "ltr",
  rtl: "rtl",
  placeholder: "",
  paragraph: "mb-2 relative",
  quote: "editor-quote",
  heading: {
    h1: "text-3xl font-extrabold text-primary mb-4 mt-2",
    h2: "text-2xl font-bold text-primary mb-4 mt-2",
    h3: "text-xl font-bold text-primary mb-4 mt-2",
    h4: "text-lg font-bold text-primary mb-4 mt-2",
    h5: "font-bold text-primary mb-4 mt-2",
  },
  list: {
    nested: {
      listitem:
        "pl-5 mt-2 space-y-1 list-decimal list-inside text-base-content",
    },
    ol: "max-w-md space-y-1 text-gray-500 list-decimal list-inside text-base-content",
    ul: "max-w-md space-y-1 text-gray-500 list-disc list-inside text-base-content",
    listitem: "text-base-content",
  },
  image: "editor-image",
  link: "font-medium text-info link link-hover",
  text: {
    bold: "font-bold",
    italic: "italic",
    overflowed: "editor-text-overflowed",
    hashtag: "editor-text-hashtag",
    underline: "underline",
    strikethrough: "line-through",
    underlineStrikethrough: "underline line-through",
    code: "font-mono text-[94%] bg-base-200 text-base-content p-1 rounded",
  },
  code: "bg-base-200 font-mono block py-2 px-8 leading-1 m-0 mt-2 mb-2 tab-2 overflow-x-auto relative before:absolute before:content-[attr(data-gutter)] before:bg-gray-200 dark:before:bg-gray-700 before:left-0 before:top-0 before:p-2 before:min-w-[25px] before:whitespace-pre-wrap before:text-right after:content-[attr(data-highlight-langrage)] after:right-3 after:absolute",
  codeHighlight: {
    atrule: "text-[#07a] dark:text-cyan-400",
    attr: "text-[#07a] dark:text-cyan-400",
    boolean: "text-pink-700 dark:text-pink-400",
    builtin: "text-[#690]",
    cdata: "bg-slate-600",
    char: "text-[#690]",
    class: "text-[#dd4a68]",
    "class-name": "text-[#dd4a68]",
    comment: "bg-slate-600 dark:bg-gray-600",
    constant: "text-pink-700 dark:text-pink-400",
    deleted: "text-pink-700 dark:text-pink-400",
    doctype: "bg-slate-600",
    entity: "text-[#9a6e3a]",
    function: "text-[#dd4a68]",
    important: "text-[#e90]",
    inserted: "text-[#690]",
    keyword: "text-[#07a] dark:text-cyan-400",
    namespace: "text-[#e90] dark:text-blue-400",
    number: "text-pink-700 dark:text-pink-400",
    operator: "text-[#9a6e3a]",
    prolog: "bg-slate-600",
    property: "text-pink-700 dark:text-pink-400",
    punctuation: "text-[#999]",
    regex: "text-[#e90] dark:text-blue-400",
    selector: "text-[#690]",
    string: "text-[#690] dark:text-orange-500",
    symbol: "text-pink-700 dark:text-pink-400",
    tag: "text-pink-700 dark:text-pink-400",
    url: "text-[#9a6e3a]",
    variable: "text-[#e90] dark:text-blue-400",
  },
};
