const css = {
  slug: 'css',
  title: 'CSS',
  icon: '🎨',
  category: 'Web Development',
  level: 'Beginner',
  estimatedHours: 5,
  tagline: 'Make the web look the way you imagine',
  description:
    'Learn how to style web pages with CSS. You will control colors, fonts, spacing, and layout, and finish by building your own responsive landing page.',
  lessons: [
    {
      slug: 'introduction-to-css',
      title: 'Introduction to CSS',
      objective: 'Understand what CSS is and how a style rule is written.',
      sections: [
        {
          heading: 'What CSS does',
          text: 'CSS (Cascading Style Sheets) controls how HTML looks: colors, fonts, spacing, and layout. A rule has two parts: a selector that picks elements, and declarations inside curly braces written as property: value pairs.',
          code: 'h1 {\n  color: navy;\n  font-size: 2rem;\n}',
          language: 'css',
        },
        {
          heading: 'Three ways to attach styles',
          text: 'You can write CSS inline on an element, inside a style element in the head, or in a separate .css file linked from the page. The external file is the best habit: one stylesheet can style every page of a site.',
          code: '<link rel="stylesheet" href="styles.css" />',
          language: 'html',
        },
      ],
      mistakes: [
        'Writing inline styles on every element. They are hard to maintain and override; keep your CSS in an external file.',
        'Forgetting the semicolon between declarations, which silently breaks every declaration that follows it.',
      ],
      exercise: {
        question: 'In a CSS rule, which part chooses the elements that get styled?',
        options: ['The declaration', 'The selector', 'The property', 'The value'],
        answer: 1,
        explanation:
          'The selector picks the elements. The declarations inside the braces describe what to change.',
      },
    },
    {
      slug: 'selectors',
      title: 'Selectors',
      objective: 'Target elements precisely with type, class, id, and combined selectors.',
      sections: [
        {
          heading: 'Type, class, and id',
          text: 'A type selector uses the tag name and styles every element of that kind. A class selector starts with a dot and matches any element carrying that class. An id selector starts with a hash and matches the single element with that id.',
          code: 'p { line-height: 1.6; }\n.card { padding: 16px; }\n#hero { text-align: center; }',
          language: 'css',
        },
        {
          heading: 'Combining and grouping',
          text: 'A space between selectors matches elements nested inside another. A comma groups several selectors under one rule. Pseudo-classes like :hover style an element in a specific state.',
          code: '.nav a { text-decoration: none; }\nh1, h2 { font-family: Georgia, serif; }\nbutton:hover { background: #1f2937; }',
          language: 'css',
        },
      ],
      mistakes: [
        'Mixing up .name and #name. The dot selects a class, the hash selects an id.',
        'Overusing id selectors. Their high specificity makes styles painful to override later.',
      ],
      exercise: {
        question: 'Which selector matches every element with class="card"?',
        options: ['#card', 'card', '.card', '*card'],
        answer: 2,
        explanation: 'Class selectors start with a dot, so .card matches all elements with that class.',
      },
    },
    {
      slug: 'colors',
      title: 'Colors',
      objective: 'Apply colors with names, hex codes, rgb, and hsl values.',
      sections: [
        {
          heading: 'Four ways to write a color',
          text: 'CSS accepts named colors like teal, hex codes like #333333, rgb() with red, green, and blue channels, and hsl() with hue, saturation, and lightness. They all describe the same colors; pick the format your team reads most easily.',
          code: 'h1 { color: teal; }\np { color: #333333; }\n.banner { background-color: rgb(255, 200, 0); }\n.badge { background-color: hsl(210, 80%, 50%); }',
          language: 'css',
        },
        {
          heading: 'Transparency and contrast',
          text: 'Adding a fourth value to rgba() or hsla() sets opacity from 0 (invisible) to 1 (solid). Whatever colors you choose, keep strong contrast between text and its background so the page stays readable.',
          code: '.overlay {\n  background-color: rgba(0, 0, 0, 0.5);\n  color: hsla(0, 0%, 100%, 0.9);\n}',
          language: 'css',
        },
      ],
      mistakes: [
        'Typing hex codes with the wrong number of digits. Valid hex colors have 3, 4, 6, or 8 digits after the hash.',
        'Relying on color alone to signal meaning, like red text for errors. Pair color with words or icons.',
      ],
      exercise: {
        question: 'Which value gives a half-transparent black background?',
        options: ['rgb(0, 0, 0)', 'rgba(0, 0, 0, 0.5)', '#000', 'black 50%'],
        answer: 1,
        explanation: 'rgba() adds an alpha channel, and 0.5 means 50 percent opacity.',
      },
    },
    {
      slug: 'typography',
      title: 'Typography',
      objective: 'Style text with font families, sizes, weights, and comfortable line spacing.',
      sections: [
        {
          heading: 'Font families and fallbacks',
          text: 'font-family takes a list of fonts. The browser tries each one in order and uses the first it has, so always end with a generic family like sans-serif or serif as a safety net.',
          code: 'body {\n  font-family: "Segoe UI", Arial, sans-serif;\n}',
          language: 'css',
        },
        {
          heading: 'Size, weight, and line height',
          text: 'Set sizes in rem so text scales with the visitor browser settings. font-weight ranges from thin to bold, and a unitless line-height around 1.5 to 1.7 gives paragraphs comfortable breathing room.',
          code: 'p {\n  font-size: 1rem;\n  font-weight: 400;\n  line-height: 1.6;\n}\nh1 {\n  font-size: 2.5rem;\n  font-weight: 700;\n}',
          language: 'css',
        },
      ],
      mistakes: [
        'Setting every font size in px. rem units respect user preferences and make scaling the whole page easy.',
        'Leaving out the generic fallback at the end of a font-family list.',
      ],
      exercise: {
        question: 'Which line-height is most comfortable for body text?',
        options: ['0.8', '1', '1.6', '3.5'],
        answer: 2,
        explanation: 'Values around 1.5 to 1.7 keep lines readable: tighter feels cramped, looser feels disconnected.',
      },
    },
    {
      slug: 'box-model',
      title: 'Box Model',
      objective: 'Explain how content, padding, border, and margin combine into the size of an element.',
      sections: [
        {
          heading: 'Four layers of every box',
          text: 'Every element is a rectangular box with four layers: the content, padding around the content, a border around the padding, and margin outside the border. Padding is space inside the box; margin is space between boxes.',
          code: '.card {\n  width: 300px;\n  padding: 16px;\n  border: 2px solid #cccccc;\n  margin: 24px;\n}',
          language: 'css',
        },
        {
          heading: 'box-sizing: border-box',
          text: 'By default, width sets only the content area, so padding and border make the box bigger than the number you wrote. Setting box-sizing to border-box makes width include padding and border, which is far easier to reason about. Most projects apply it to every element.',
          code: '* {\n  box-sizing: border-box;\n}',
          language: 'css',
        },
      ],
      mistakes: [
        'Expecting width: 300px to be the final rendered size. In the default model, padding and border are added on top.',
        'Using padding to push boxes apart. Padding lives inside the border; use margin for space between elements.',
      ],
      exercise: {
        question: 'Which property adds space outside the border of an element?',
        options: ['padding', 'margin', 'gap', 'outline-offset'],
        answer: 1,
        explanation: 'Margin is the outermost layer of the box model and separates an element from its neighbors.',
      },
    },
    {
      slug: 'display',
      title: 'Display',
      objective: 'Control how elements flow on the page with block, inline, inline-block, and none.',
      sections: [
        {
          heading: 'Block, inline, and inline-block',
          text: 'Block elements start on a new line and stretch across the available width. Inline elements flow inside text and ignore width and height. inline-block is the mix: it flows in a line but accepts width, height, and vertical padding.',
          code: 'div { display: block; }\nspan { display: inline; }\n.button {\n  display: inline-block;\n  padding: 8px 16px;\n}',
          language: 'css',
        },
        {
          heading: 'Hiding elements',
          text: 'display: none removes an element from the layout completely, as if it were deleted. visibility: hidden makes it invisible but keeps its empty space in place. Choose based on whether the gap should remain.',
          code: '.menu-closed { display: none; }\n.reserved-slot { visibility: hidden; }',
          language: 'css',
        },
      ],
      mistakes: [
        'Setting width or height on an inline element and wondering why nothing changes. Switch it to inline-block or block first.',
        'Treating display: none and visibility: hidden as the same. The first removes the space, the second keeps it.',
      ],
      exercise: {
        question: 'Which declaration removes an element and the space it occupied?',
        options: ['visibility: hidden', 'display: none', 'opacity: 0', 'display: hidden'],
        answer: 1,
        explanation:
          'display: none takes the element out of the layout. The other real options leave the space behind, and display: hidden does not exist.',
      },
    },
    {
      slug: 'flexbox',
      title: 'Flexbox',
      objective: 'Arrange items in a row or column and align them with flexbox.',
      sections: [
        {
          heading: 'Container and items',
          text: 'Flexbox starts by setting display: flex on a parent, which turns its children into flex items laid out in a row by default. justify-content spaces items along the row, align-items aligns them across it, and gap adds space between them.',
          code: '.toolbar {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 12px;\n}',
          language: 'css',
        },
        {
          heading: 'Wrapping and growing',
          text: 'flex-wrap: wrap lets items drop to a new line when the row runs out of room. The flex shorthand on an item controls how it grows and shrinks: flex: 1 1 250px means grow, shrink, and start near 250px wide.',
          code: '.cards {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 16px;\n}\n.cards article {\n  flex: 1 1 250px;\n}',
          language: 'css',
        },
      ],
      mistakes: [
        'Writing justify-content on the items instead of the container. Alignment properties belong on the flex parent.',
        'Forgetting flex-wrap: wrap, so items squeeze onto one line and overflow on small screens.',
      ],
      exercise: {
        question: 'Where do you write display: flex?',
        options: [
          'On every item you want to move',
          'On the parent container of the items',
          'On the body element only',
          'On the html element',
        ],
        answer: 1,
        explanation: 'The parent becomes the flex container and its direct children become flex items automatically.',
      },
    },
    {
      slug: 'grid',
      title: 'Grid',
      objective: 'Build two-dimensional layouts with grid columns, rows, and gaps.',
      sections: [
        {
          heading: 'Defining a grid',
          text: 'display: grid turns a container into a grid, and grid-template-columns defines the columns. The fr unit shares free space: repeat(3, 1fr) creates three equal columns, and gap spaces both rows and columns in one property.',
          code: '.gallery {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 20px;\n}',
          language: 'css',
        },
        {
          heading: 'Placing items across tracks',
          text: 'Items fill grid cells in order, but you can place one deliberately. grid-column: 1 / 3 stretches an item from the first line to the third, so it spans two columns. This is how featured cards and banners get extra room.',
          code: '.featured {\n  grid-column: 1 / 3;\n  grid-row: 1;\n}',
          language: 'css',
        },
      ],
      mistakes: [
        'Reaching for grid when the layout is a single row or column. Flexbox is simpler for one direction.',
        'Adding margins between grid items by hand instead of using the gap property.',
      ],
      exercise: {
        question: 'In grid-template-columns, what does 1fr mean?',
        options: [
          'One fixed pixel',
          'One fraction of the free space',
          'One percent of the page width',
          'The first row of the grid',
        ],
        answer: 1,
        explanation: 'fr is a fraction unit: the free space is divided among columns in proportion to their fr values.',
      },
    },
    {
      slug: 'responsive-design',
      title: 'Responsive Design',
      objective: 'Adapt one layout to phones, tablets, and desktops with fluid units and media queries.',
      sections: [
        {
          heading: 'Fluid foundations',
          text: 'Responsive design starts with the viewport meta tag, which tells phones to render at their real width instead of pretending to be a desktop. From there, prefer fluid units like percentages and rem, and cap images with max-width: 100% so they never overflow.',
          code: '<meta name="viewport" content="width=device-width, initial-scale=1" />',
          language: 'html',
        },
        {
          heading: 'Media queries',
          text: 'A media query applies extra rules only when a condition matches, usually a minimum screen width. Build the small stacked layout first, then add breakpoints that rearrange things as space grows. This mobile-first approach keeps the base CSS simple.',
          code: '.layout {\n  display: grid;\n  grid-template-columns: 1fr;\n}\n@media (min-width: 768px) {\n  .layout {\n    grid-template-columns: 1fr 1fr;\n  }\n}',
          language: 'css',
        },
      ],
      mistakes: [
        'Skipping the viewport meta tag, so phones zoom out and show a tiny desktop layout.',
        'Designing for desktop first and patching phones later. Start small, then add wider breakpoints.',
      ],
      exercise: {
        question: 'When do the rules inside @media (min-width: 768px) apply?',
        options: [
          'Only on screens narrower than 768px',
          'On screens 768px wide and wider',
          'Only on screens exactly 768px wide',
          'Only when printing the page',
        ],
        answer: 1,
        explanation: 'min-width means "at least this wide", so the rules apply from 768px upward.',
      },
    },
    {
      slug: 'mini-project-responsive-landing-page',
      title: 'Mini Project: Responsive Landing Page',
      objective: 'Combine selectors, the box model, flexbox, and media queries into one responsive landing page.',
      sections: [
        {
          heading: 'What to build',
          text: 'Build a one-page site for an imaginary app with four parts: a header with a logo and navigation links, a hero section with a headline, a short pitch, and a call-to-action button, a row of three feature cards, and a simple footer. On phones the cards must stack in a single column; from 768px up they sit side by side. Choose your own color palette and font stack, and give sections padding so nothing touches the screen edges.',
        },
        {
          heading: 'Starter markup',
          text: 'Copy this HTML into a fresh page, link a stylesheet, and write all the CSS yourself: flexbox for the header and cards, box model spacing throughout, and one media query for the wide layout.',
          code: '<header class="site-header">\n  <span class="logo">Nimbus</span>\n  <nav>\n    <a href="#features">Features</a>\n    <a href="#contact">Contact</a>\n  </nav>\n</header>\n<section class="hero">\n  <h1>Plan your day in seconds</h1>\n  <p>Nimbus keeps your tasks light, fast, and in one place.</p>\n  <a class="cta" href="#features">Get started</a>\n</section>\n<section id="features" class="cards">\n  <article>Fast capture</article>\n  <article>Smart reminders</article>\n  <article>Works offline</article>\n</section>\n<footer id="contact">Made with care by you</footer>',
          language: 'html',
        },
      ],
      mistakes: [
        'Styling the desktop version first. Build the stacked mobile layout, then add one media query for wider screens.',
        'Hard-coding pixel widths on the cards. Let flexbox or grid share the space so the page stays fluid.',
      ],
      exercise: {
        question: 'The three feature cards must stack on phones and sit in a row on wide screens. What is the cleanest approach?',
        options: [
          'Floats with clearing hacks',
          'Flexbox or grid plus one media query',
          'An HTML table with fixed cell widths',
          'Absolute positioning for each card',
        ],
        answer: 1,
        explanation:
          'A flex or grid container switches from one column to a row inside a single media query, with no hacks.',
      },
    },
  ],
  quiz: [
    {
      question: 'What does CSS stand for?',
      options: [
        'Creative Style System',
        'Cascading Style Sheets',
        'Computer Styled Sections',
        'Colorful Sheet Syntax',
      ],
      answer: 1,
      explanation: 'CSS is Cascading Style Sheets, the language that styles web pages.',
    },
    {
      question: 'Which selector styles the single element with id="hero"?',
      options: ['.hero', '#hero', 'hero', '*hero'],
      answer: 1,
      explanation: 'Id selectors start with a hash. The dot version would match a class instead.',
    },
    {
      question: 'Which property creates space between the content and the border of a box?',
      options: ['margin', 'padding', 'gap', 'border-spacing'],
      answer: 1,
      explanation: 'Padding sits inside the border, around the content. Margin is outside the border.',
    },
    {
      question: 'Which declaration turns an element into a flex container?',
      options: ['display: flex', 'flex: on', 'layout: flex', 'position: flex'],
      answer: 0,
      explanation: 'display: flex on a parent makes its direct children flex items.',
    },
    {
      question: 'In grid, which property defines the number and size of the columns?',
      options: ['grid-gap', 'grid-template-columns', 'column-count', 'grid-area'],
      answer: 1,
      explanation: 'grid-template-columns lists the column tracks, for example repeat(3, 1fr).',
    },
    {
      question: 'What is a media query used for?',
      options: [
        'Loading images faster',
        'Applying styles only when conditions like screen width match',
        'Querying a database for style values',
        'Embedding audio and video on a page',
      ],
      answer: 1,
      explanation: 'Media queries switch styles on or off based on conditions such as viewport width, which powers responsive design.',
    },
  ],
};

export default css;
