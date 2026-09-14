const python = {
  slug: 'python',
  title: 'Python',
  icon: '🐍',
  category: 'Programming Languages',
  level: 'Beginner',
  estimatedHours: 6,
  tagline: 'A friendly language that gets real work done',
  description:
    'Learn the language behind automation, data work, and modern backends. Python has clean, readable syntax, which makes it one of the best first languages you can pick.',
  lessons: [
    {
      slug: 'introduction-to-python',
      title: 'Introduction to Python',
      objective: 'Understand what Python is and how you will practice it on this platform.',
      sections: [
        {
          heading: 'What Python is',
          text: 'Python is a general purpose programming language used for automation, websites, data analysis, and much more. Its syntax reads almost like plain English, so you spend your energy on ideas instead of punctuation. You write instructions in a file, and the Python interpreter runs them from top to bottom.',
        },
        {
          heading: 'Your first program',
          text: 'The print function displays text on the screen, and a one line program is already a real program. One note: Python examples on this platform are read-and-edit examples, since the browser cannot run Python yet. Copy them into a local editor or an online interpreter to see them run.',
          code: 'print("Hello from Jovexa Learn")\nprint("Python runs this line second")',
          language: 'python',
        },
      ],
      mistakes: [
        'Writing print "hello" without parentheses. That was Python 2 syntax; Python 3 always uses print("hello").',
        'Treating indentation as decoration. In Python, indentation is part of the language and changes what your code means.',
      ],
      exercise: {
        question: 'Which function displays text output in Python 3?',
        options: ['echo()', 'console.log()', 'print()', 'display()'],
        answer: 2,
        explanation: 'print() is the built-in Python function for writing output to the screen.',
      },
    },
    {
      slug: 'variables',
      title: 'Variables',
      objective: 'Store and update values using variables.',
      sections: [
        {
          heading: 'Creating a variable',
          text: 'A variable is a name that points to a value. You create one with a single equals sign, and there is no special declaration keyword. Assigning a new value to the same name simply replaces the old one.',
          code: 'name = "Ava"\nage = 19\nheight = 1.68\nage = age + 1\nprint(name, age, height)',
          language: 'python',
        },
        {
          heading: 'Naming rules',
          text: 'Variable names can use letters, digits, and underscores, but cannot start with a digit. Python convention is snake_case, like total_price or user_name. Names are case sensitive, so Score and score are two different variables.',
        },
      ],
      mistakes: [
        'Starting a variable name with a number, like 2players. Write players2 or two_players instead.',
        'Confusing = with ==. A single equals sign assigns a value, while a double equals sign compares two values.',
      ],
      exercise: {
        question: 'Which of these is a valid Python variable name?',
        options: ['2nd_place', 'total-price', 'user_name', 'class'],
        answer: 2,
        explanation:
          'user_name follows the rules. Names cannot start with a digit, hyphens are not allowed, and class is a reserved keyword.',
      },
    },
    {
      slug: 'data-types',
      title: 'Data Types',
      objective: 'Recognize the core Python types and convert between them.',
      sections: [
        {
          heading: 'The types you will meet first',
          text: 'Strings (str) hold text, integers (int) hold whole numbers, floats (float) hold decimal numbers, and booleans (bool) hold True or False. The type function tells you what type any value has, which is handy while learning.',
          code: 'city = "Nairobi"\nyear = 2026\nprice = 4.99\nis_open = True\nprint(type(city), type(year))\nprint(type(price), type(is_open))',
          language: 'python',
        },
        {
          heading: 'Converting between types',
          text: 'Python will not silently mix text and numbers, so you convert on purpose. int() and float() turn text into numbers, and str() turns a number into text you can join with other strings.',
          code: 'age_text = "21"\nage = int(age_text)\nprint(age + 1)\nprint("Age: " + str(age))',
          language: 'python',
        },
      ],
      mistakes: [
        'Adding a string to a number, like "5" + 3. Convert first with int("5") + 3.',
        'Assuming "5" and 5 are the same value. One is text and the other is a number, and they behave differently.',
      ],
      exercise: {
        question: 'What does type(3.14) return?',
        options: ['int', 'float', 'str', 'decimal'],
        answer: 1,
        explanation: 'Numbers with a decimal point are floats, so type(3.14) reports float.',
      },
    },
    {
      slug: 'conditions',
      title: 'Conditions',
      objective: 'Make programs choose between paths with if, elif, and else.',
      sections: [
        {
          heading: 'if, elif, else',
          text: 'An if statement runs its indented block only when its condition is true. elif checks another condition when the first one failed, and else catches every remaining case. Each condition line ends with a colon, and the block under it is indented.',
          code: 'score = 74\nif score >= 80:\n    print("Great work")\nelif score >= 50:\n    print("You passed")\nelse:\n    print("Try again")',
          language: 'python',
        },
        {
          heading: 'Comparing and combining',
          text: 'Comparison operators include == equal, != not equal, and the usual <, >, <=, >=. You can combine checks with and, or, and not to build richer conditions.',
          code: 'age = 20\nhas_ticket = True\nif age >= 18 and has_ticket:\n    print("Welcome in")',
          language: 'python',
        },
      ],
      mistakes: [
        'Using a single = inside a condition. Comparison needs ==, so write if score == 100, not if score = 100.',
        'Forgetting the colon at the end of if, elif, or else lines, which causes a syntax error.',
      ],
      exercise: {
        question: 'Which keyword checks another condition after the first if fails?',
        options: ['elseif', 'elif', 'otherwise', 'case'],
        answer: 1,
        explanation: 'Python spells it elif. It runs its check only when the conditions above it were false.',
      },
    },
    {
      slug: 'loops',
      title: 'Loops',
      objective: 'Repeat work with for and while loops.',
      sections: [
        {
          heading: 'for loops',
          text: 'A for loop repeats a block once for each item in a sequence. range(3) produces the numbers 0, 1, and 2, and looping over a list visits each item in order.',
          code: 'for number in range(3):\n    print("Round", number)\n\nfruits = ["apple", "mango", "pear"]\nfor fruit in fruits:\n    print(fruit)',
          language: 'python',
        },
        {
          heading: 'while loops',
          text: 'A while loop keeps running as long as its condition stays true, which is useful when you do not know the number of repeats in advance. Make sure something inside the loop moves the condition toward false, or the loop never ends.',
          code: 'count = 3\nwhile count > 0:\n    print(count)\n    count = count - 1\nprint("Liftoff")',
          language: 'python',
        },
      ],
      mistakes: [
        'Forgetting to update the counter in a while loop, which creates an infinite loop.',
        'Expecting range(5) to include 5. It produces 0 through 4, five numbers in total.',
      ],
      exercise: {
        question: 'How many times does the body of "for i in range(3):" run?',
        options: ['2', '3', '4', 'It depends on i'],
        answer: 1,
        explanation: 'range(3) yields 0, 1, and 2, so the loop body runs exactly three times.',
      },
    },
    {
      slug: 'functions',
      title: 'Functions',
      objective: 'Package reusable logic into functions with parameters and return values.',
      sections: [
        {
          heading: 'Defining and calling',
          text: 'The def keyword defines a function, parameters go in parentheses, and return sends a value back to the caller. Nothing inside the function runs until you actually call it.',
          code: 'def greet(name):\n    return "Hello, " + name\n\nmessage = greet("Sam")\nprint(message)',
          language: 'python',
        },
        {
          heading: 'Default values and return vs print',
          text: 'A parameter can have a default value that is used when the caller leaves it out. Remember that print only shows a value on screen, while return hands the value back so the rest of your program can use it.',
          code: 'def area(width, height=10):\n    return width * height\n\nprint(area(5))\nprint(area(5, 3))',
          language: 'python',
        },
      ],
      mistakes: [
        'Forgetting return and wondering why the function gives back None.',
        'Calling greet instead of greet("Sam"). Without parentheses you refer to the function, you do not run it.',
      ],
      exercise: {
        question: 'What does a function return when it has no return statement?',
        options: ['0', 'An empty string', 'None', 'It raises an error'],
        answer: 2,
        explanation: 'A function with no return statement implicitly returns the special value None.',
      },
    },
    {
      slug: 'lists',
      title: 'Lists',
      objective: 'Store ordered collections and access items by index.',
      sections: [
        {
          heading: 'Creating and indexing',
          text: 'A list holds items in order inside square brackets. Indexing starts at 0, so the first item is list[0]. Negative indexes count from the end, so list[-1] is the last item.',
          code: 'colors = ["red", "green", "blue"]\nprint(colors[0])\nprint(colors[-1])',
          language: 'python',
        },
        {
          heading: 'Changing and measuring lists',
          text: 'append adds an item to the end and remove deletes the first match. len tells you how many items a list has, and slicing like colors[0:2] copies a portion without touching the original.',
          code: 'colors = ["red", "green", "blue"]\ncolors.append("gold")\ncolors.remove("green")\nprint(len(colors))\nprint(colors[0:2])',
          language: 'python',
        },
      ],
      mistakes: [
        'Asking for an index that does not exist, like colors[5] on a three item list, which raises an IndexError.',
        'Forgetting that indexing starts at 0, so the third item lives at index 2, not index 3.',
      ],
      exercise: {
        question: 'Given colors = ["red", "green", "blue"], what is colors[1]?',
        options: ['"red"', '"green"', '"blue"', 'An error'],
        answer: 1,
        explanation: 'Indexes start at 0, so index 1 is the second item, "green".',
      },
    },
    {
      slug: 'dictionaries',
      title: 'Dictionaries',
      objective: 'Store labeled data as key and value pairs.',
      sections: [
        {
          heading: 'Keys and values',
          text: 'A dictionary maps keys to values inside curly braces. You read and update values by key rather than by position, which makes dictionaries perfect for describing one thing with several named facts.',
          code: 'person = {"name": "Lena", "age": 30}\nprint(person["name"])\nperson["age"] = 31',
          language: 'python',
        },
        {
          heading: 'Adding, safe reads, and looping',
          text: 'Assigning to a new key adds it. The get method reads a key safely and returns a fallback when the key is missing, and items() lets you loop over every pair.',
          code: 'person = {"name": "Lena", "age": 31}\nperson["city"] = "Oslo"\nprint(person.get("email", "not set"))\nfor key, value in person.items():\n    print(key, value)',
          language: 'python',
        },
      ],
      mistakes: [
        'Reading a missing key with square brackets, which raises a KeyError. Use get when the key might not exist.',
        'Mixing up lists and dictionaries: lists use numeric positions, dictionaries use named keys.',
      ],
      exercise: {
        question: 'Which is the safe way to read a key that might be missing?',
        options: [
          'person["email"]',
          'person.get("email", "not set")',
          'person.email',
          'person.fetch("email")',
        ],
        answer: 1,
        explanation: 'get returns the fallback value instead of raising a KeyError when the key is absent.',
      },
    },
    {
      slug: 'working-with-files',
      title: 'Working with Files',
      objective: 'Read from and write to text files safely.',
      sections: [
        {
          heading: 'Reading a file',
          text: 'The open function opens a file, and the with statement guarantees it closes automatically, even if an error happens. read() returns the whole file content as one string.',
          code: 'with open("notes.txt") as file:\n    content = file.read()\n    print(content)',
          language: 'python',
        },
        {
          heading: 'Writing and appending',
          text: 'Mode "w" writes a fresh file and erases anything that was already there, while mode "a" appends to the end and keeps existing content. Add a newline character yourself when you want each entry on its own line.',
          code: 'with open("log.txt", "a") as file:\n    file.write("New entry\\n")',
          language: 'python',
        },
      ],
      mistakes: [
        'Opening files without the with statement and forgetting to close them, which can lose buffered data.',
        'Using mode "w" when you meant to add to a file. Mode "w" wipes the existing content first.',
      ],
      exercise: {
        question: 'Which mode adds new content to the end of an existing file?',
        options: ['"r"', '"w"', '"a"', '"x"'],
        answer: 2,
        explanation: 'Mode "a" appends. "r" reads, "w" overwrites, and "x" creates a brand new file.',
      },
    },
    {
      slug: 'mini-project-simple-calculator',
      title: 'Mini Project: Simple Calculator',
      objective: 'Combine input, conditions, and conversion to build a command-line calculator.',
      sections: [
        {
          heading: 'Project requirements',
          text: 'Build a program that asks the user for two numbers and an operation. It should support +, -, *, and /, print the result, and show a clear message instead of crashing when someone divides by zero. As a stretch goal, wrap everything in a while loop so the user can calculate again until they type quit.',
        },
        {
          heading: 'Starter code',
          text: 'This starter covers the core flow: read input, convert it to numbers, pick a branch, and print the result. Type it into your local editor, run it, then extend it with the stretch goal.',
          code: 'print("Simple Calculator")\na = float(input("First number: "))\nb = float(input("Second number: "))\nop = input("Operation (+, -, *, /): ")\n\nif op == "+":\n    print(a + b)\nelif op == "-":\n    print(a - b)\nelif op == "*":\n    print(a * b)\nelif op == "/":\n    if b == 0:\n        print("Cannot divide by zero")\n    else:\n        print(a / b)\nelse:\n    print("Unknown operation")',
          language: 'python',
        },
      ],
      mistakes: [
        'Doing math on input() results directly. input always returns a string, so convert with float or int first.',
        'Skipping the divide by zero check, which crashes the program with a ZeroDivisionError.',
      ],
      exercise: {
        question: 'What type of value does input() always return?',
        options: ['int', 'float', 'str', 'Whatever the user typed'],
        answer: 2,
        explanation: 'input() always returns a string, even when the user types digits, so convert before doing math.',
      },
    },
  ],
  quiz: [
    {
      question: 'Which symbol assigns a value to a variable?',
      options: ['==', '=', ':=then', '->'],
      answer: 1,
      explanation: 'A single equals sign assigns. Double equals compares two values.',
    },
    {
      question: 'What is the type of the value True?',
      options: ['str', 'int', 'bool', 'truth'],
      answer: 2,
      explanation: 'True and False are the two boolean values, type bool.',
    },
    {
      question: 'Which keyword starts a function definition?',
      options: ['function', 'def', 'fn', 'lambda only'],
      answer: 1,
      explanation: 'Functions are defined with def, followed by the name and parameters.',
    },
    {
      question: 'What does len(["a", "b", "c"]) return?',
      options: ['2', '3', '"abc"', 'An error'],
      answer: 1,
      explanation: 'len counts the items in the list, and this list has three items.',
    },
    {
      question: 'How do you read the value stored under the key "name" in a dictionary called person?',
      options: ['person.name', 'person("name")', 'person["name"]', 'person->name'],
      answer: 2,
      explanation: 'Dictionaries use square brackets with the key: person["name"].',
    },
    {
      question: 'Why should you open files with the with statement?',
      options: [
        'It makes reading faster',
        'It closes the file automatically, even after an error',
        'It converts the file to a string',
        'It is required by Python 3',
      ],
      answer: 1,
      explanation: 'with guarantees the file is closed when the block ends, so you never leak open file handles.',
    },
  ],
};

export default python;
