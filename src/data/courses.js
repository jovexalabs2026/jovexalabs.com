// Original Jovexa Learn course content. Each course has ordered lessons; each
// lesson has sections with optional code examples.

export const courses = [
  {
    slug: 'html-basics',
    title: 'HTML Basics',
    icon: '🧱',
    level: 'Beginner',
    tagline: 'The structure of every web page.',
    description:
      'Learn how web pages are built. HTML gives a page its structure: headings, paragraphs, links, images, lists, and more.',
    lessons: [
      {
        slug: 'what-is-html',
        title: 'What is HTML?',
        sections: [
          {
            heading: 'The skeleton of the web',
            text: 'HTML (HyperText Markup Language) describes the structure of a web page. Every website you visit, from search engines to games, starts with an HTML document that the browser reads and displays.',
          },
          {
            heading: 'Elements and tags',
            text: 'HTML is written using elements. An element usually has an opening tag, some content, and a closing tag. The tag name tells the browser what the content means.',
            code: '<h1>My first heading</h1>\n<p>My first paragraph.</p>',
            language: 'html',
          },
          {
            heading: 'Your first page',
            text: 'A complete HTML document has a doctype, an html element, a head for information about the page, and a body for everything you see.',
            code: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>My Page</title>\n  </head>\n  <body>\n    <h1>Hello, world!</h1>\n    <p>I am learning HTML with Jovexa Learn.</p>\n  </body>\n</html>',
            language: 'html',
          },
        ],
      },
      {
        slug: 'headings-and-paragraphs',
        title: 'Headings & Paragraphs',
        sections: [
          {
            heading: 'Six levels of headings',
            text: 'Headings run from h1 (most important) to h6 (least important). A page should normally have one h1, with h2 and h3 used to organize the sections beneath it.',
            code: '<h1>Page title</h1>\n<h2>A major section</h2>\n<h3>A smaller subsection</h3>',
            language: 'html',
          },
          {
            heading: 'Paragraphs and line breaks',
            text: 'The p element holds a paragraph of text. Browsers automatically add space between paragraphs. Use br only when a line break is truly part of the content, such as an address.',
            code: '<p>First paragraph of my page.</p>\n<p>Second paragraph, separated automatically.</p>',
            language: 'html',
          },
          {
            heading: 'Emphasis',
            text: 'Use strong for important text and em for stressed text. Browsers show them as bold and italic, and screen readers give them emphasis too.',
            code: '<p>This is <strong>very important</strong> and this is <em>stressed</em>.</p>',
            language: 'html',
          },
        ],
      },
      {
        slug: 'links-and-images',
        title: 'Links & Images',
        sections: [
          {
            heading: 'Linking pages together',
            text: 'The a (anchor) element creates a link. The href attribute holds the destination. Links are what turn separate pages into a web.',
            code: '<a href="https://jovexalabs.com">Visit Jovexa Labs</a>',
            language: 'html',
          },
          {
            heading: 'Adding images',
            text: 'The img element displays an image. It has no closing tag. Always include an alt attribute describing the image for people who cannot see it.',
            code: '<img src="logo.png" alt="Jovexa Labs logo" width="200" />',
            language: 'html',
          },
          {
            heading: 'Combining them',
            text: 'Wrap an image inside a link to make the image clickable.',
            code: '<a href="/">\n  <img src="logo.png" alt="Back to the home page" />\n</a>',
            language: 'html',
          },
        ],
      },
      {
        slug: 'lists-and-tables',
        title: 'Lists & Tables',
        sections: [
          {
            heading: 'Unordered and ordered lists',
            text: 'Use ul for bullet lists and ol for numbered lists. Each item goes inside an li element.',
            code: '<ul>\n  <li>Apples</li>\n  <li>Bananas</li>\n</ul>\n\n<ol>\n  <li>Preheat the oven</li>\n  <li>Mix the batter</li>\n</ol>',
            language: 'html',
          },
          {
            heading: 'Tables for tabular data',
            text: 'Tables display rows and columns of data. Use tr for rows, th for header cells, and td for data cells. Use tables for data, not for page layout.',
            code: '<table>\n  <tr><th>Game</th><th>Score</th></tr>\n  <tr><td>Dash Rush</td><td>1250</td></tr>\n</table>',
            language: 'html',
          },
        ],
      },
    ],
  },
  {
    slug: 'css-basics',
    title: 'CSS Basics',
    icon: '🎨',
    level: 'Beginner',
    tagline: 'Make your pages look great.',
    description:
      'CSS controls how a page looks: colors, fonts, spacing, and layout. Learn the core ideas that every design on the web is built from.',
    lessons: [
      {
        slug: 'what-is-css',
        title: 'What is CSS?',
        sections: [
          {
            heading: 'Style, separated from structure',
            text: 'CSS (Cascading Style Sheets) describes how HTML elements should appear. Keeping style separate from structure lets you change the entire look of a site by editing one file.',
          },
          {
            heading: 'Rules, selectors, and declarations',
            text: 'A CSS rule has a selector (which elements to style) and declarations (what to change). Each declaration is a property and a value.',
            code: 'h1 {\n  color: navy;\n  font-size: 32px;\n}',
            language: 'css',
          },
          {
            heading: 'Attaching CSS to a page',
            text: 'The best practice is an external stylesheet linked from the head of your HTML document.',
            code: '<head>\n  <link rel="stylesheet" href="styles.css" />\n</head>',
            language: 'html',
          },
        ],
      },
      {
        slug: 'selectors',
        title: 'Selectors',
        sections: [
          {
            heading: 'Element, class, and id selectors',
            text: 'Select elements by tag name, by class (reusable, starts with a dot), or by id (unique, starts with a hash). Classes are the workhorse of real projects.',
            code: 'p { line-height: 1.6; }\n.card { border: 1px solid gray; }\n#site-header { position: sticky; }',
            language: 'css',
          },
          {
            heading: 'Combining selectors',
            text: 'A space selects elements inside another element. A comma applies one rule to several selectors at once.',
            code: '.card h2 { margin-top: 0; }\nh1, h2, h3 { font-family: Georgia, serif; }',
            language: 'css',
          },
        ],
      },
      {
        slug: 'colors-and-text',
        title: 'Colors & Text',
        sections: [
          {
            heading: 'Ways to write a color',
            text: 'Colors can be named (navy), hex codes (#3b82f6), or rgb values. Hex codes are the most common in real projects.',
            code: 'body {\n  background-color: #05060f;\n  color: #e7e9f5;\n}',
            language: 'css',
          },
          {
            heading: 'Typography basics',
            text: 'font-family sets the typeface, font-size the size, font-weight the boldness, and line-height the vertical spacing between lines. Good typography is most of good design.',
            code: 'p {\n  font-family: system-ui, sans-serif;\n  font-size: 16px;\n  line-height: 1.6;\n}',
            language: 'css',
          },
        ],
      },
      {
        slug: 'box-model-and-layout',
        title: 'Box Model & Layout',
        sections: [
          {
            heading: 'Everything is a box',
            text: 'Every element is a rectangle made of content, padding (space inside the border), border, and margin (space outside the border). Understanding this model solves most layout confusion.',
            code: '.card {\n  padding: 16px;\n  border: 1px solid #ccc;\n  margin: 12px;\n}',
            language: 'css',
          },
          {
            heading: 'Flexbox in one minute',
            text: 'Set display: flex on a container to lay out its children in a row. gap adds space between them, and justify-content controls how they spread out.',
            code: '.toolbar {\n  display: flex;\n  gap: 12px;\n  justify-content: space-between;\n}',
            language: 'css',
          },
        ],
      },
    ],
  },
  {
    slug: 'javascript-basics',
    title: 'JavaScript Basics',
    icon: '⚡',
    level: 'Beginner',
    tagline: 'Bring your pages to life.',
    description:
      'JavaScript is the programming language of the web. Learn variables, functions, and how to react to what the user does.',
    lessons: [
      {
        slug: 'what-is-javascript',
        title: 'What is JavaScript?',
        sections: [
          {
            heading: 'The behavior layer',
            text: 'HTML is structure, CSS is style, and JavaScript is behavior. It runs in the browser and can respond to clicks, fetch data, and update the page without reloading.',
          },
          {
            heading: 'Your first script',
            text: 'JavaScript goes in a script element, usually placed at the end of the body or loaded as a file.',
            code: '<script>\n  console.log("Hello from JavaScript!");\n</script>',
            language: 'html',
          },
        ],
      },
      {
        slug: 'variables-and-types',
        title: 'Variables & Types',
        sections: [
          {
            heading: 'Declaring variables',
            text: 'Use const for values that never change and let for values that do. Avoid var in modern code.',
            code: "const siteName = 'Jovexa Learn';\nlet score = 0;\nscore = score + 10;",
            language: 'javascript',
          },
          {
            heading: 'Common types',
            text: 'The types you will use most are strings (text), numbers, booleans (true or false), arrays (ordered lists), and objects (labeled collections).',
            code: "const player = {\n  name: 'Dash',\n  score: 1250,\n  isRunning: true,\n  items: ['shield', 'magnet'],\n};",
            language: 'javascript',
          },
        ],
      },
      {
        slug: 'functions',
        title: 'Functions',
        sections: [
          {
            heading: 'Reusable blocks of logic',
            text: 'A function groups steps under a name so you can run them whenever you need. Parameters let the same function work with different values.',
            code: 'function add(a, b) {\n  return a + b;\n}\n\nconsole.log(add(2, 3)); // 5',
            language: 'javascript',
          },
          {
            heading: 'Arrow functions',
            text: 'Arrow functions are a shorter syntax, common in modern code and especially inside callbacks.',
            code: 'const double = (n) => n * 2;\nconsole.log(double(8)); // 16',
            language: 'javascript',
          },
        ],
      },
      {
        slug: 'dom-and-events',
        title: 'The DOM & Events',
        sections: [
          {
            heading: 'Selecting and changing elements',
            text: 'The DOM is the browser’s live model of your page. JavaScript can find elements and change their content or style.',
            code: "const title = document.querySelector('h1');\ntitle.textContent = 'Updated by JavaScript!';",
            language: 'javascript',
          },
          {
            heading: 'Reacting to the user',
            text: 'Event listeners run a function when something happens, such as a click.',
            code: "const button = document.querySelector('button');\nbutton.addEventListener('click', () => {\n  alert('You clicked me!');\n});",
            language: 'javascript',
          },
        ],
      },
    ],
  },
  {
    slug: 'python-basics',
    title: 'Python Basics',
    icon: '🐍',
    level: 'Beginner',
    tagline: 'A friendly first programming language.',
    description:
      'Python is known for readable code and is used for automation, data, web servers, and more. Learn the fundamentals here.',
    lessons: [
      {
        slug: 'what-is-python',
        title: 'What is Python?',
        sections: [
          {
            heading: 'Readable and versatile',
            text: 'Python emphasizes readable code, which makes it a popular first language. It powers automation scripts, data analysis, machine learning, and web backends.',
          },
          {
            heading: 'Hello, Python',
            text: 'The print function writes text to the screen. This one line is a complete program.',
            code: 'print("Hello from Jovexa Learn!")',
            language: 'python',
          },
        ],
      },
      {
        slug: 'variables-and-data',
        title: 'Variables & Data',
        sections: [
          {
            heading: 'No type declarations needed',
            text: 'Assign a value with the equals sign. Python figures out the type automatically.',
            code: 'name = "Dash"\nscore = 1250\nis_running = True\nitems = ["shield", "magnet"]',
            language: 'python',
          },
          {
            heading: 'f-strings',
            text: 'f-strings let you place values directly inside text, which is the cleanest way to build messages.',
            code: 'print(f"{name} scored {score} points!")',
            language: 'python',
          },
        ],
      },
      {
        slug: 'control-flow',
        title: 'Control Flow',
        sections: [
          {
            heading: 'Making decisions',
            text: 'if, elif, and else run different code depending on conditions. Indentation defines the blocks, so keep it consistent.',
            code: 'if score >= 1000:\n    print("High score!")\nelif score >= 500:\n    print("Nice run!")\nelse:\n    print("Keep practicing!")',
            language: 'python',
          },
          {
            heading: 'Loops',
            text: 'A for loop repeats once per item in a collection.',
            code: 'for item in items:\n    print(f"Collected: {item}")',
            language: 'python',
          },
        ],
      },
      {
        slug: 'functions-in-python',
        title: 'Functions',
        sections: [
          {
            heading: 'def defines a function',
            text: 'Functions keep programs organized and testable. Use return to send a result back to the caller.',
            code: 'def add_bonus(score, bonus=100):\n    return score + bonus\n\nprint(add_bonus(1250))      # 1350\nprint(add_bonus(1250, 500)) # 1750',
            language: 'python',
          },
        ],
      },
    ],
  },
  {
    slug: 'git-and-github',
    title: 'Git & GitHub',
    icon: '🌿',
    level: 'Beginner',
    tagline: 'Track, share, and protect your code.',
    description:
      'Version control is a must-have skill for every developer. Learn to save snapshots of your work and publish projects online.',
    lessons: [
      {
        slug: 'why-version-control',
        title: 'Why Version Control?',
        sections: [
          {
            heading: 'A time machine for code',
            text: 'Git records snapshots (commits) of your project. You can look back at any point in history, undo mistakes safely, and work with others without overwriting each other.',
          },
          {
            heading: 'Git vs GitHub',
            text: 'Git is the tool that runs on your computer. GitHub is a website that hosts Git repositories online so you can back up and share them. Jovexa Labs publishes its open-source work on GitHub.',
          },
        ],
      },
      {
        slug: 'your-first-repository',
        title: 'Your First Repository',
        sections: [
          {
            heading: 'Initialize and check status',
            text: 'A repository (repo) is a project tracked by Git. Create one with init, then use status constantly to see what changed.',
            code: 'git init\ngit status',
            language: 'bash',
          },
          {
            heading: 'Stage and commit',
            text: 'Staging chooses which changes go into the next snapshot. Committing saves the snapshot with a message describing it.',
            code: 'git add index.html\ngit commit -m "Add home page"',
            language: 'bash',
          },
        ],
      },
      {
        slug: 'branches',
        title: 'Branches',
        sections: [
          {
            heading: 'Experiment without fear',
            text: 'A branch is an independent line of work. Build a feature on a branch, and merge it into main when it is ready.',
            code: 'git switch -c new-feature\n# ...make commits...\ngit switch main\ngit merge new-feature',
            language: 'bash',
          },
        ],
      },
      {
        slug: 'publishing-to-github',
        title: 'Publishing to GitHub',
        sections: [
          {
            heading: 'Connect and push',
            text: 'Create an empty repository on GitHub, connect it as a remote named origin, and push your commits to it.',
            code: 'git remote add origin https://github.com/you/your-repo.git\ngit push -u origin main',
            language: 'bash',
          },
          {
            heading: 'Keep pushing',
            text: 'After the first push, publishing new commits is one command. Your work is now backed up and shareable.',
            code: 'git push',
            language: 'bash',
          },
        ],
      },
    ],
  },
  {
    slug: 'flutter-intro',
    title: 'Intro to Flutter',
    icon: '📱',
    level: 'Intermediate',
    tagline: 'Build mobile apps like we build Dash Rush.',
    description:
      'Flutter is the toolkit Jovexa Labs used to build Dash Rush. Learn the core ideas: widgets, layouts, and your first running app.',
    lessons: [
      {
        slug: 'what-is-flutter',
        title: 'What is Flutter?',
        sections: [
          {
            heading: 'One codebase, many platforms',
            text: 'Flutter lets you build apps for Android, iOS, web, and desktop from a single codebase written in the Dart language. Our game Dash Rush: Endless Run & Jump is built with Flutter.',
          },
          {
            heading: 'Everything is a widget',
            text: 'In Flutter, every piece of the interface is a widget: text, buttons, padding, rows, even the app itself. You build screens by combining small widgets into bigger ones.',
          },
        ],
      },
      {
        slug: 'widgets-and-layout',
        title: 'Widgets & Layout',
        sections: [
          {
            heading: 'Composing a layout',
            text: 'Column stacks children vertically, Row places them side by side, and Padding adds space. Most screens are just these pieces nested together.',
            code: "Column(\n  children: [\n    Text('Dash Rush'),\n    Text('Tap to jump!'),\n    ElevatedButton(\n      onPressed: startGame,\n      child: Text('Play'),\n    ),\n  ],\n)",
            language: 'dart',
          },
        ],
      },
      {
        slug: 'your-first-app',
        title: 'Your First App',
        sections: [
          {
            heading: 'A complete runnable app',
            text: 'This is a minimal Flutter app. runApp starts it, MaterialApp provides theming and navigation, and Scaffold gives the screen its basic structure.',
            code: "import 'package:flutter/material.dart';\n\nvoid main() => runApp(const MyApp());\n\nclass MyApp extends StatelessWidget {\n  const MyApp({super.key});\n\n  @override\n  Widget build(BuildContext context) {\n    return MaterialApp(\n      home: Scaffold(\n        appBar: AppBar(title: const Text('My First App')),\n        body: const Center(child: Text('Hello, Flutter!')),\n      ),\n    );\n  }\n}",
            language: 'dart',
          },
          {
            heading: 'Where to go next',
            text: 'Install the Flutter SDK, run flutter create my_app, and start experimenting. State management, animation, and packages open up from there.',
            code: 'flutter create my_app\ncd my_app\nflutter run',
            language: 'bash',
          },
        ],
      },
    ],
  },
];

export function getCourse(slug) {
  return courses.find((c) => c.slug === slug);
}

export function getLesson(courseSlug, lessonSlug) {
  const course = getCourse(courseSlug);
  if (!course) return { course: undefined, lesson: undefined, index: -1 };
  const index = course.lessons.findIndex((l) => l.slug === lessonSlug);
  return { course, lesson: course.lessons[index], index };
}
