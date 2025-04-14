import { useEffect } from "react";

// import { $getRoot, $getSelection } from "lexical";
import { EditorState, EditorThemeClasses } from "lexical";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
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
import {
  CodeNode,
  CodeHighlightNode,
  registerCodeHighlighting,
} from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { SelectionAlwaysOnDisplay } from "@lexical/react/LexicalSelectionAlwaysOnDisplay";
import { AutoLinkPlugin } from "@lexical/react/LexicalAutoLinkPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { ClickableLinkPlugin } from "@lexical/react/LexicalClickableLinkPlugin";
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS,
} from "@lexical/markdown";

import DraggableBlockPlugin from "./DraggableBlockPlugin";

const markdown = `
# Heading h1

This is a \`Markdown\` file.

## This is a Heading h2

This is the text under it

## Emphasis

*This text will be italic*  
_This will also be italic_

**This text will be bold**  
__This will also be bold__

_You **can** combine them_

~~You can change your mind, too~~

## Lists

### Unordered

* Item 1
* Item 2
* Item 3
    * Item 3a
    * Item 3b

### Ordered

1. Item 1
2. Item 2
3. Item 3
    1. Item 3a
    2. Item 3b

### Checkboxes

* [ ] Item 1
* [ ] Item 2
* [x] Item 3 (checked)

## Links

You may be using [Markdown Live Preview](https://markdownlivepreview.com/).

## Block quotes

> Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.
 
Markdown is often used to format readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.

## Blocks of code

\`\`\`javascript
let message = 'Hello world';
alert(message);
\`\`\`

## Inline code

This web site is using \`markedjs/marked\`.
`;

const URL_MATCHER =
  /((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

const MATCHERS = [
  (text: string) => {
    const match = URL_MATCHER.exec(text);
    if (match === null) {
      return null;
    }
    const fullMatch = match[0];
    return {
      index: match.index,
      length: fullMatch.length,
      text: fullMatch,
      url: fullMatch.startsWith("http") ? fullMatch : `https://${fullMatch}`,
      // attributes: { rel: 'noreferrer', target: '_blank' }, // Optional link attributes
    };
  },
];

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
      <TabIndentationPlugin />
      <LinkPlugin />
      <ClickableLinkPlugin />
      <ListPlugin />
      <CheckListPlugin />
      <AutoLinkPlugin matchers={MATCHERS} />
      <SelectionAlwaysOnDisplay />
      <CodeHighlightPlugin />
      <DraggableBlockPlugin />
    </LexicalComposer>
  );
};

const theme: EditorThemeClasses = {
  ltr: "ltr",
  rtl: "rtl",
  placeholder: "",
  paragraph: "mb-2 relative",
  quote: "font-italic border-l-4 border-gray-300 pl-4 my-2",
  heading: {
    h1: "text-primary mt-4 mb-2 font-extrabold text-3xl",
    h2: "text-primary mt-4 mb-2 font-bold text-2xl",
    h3: "text-primary mt-4 mb-2 font-bold text-xl",
    h4: "text-primary mt-4 mb-2 font-bold text-lg",
    h5: "text-primary mt-4 mb-2 font-bold",
  },
  // indent: "lexical-indent",
  list: {
    ul: "list-outside list-disc",
    ol: "list-outside list-decimal ml-1",
    listitem:
      "text-base-content ml-4 mt-1 pl-1 marker:text-primary marker:font-medium",
    nested: {
      listitem: "list-none before:hidden after:hidden mt-2",
    },
    checklist: "relative mx-2 px-6 list-none outline-none",
    listitemChecked:
      "relative mx-2 px-6 list-none outline-none line-through before:content-[''] before:absolute before:w-4 before:h-4 before:top-0.5 before:left-0 before:cursor-pointer before:block before:bg-cover before:border before:border-blue-500 before:rounded before:bg-blue-500 before:bg-no-repeat rtl:before:left-auto rtl:before:right-0 focus:before:shadow-[0_0_0_2px_#a6cdfe] focus:before:rounded after:content-[''] after:absolute after:block after:w-[3px] after:h-1.5 after:top-1.5 after:left-[7px] after:border-white after:border-solid after:border-r-2 after:border-b-2 after:border-t-0 after:border-l-0 after:rotate-45 after:cursor-pointer",
    listitemUnchecked:
      "relative mx-2 px-6 list-none outline-none before:content-[''] before:absolute before:w-4 before:h-4 before:top-0.5 before:left-0 before:cursor-pointer before:block before:bg-cover before:border before:border-gray-400 before:rounded rtl:before:left-auto rtl:before:right-0 focus:before:shadow-[0_0_0_2px_#a6cdfe] focus:before:rounded",
  },
  link: "font-medium text-info link link-hover",
  text: {
    bold: "font-bold",
    italic: "italic",
    // overflowed: "overflow-auto",
    // hashtag: "text-warning",
    underline: "underline",
    strikethrough: "line-through opacity-80",
    underlineStrikethrough: "underline line-through",
    code: "font-mono text-[94%] bg-base-300 py-1 px-2 rounded",
  },
  code: "bg-base-200 font-mono block p-8 leading-6 tab-2",
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
    variable: "text-[#e90]",
  },
};

export const CodeHighlightPlugin = (): JSX.Element | null => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return registerCodeHighlighting(editor);
  }, [editor]);

  return null;
};
