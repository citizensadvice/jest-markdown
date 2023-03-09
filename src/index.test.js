import { elementToMarkdown } from './index.js';

afterEach(() => {
  document.body.replaceChildren();
});

describe('toMatchMarkdown', () => {
  it('converts an element to markdown', () => {
    document.body.innerHTML = `
      <h1>Heading 1</h1>
      <p>
        Paragraph<br>
        with <strong>strong</strong><br>
        with <b>bold</b><br>
        with <em>em</em><br>
        with <i>italic</i><br>
        with <code>code</code><br>
        with <del>strikethrough</del><br>
        with <a href="http://www.example.com">link</a><br>
        with <img alt="image" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII"><br>
        with <button>button</button>
      </p>

      <h2>
        <p>Heading with a nested paragraph</p>
      </h2>

      <div>
        A div
        <p>
          Nested paragraph
        </p>
      </div>

      <ul>
        <li>Item 1</li>
        <li>
          Item 2
          <ul>
            <li>Nested item 1</li>
            <li>Nested item 2</li>
          </ul>
        </li>
      </ul>

      <ol>
        <li>Item 1</li>
        <li>Item 2</li>
      </ol>

      <dl>
        <dt>Term</dt>
        <dd>Definition</dd>
      </dl>

      <hr>

      <table>
        <tr>
          <th>One
          <th>Two
        </tr>
        <tr>
          <td>Three
          <td>Four
        </tr>
      </table>

      <blockquote>
        Block quote

        <blockquote>
          <p>
            With a nested blockquote
          </p>
        </blockquote>
      </blockquote>
    `;

    expect(document.body).toMatchMarkdown(`
      # Heading 1

      Paragraph\\
      with **strong**\\
      with **bold**\\
      with *em*\\
      with *italic*\\
      with \`code\`\\
      with ~~strikethrough~~\\
      with [link](http://www.example.com)\\
      with ![image](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII)\\
      with button

      ## Heading with a nested paragraph

      A div

      Nested paragraph

      * Item 1

      * Item 2

        * Nested item 1
        * Nested item 2

      1. Item 1
      2. Item 2

      * Term

        Definition

      ***

      | One   | Two  |
      | ----- | ---- |
      | Three | Four |

      > Block quote
      >
      > > With a nested blockquote
    `);
  });

  it('directly matches an element', () => {
    document.body.innerHTML = `
      <table>
        <tr>
          <th>One
          <th>Two
        </tr>
        <tr>
          <td>Three
          <td>Four
        </tr>
      </table>
    `;
    expect(document.querySelector('table')).toMatchMarkdown(`
      | One   | Two  |
      | ----- | ---- |
      | Three | Four |
    `);
  });

  it('keeps a caption', () => {
    document.body.innerHTML = `
      <table>
        <caption>Table <b>caption</b></caption>
        <thead>
          <tr>
            <th>One
            <th>Two
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Three
            <td>Four
          </tr>
        </tbody>
      </table>
    `;
    expect(document.querySelector('table')).toMatchMarkdown(`
      Table **caption**

      | One   | Two  |
      | ----- | ---- |
      | Three | Four |
    `);
  });

  it('filters hidden nodes', () => {
    document.body.innerHTML = `
      <h1>Heading 1</h1>
      <p hidden>Paragraph <strong>strong</strong> <b>bold</b></p>
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
      </ul>
    `;

    expect(document.body).toMatchMarkdown(`
      # Heading 1

      * Item 1
      * Item 2
    `);
  });

  it('filters aria-hidden nodes', () => {
    document.body.innerHTML = `
      <h1>Heading 1</h1>
      <p aria-hidden="true">Paragraph <strong>strong</strong> <b>bold</b></p>
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
      </ul>
    `;

    expect(document.body).toMatchMarkdown(`
      # Heading 1

      * Item 1
      * Item 2
    `);
  });

  it('filters visibility hidden nodes', () => {
    document.body.innerHTML = `
      <h1>Heading 1</h1>
      <div style="visibility: hidden">
        <p>Hidden</p>
        <p style="visibility: visible">Visible</p>
      </div>
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
      </ul>
    `;

    expect(document.body).toMatchMarkdown(`
      # Heading 1

      Visible

      * Item 1
      * Item 2
    `);
  });

  it('maps aria roles', () => {
    document.body.innerHTML = `
      <div role="heading" aria-level="1">Heading 1</div>

      <div role="paragraph">
        Paragraph<br>
        with <span role="strong">strong</span><br>
        with <span role="emphasis">em</span><br>
        with <span role="code">code</span><br>
        with <span role="deletion">strikethrough</span><br>
        with <span role="link">link</span><br>
        with <span role="image">image</span><br>
      </div>

      <div role="heading">
        Heading 2
      </div>

      <h1 aria-level="3">
        Heading 3
      </h1>

      <div role="list">
        <div role="listitem">
          Item 1
        </div>
        <div role="listitem">
          Item 2
        </div>
      </div>

      <div role="separator">content</div>

      <div role="table">
        <div role="row">
          <div role="columnheader">One</div>
          <div role="columnheader">Two</div>
        </div>
        <div role="row">
          <div role="cell">Three</div>
          <div role="cell">Four</div>
        </div>
      </div>

      <div role="blockquote">
        Block quote
      </div>
    `;

    expect(document.body).toMatchMarkdown(`
      # Heading 1

      Paragraph\\
      with **strong**\\
      with *em*\\
      with \`code\`\\
      with ~~strikethrough~~\\
      with [link]()\\
      with ![image]()

      ## Heading 2

      ### Heading 3

      1. Item 1
      2. Item 2

      ***

      | One   | Two  |
      | ----- | ---- |
      | Three | Four |

      > Block quote
    `);
  });

  it('removes roles from presentational elements', () => {
    document.body.innerHTML = `
      <h1>Heading 1</h1>
      <ul role="none">
        <li>Item 1</li>
        <li>Item 2</li>
      </ul>

      <ul role="presentation">
        <li>Item 1</li>
        <li>Item 2</li>
      </ul>

      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
      </ul>
    `;

    expect(document.body).toMatchMarkdown(`
      # Heading 1

      Item 1

      Item 2

      Item 1

      Item 2

      * Item 1
      * Item 2
    `);
  });

  it('throws without an element', () => {
    expect(() => {
      expect('foo').toMatchMarkdown('foo');
    }).toThrow('expected element to be a DOM Element not: String');
  });
});

describe('toContainMarkdown', () => {
  it('matches contained markdown', () => {
    document.body.innerHTML = `
      <h1>Heading 1</h1>
      <p>Paragraph <strong>strong</strong>
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
      </ul>
    `;

    expect(document.body).toContainMarkdown(`
      Paragraph **strong**
    `);
  });
});

describe('elementToMarkdown', () => {
  it('converts an element to markdown', () => {
    document.body.innerHTML = `
      <h1>Heading 1</h1>
      <p>Paragraph <strong>strong</strong>
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
      </ul>
    `;

    expect(elementToMarkdown(document.body)).toMatchInlineSnapshot(`
"# Heading 1

Paragraph **strong**

* Item 1
* Item 2
"
`);
  });

  it('throws without an element', () => {
    expect(() => {
      elementToMarkdown('foo');
    }).toThrow('expected element to be a DOM Element not: String');
  });
});
