import { fromDom } from 'hast-util-from-dom';
import { toMdast } from 'hast-util-to-mdast';
import { toMarkdown } from 'mdast-util-to-markdown';
import { gfmTableToMarkdown } from 'mdast-util-gfm-table';
import { gfmStrikethroughToMarkdown } from 'mdast-util-gfm-strikethrough';
import { diff } from 'jest-diff';

import { buildDom } from './build_dom.js';
import { undent } from './undent.js';

const defaultStringifyOptions = {
  extensions: [gfmTableToMarkdown(), gfmStrikethroughToMarkdown],
  listItemIndent: 'one',
};

/**
 * @description
 * Serialises an element to markdown
 *
 * This takes aria roles applied to elements into account
 *
 * @param {Element} element The element to test
 * @param {Object} [options] Parsing and serialisation options
 * @param {Object} [options.parseOptions] options to pass to hast-util-to-mdast
 * @param {Object} [options.stringifyOptions] options to pass to mdast-util-to-markdown
 *
 * @returns {String} The markdown representation
 */
export function elementToMarkdown(
  element,
  { parseOptions, stringifyOptions } = {},
) {
  if (!(element instanceof Element)) {
    throw new Error(`expected element to be a DOM Element not: ${element?.constructor?.name || element}`);
  }
  const hast = fromDom(buildDom(element));
  const mdast = toMdast(hast, parseOptions);
  return toMarkdown(mdast, { ...defaultStringifyOptions, ...stringifyOptions });
}

expect.extend({
  /**
   * @description
   * Does an element serialised to markdown match this markdown
   *
   * Consistent leading white-space will be automatically trimmed from the markdown.
   *
   * @param {Element} element The element to test
   * @param {String} expected The expected markdown
   * @param {Object} [options] Parsing and serialisation options
   * @param {Object} [options.parseOptions] options to pass to hast-util-to-mdast
   * @param {Object} [options.stringifyOptions] options to pass to mdast-util-to-markdown
   */
  toMatchMarkdown(
    element,
    expected,
    options,
  ) {
    const hintOptions = {
      comment: '===',
      isNot: this.isNot,
      promise: this.promise,
    };
    const markdown = elementToMarkdown(element, options).trim();
    expected = undent(expected);

    const pass = expected === markdown;

    const message = pass
      ? () => (
        // eslint-disable-next-line prefer-template
        this.utils.matcherHint('toMatchMarkdown', undefined, undefined, hintOptions)
        + '\n\n'
        + `Expected: not ${this.utils.printExpected(expected)}\n`
        + `Received: ${this.utils.printReceived(markdown)}`
      )
      : () => {
        const diffString = diff(expected, markdown, {
          expand: this.expand,
        });
        return (
          // eslint-disable-next-line prefer-template
          this.utils.matcherHint('toMatchMarkdown', undefined, undefined, hintOptions)
           + '\n\n'
           + (diffString && diffString.includes('- Expect')
             ? `Difference:\n\n${diffString}`
             : `Expected: ${this.utils.printExpected(expected)}\n`
               + `Received: ${this.utils.printReceived(markdown)}`)
        );
      };

    return { message, pass };
  },

  /**
   * @description
   * Does an element serialised to markdown contain this markdown
   *
   * Consistent leading white-space will be automatically trimmed from the markdown.
   *
   * @param {Element} element The element to test
   * @param {String} expected The expected markdown
   * @param {Object} [options] Parsing and serialisation options
   * @param {Object} [options.parseOptions] options to pass to hast-util-to-mdast
   * @param {Object} [options.stringifyOptions] options to pass to mdast-util-to-markdown
   */
  toContainMarkdown(
    element,
    expected,
    options,
  ) {
    const hintOptions = {
      comment: 'includes',
      isNot: this.isNot,
      promise: this.promise,
    };
    const markdown = elementToMarkdown(element, options).trim();
    expected = undent(expected);

    const pass = markdown.includes(expected);

    const message = pass
      ? () => (
        this.utils.matcherHint('toContainMarkdown', undefined, undefined, hintOptions)
        + '\n\n'
        + `Expected markdown: ${this.utils.printExpected(expected)}\n`
        + `Not within: ${this.utils.printReceived(markdown)}`
      )
      : () => (
        this.utils.matcherHint('toContainMarkdown', undefined, undefined, hintOptions)
        + '\n\n'
        + `Expected markdown: ${this.utils.printExpected(expected)}\n`
        + `Within: ${this.utils.printReceived(markdown)}`
      );

    return { message, pass };
  },
});
