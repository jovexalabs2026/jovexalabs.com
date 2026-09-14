const flutter = {
  slug: 'flutter-intro',
  title: 'Intro to Flutter',
  icon: '📱',
  category: 'Mobile Development',
  level: 'Intermediate',
  estimatedHours: 3,
  tagline: 'Build mobile apps like we build Dash Rush',
  description:
    'Flutter is the toolkit Jovexa Labs used to build Dash Rush. Learn the core ideas: widgets, layouts, and your first running app.',
  lessons: [
    {
      slug: 'what-is-flutter',
      title: 'What is Flutter?',
      objective: 'Understand what Flutter is and why one codebase can target many platforms.',
      sections: [
        {
          heading: 'One codebase, many platforms',
          text: 'Flutter lets you build apps for Android, iOS, web, and desktop from a single codebase written in the Dart language. Our game Dash Rush: Endless Run & Jump is built with Flutter.',
          code: "void main() {\n  print('Hello from Dart!');\n}",
          language: 'dart',
        },
        {
          heading: 'Everything is a widget',
          text: 'In Flutter, every piece of the interface is a widget: text, buttons, padding, rows, even the app itself. You build screens by combining small widgets into bigger ones.',
        },
      ],
      mistakes: [
        'Expecting Flutter to use native platform widgets. Flutter draws its own UI, which is why it looks identical everywhere.',
        'Skipping Dart basics. A little Dart knowledge makes Flutter far easier to learn.',
      ],
      exercise: {
        question: 'What language are Flutter apps written in?',
        options: ['JavaScript', 'Kotlin', 'Dart', 'Swift'],
        answer: 2,
        explanation: 'Flutter apps are written in Dart, a language designed for building fast user interfaces.',
      },
    },
    {
      slug: 'widgets-and-layout',
      title: 'Widgets & Layout',
      objective: 'Compose screens from Column, Row, and other layout widgets.',
      sections: [
        {
          heading: 'Composing a layout',
          text: 'Column stacks children vertically, Row places them side by side, and Padding adds space. Most screens are just these pieces nested together.',
          code: "Column(\n  children: [\n    Text('Dash Rush'),\n    Text('Tap to jump!'),\n    ElevatedButton(\n      onPressed: startGame,\n      child: Text('Play'),\n    ),\n  ],\n)",
          language: 'dart',
        },
        {
          heading: 'Think in trees',
          text: 'A Flutter screen is a tree of widgets. When you want to change how something looks, you usually wrap it in another widget rather than editing properties on the fly.',
        },
      ],
      mistakes: [
        'Building one giant widget. Split screens into small reusable widgets early.',
        'Fighting layout errors by guessing. Read the error: it usually names the widget that needs a size.',
      ],
      exercise: {
        question: 'Which widget stacks its children vertically?',
        options: ['Row', 'Column', 'Stack', 'Padding'],
        answer: 1,
        explanation: 'Column lays out children top to bottom. Row is the horizontal version.',
      },
    },
    {
      slug: 'your-first-app',
      title: 'Your First App',
      objective: 'Run a complete minimal Flutter app and know where to go next.',
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
      mistakes: [
        'Editing code without hot reload. Save the file while the app runs and changes appear instantly.',
        'Ignoring the pubspec.yaml file. Dependencies and assets are declared there.',
      ],
      exercise: {
        question: 'Which function starts a Flutter application?',
        options: ['startApp()', 'runApp()', 'main.run()', 'flutter.start()'],
        answer: 1,
        explanation: 'main() calls runApp() with your root widget to start the app.',
      },
    },
  ],
  quiz: [
    {
      question: 'Flutter renders its interface by:',
      options: [
        'Using each platform\u2019s native widgets',
        'Drawing its own widgets identically on every platform',
        'Generating HTML pages',
        'Embedding a web browser',
      ],
      answer: 1,
      explanation: 'Flutter paints its own UI, so apps look and behave the same across platforms.',
    },
    {
      question: 'Which widget gives a screen its basic structure like an app bar and body?',
      options: ['Container', 'MaterialApp', 'Scaffold', 'Center'],
      answer: 2,
      explanation: 'Scaffold provides the standard screen layout: app bar, body, floating buttons, and more.',
    },
    {
      question: 'What command creates a new Flutter project?',
      options: ['flutter new my_app', 'flutter create my_app', 'dart create my_app', 'flutter init'],
      answer: 1,
      explanation: 'flutter create my_app scaffolds a ready-to-run project.',
    },
    {
      question: 'What is hot reload?',
      options: [
        'Restarting the phone',
        'Reinstalling the app',
        'Applying code changes to the running app instantly',
        'Clearing the app cache',
      ],
      answer: 2,
      explanation: 'Hot reload injects your updated code into the running app so you see changes in about a second.',
    },
  ],
};

export default flutter;
