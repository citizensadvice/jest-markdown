import { type Options as ParseOptions } from 'hast-util-to-mdast';
import { type Options as StringifyOptions } from 'mdast-util-to-markdown';

interface Options {
  parseOptions?: ParseOptions;
  stringifyOptions?: StringifyOptions;
}

// Copied from https://www.npmjs.com/package/@types/testing-library__jest-dom

interface MarkdownMatches<E, R> extends Record<string, any> {
  /**
   * @description
   * Does an element serialised to markdown match this markdown
   *
   * Consistent leading white-space will be automatically trimmed from the markdown.
   */
  toMatchMarkdown(markdown: string, options?: Options): R;

  /**
   * @description
   * Does an element serialised to markdown contain this markdown
   *
   * Consistent leading white-space will be automatically trimmed from the markdown.
   */
  toContainMarkdown(markdown: string, options?: Options): R;
}

declare global {
  namespace jest {
    interface Matchers<R = void, T = {}> extends MarkdownMatches<typeof expect.stringContaining, R> {}
  }
}

export declare function elementToMarkdown(element: Element, options?: Options): string;
export {};
