import html from './html.js';
import css from './css.js';
import javascript from './javascript.js';
import python from './python.js';
import sql from './sql.js';
import git from './git.js';
import flutter from './flutter.js';

export const courses = [html, css, javascript, python, sql, git, flutter];

export const categories = [
  'Web Development',
  'Programming Languages',
  'Databases',
  'Developer Tools',
  'Mobile Development',
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

export function coursesByCategory() {
  return categories
    .map((category) => ({
      category,
      courses: courses.filter((c) => c.category === category),
    }))
    .filter((group) => group.courses.length > 0);
}

export function totalLessons() {
  return courses.reduce((sum, c) => sum + c.lessons.length, 0);
}
