import { LexicalEditor } from "./LexicalEditor";

export const Notes = () => {
  return <LexicalEditor onChange={console.log} text={markdown} />;
};

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
