# Contributing to Jovexa Learn

Jovexa Learn is the open-source coding education platform by Jovexa Labs
(https://jovexalabs.com/learn). Contributions of all sizes are welcome:
fixing a typo, improving an example, adding an exercise, or writing a lesson.

## How the content works

All lesson content is plain data, no CMS required:

- Courses live in `src/data/learn/` (one file per course: `html.js`, `css.js`, ...)
- Learning paths: `src/data/learn/paths.js`
- Mini projects: `src/data/learn/projects.js`
- Reference entries: `src/data/learn/reference.js`

Each course exports one object:

```js
{
  slug, title, icon, category, level, estimatedHours, tagline, description,
  lessons: [
    {
      slug, title, objective,
      sections: [{ heading, text, code?, language? }],
      mistakes: ['...', '...'],
      exercise: { question, options: [4 strings], answer: index, explanation },
    },
  ],
  quiz: [{ question, options, answer, explanation }],
}
```

Edit a data file, and the site rebuilds automatically after merge.

## Lesson-writing guidelines

1. **Originality is non-negotiable.** Never copy text, examples, or exercise
   wording from W3Schools, MDN, books, or any other source. Write in your own
   plain English.
2. Keep section text short: 2 to 4 sentences that explain one idea.
3. Every lesson needs at least one short, correct, runnable code example.
4. No em dashes in copy. Use commas, periods, or colons.
5. Exercises must have exactly 4 options, one correct answer, and a one-line
   explanation of why.
6. Beginner courses assume zero prior knowledge.

## Code contributions

1. Fork the repository and create a branch: `feature/short-description`
2. Run locally:
   ```bash
   npm install
   npm run dev
   ```
3. Before opening a pull request:
   ```bash
   npm run build
   npx oxlint src
   ```
   Both must pass with no errors.
4. Keep pull requests focused on one change.

## Reporting issues

Open an issue at https://github.com/jovexalabs2026/jovexalabs.com/issues with:

- what you expected
- what happened instead
- the page URL and your device/browser if it is a display bug

## Suggesting lessons or courses

Open an issue titled `Lesson suggestion: <topic>` describing what the lesson
should teach and who it is for.

## Review process

A Jovexa Labs maintainer reviews every pull request for originality, accuracy,
and style before merging. Content that appears copied from another source will
be declined.

## License

This project is licensed under the MIT License (see the LICENSE file). By
submitting a pull request you agree to license your contribution, including
lesson content, under the same terms. The Jovexa Labs name, logo, and brand
assets are trademarks and are not covered by the license.
