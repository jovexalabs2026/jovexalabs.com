const sql = {
  slug: 'sql',
  title: 'SQL',
  icon: '🗄️',
  category: 'Databases',
  level: 'Beginner',
  estimatedHours: 4,
  tagline: 'Ask questions and get answers from your data',
  description:
    'Learn to read, add, change, and connect data stored in relational databases. SQL is the standard language behind almost every app that remembers anything.',
  lessons: [
    {
      slug: 'introduction-to-sql',
      title: 'Introduction to SQL',
      objective: 'Understand what SQL is and how data is organized into tables, rows, and columns.',
      sections: [
        {
          heading: 'What SQL does',
          text: 'SQL (Structured Query Language) is how you talk to a relational database. Instead of writing loops, you describe the result you want and the database figures out how to fetch it. Throughout this course we use a small game studio database with three tables: players, scores, and games.',
        },
        {
          heading: 'Tables, rows, and columns',
          text: 'A table is like a spreadsheet with a fixed set of columns. Each row is one record, such as one player. This statement creates our players table so you can see the shape of the data we will query.',
          code: 'CREATE TABLE players (\n  id INTEGER PRIMARY KEY,\n  username TEXT,\n  country TEXT,\n  joined_date DATE\n);',
          language: 'sql',
        },
      ],
      mistakes: [
        'Expecting SQL to run top to bottom like a script. Each statement is an independent request that the database answers on its own.',
        'Confusing the database with the table. A database holds many tables, and each table holds rows of one kind of record.',
      ],
      exercise: {
        question: 'In a relational database, what does a single row in the players table represent?',
        options: [
          'One column of data',
          'One player record',
          'The entire database',
          'A backup of the table',
        ],
        answer: 1,
        explanation: 'Each row is one record. In the players table, one row holds all the stored details for one player.',
      },
    },
    {
      slug: 'select',
      title: 'SELECT',
      objective: 'Read data from a table by choosing which columns to return.',
      sections: [
        {
          heading: 'Reading rows with SELECT',
          text: 'SELECT is the statement you will type most often. You list the columns you want, then name the table after FROM. The database returns a result set, which is itself a small temporary table.',
          code: 'SELECT username, country\nFROM players;',
          language: 'sql',
        },
        {
          heading: 'Selecting everything',
          text: 'The star symbol asks for every column. It is handy while exploring, but in real applications it is better to name columns so your result does not silently change when someone adds a new column to the table.',
          code: 'SELECT *\nFROM players;',
          language: 'sql',
        },
      ],
      mistakes: [
        'Writing SELECT * in production code, which fetches columns you do not need and breaks assumptions when the table changes.',
        'Forgetting the FROM clause. SELECT username on its own does not tell the database which table to read.',
      ],
      exercise: {
        question: 'Which statement returns only the username column from the players table?',
        options: [
          'SELECT players FROM username;',
          'GET username FROM players;',
          'SELECT username FROM players;',
          'SELECT * FROM username;',
        ],
        answer: 2,
        explanation: 'The pattern is SELECT column FROM table. Columns come first, then the table name after FROM.',
      },
    },
    {
      slug: 'where',
      title: 'WHERE',
      objective: 'Filter rows so a query returns only the records that match a condition.',
      sections: [
        {
          heading: 'Filtering with conditions',
          text: 'WHERE keeps only the rows where a condition is true. You compare columns to values with operators like =, <, >, and <>. Text values go inside single quotes, numbers do not.',
          code: "SELECT username, country\nFROM players\nWHERE country = 'Japan';",
          language: 'sql',
        },
        {
          heading: 'Combining conditions',
          text: 'AND requires both conditions to be true, OR requires at least one. You can group logic with parentheses to make the intent obvious. This query finds high scores in one specific game.',
          code: 'SELECT player_id, points\nFROM scores\nWHERE game_id = 3 AND points > 9000;',
          language: 'sql',
        },
      ],
      mistakes: [
        "Using double quotes for text values. Standard SQL expects single quotes, as in country = 'Japan'.",
        'Writing WHERE points = NULL to find missing values. NULL needs IS NULL or IS NOT NULL, not the = operator.',
      ],
      exercise: {
        question: 'Which query returns players who joined after 2025-01-01 AND are from Brazil?',
        options: [
          "SELECT * FROM players WHERE joined_date > '2025-01-01' AND country = 'Brazil';",
          "SELECT * FROM players WHERE joined_date > '2025-01-01' OR country = 'Brazil';",
          "SELECT * FROM players IF joined_date > '2025-01-01' AND country = 'Brazil';",
          "SELECT * FROM players WHERE joined_date > '2025-01-01' + country = 'Brazil';",
        ],
        answer: 0,
        explanation: 'AND makes both conditions required. OR would also include players from Brazil who joined earlier.',
      },
    },
    {
      slug: 'order-by',
      title: 'ORDER BY',
      objective: 'Sort query results by one or more columns in ascending or descending order.',
      sections: [
        {
          heading: 'Sorting results',
          text: 'Rows come back in no guaranteed order unless you ask for one. ORDER BY sorts the result by a column. ASC means ascending and is the default, DESC means descending. A leaderboard is a classic use case.',
          code: 'SELECT player_id, points\nFROM scores\nORDER BY points DESC;',
          language: 'sql',
        },
        {
          heading: 'Sorting by more than one column',
          text: 'You can list several columns separated by commas. The database sorts by the first column, then breaks ties using the second. Here players are grouped alphabetically by country, newest members first within each country.',
          code: 'SELECT username, country, joined_date\nFROM players\nORDER BY country ASC, joined_date DESC;',
          language: 'sql',
        },
      ],
      mistakes: [
        'Assuming rows arrive sorted without ORDER BY. The database may return any order, and it can change between runs.',
        'Placing ORDER BY before WHERE. Filtering comes first in the statement, sorting goes at the end.',
      ],
      exercise: {
        question: 'How do you list scores from highest points to lowest?',
        options: [
          'ORDER BY points ASC',
          'ORDER BY points DESC',
          'SORT BY points HIGH',
          'GROUP BY points DESC',
        ],
        answer: 1,
        explanation: 'DESC sorts from largest to smallest, which puts the top score first.',
      },
    },
    {
      slug: 'insert',
      title: 'INSERT',
      objective: 'Add new rows to a table with the INSERT INTO statement.',
      sections: [
        {
          heading: 'Adding a row',
          text: 'INSERT INTO names the table and the columns you are filling, then VALUES supplies the data in the same order. Naming the columns keeps the statement working even if the table gains new columns later.',
          code: "INSERT INTO players (username, country, joined_date)\nVALUES ('pixel_fox', 'Canada', '2026-09-01');",
          language: 'sql',
        },
        {
          heading: 'Inserting several rows at once',
          text: 'You can pass multiple value groups separated by commas. This is faster than repeating the whole statement for every row, and it keeps related inserts together.',
          code: "INSERT INTO games (title, genre)\nVALUES\n  ('Star Drift', 'Racing'),\n  ('Mole Patrol', 'Puzzle');",
          language: 'sql',
        },
      ],
      mistakes: [
        'Listing values in a different order than the columns, which quietly puts data in the wrong fields.',
        'Supplying a value for an auto-generated id column. Let the database assign primary keys itself.',
      ],
      exercise: {
        question: 'What does the VALUES clause do in an INSERT statement?',
        options: [
          'It filters which rows get inserted',
          'It supplies the data for the new row, matching the column list order',
          'It renames the columns of the table',
          'It sorts the table after inserting',
        ],
        answer: 1,
        explanation: 'VALUES provides the actual data. Each value lines up with the column in the same position in the column list.',
      },
    },
    {
      slug: 'update',
      title: 'UPDATE',
      objective: 'Change existing rows safely with UPDATE and a WHERE clause.',
      sections: [
        {
          heading: 'Changing data',
          text: 'UPDATE names the table, SET lists the columns to change with their new values, and WHERE picks which rows are affected. Here one player moves to a new country.',
          code: "UPDATE players\nSET country = 'Germany'\nWHERE username = 'pixel_fox';",
          language: 'sql',
        },
        {
          heading: 'The WHERE clause is your safety net',
          text: 'Without WHERE, an UPDATE changes every row in the table. A good habit is to run a SELECT with the same WHERE clause first, confirm the rows it returns, then convert it into the UPDATE.',
          code: "SELECT * FROM players WHERE username = 'pixel_fox';\n\nUPDATE players\nSET country = 'Germany'\nWHERE username = 'pixel_fox';",
          language: 'sql',
        },
      ],
      mistakes: [
        'Running UPDATE without a WHERE clause and overwriting a column in every single row.',
        'Using = twice, as in SET country = = value. SET uses one equals sign per column assignment.',
      ],
      exercise: {
        question: 'What happens if you run UPDATE players SET country = \'Spain\'; with no WHERE clause?',
        options: [
          'The database rejects the statement',
          'Only the first row changes',
          'Every player row gets country set to Spain',
          'Nothing changes until you commit twice',
        ],
        answer: 2,
        explanation: 'UPDATE applies to all rows that match the WHERE clause, and with no WHERE clause every row matches.',
      },
    },
    {
      slug: 'delete',
      title: 'DELETE',
      objective: 'Remove rows from a table without dropping the table itself.',
      sections: [
        {
          heading: 'Removing rows',
          text: 'DELETE FROM removes whole rows that match the WHERE condition. The table and its columns stay in place, only the matching records disappear. This removes one retired game from the catalog.',
          code: "DELETE FROM games\nWHERE title = 'Mole Patrol';",
          language: 'sql',
        },
        {
          heading: 'DELETE vs DROP',
          text: 'DELETE removes rows, DROP TABLE removes the entire table including its structure. Deleted rows are usually gone for good once the change is committed, so double check the WHERE clause with a SELECT first.',
        },
      ],
      mistakes: [
        'Forgetting the WHERE clause, which empties the whole table in one statement.',
        'Writing DELETE * FROM games. DELETE does not take a column list, the correct form is DELETE FROM games.',
      ],
      exercise: {
        question: 'Which statement removes only scores below 100 points?',
        options: [
          'DELETE FROM scores WHERE points < 100;',
          'DELETE scores WHERE points < 100;',
          'DROP FROM scores WHERE points < 100;',
          'REMOVE * FROM scores WHERE points < 100;',
        ],
        answer: 0,
        explanation: 'The correct pattern is DELETE FROM table WHERE condition. DROP is for removing whole tables.',
      },
    },
    {
      slug: 'join-basics',
      title: 'JOIN Basics',
      objective: 'Combine rows from two tables using a shared key column.',
      sections: [
        {
          heading: 'Why joins exist',
          text: 'Related data lives in separate tables to avoid duplication. The scores table stores a player_id instead of repeating the username on every score. A JOIN stitches the tables back together by matching those id values.',
          code: 'SELECT players.username, scores.points\nFROM scores\nJOIN players ON scores.player_id = players.id;',
          language: 'sql',
        },
        {
          heading: 'INNER vs LEFT JOIN',
          text: 'A plain JOIN (also called INNER JOIN) returns only rows that match in both tables. A LEFT JOIN keeps every row from the first table and fills in NULL where the second table has no match, which is useful for finding players who have never posted a score.',
          code: 'SELECT players.username, scores.points\nFROM players\nLEFT JOIN scores ON scores.player_id = players.id;',
          language: 'sql',
        },
      ],
      mistakes: [
        'Leaving out the ON condition, which pairs every row with every other row and produces a huge meaningless result.',
        'Using an INNER JOIN when you need unmatched rows too. Players with no scores vanish unless you use a LEFT JOIN.',
      ],
      exercise: {
        question: 'What does the ON clause in a JOIN specify?',
        options: [
          'Which database to connect to',
          'How rows from the two tables match up',
          'The order of the final results',
          'Which columns are returned',
        ],
        answer: 1,
        explanation: 'ON defines the matching rule, usually a shared key like scores.player_id = players.id.',
      },
    },
  ],
  quiz: [
    {
      question: 'Which statement reads data from a table?',
      options: ['INSERT', 'SELECT', 'UPDATE', 'DELETE'],
      answer: 1,
      explanation: 'SELECT retrieves rows. INSERT adds, UPDATE changes, and DELETE removes them.',
    },
    {
      question: 'Which clause filters rows so only matching records are returned?',
      options: ['ORDER BY', 'FROM', 'WHERE', 'SET'],
      answer: 2,
      explanation: 'WHERE keeps only the rows where the condition is true, in SELECT, UPDATE, and DELETE alike.',
    },
    {
      question: 'Which query lists players sorted alphabetically by username?',
      options: [
        'SELECT username FROM players ORDER BY username ASC;',
        'SELECT username FROM players SORT username;',
        'SELECT username ORDER BY players;',
        'SELECT username FROM players WHERE username ASC;',
      ],
      answer: 0,
      explanation: 'ORDER BY column ASC sorts ascending, which is alphabetical for text.',
    },
    {
      question: 'Which statement correctly adds a new game?',
      options: [
        "ADD INTO games (title) VALUES ('Sky Loop');",
        "INSERT games SET title = 'Sky Loop';",
        "INSERT INTO games (title) VALUES ('Sky Loop');",
        "UPDATE games ADD title = 'Sky Loop';",
      ],
      answer: 2,
      explanation: 'New rows use INSERT INTO table (columns) VALUES (data). SET belongs to UPDATE.',
    },
    {
      question: 'What is the biggest risk when running UPDATE or DELETE?',
      options: [
        'The table gets sorted incorrectly',
        'Forgetting the WHERE clause and affecting every row',
        'The database creates duplicate tables',
        'Column names get renamed',
      ],
      answer: 1,
      explanation: 'Without WHERE, UPDATE rewrites every row and DELETE removes every row. Always check the condition first.',
    },
    {
      question: 'A LEFT JOIN from players to scores returns what?',
      options: [
        'Only players who have at least one score',
        'Only scores with no matching player',
        'All players, with NULL score columns for players who have no scores',
        'The two tables merged into one permanent table',
      ],
      answer: 2,
      explanation: 'LEFT JOIN keeps every row from the left table and fills unmatched right-table columns with NULL.',
    },
  ],
};

export default sql;
