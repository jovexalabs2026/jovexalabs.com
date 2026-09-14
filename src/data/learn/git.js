const git = {
  slug: 'git',
  title: 'Git & GitHub',
  icon: '🌿',
  category: 'Developer Tools',
  level: 'Beginner',
  estimatedHours: 3,
  tagline: 'Track every change and never lose work again',
  description:
    'Learn how developers save, share, and rewind their code. Git records the history of your project and GitHub lets you back it up and collaborate with others.',
  lessons: [
    {
      slug: 'introduction-to-version-control',
      title: 'Introduction to Version Control',
      objective: 'Understand what version control is and why every developer relies on it.',
      sections: [
        {
          heading: 'What version control solves',
          text: 'Version control records snapshots of your project over time. Instead of copying folders named final, final2, and final-really, you keep one folder and Git remembers every saved state. You can look back, compare versions, and restore anything you have committed.',
        },
        {
          heading: 'Checking that Git is ready',
          text: 'Git is a program you run from the terminal. Before anything else, confirm it is installed and tell it who you are, because every snapshot is stamped with a name and email.',
          code: 'git --version\n# introduce yourself once per machine\ngit config --global user.name "Ada Codes"\ngit config --global user.email "ada@example.com"',
          language: 'bash',
        },
      ],
      mistakes: [
        'Thinking Git and GitHub are the same thing. Git is the tool on your computer, GitHub is a website that hosts Git projects.',
        'Skipping the user.name and user.email setup, which leaves commits stamped with wrong or empty author details.',
      ],
      exercise: {
        question: 'What is the main purpose of version control?',
        options: [
          'Making code run faster',
          'Recording the history of a project so you can compare and restore versions',
          'Hosting websites on the internet',
          'Automatically fixing bugs in code',
        ],
        answer: 1,
        explanation:
          'Version control tracks how a project changes over time. Speed, hosting, and bug fixing are separate concerns.',
      },
    },
    {
      slug: 'repositories',
      title: 'Repositories',
      objective: 'Know what a repository is and where Git stores its history.',
      sections: [
        {
          heading: 'A repository is a tracked folder',
          text: 'A repository, or repo, is simply a project folder that Git is watching. All of the history lives in a hidden .git folder inside it. Delete that hidden folder and the files remain, but the entire history is gone.',
        },
        {
          heading: 'Local and remote repos',
          text: 'The repo on your computer is the local repo. A copy hosted on a service like GitHub is a remote repo. You work locally, then sync with the remote to back up your history or share it with teammates.',
          code: '# see the hidden .git folder inside a repo\nls -a\n# list any remotes this repo is connected to\ngit remote -v',
          language: 'bash',
        },
      ],
      mistakes: [
        'Deleting or editing files inside the .git folder by hand. Let Git manage it.',
        'Creating a repo inside another repo by accident, which confuses Git about which history a file belongs to.',
      ],
      exercise: {
        question: 'Where does Git keep the history of a repository?',
        options: [
          'In a hidden .git folder inside the project',
          'In a file called history.txt',
          'Only on GitHub servers',
          'In the operating system settings',
        ],
        answer: 0,
        explanation:
          'Everything Git knows about a project lives in the hidden .git folder at the root of the repo.',
      },
    },
    {
      slug: 'git-init',
      title: 'git init',
      objective: 'Turn an ordinary folder into a Git repository.',
      sections: [
        {
          heading: 'Starting a repo',
          text: 'Run git init once inside a project folder to start tracking it. The command creates the hidden .git folder and nothing else changes: your files are untouched and no snapshot exists yet.',
          code: 'mkdir recipe-app\ncd recipe-app\ngit init\n# check what Git sees\ngit status',
          language: 'bash',
        },
        {
          heading: 'Reading git status',
          text: 'git status is your dashboard. Right after init it reports that you are on a branch with no commits yet, and any files you create show up as untracked until you add them. Run it often, it never changes anything.',
        },
      ],
      mistakes: [
        'Running git init in a huge folder like the home directory or Desktop, which makes Git try to track everything you own.',
        'Running git init twice expecting a reset. It is safe but does nothing new; the repo already exists.',
      ],
      exercise: {
        question: 'What does git init actually do?',
        options: [
          'Uploads the folder to GitHub',
          'Creates a hidden .git folder so Git can start tracking the project',
          'Makes the first commit automatically',
          'Downloads someone else\'s project',
        ],
        answer: 1,
        explanation:
          'git init only creates the .git folder. Nothing is committed and nothing goes online until you take further steps.',
      },
    },
    {
      slug: 'git-add',
      title: 'git add',
      objective: 'Stage changes so they are ready to be committed.',
      sections: [
        {
          heading: 'The staging area',
          text: 'Git does not snapshot files directly from your folder. First you place changes in the staging area with git add. Think of it as a box you pack before sealing it: only what you put in the box becomes part of the next commit.',
          code: '# stage one file\ngit add index.html\n# stage several files\ngit add style.css app.js\n# stage everything changed in this folder\ngit add .',
          language: 'bash',
        },
        {
          heading: 'Why staging exists',
          text: 'Staging lets you commit only part of your work. If you fixed a bug and also started a new feature, you can stage just the bug fix and commit it alone, keeping the history clean and easy to read.',
        },
      ],
      mistakes: [
        'Running git add . blindly and staging junk like log files or secret keys. Check git status first and use a .gitignore file.',
        'Editing a file after staging it and forgetting to add it again. The commit uses the staged version, not the latest save.',
      ],
      exercise: {
        question: 'What does git add do with a changed file?',
        options: [
          'Saves it permanently into the history',
          'Uploads it to GitHub',
          'Places it in the staging area for the next commit',
          'Creates a backup copy on your disk',
        ],
        answer: 2,
        explanation:
          'git add only stages changes. They become part of history when you run git commit.',
      },
    },
    {
      slug: 'git-commit',
      title: 'git commit',
      objective: 'Save a permanent snapshot of the staged changes with a clear message.',
      sections: [
        {
          heading: 'Making a commit',
          text: 'A commit seals everything in the staging area into a permanent snapshot with an id, a timestamp, your name, and a message. The message should say what the change does, so future readers understand the history without opening the code.',
          code: 'git commit -m "Add contact form to homepage"\n# view the history of commits\ngit log --oneline',
          language: 'bash',
        },
        {
          heading: 'Small commits win',
          text: 'Commit early and often. A commit that does one focused thing is easy to review, easy to describe, and easy to undo. A giant commit touching twenty files for five reasons is none of those things.',
        },
      ],
      mistakes: [
        'Writing vague messages like "stuff" or "fix". Say what changed: "Fix broken login link in navbar".',
        'Committing with nothing staged and wondering why Git says there is nothing to commit. Stage with git add first.',
      ],
      exercise: {
        question: 'Which command saves the staged changes into the project history?',
        options: [
          'git save -m "message"',
          'git commit -m "message"',
          'git add -m "message"',
          'git snapshot "message"',
        ],
        answer: 1,
        explanation:
          'git commit -m records the staged changes as a snapshot with your message attached.',
      },
    },
    {
      slug: 'branches',
      title: 'Branches',
      objective: 'Work on new ideas safely by creating and switching branches.',
      sections: [
        {
          heading: 'Parallel lines of work',
          text: 'A branch is an independent line of history. The default branch is usually called main. When you want to try a feature or a fix, you create a branch, work there freely, and main stays untouched until you decide to bring the work back.',
          code: '# create a branch and move onto it\ngit switch -c dark-mode\n# see all branches, the * marks where you are\ngit branch\n# go back to main\ngit switch main',
          language: 'bash',
        },
        {
          heading: 'Why branches matter',
          text: 'Branches make experiments cheap. If the idea works, you merge it. If it fails, you delete the branch and main never knew it existed. Teams use one branch per feature so people do not overwrite each other.',
        },
      ],
      mistakes: [
        'Doing all work directly on main, so a half-finished experiment breaks the stable version of the project.',
        'Switching branches with unsaved changes and getting confused when files look different. Commit or stash before switching.',
      ],
      exercise: {
        question: 'What happens to the main branch while you work on a feature branch?',
        options: [
          'It is deleted temporarily',
          'It stays unchanged until you merge your work into it',
          'It automatically copies every change you make',
          'It becomes read-only forever',
        ],
        answer: 1,
        explanation:
          'Branches are independent. main only receives your feature work when you merge it in.',
      },
    },
    {
      slug: 'merging',
      title: 'Merging',
      objective: 'Combine the work from one branch into another and handle conflicts calmly.',
      sections: [
        {
          heading: 'Bringing branches together',
          text: 'Merging pulls the commits from one branch into another. You switch to the branch that should receive the work, usually main, then merge the feature branch into it. Git combines the histories automatically whenever it can.',
          code: 'git switch main\ngit merge dark-mode\n# delete the branch once it is merged\ngit branch -d dark-mode',
          language: 'bash',
        },
        {
          heading: 'Merge conflicts',
          text: 'If both branches changed the same lines, Git stops and marks the file with conflict markers so a human can choose. You edit the file to keep the right version, remove the markers, then stage and commit. A conflict is a question, not an error.',
        },
      ],
      mistakes: [
        'Panicking at a merge conflict and deleting the whole repo. Open the file, pick the correct lines, remove the markers, commit.',
        'Merging while standing on the wrong branch. Always switch to the receiving branch first.',
      ],
      exercise: {
        question: 'You want the dark-mode branch merged into main. What do you do first?',
        options: [
          'Delete the dark-mode branch',
          'Switch to main, then run git merge dark-mode',
          'Run git merge main while on dark-mode',
          'Rename dark-mode to main',
        ],
        answer: 1,
        explanation:
          'You merge into the branch you are standing on, so move to main before merging the feature branch.',
      },
    },
    {
      slug: 'github-basics',
      title: 'GitHub Basics',
      objective: 'Connect a local repo to GitHub and sync work with push, pull, and clone.',
      sections: [
        {
          heading: 'Connecting and pushing',
          text: 'GitHub hosts a remote copy of your repo. You create an empty repository on the website, link it to your local repo as a remote named origin, then push your commits up. After the first push with -u, plain git push is enough.',
          code: 'git remote add origin https://github.com/ada/recipe-app.git\ngit push -u origin main\n# later, after new commits\ngit push',
          language: 'bash',
        },
        {
          heading: 'Cloning and pulling',
          text: 'To copy an existing GitHub project to your machine, use git clone with its URL. When the remote gains new commits, for example from a teammate, git pull downloads them and merges them into your local branch.',
          code: 'git clone https://github.com/ada/recipe-app.git\ncd recipe-app\ngit pull',
          language: 'bash',
        },
      ],
      mistakes: [
        'Pushing secrets like API keys or password files. Once pushed, treat them as leaked; add such files to .gitignore before committing.',
        'Forgetting to pull before starting work, then pushing and hitting rejections because the remote has commits you do not have.',
      ],
      exercise: {
        question: 'Which command downloads new commits from GitHub into your local branch?',
        options: ['git push', 'git pull', 'git commit', 'git init'],
        answer: 1,
        explanation:
          'git pull fetches the latest commits from the remote and merges them into your current branch. git push goes the other way.',
      },
    },
  ],
  quiz: [
    {
      question: 'Which statement about Git and GitHub is correct?',
      options: [
        'They are two names for the same website',
        'Git runs on your computer, GitHub hosts repositories online',
        'GitHub is required for Git to work',
        'Git is only for websites, GitHub is only for apps',
      ],
      answer: 1,
      explanation:
        'Git is a local version control tool. GitHub is one of several services that host Git repositories online.',
    },
    {
      question: 'What is the correct order of the basic Git workflow?',
      options: [
        'commit, add, push',
        'push, commit, add',
        'add, commit, push',
        'commit, push, add',
      ],
      answer: 2,
      explanation:
        'You stage changes with add, seal them into history with commit, then upload them with push.',
    },
    {
      question: 'Which command turns the current folder into a new Git repository?',
      options: ['git start', 'git new', 'git init', 'git create'],
      answer: 2,
      explanation: 'git init creates the hidden .git folder and begins tracking the project.',
    },
    {
      question: 'What is the staging area used for?',
      options: [
        'Storing deleted files permanently',
        'Choosing exactly which changes go into the next commit',
        'Hosting the project online',
        'Running tests before every push',
      ],
      answer: 1,
      explanation:
        'The staging area holds the changes you select with git add, and only those become part of the next commit.',
    },
    {
      question: 'Why do developers create branches?',
      options: [
        'To make the repository download faster',
        'To work on features or fixes without touching the stable main branch',
        'Because Git requires a new branch for every commit',
        'To delete old commits automatically',
      ],
      answer: 1,
      explanation:
        'A branch is a safe, independent line of work. main stays stable until the branch is merged back in.',
    },
    {
      question: 'A merge conflict appears. What should you do?',
      options: [
        'Delete the repository and clone it again',
        'Edit the marked file, keep the correct lines, remove the markers, then stage and commit',
        'Run git init to reset everything',
        'Ignore it, Git resolves conflicts on its own eventually',
      ],
      answer: 1,
      explanation:
        'Conflicts ask a human to choose between competing changes. You resolve the file by hand, then stage and commit the result.',
    },
  ],
};

export default git;
