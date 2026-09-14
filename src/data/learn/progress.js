// Local-first progress store. Designed so a cloud sync layer can replace the
// storage backend later without changing callers.
const KEY = 'jovexa-learn-progress-v1';

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore corrupt or unavailable storage
  }
  return { completed: {}, quizScores: {}, bookmarks: [], recent: [] };
}

function save(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // storage may be unavailable (private mode); progress is best-effort
  }
}

export function getProgress() {
  return load();
}

function lessonKey(courseSlug, lessonSlug) {
  return `${courseSlug}/${lessonSlug}`;
}

export function isLessonComplete(courseSlug, lessonSlug) {
  return Boolean(load().completed[lessonKey(courseSlug, lessonSlug)]);
}

export function toggleLessonComplete(courseSlug, lessonSlug) {
  const state = load();
  const key = lessonKey(courseSlug, lessonSlug);
  if (state.completed[key]) delete state.completed[key];
  else state.completed[key] = Date.now();
  save(state);
  return Boolean(state.completed[key]);
}

export function completedCount(course) {
  const state = load();
  return course.lessons.filter((l) => state.completed[lessonKey(course.slug, l.slug)]).length;
}

export function setQuizScore(courseSlug, score, total) {
  const state = load();
  const best = state.quizScores[courseSlug];
  if (!best || score > best.score) {
    state.quizScores[courseSlug] = { score, total, at: Date.now() };
    save(state);
  }
}

export function getQuizScore(courseSlug) {
  return load().quizScores[courseSlug];
}

export function isBookmarked(courseSlug, lessonSlug) {
  return load().bookmarks.includes(lessonKey(courseSlug, lessonSlug));
}

export function toggleBookmark(courseSlug, lessonSlug) {
  const state = load();
  const key = lessonKey(courseSlug, lessonSlug);
  const i = state.bookmarks.indexOf(key);
  if (i >= 0) state.bookmarks.splice(i, 1);
  else state.bookmarks.unshift(key);
  save(state);
  return i < 0;
}

export function getBookmarks() {
  return load().bookmarks.map((key) => {
    const [courseSlug, lessonSlug] = key.split('/');
    return { courseSlug, lessonSlug };
  });
}

export function recordVisit(courseSlug, lessonSlug) {
  const state = load();
  const key = lessonKey(courseSlug, lessonSlug);
  state.recent = [key, ...state.recent.filter((k) => k !== key)].slice(0, 8);
  save(state);
}

export function getRecent() {
  return load().recent.map((key) => {
    const [courseSlug, lessonSlug] = key.split('/');
    return { courseSlug, lessonSlug };
  });
}
