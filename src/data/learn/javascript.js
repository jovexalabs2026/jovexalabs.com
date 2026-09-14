const javascript = {
  slug: 'javascript',
  title: 'JavaScript',
  icon: '⚡',
  category: 'Web Development',
  level: 'Beginner',
  estimatedHours: 6,
  tagline: 'Make your web pages think and react',
  description:
    'Learn the language that powers interactivity on the web. JavaScript lets you respond to clicks, work with data, and update the page without reloading it.',
  lessons: [
    {
      slug: 'introduction-to-javascript',
      title: 'Introduction to JavaScript',
      objective: 'Understand what JavaScript is and where it runs in a web page.',
      sections: [
        {
          heading: 'The language of behavior',
          text: 'HTML gives a page structure and CSS gives it style, but JavaScript gives it behavior. It is a full programming language that runs inside the browser, so it can react to clicks, check form input, fetch data, and change the page while the visitor is looking at it.',
        },
        {
          heading: 'Your first line of code',
          text: 'The quickest way to see JavaScript work is console.log, which prints a message to the browser console. Open the developer tools in any browser, find the Console tab, and try it.',
          code: 'console.log("Hello from Jovexa Learn");\nconsole.log(2 + 3); // prints 5',
          language: 'javascript',
        },
      ],
      mistakes: [
        'Confusing JavaScript with Java. They are unrelated languages that happen to share part of a name.',
        'Skipping the browser console while learning. It is the fastest place to test small pieces of code and see errors.',
      ],
      exercise: {
        question: 'What role does JavaScript play in a web page?',
        options: [
          'It defines the structure of the content',
          'It controls colors, fonts, and layout',
          'It adds behavior and interactivity',
          'It stores files on the server',
        ],
        answer: 2,
        explanation:
          'JavaScript handles behavior: reacting to user actions and updating the page. Structure is HTML and styling is CSS.',
      },
    },
    {
      slug: 'variables',
      title: 'Variables',
      objective: 'Store and update values using const and let.',
      sections: [
        {
          heading: 'const and let',
          text: 'A variable is a named box that holds a value. Use const when the value should never be reassigned and let when it needs to change later. Modern code prefers const by default and switches to let only when reassignment is truly needed.',
          code: 'const siteName = "Jovexa Learn";\nlet score = 0;\nscore = score + 10;\nconsole.log(siteName, score); // "Jovexa Learn" 10',
          language: 'javascript',
        },
        {
          heading: 'Naming rules',
          text: 'Variable names are case sensitive, cannot start with a number, and cannot contain spaces. The common style is camelCase: start lowercase and capitalize each new word, like totalPrice or userEmail.',
        },
      ],
      mistakes: [
        'Trying to reassign a const. If a value must change, declare it with let instead.',
        'Using var out of habit from old tutorials. var has confusing scoping rules, so stick to const and let.',
      ],
      exercise: {
        question: 'Which declaration is best for a value that never gets reassigned?',
        options: ['var', 'let', 'const', 'static'],
        answer: 2,
        explanation:
          'const signals that the variable will not be reassigned, which makes code easier to reason about.',
      },
    },
    {
      slug: 'data-types',
      title: 'Data Types',
      objective: 'Recognize the basic types of values JavaScript works with.',
      sections: [
        {
          heading: 'The everyday types',
          text: 'The values you will use most are strings (text in quotes), numbers, and booleans (true or false). Two special values mean "nothing": undefined is a variable that was never given a value, and null is an intentional empty value you set yourself.',
          code: 'const course = "JavaScript"; // string\nconst lessons = 12; // number\nconst isFree = true; // boolean\nlet nickname; // undefined\nconst winner = null; // intentionally empty',
          language: 'javascript',
        },
        {
          heading: 'Checking a type',
          text: 'The typeof operator tells you what type a value is, which is handy when debugging. Strings can also be written with backticks as template literals, which let you insert values with the dollar-brace syntax.',
          code: 'console.log(typeof "hi"); // "string"\nconsole.log(typeof 42); // "number"\nconst name = "Ava";\nconsole.log(`Welcome, ${name}!`); // "Welcome, Ava!"',
          language: 'javascript',
        },
      ],
      mistakes: [
        'Forgetting that "5" and 5 are different: one is a string and one is a number, and adding them gives "55".',
        'Mixing up null and undefined. undefined means a value was never set, null means you set it to empty on purpose.',
      ],
      exercise: {
        question: 'What is the result of typeof true?',
        options: ['"true"', '"boolean"', '"number"', '"string"'],
        answer: 1,
        explanation: 'true is a boolean value, so typeof returns the string "boolean".',
      },
    },
    {
      slug: 'operators',
      title: 'Operators',
      objective: 'Combine and compare values with arithmetic, comparison, and logical operators.',
      sections: [
        {
          heading: 'Arithmetic and comparison',
          text: 'Arithmetic operators (+, -, *, /, %) do math. Comparison operators produce booleans: always use === for equals and !== for not equals, because they check both value and type without surprise conversions.',
          code: 'const price = 20;\nconst tax = price * 0.1;\nconsole.log(price + tax); // 22\nconsole.log(price === 20); // true\nconsole.log(price !== "20"); // true, different types',
          language: 'javascript',
        },
        {
          heading: 'Logical operators',
          text: 'Logical operators combine booleans: && means both sides must be true, || means at least one side must be true, and ! flips a value. They power the conditions you will write in the next lesson.',
          code: 'const loggedIn = true;\nconst isAdmin = false;\nconsole.log(loggedIn && isAdmin); // false\nconsole.log(loggedIn || isAdmin); // true\nconsole.log(!loggedIn); // false',
          language: 'javascript',
        },
      ],
      mistakes: [
        'Using == instead of ===. Double equals converts types silently, so "5" == 5 is true and hides bugs.',
        'Writing = when you meant ===. A single equals sign assigns a value instead of comparing.',
      ],
      exercise: {
        question: 'Why is === preferred over == in JavaScript?',
        options: [
          'It runs faster in every browser',
          'It compares value and type without converting anything',
          'It works on strings only',
          'It can compare more than two values',
        ],
        answer: 1,
        explanation:
          'Strict equality (===) never converts types, so comparisons behave predictably. == can convert types and surprise you.',
      },
    },
    {
      slug: 'conditions',
      title: 'Conditions',
      objective: 'Make code choose between paths with if, else if, and else.',
      sections: [
        {
          heading: 'if, else if, else',
          text: 'An if statement runs its block only when the condition in parentheses is true. Chain else if for extra checks and end with else as the fallback. JavaScript tests the conditions from top to bottom and runs the first block that matches.',
          code: 'const age = 17;\nif (age >= 18) {\n  console.log("You can vote");\n} else if (age >= 16) {\n  console.log("Almost there");\n} else {\n  console.log("Not yet");\n}',
          language: 'javascript',
        },
        {
          heading: 'Truthy and falsy',
          text: 'Conditions do not have to be strict booleans. Values like 0, an empty string, null, and undefined count as falsy, while most other values count as truthy. This lets you write checks like if (username) to test that a string is not empty.',
        },
      ],
      mistakes: [
        'Putting a semicolon right after the condition, like if (x > 5); which ends the statement and always runs the block.',
        'Repeating full comparisons when a simple truthy check works, or the reverse: relying on truthiness when 0 is a valid value.',
      ],
      exercise: {
        question: 'In an if / else if / else chain, which block runs?',
        options: [
          'Every block whose condition is true',
          'Only the first block whose condition is true',
          'Always the else block',
          'The last block whose condition is true',
        ],
        answer: 1,
        explanation:
          'JavaScript checks conditions from the top and runs only the first matching block, then skips the rest of the chain.',
      },
    },
    {
      slug: 'loops',
      title: 'Loops',
      objective: 'Repeat work with for, while, and for...of loops.',
      sections: [
        {
          heading: 'The classic for loop',
          text: 'A for loop repeats a block a set number of times. It has three parts: a starting counter, a condition checked before each lap, and an update that runs after each lap.',
          code: 'for (let i = 1; i <= 3; i++) {\n  console.log(`Lap ${i}`);\n}\n// Lap 1, Lap 2, Lap 3',
          language: 'javascript',
        },
        {
          heading: 'Looping over a collection',
          text: 'When you have an array, for...of walks through each item directly with no counter to manage. A while loop is the third option: it keeps running as long as its condition stays true, which suits cases where you do not know the lap count in advance.',
          code: 'const colors = ["red", "green", "blue"];\nfor (const color of colors) {\n  console.log(color);\n}',
          language: 'javascript',
        },
      ],
      mistakes: [
        'Writing a condition that never becomes false, which creates an infinite loop and freezes the page.',
        'Starting the counter at 1 when reading array positions. Array indexes start at 0, so the last index is length minus 1.',
      ],
      exercise: {
        question: 'Which loop is the cleanest way to visit every item in an array?',
        options: [
          'while with a manual counter',
          'for...of',
          'do...while',
          'if...else',
        ],
        answer: 1,
        explanation:
          'for...of gives you each item directly without managing indexes, so there is less room for off-by-one errors.',
      },
    },
    {
      slug: 'functions',
      title: 'Functions',
      objective: 'Package reusable logic into named and arrow functions.',
      sections: [
        {
          heading: 'Declaring and calling',
          text: 'A function is a reusable block of code with a name. Parameters are the inputs listed in parentheses, and return sends a value back to whoever called the function. Defining a function does nothing until you call it.',
          code: 'function greet(name) {\n  return `Hello, ${name}!`;\n}\nconsole.log(greet("Sam")); // "Hello, Sam!"',
          language: 'javascript',
        },
        {
          heading: 'Arrow functions',
          text: 'Arrow functions are a shorter syntax, often stored in a const. When the body is a single expression you can drop the braces and the return keyword, which makes small helpers very compact.',
          code: 'const double = (n) => n * 2;\nconst add = (a, b) => a + b;\nconsole.log(double(7)); // 14\nconsole.log(add(3, 4)); // 7',
          language: 'javascript',
        },
      ],
      mistakes: [
        'Forgetting to return a value. A function without return gives back undefined, even if it calculated something inside.',
        'Calling a function without parentheses. greet is the function itself, greet("Sam") actually runs it.',
      ],
      exercise: {
        question: 'What does a function return if it has no return statement?',
        options: ['0', 'null', 'undefined', 'An empty string'],
        answer: 2,
        explanation:
          'Without an explicit return, every JavaScript function returns undefined by default.',
      },
    },
    {
      slug: 'arrays',
      title: 'Arrays',
      objective: 'Store ordered lists of values and transform them with array methods.',
      sections: [
        {
          heading: 'Creating and updating arrays',
          text: 'An array holds an ordered list of values inside square brackets. Positions start counting at 0, push adds an item to the end, and length tells you how many items are inside.',
          code: 'const tasks = ["wash dishes", "study"];\ntasks.push("stretch");\nconsole.log(tasks[0]); // "wash dishes"\nconsole.log(tasks.length); // 3',
          language: 'javascript',
        },
        {
          heading: 'map and filter',
          text: 'Two methods you will use constantly: map builds a new array by transforming each item, and filter builds a new array keeping only the items that pass a test. Both leave the original array untouched.',
          code: 'const nums = [1, 2, 3, 4];\nconst doubled = nums.map((n) => n * 2); // [2, 4, 6, 8]\nconst evens = nums.filter((n) => n % 2 === 0); // [2, 4]',
          language: 'javascript',
        },
      ],
      mistakes: [
        'Reading tasks[tasks.length] to get the last item. The last index is length minus 1.',
        'Expecting map or filter to change the original array. They return a new array, so store the result in a variable.',
      ],
      exercise: {
        question: 'What does [10, 20, 30].filter((n) => n > 15) return?',
        options: ['[10]', '[20, 30]', '[10, 20, 30]', '30'],
        answer: 1,
        explanation:
          'filter keeps only the items that pass the test. 20 and 30 are greater than 15, so the new array is [20, 30].',
      },
    },
    {
      slug: 'objects',
      title: 'Objects',
      objective: 'Group related data and behavior into key-value pairs.',
      sections: [
        {
          heading: 'Keys and values',
          text: 'An object groups related data under named keys, wrapped in curly braces. Read a value with dot notation like player.name, or with brackets like player["name"] when the key is stored in a variable.',
          code: 'const player = {\n  name: "Rio",\n  score: 42,\n  active: true,\n};\nconsole.log(player.name); // "Rio"\nplayer.score = 50;\nconsole.log(player["score"]); // 50',
          language: 'javascript',
        },
        {
          heading: 'Methods',
          text: 'When a key holds a function it is called a method, and inside a method the keyword this refers to the object itself. This is how you attach behavior to data, like a levelUp method that changes the score it belongs to.',
          code: 'const game = {\n  level: 1,\n  levelUp() {\n    this.level += 1;\n  },\n};\ngame.levelUp();\nconsole.log(game.level); // 2',
          language: 'javascript',
        },
      ],
      mistakes: [
        'Using brackets without quotes, like player[name], which looks up a variable called name instead of the key "name".',
        'Assuming key order or comparing objects with ===. Two objects with the same content are still different objects in memory.',
      ],
      exercise: {
        question: 'How do you read the email key from const user = { email: "a@b.com" }?',
        options: ['user->email', 'user(email)', 'user.email', 'user::email'],
        answer: 2,
        explanation:
          'Dot notation, user.email, reads a key directly. user["email"] with a quoted string works too.',
      },
    },
    {
      slug: 'dom-basics',
      title: 'DOM Basics',
      objective: 'Select elements on the page and change their content from JavaScript.',
      sections: [
        {
          heading: 'What the DOM is',
          text: 'When the browser loads your HTML it builds the DOM, a live tree of objects representing every element on the page. JavaScript can search this tree, read it, and change it, and the page updates instantly. Suppose the page contains this markup.',
          code: '<h1 id="title">Loading...</h1>\n<p class="status">Please wait</p>',
          language: 'html',
        },
        {
          heading: 'Selecting and changing elements',
          text: 'document.querySelector finds the first element matching a CSS selector, so you can reuse the selectors you already know from CSS. Once you have an element, textContent changes its text and classList adds or removes classes.',
          code: 'const title = document.querySelector("#title");\ntitle.textContent = "Welcome back";\n\nconst status = document.querySelector(".status");\nstatus.classList.add("ready");',
          language: 'javascript',
        },
      ],
      mistakes: [
        'Running DOM code before the HTML exists. Load your script at the end of the body or use the defer attribute on the script tag.',
        'Forgetting the # or . in querySelector. It takes a CSS selector, so "#title" finds an id and "title" finds a <title> tag.',
      ],
      exercise: {
        question: 'Which line selects the element with id="menu"?',
        options: [
          'document.querySelector("menu")',
          'document.querySelector("#menu")',
          'document.getElement("menu")',
          'document.select(".menu")',
        ],
        answer: 1,
        explanation:
          'querySelector uses CSS selector syntax, and an id selector starts with #.',
      },
    },
    {
      slug: 'events',
      title: 'Events',
      objective: 'React to user actions like clicks and typing with event listeners.',
      sections: [
        {
          heading: 'Listening for events',
          text: 'An event is something that happens on the page: a click, a key press, a form submit. addEventListener attaches a function to an element, and the browser calls that function every time the event fires.',
          code: 'const btn = document.querySelector("#save");\nbtn.addEventListener("click", () => {\n  console.log("Saved!");\n});',
          language: 'javascript',
        },
        {
          heading: 'The event object',
          text: 'The browser passes an event object to your listener with details about what happened. For a text input, event.target is the element itself, so event.target.value gives you what the user typed. On form submits, event.preventDefault() stops the page from reloading.',
          code: 'const input = document.querySelector("#search");\ninput.addEventListener("input", (event) => {\n  console.log(`You typed: ${event.target.value}`);\n});',
          language: 'javascript',
        },
      ],
      mistakes: [
        'Calling the function while attaching it: addEventListener("click", save()) runs save immediately. Pass save without parentheses.',
        'Forgetting event.preventDefault() on form submits, so the page reloads and your JavaScript state disappears.',
      ],
      exercise: {
        question: 'What is wrong with btn.addEventListener("click", greet())?',
        options: [
          'The event name should be "onclick"',
          'greet() runs immediately instead of waiting for the click',
          'addEventListener only accepts arrow functions',
          'Nothing, it works as expected',
        ],
        answer: 1,
        explanation:
          'The parentheses call greet right away and pass its return value. Pass the function itself: addEventListener("click", greet).',
      },
    },
    {
      slug: 'mini-project-todo-app',
      title: 'Mini Project: Todo App',
      objective: 'Combine variables, functions, the DOM, and events to build a working todo list.',
      sections: [
        {
          heading: 'Project requirements',
          text: 'Build a small todo app that uses everything from this course. The page needs a text input with id task-input, a button with id add-btn, and an empty ul with id task-list. Clicking the button should add the typed text as a new list item, ignore empty input, and clear the field afterwards. Clicking a list item should toggle a done class so completed tasks can be styled with a strikethrough.',
        },
        {
          heading: 'Starter code',
          text: 'This starter wires up the core flow: read the input, validate it, create a list item, and attach a click listener for the done toggle. Extend it yourself with a delete button on each item or a counter showing how many tasks remain.',
          code: 'const input = document.querySelector("#task-input");\nconst addBtn = document.querySelector("#add-btn");\nconst list = document.querySelector("#task-list");\n\nconst addTask = () => {\n  const text = input.value.trim();\n  if (text === "") return;\n\n  const item = document.createElement("li");\n  item.textContent = text;\n  item.addEventListener("click", () => {\n    item.classList.toggle("done");\n  });\n\n  list.appendChild(item);\n  input.value = "";\n};\n\naddBtn.addEventListener("click", addTask);',
          language: 'javascript',
        },
      ],
      mistakes: [
        'Skipping the empty-input check, which fills the list with blank items when the button is clicked repeatedly.',
        'Creating elements but never calling appendChild, so tasks exist in memory but never appear on the page.',
      ],
      exercise: {
        question: 'In the starter code, what does input.value.trim() do?',
        options: [
          'Deletes the input element from the page',
          'Removes spaces from the start and end of the typed text',
          'Converts the text to lowercase',
          'Clears the input field',
        ],
        answer: 1,
        explanation:
          'trim strips leading and trailing whitespace, so a value of only spaces becomes an empty string and gets rejected by the check.',
      },
    },
  ],
  quiz: [
    {
      question: 'Which declaration should you reach for first in modern JavaScript?',
      options: ['var', 'const', 'let', 'define'],
      answer: 1,
      explanation:
        'Default to const, switch to let only when the variable must be reassigned, and avoid var entirely.',
    },
    {
      question: 'What does "3" + 3 evaluate to?',
      options: ['6', '"33"', 'NaN', 'An error'],
      answer: 1,
      explanation:
        'When one side of + is a string, JavaScript joins them as text, so the result is the string "33".',
    },
    {
      question: 'Which comparison is true?',
      options: ['5 === "5"', '5 == "6"', '5 !== "5"', 'null === undefined'],
      answer: 2,
      explanation:
        'Strict comparison checks type as well as value. A number is never strictly equal to a string, so 5 !== "5" is true.',
    },
    {
      question: 'What does [1, 2, 3].map((n) => n * 10) return?',
      options: ['[10, 20, 30]', '[1, 2, 3]', '60', '[10]'],
      answer: 0,
      explanation:
        'map applies the function to every item and returns a new array of the results.',
    },
    {
      question: 'Which method finds the first element matching a CSS selector?',
      options: [
        'document.findElement',
        'document.querySelector',
        'document.getSelector',
        'document.matchCSS',
      ],
      answer: 1,
      explanation:
        'document.querySelector takes any CSS selector, like "#id", ".class", or a tag name, and returns the first match.',
    },
    {
      question: 'How do you run a function named save every time a button is clicked?',
      options: [
        'btn.addEventListener("click", save())',
        'btn.addEventListener(save, "click")',
        'btn.addEventListener("click", save)',
        'btn.onClick = save()',
      ],
      answer: 2,
      explanation:
        'Pass the function itself, without parentheses, so the browser can call it later on each click.',
    },
  ],
};

export default javascript;
