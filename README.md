# `@citizensadvice/jest-markdown`

Jest expect matches to test if a DOM `Element` matches [markdown](https://www.markdownguide.org/basic-syntax/).

Markdown does a good job of representing the semantic structure of html as
both a sighted user and a screen reader would see it.

This makes is a useful means to test the output of flat content in a unit test.

This uses dependencies written in es6, so see the [note on es6 modules and Jest](#jest-and-es6-modules).

## `toMatchMarkdown(markdown: string, options?: Options)`

This will test a supplied DOM `Element` exactly matches the supplied markdown.

The leading white-space from the first non-empty line will be automatically trimmed from all lines.

Hidden elements, including `aria-hidden` elements, will be removed from the markdown.

Additionally, the aria `role` of elements will be taken into account when generating the markdown.

```js
import '@citizensadvice/expect-to-match-markdown`;

test('example', () => {
  expect(document.body).toMatchMarkdown(`
    #h1 My page

    Lorem ipsum dolor sit amet, consectetur adipiscing elit.

    * Item 1
    * Item 2
  `);
});
```

## `toIncludeMarkdown(markdown: string, options?: Options)`

Like `toMatchMarkdown`, but will test if the supplied DOM `Element` includes the markdown.

## `elementToMarkdown(element: Element, options?: Options)`

Convert an element to markdown. This can be combined with snapshot testings.

Hidden elements, including `aria-hidden` elements, will be removed from the markdown.

The aria `role` of elements will be taken into account when generating the markdown.

```js
import { elementToMarkdown } from '@citizensadvice/expect-to-match-markdown`;

test('example', () => {
  expect(elementToMarkdown(document.body)).toMatchSnapshot();
});
```

## `Options: { parseOptions?: object, stringifyOptions?: object }`

These options will be passed to the underlying libraries when converting to markdown.

- `parseOptions`: passed to [`hast-util-to-mdast`](https://github.com/syntax-tree/hast-util-to-mdast)
- `stringifyOptions`: passed to [`mdast-util-to-markdown`](https://github.com/syntax-tree/mdast-util-to-markdown)

## Jest and es6 modules

The dependencies used by this library are es6 modules.  Jest, by default, currently chokes on es6 modules.

See [the jest documentation](https://jestjs.io/docs/ecmascript-modules) for options and guidance.

If you can't disable transformation, this library recommends using (`@swc/jest`)[https://swc.rs/docs/usage/jest],
and overriding `transformIgnorePatterns` to include `node_modules`.

```js
// jest.config.js

module.exports = {
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
  transformIgnorePatterns: [],
};
```
