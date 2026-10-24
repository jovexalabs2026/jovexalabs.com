export const DEMO_STORAGE_KEY = 'jovexa-community-demo-v1';
export const SESSION_MS = 60_000;
export const SESSION_POINTS = 25;
export const DEMO_TASKS = [
  { id: 'learn', title: 'Explore a lesson', description: 'Read a lesson and identify one new idea.', points: 10, path: '/learn' },
  { id: 'protect', title: 'Review your online habits', description: 'Review our online-safety guidance. Never paste private information.', points: 15, path: '/digital2030/cybersecurity' },
  { id: 'plan', title: 'Plan a small project', description: 'Try a business outline using fictional details.', points: 20, path: '/digital2030/business' },
];

const maxCount = 1_000_000;
const validTime = (value) => Number.isSafeInteger(value) && value >= 0 && value <= 8_640_000_000_000_000;
const dayAt = (now) => {
  if (!validTime(now)) throw new Error('The device clock is invalid. Check your date and time.');
  return new Date(now).toISOString().slice(0, 10);
};

export function emptyDemo() {
  return { version: 1, startedAt: null, sessionsCompleted: 0, taskPoints: 0, taskDay: '', claimedTasks: [] };
}

export function parseDemo(raw) {
  if (raw === null) return emptyDemo();
  const data = JSON.parse(raw);
  if (!data || data.version !== 1 ||
    !(data.startedAt === null || validTime(data.startedAt)) ||
    !Number.isInteger(data.sessionsCompleted) || data.sessionsCompleted < 0 || data.sessionsCompleted > maxCount ||
    !Number.isInteger(data.taskPoints) || data.taskPoints < 0 || data.taskPoints > maxCount ||
    typeof data.taskDay !== 'string' || !(data.taskDay === '' || /^\d{4}-\d{2}-\d{2}$/.test(data.taskDay)) ||
    !Array.isArray(data.claimedTasks) || data.claimedTasks.length > DEMO_TASKS.length ||
    new Set(data.claimedTasks).size !== data.claimedTasks.length ||
    data.claimedTasks.some((id) => !DEMO_TASKS.some((task) => task.id === id))) {
    throw new Error('Saved demo data is invalid. Reset the demo to continue.');
  }
  return { version: 1, startedAt: data.startedAt, sessionsCompleted: data.sessionsCompleted,
    taskPoints: data.taskPoints, taskDay: data.taskDay, claimedTasks: [...data.claimedTasks] };
}

export function demoBalance(data) {
  return data.sessionsCompleted * SESSION_POINTS + data.taskPoints;
}

export function sessionRemaining(data, now) {
  dayAt(now);
  if (data.startedAt === null) return 0;
  if (now < data.startedAt) throw new Error('The device clock moved backwards. Restore the clock or reset the demo.');
  return Math.max(0, SESSION_MS - (now - data.startedAt));
}

export function claimedToday(data, now) {
  return data.taskDay === dayAt(now) ? data.claimedTasks : [];
}

export function updateDemo(data, action, now) {
  const day = dayAt(now);
  if (action.type === 'start') {
    if (data.startedAt !== null) throw new Error('Finish and claim the current demo session first.');
    if (data.sessionsCompleted >= maxCount) throw new Error('Demo session limit reached. Reset the demo to continue.');
    return { ...data, startedAt: now };
  }
  if (action.type === 'claim-session') {
    if (data.startedAt === null) throw new Error('Start a demo session first.');
    if (sessionRemaining(data, now) > 0) throw new Error('The demo session is not complete yet.');
    return { ...data, startedAt: null, sessionsCompleted: data.sessionsCompleted + 1 };
  }
  if (action.type === 'claim-task') {
    const task = DEMO_TASKS.find((item) => item.id === action.id);
    if (!task) throw new Error('This demo task does not exist.');
    if (action.confirmed !== true) throw new Error('Confirm that you tried the activity before claiming demo points.');
    const claimed = claimedToday(data, now);
    if (claimed.includes(task.id)) throw new Error('This task was already claimed today (UTC).');
    if (data.taskPoints + task.points > maxCount) throw new Error('Demo point limit reached. Reset the demo to continue.');
    return { ...data, taskPoints: data.taskPoints + task.points, taskDay: day, claimedTasks: [...claimed, task.id] };
  }
  throw new Error('Unknown demo action.');
}
