const html = {
  slug: 'html',
  title: 'HTML',
  icon: '🧱',
  category: 'Web Development',
  level: 'Beginner',
  estimatedHours: 4,
  tagline: 'The structure of every web page',
  description:
    'Learn how web pages are built. HTML gives your content structure and meaning, and it is the first skill every web developer learns.',
  lessons: [
    {
      slug: 'introduction-to-html',
      title: 'Introduction to HTML',
      objective: 'Understand what HTML is and the role it plays in every website.',
      sections: [
        {
          heading: 'What HTML does',
          text: 'HTML (HyperText Markup Language) describes the structure of a web page. It tells the browser what each piece of content is: a heading, a paragraph, a link, an image, a button. The browser reads your HTML from top to bottom and draws the page from it.',
        },
        {
          heading: 'A tiny example',
          text: 'Here is one of the smallest useful pieces of HTML. The h1 element marks the main heading and the p element marks a paragraph.',
          code: '<h1>Hello from Jovexa Learn</h1>\n<p>This is my very first page.</p>',
          language: 'html',
        },
      ],
      mistakes: [
        'Thinking HTML is a programming language. It is a markup language: it describes structure, it does not run logic.',
        'Trying to control colors and layout with HTML. That is the job of CSS, which you will learn next.',
      ],
      exercise: {
        question: 'What is the main job of HTML in a web page?',
        options: [
          'Styling colors and fonts',
          'Describing the structure and meaning of content',
          'Running calculations and logic',
          'Storing data in a database',
        ],
        answer: 1,
        explanation:
          'HTML marks up content so the browser knows what each part is. Styling is handled by CSS and logic by JavaScript.',
      },
    },
    {
      slug: 'document-structure',
      title: 'HTML Document Structure',
      objective: 'Write a complete, valid HTML document from scratch.',
      sections: [
        {
          heading: 'The skeleton of a page',
          text: 'Every HTML document follows the same skeleton: a doctype, an html element wrapping everything, a head for information about the page, and a body for everything visible.',
          code: '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <title>My Page</title>\n  </head>\n  <body>\n    <h1>Welcome</h1>\n  </body>\n</html>',
          language: 'html',
        },
        {
          heading: 'head vs body',
          text: 'The head holds metadata: the page title shown in the browser tab, the character encoding, and links to stylesheets. The body holds everything the visitor actually sees.',
        },
      ],
      mistakes: [
        'Forgetting the doctype. Without <!DOCTYPE html> browsers may render the page in an old compatibility mode.',
        'Putting visible content inside the head. Only metadata belongs there.',
      ],
      exercise: {
        question: 'Where does the visible content of a page belong?',
        options: ['Inside <head>', 'Inside <body>', 'Inside <title>', 'Before <!DOCTYPE html>'],
        answer: 1,
        explanation: 'Everything a visitor sees lives inside the body element.',
      },
    },
    {
      slug: 'elements',
      title: 'HTML Elements',
      objective: 'Understand how elements are written and how they nest inside each other.',
      sections: [
        {
          heading: 'Opening tag, content, closing tag',
          text: 'Most elements have three parts: an opening tag, content, and a closing tag. The tag name describes the meaning of the content between them.',
          code: '<p>This whole line is one paragraph element.</p>',
          language: 'html',
        },
        {
          heading: 'Nesting and empty elements',
          text: 'Elements can contain other elements, which creates a tree the browser understands. A few elements, like br and img, are empty: they have no content and no closing tag.',
          code: '<p>You can <strong>nest elements</strong> inside others.</p>\n<img src="photo.jpg" alt="A sample photo" />',
          language: 'html',
        },
      ],
      mistakes: [
        'Overlapping tags like <b><i>text</b></i>. Always close inner elements before outer ones.',
        'Forgetting closing tags, which can make the browser guess your structure incorrectly.',
      ],
      exercise: {
        question: 'Which of these elements is an empty element with no closing tag?',
        options: ['<p>', '<strong>', '<img>', '<h1>'],
        answer: 2,
        explanation: 'img is an empty element. It takes attributes but never wraps content.',
      },
    },
    {
      slug: 'attributes',
      title: 'HTML Attributes',
      objective: 'Add extra information to elements using attributes.',
      sections: [
        {
          heading: 'What attributes are',
          text: 'Attributes live inside the opening tag and give an element extra information, written as name="value" pairs. Different elements support different attributes.',
          code: '<a href="https://jovexalabs.com" target="_blank">Visit Jovexa Labs</a>',
          language: 'html',
        },
        {
          heading: 'Attributes you will use constantly',
          text: 'href sets where a link goes, src points to an image or script file, alt describes an image for accessibility, class and id label elements so CSS and JavaScript can find them.',
          code: '<img src="logo.png" alt="Company logo" class="brand" id="main-logo" />',
          language: 'html',
        },
      ],
      mistakes: [
        'Skipping quotes around attribute values. Always write href="page.html", not href=page.html.',
        'Leaving out the alt attribute on images, which hurts accessibility and SEO.',
      ],
      exercise: {
        question: 'Which attribute tells a link where to navigate?',
        options: ['src', 'alt', 'href', 'class'],
        answer: 2,
        explanation: 'href (hypertext reference) holds the destination URL of a link.',
      },
    },
    {
      slug: 'headings-and-paragraphs',
      title: 'Headings and Paragraphs',
      objective: 'Organize text content with the six heading levels and paragraphs.',
      sections: [
        {
          heading: 'Six levels of headings',
          text: 'HTML has headings h1 through h6. h1 is the most important and should normally appear once per page. Use levels in order to create a logical outline, like chapters and subchapters in a book.',
          code: '<h1>Cooking Guide</h1>\n<h2>Breakfast</h2>\n<h3>Pancakes</h3>\n<p>Mix, pour, flip, enjoy.</p>',
          language: 'html',
        },
        {
          heading: 'Paragraphs',
          text: 'The p element wraps a block of text. Browsers automatically add spacing between paragraphs, so you never need empty paragraphs or repeated line breaks for spacing.',
        },
      ],
      mistakes: [
        'Choosing a heading level because of its size instead of its meaning. Size is controlled with CSS.',
        'Using <br> repeatedly to create space between blocks. Use separate paragraphs and CSS margins instead.',
      ],
      exercise: {
        question: 'How many times should h1 normally appear on a page?',
        options: ['As many as you like', 'Exactly once', 'Twice', 'Never'],
        answer: 1,
        explanation: 'One h1 per page keeps the document outline clear for readers, screen readers, and search engines.',
      },
    },
    {
      slug: 'links',
      title: 'Links',
      objective: 'Connect pages together with anchors and understand absolute vs relative URLs.',
      sections: [
        {
          heading: 'The anchor element',
          text: 'Links are created with the a element. The text between the tags is what the visitor clicks, and href is where they go. An absolute URL includes the full address; a relative URL points to a file within your own site.',
          code: '<a href="https://jovexalabs.com">Absolute: another site</a>\n<a href="/learn">Relative: a page on this site</a>\n<a href="#top">Jump to an element with id="top"</a>',
          language: 'html',
        },
        {
          heading: 'Opening in a new tab',
          text: 'Adding target="_blank" opens the link in a new tab. When you do, also add rel="noopener" so the new page cannot control the page that opened it.',
          code: '<a href="https://github.com/jovexalabs2026" target="_blank" rel="noopener">Our GitHub</a>',
          language: 'html',
        },
      ],
      mistakes: [
        'Writing vague link text like "click here". Descriptive text helps everyone, especially screen reader users.',
        'Using target="_blank" without rel="noopener".',
      ],
      exercise: {
        question: 'Which href value links to another page inside your own site?',
        options: [
          'href="https://example.com/page"',
          'href="/about"',
          'href="mailto:hi@example.com"',
          'href="tel:+123456789"',
        ],
        answer: 1,
        explanation: 'A path starting with / is a relative URL that stays on the current site.',
      },
    },
    {
      slug: 'images',
      title: 'Images',
      objective: 'Embed images correctly with src, alt, and size attributes.',
      sections: [
        {
          heading: 'The img element',
          text: 'img displays a picture. src points to the image file and alt describes it in words. The alt text appears if the image fails to load and is read aloud by screen readers.',
          code: '<img src="team.jpg" alt="The Jovexa Labs team at a table" width="640" height="360" />',
          language: 'html',
        },
        {
          heading: 'Why width and height matter',
          text: 'Giving the browser the image dimensions lets it reserve space before the file downloads, so the page does not jump around while loading.',
        },
      ],
      mistakes: [
        'Leaving alt empty on meaningful images. Use alt="" only for purely decorative images.',
        'Embedding huge image files. Resize and compress images before putting them on a page.',
      ],
      exercise: {
        question: 'What does the alt attribute do?',
        options: [
          'Sets an alternate image if the first is slow',
          'Describes the image in words for accessibility and fallback',
          'Adds a caption below the image',
          'Makes the image load faster',
        ],
        answer: 1,
        explanation: 'alt is the text alternative: shown when the image cannot load and read by screen readers.',
      },
    },
    {
      slug: 'lists',
      title: 'Lists',
      objective: 'Present items with unordered, ordered, and nested lists.',
      sections: [
        {
          heading: 'Unordered and ordered lists',
          text: 'Use ul when order does not matter (bullet points) and ol when it does (steps, rankings). Every item inside either list is an li element.',
          code: '<ul>\n  <li>Milk</li>\n  <li>Eggs</li>\n</ul>\n<ol>\n  <li>Preheat the oven</li>\n  <li>Mix the batter</li>\n  <li>Bake for 20 minutes</li>\n</ol>',
          language: 'html',
        },
        {
          heading: 'Nesting lists',
          text: 'A list can contain another list. Put the inner ul or ol inside an li of the outer list, not directly inside the outer list.',
          code: '<ul>\n  <li>Frontend\n    <ul>\n      <li>HTML</li>\n      <li>CSS</li>\n    </ul>\n  </li>\n</ul>',
          language: 'html',
        },
      ],
      mistakes: [
        'Placing text or other elements directly inside ul or ol. Only li elements belong there.',
        'Using lists just for indentation. Use CSS margins for spacing.',
      ],
      exercise: {
        question: 'Which element should you use for step-by-step instructions?',
        options: ['<ul>', '<ol>', '<dl>', '<div>'],
        answer: 1,
        explanation: 'ol is an ordered list, ideal when the sequence of items matters.',
      },
    },
    {
      slug: 'tables',
      title: 'Tables',
      objective: 'Display rows and columns of data with table, tr, th, and td.',
      sections: [
        {
          heading: 'Table building blocks',
          text: 'A table is built from rows (tr). Header cells use th and data cells use td. Wrapping the header row in thead and the data rows in tbody keeps the structure clear.',
          code: '<table>\n  <thead>\n    <tr><th>Course</th><th>Lessons</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>HTML</td><td>10</td></tr>\n    <tr><td>CSS</td><td>10</td></tr>\n  </tbody>\n</table>',
          language: 'html',
        },
        {
          heading: 'When to use a table',
          text: 'Tables are for tabular data: schedules, prices, statistics. Do not use tables to lay out a page; CSS flexbox and grid do that job far better.',
        },
      ],
      mistakes: [
        'Using tables for page layout. That approach died with old browsers.',
        'Skipping th cells. Header cells give the table meaning for screen readers.',
      ],
      exercise: {
        question: 'Which element marks a header cell in a table?',
        options: ['<td>', '<tr>', '<th>', '<thead>'],
        answer: 2,
        explanation: 'th is a header cell. thead groups header rows, tr is a row, td is a data cell.',
      },
    },
    {
      slug: 'forms',
      title: 'Forms',
      objective: 'Collect user input with form, input, label, and button.',
      sections: [
        {
          heading: 'A basic form',
          text: 'Forms gather input from visitors. Each input should have a label connected by matching for and id values, so clicking the label focuses the field and screen readers announce it correctly.',
          code: '<form>\n  <label for="email">Email</label>\n  <input type="email" id="email" name="email" required />\n\n  <label for="msg">Message</label>\n  <textarea id="msg" name="msg"></textarea>\n\n  <button type="submit">Send</button>\n</form>',
          language: 'html',
        },
        {
          heading: 'Input types',
          text: 'The type attribute changes both behavior and validation: text, email, password, number, checkbox, radio, date, and more. Picking the right type gives mobile users the right keyboard automatically.',
        },
      ],
      mistakes: [
        'Inputs without labels. Placeholder text is not a substitute for a real label.',
        'Using type="text" for everything and losing free validation and better mobile keyboards.',
      ],
      exercise: {
        question: 'How do you connect a label to its input?',
        options: [
          'Give both the same class',
          'Put the input id in the label for attribute',
          'Wrap the input in a div',
          'They connect automatically',
        ],
        answer: 1,
        explanation: 'label for="email" pairs with input id="email". Wrapping the input inside the label also works.',
      },
    },
  ],
  quiz: [
    {
      question: 'What does HTML stand for?',
      options: [
        'HyperText Markup Language',
        'HighTech Modern Language',
        'HyperTransfer Markup Logic',
        'Home Tool Markup Language',
      ],
      answer: 0,
      explanation: 'HTML is HyperText Markup Language, the standard markup language of the web.',
    },
    {
      question: 'Which element contains everything visible on the page?',
      options: ['<head>', '<html>', '<body>', '<main>'],
      answer: 2,
      explanation: 'The body element wraps all visible content. head holds metadata only.',
    },
    {
      question: 'Which is a correctly written link?',
      options: [
        '<a url="page.html">Go</a>',
        '<a href="page.html">Go</a>',
        '<link href="page.html">Go</link>',
        '<a src="page.html">Go</a>',
      ],
      answer: 1,
      explanation: 'Links use the a element with an href attribute.',
    },
    {
      question: 'Which attribute provides a text alternative for images?',
      options: ['title', 'src', 'alt', 'aria'],
      answer: 2,
      explanation: 'alt text describes the image when it cannot be seen or loaded.',
    },
    {
      question: 'Which element belongs directly inside a <ul>?',
      options: ['<p>', '<li>', '<td>', '<span>'],
      answer: 1,
      explanation: 'Only li elements belong directly inside ul or ol.',
    },
    {
      question: 'What is the purpose of the label element in forms?',
      options: [
        'It styles the input',
        'It names an input for users and assistive technology',
        'It validates the input value',
        'It submits the form',
      ],
      answer: 1,
      explanation: 'Labels describe inputs, improve accessibility, and enlarge the clickable area.',
    },
  ],
};

export default html;
