import { useEffect, useRef, useState } from "react";
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

  // `ignoreSelectionChange` below keeps the mount-time *selection* update out of
  // `handleChange`, but it is not the only update a fresh editor makes: code
  // highlighting re-tokenizes fenced blocks in an untagged nested
  // `editor.update`, which dirties leaves and does reach it. Since the markdown
  // round-trip is not guaranteed byte-identical, that emission can hand us a
  // normalized copy of the daily-note template, and autosaving it would write a
  // `notes` row for a day the user only looked at. Only a real interaction
  // arms the autosave.
  const hasUserEdited = useRef(false);
  const markEdited = () => {
    hasUserEdited.current = true;
  };

  useEffect(() => {
    if (hasUserEdited.current) onChange(debouncedMd);
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
            className="w-full min-h-full h-fit outline-none text-sm"
            onBeforeInput={markEdited}
            // Gated on the same flag as the debounce: blur exists to flush a
            // pending edit, and with no interaction there is none to flush.
            // Ungated, it reopens the hole above by the likeliest route —
            // AutoFocusPlugin focuses on mount, so opening the day and clicking
            // straight to another tab blurs an untouched editor.
            onBlur={() => {
              if (hasUserEdited.current) onChange(md);
            }}
            // A click can change content without any input event — toggling a
            // checklist item — so it arms the autosave too.
            onClick={markEdited}
            onDrop={markEdited}
            onKeyDown={markEdited}
            onPaste={markEdited}
            placeholder={<div className="w-full h-full outline-none" />}
          />
        }
      />
      {/* `ignoreSelectionChange` so the selection AutoFocusPlugin creates on
          mount can't emit a "change". The markdown round-trip isn't guaranteed
          byte-identical, so a normalized re-serialization of the daily-note
          template would otherwise autosave — writing a `notes` row for a day
          the user only looked at. */}
      <OnChangePlugin ignoreSelectionChange onChange={handleChange} />
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
  paragraph: "mb-1 relative",
  quote:
    "border-l-4 border-base-content/50 text-base-content/80 pl-4 my-1 italic",
  heading: {
    h1: "text-primary mt-3 mb-1 font-extrabold text-xl",
    h2: "text-primary mt-3 mb-1 font-bold text-lg",
    h3: "text-primary mt-3 mb-1 font-bold text-base",
    h4: "text-primary mt-3 mb-1 font-bold",
    h5: "text-primary mt-3 mb-1 font-bold",
  },
  // indent: "lexical-indent",
  list: {
    ul: "list-outside list-disc",
    ol: "list-outside list-decimal ml-1",
    listitem:
      "text-base-content ml-3 mt-1 pl-1 marker:text-primary marker:font-medium",
    nested: {
      listitem: "list-none before:hidden after:hidden mt-1",
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
    code: "font-mono text-[94%] bg-base-300 py-0.5 px-1 rounded",
  },
  code: "bg-base-200 font-mono block px-3 py-2 leading-6 tab-2 rounded-box",
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
