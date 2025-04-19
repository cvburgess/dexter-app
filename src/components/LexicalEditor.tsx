import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

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
const onError = (error: Error) => {
  console.error(error);
};

type TLexicalEditorProps = {
  onChange: (text: string) => void;
  text: string;
};

export const LexicalEditor = ({ onChange, text }: TLexicalEditorProps) => {
  const [md, setMd] = useState<string>(text);
  const [debouncedMd] = useDebounce(md, 500);

  useEffect(() => {
    onChange(debouncedMd);
  }, [debouncedMd]);

  const initialConfig = {
    editorState: () => $convertFromMarkdownString(text, TRANSFORMERS),
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

  const handleChange = (editorState: EditorState) => {
    editorState.read(() => {
      setMd($convertToMarkdownString(TRANSFORMERS));
    });
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <RichTextPlugin
        ErrorBoundary={LexicalErrorBoundary}
        contentEditable={
          <ContentEditable
            aria-placeholder=""
            className="w-full min-h-full h-fit outline-none"
            onBlur={() => onChange(md)}
            placeholder={<div className="w-full h-full outline-none" />}
          />
        }
      />
      <OnChangePlugin onChange={handleChange} />
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
    </LexicalComposer>
  );
};

const primary = "text-primary";
const secondary = "text-secondary";
const accent = "text-primary/80";
const red = "text-error";
const base = "text-base-content/80";
const ghost = "text-base-content/50";

const theme: EditorThemeClasses = {
  ltr: "ltr",
  rtl: "rtl",
  placeholder: "",
  paragraph: "mb-2 relative",
  quote:
    "border-l-4 border-base-content/50 text-base-content/80 pl-4 my-2 italic",
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
    bold: "font-bold text-primary",
    italic: "italic text-primary",
    // overflowed: "overflow-auto",
    // hashtag: "text-warning",
    underline: "underline",
    strikethrough: "line-through opacity-80",
    underlineStrikethrough: "underline line-through opacity-80",
    code: "font-mono text-[94%] bg-base-300 py-1 px-2 rounded",
  },
  code: "bg-base-200 font-mono block px-6 py-4 leading-6 tab-2 rounded-box",
  codeHighlight: {
    atrule: accent,
    attr: accent,
    keyword: accent,
    important: accent,
    namespace: accent,
    regex: accent,

    deleted: red,
    tag: red,
    property: red,
    class: red,
    "class-name": red,
    entity: red,

    selector: secondary,
    function: secondary,
    variable: secondary,

    string: primary,
    boolean: primary,
    constant: primary,
    number: primary,
    symbol: primary,
    builtin: primary,
    char: primary,
    inserted: primary,

    cdata: ghost,
    comment: ghost,
    doctype: ghost,
    punctuation: ghost,
    prolog: ghost,

    operator: base,
    url: base,
  },
};

export const CodeHighlightPlugin = (): JSX.Element | null => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return registerCodeHighlighting(editor);
  }, [editor]);

  return null;
};
