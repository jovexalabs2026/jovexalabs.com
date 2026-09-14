export const projects = [
  {
    slug: 'personal-profile-page',
    title: 'Personal Profile Page',
    course: 'html',
    icon: '🧱',
    objective: 'Build a one-page personal profile using only HTML.',
    requirements: [
      'One h1 with your name and a short paragraph about you',
      'A photo or placeholder image with proper alt text',
      'A list of three skills or hobbies',
      'A links section pointing to sites you like',
      'A small table with your weekly schedule',
    ],
    starter:
      '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <title>My Profile</title>\n  </head>\n  <body>\n    <h1><!-- your name --></h1>\n    <p><!-- about you --></p>\n  </body>\n</html>',
    language: 'html',
    hints: [
      'Sketch the sections on paper first, then translate each into elements.',
      'Validate structure by checking every opening tag has a closing tag.',
    ],
    challenge: 'Add a contact form with a labeled email input and a submit button.',
  },
  {
    slug: 'responsive-landing-page',
    title: 'Responsive Landing Page',
    course: 'css',
    icon: '🎨',
    objective: 'Style a landing page that looks great on phone and desktop.',
    requirements: [
      'A hero section with a headline, supporting text, and a button',
      'A three-card feature section built with flexbox or grid',
      'Cards stack vertically below 720px width',
      'Consistent spacing using a small set of margin and padding values',
      'A simple footer',
    ],
    starter:
      '.hero {\n  padding: 60px 20px;\n  text-align: center;\n}\n\n.features {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 20px;\n}\n\n@media (max-width: 720px) {\n  .features {\n    grid-template-columns: 1fr;\n  }\n}',
    language: 'css',
    hints: [
      'Start on a narrow screen, then add a media query for wider layouts.',
      'Test in the Code Lab by resizing the preview pane.',
    ],
    challenge: 'Add a sticky header that stays visible while scrolling.',
  },
  {
    slug: 'todo-app',
    title: 'Todo App',
    course: 'javascript',
    icon: '⚡',
    objective: 'Build an interactive todo list with add, complete, and delete.',
    requirements: [
      'A text input and an Add button',
      'New todos appear in a list when added',
      'Clicking a todo toggles a done style',
      'Each todo has a delete button that removes it',
      'Empty input is ignored',
    ],
    starter:
      "const input = document.querySelector('#todo-input');\nconst list = document.querySelector('#todo-list');\n\nfunction addTodo() {\n  const text = input.value.trim();\n  if (!text) return;\n  // create an li, add events, append to list\n}",
    language: 'javascript',
    hints: [
      'document.createElement and appendChild build the list items.',
      'Store the done state as a CSS class on the li element.',
    ],
    challenge: 'Save todos to localStorage so they survive a page refresh.',
  },
  {
    slug: 'simple-calculator',
    title: 'Simple Calculator',
    course: 'python',
    icon: '🐍',
    objective: 'Write a command-line calculator that adds, subtracts, multiplies, and divides.',
    requirements: [
      'Ask the user for two numbers and an operation',
      'Perform the chosen calculation in a function',
      'Handle division by zero with a friendly message',
      'Loop so the user can calculate again or quit',
    ],
    starter:
      'def calculate(a, b, op):\n    if op == "+":\n        return a + b\n    # add the other operations\n\nwhile True:\n    a = float(input("First number: "))\n    # get op and second number, print result',
    language: 'python',
    hints: [
      'float() converts input text to a number.',
      'Check op == "/" and b == 0 before dividing.',
    ],
    challenge: 'Add a history feature that prints all previous calculations.',
  },
  {
    slug: 'student-database-queries',
    title: 'Student Database Queries',
    course: 'sql',
    icon: '🗄️',
    objective: 'Practice core SQL by querying a small students table.',
    requirements: [
      'Create a students table with id, name, grade, and enrolled_year',
      'Insert at least five students',
      'Select students with a grade above a threshold, sorted by name',
      'Update one student\u2019s grade and delete one row',
    ],
    starter:
      'CREATE TABLE students (\n  id INTEGER PRIMARY KEY,\n  name TEXT NOT NULL,\n  grade INTEGER,\n  enrolled_year INTEGER\n);\n\nINSERT INTO students (id, name, grade, enrolled_year)\nVALUES (1, \'Ava\', 91, 2026);',
    language: 'sql',
    hints: [
      'Always write the WHERE clause before running UPDATE or DELETE.',
      'ORDER BY name ASC sorts alphabetically.',
    ],
    challenge: 'Add a courses table and join it to students.',
  },
  {
    slug: 'version-controlled-project',
    title: 'Version-Controlled Project',
    course: 'git',
    icon: '🌿',
    objective: 'Put a real project under Git version control and publish it to GitHub.',
    requirements: [
      'Initialize a repository in a project folder',
      'Make at least five meaningful commits with clear messages',
      'Create a feature branch, change something, and merge it back',
      'Push the repository to GitHub with a README',
    ],
    starter:
      'git init\ngit add .\ngit commit -m "chore: initial commit"\ngit branch feature/first-change\ngit checkout feature/first-change',
    language: 'bash',
    hints: [
      'Commit small, related changes together, not everything at once.',
      'Write commit messages that explain why, not just what.',
    ],
    challenge: 'Open a pull request on GitHub and merge it through the web interface.',
  },
];

export function getProject(slug) {
  return projects.find((p) => p.slug === slug);
}
