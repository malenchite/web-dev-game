require('../db');
const db = require('../models');

const questionSeed = [
  {
    category: 'frontend',
    subcategory: 'HTML',
    text: 'What is HTML?',
    answer: 'HTML is short for HyperText Markup Language and is the language of the World Wide Web. It is the standard text formatting language used for creating and displaying pages on the Web.'
  },
  {
    category: 'frontend',
    subcategory: 'HTML',
    text: 'What is a "tag" in HTML?',
    answer: 'Content is placed in between HTML tags in order to properly format it. It makes use of the less than symbol (<) and the greater than symbol (>). A slash symbol (/) is also used as a closing tag.'
  },
  {
    category: 'frontend',
    subcategory: 'HTML',
    text: 'Name at least two of the common lists that can be used when designing a page in HTML.',
    answer: 'Options include: ordered list, unordered list, definition list, menu list, and directory list.'
  },
  {
    category: 'frontend',
    subcategory: 'HTML',
    text: 'Do all character entities display properly on all systems in HTML?',
    answer: 'No, there are some character entities that cannot be displayed when the operating system that the browser is running on does not support the characters. When that happens, these characters are displayed as boxes.'
  },
  {
    category: 'frontend',
    subcategory: 'HTML',
    text: 'What is the advantage of collapsing white space in HTML?',
    answer: 'White spaces are a blank sequence of space characters. Since the browser collapses multiple spaces into a single space, you can indent lines of text without worrying about multiple spaces. This enables HTML code to be formatted in a more readable fashion.'
  },
  {
    category: 'frontend',
    subcategory: 'HTML',
    text: 'In HTML, can attribute values be set to anything or are there specific values that they accept?',
    answer: 'Some attribute values can be set to only predefined values. Other attributes can accept any numerical value that represents the number of pixels for a size.'
  },
  {
    category: 'frontend',
    subcategory: 'HTML',
    text: 'In HTML, how do you create a link that will connect to another web page when clicked?',
    answer: 'To create links that connect to another web page (hyperlinks), use the <a> "anchor" tag. The format for this is: <a href="site">text</a> where "site" is the URL of the target page.'
  },
  {
    category: 'frontend',
    subcategory: 'HTML',
    text: 'What are two types of Web Storage in HTML5?',
    answer: 'Two storage types of HTML5 are session storage (automatically clears when the browser is closed) and local storage (persistent between sessions)'
  },
  {
    category: 'frontend',
    subcategory: 'HTML',
    text: 'Does an HTML hyperlink apply to text only?',
    answer: 'No, hyperlinks can be created from many differen HTML elements when wrapped in an <a> "anchor" tag. For example, you can convert an image into a link that takes the user to another page when clicked.'
  },
  {
    category: 'frontend',
    subcategory: 'HTML',
    text: 'How do you insert a comment in HTML?',
    answer: 'Comments in HTML begins with "<!–" and ends with "–>".'
  },
  {
    category: 'frontend',
    subcategory: 'CSS',
    text: 'What is CSS?',
    answer: 'CSS stands for Cascading Style Sheet. It is a popular styling language which is used with HTML to design websites. It can also be used with any XML documents including plain XML, SVG, and XUL.'
  },
  {
    category: 'frontend',
    subcategory: 'CSS',
    text: 'Name at least one advantage of using CSS.',
    answer: 'Bandwidth, site-wide consistency, page reformatting, accessibility, separating content from presentation'
  },
  {
    category: 'frontend',
    subcategory: 'CSS',
    text: 'Name one example of a CSS framework.',
    answer: 'Some examples are: Bootstrap, Foundation, Tailwind, Semantic UI, Gumby, and Ulkit.'
  },
  {
    category: 'frontend',
    subcategory: 'CSS',
    text: 'What is the float property of CSS?',
    answer: 'The float CSS property places an element on the left or right side of its container, allowing text and inline elements to wrap around it.'
  },
  {
    category: 'frontend',
    subcategory: 'CSS',
    text: 'Name the CSS property used to specify the background color of an element.',
    answer: 'background-color'
  },
  {
    category: 'frontend',
    subcategory: 'CSS',
    text: 'In a CSS style definition, how do you differentiate between a class and an id?',
    answer: 'Classes are prefixed with "." while id\'s are prefixed with "#".'
  },
  {
    category: 'frontend',
    subcategory: 'CSS',
    text: 'Can you target multiple elements using separators when styling in CSS?',
    answer: 'Yes, with comma separation. For example: "h2, h3"'
  },
  {
    category: 'frontend',
    subcategory: 'CSS',
    text: 'What is responsive web design?',
    answer: 'Responsive design is an approach to web page creation that makes use of flexible layouts, flexible images, and CSS media queries. The goal of responsive design is to build applications that detect the visitor\'s screen size and orientation and change the layout accordingly.'
  },
  {
    category: 'frontend',
    subcategory: 'CSS',
    text: 'How do you comment in CSS?',
    answer: '/* This is a single-line comment */'
  },
  {
    category: 'frontend',
    subcategory: 'CSS',
    text: 'Which CSS property is used to change the font of an element?',
    answer: 'font-family'
  },
  {
    category: 'backend',
    subcategory: 'Databases',
    text: 'What is the primary difference between SQL and NoSQL databases?',
    answer: 'SQL databases are relational. NoSQL are non-relational.'
  },
  {
    category: 'backend',
    subcategory: 'Databases',
    text: 'Is MongoDB an example of a NoSQL or SQL database?',
    answer: 'MongoDB is a NoSQL database'
  },
  {
    category: 'backend',
    subcategory: 'Databases',
    text: 'What does DBMS stand for?',
    answer: 'Database Management System. A Database Management System is a collection of application programs which allow the user to organize, restore, and retrieve information about data efficiently and effectively.'
  },
  {
    category: 'backend',
    subcategory: 'Databases',
    text: 'What is an example of a benefit of working with SQL?',
    answer: 'Some examples: simple SQL queries can be used to retrieve a large amount of data from the database very quickly and efficiently. SQL is easy to learn and almost every DBMS supports SQL. It is easier to manage the database using SQL as no large amount of coding is required.'
  },
  {
    category: 'backend',
    subcategory: 'Databases',
    text: 'What are tables and fields in SQL?',
    answer: 'A table is an organized collection of data stored in the form of rows and columns. Columns can be categorized as vertical and rows as horizontal. The columns in a table are called fields while the rows can be referred to as records.'
  },
  {
    category: 'backend',
    subcategory: 'Databases',
    text: 'What is a view in SQL?',
    answer: 'A view is a virtual table based on the result-set of an SQL statement. A view contains rows and columns, just like a real table. The fields in a view are fields from one or more real tables in the database.'
  },
  {
    category: 'backend',
    subcategory: 'Databases',
    text: 'What would VARCHAR(255) be expected to do when defining a column in SQL?',
    answer: 'A VARCHAR or Variable Character field is a set of character data of indeterminate length. In this case, the field would be restricted to a maximum length of 255 characters.'
  },
  {
    category: 'backend',
    subcategory: 'Databases',
    text: 'What is a SQL primary key?',
    answer: 'The PRIMARY KEY constraint uniquely identifies each row in a table. It must contain UNIQUE values and has an implicit NOT NULL constraint. A table is strictly restricted to have one and only one primary key.'
  },
  {
    category: 'backend',
    subcategory: 'Databases',
    text: 'What is a query in SQL?',
    answer: 'A query is a request for data or information from a database table or combination of tables. A database query can be either a select query or an action query.'
  },
  {
    category: 'backend',
    subcategory: 'Databases',
    text: 'What does the SELECT statement do in SQL?',
    answer: 'The SELECT operator in SQL is used to extract a subset of data from a database. The data returned is stored in a result table, called the result-set.'
  },
  {
    category: 'backend',
    subcategory: 'Node.js',
    text: 'What is the difference between Node.js and JavaScript?',
    answer: ' JavaScript is a programming language. Node is an interpreter and environment for running JavaScript code. Node is used for performing actions in an operating system while JavaScript is used for client-side activity in web apps.'
  },
  {
    category: 'backend',
    subcategory: 'Node.js',
    text: 'What is Node.js?',
    answer: 'Node.js is a framework developed using Chrome\'s V8 engine. It is a lightweight framework used for creating server side web applications.'
  },
  {
    category: 'backend',
    subcategory: 'Node.js',
    text: 'Name two benefits of Node.js.',
    answer: 'Some examples: fast, asynchronous, scalable, open-source, non-buffering.'
  },
  {
    category: 'backend',
    subcategory: 'Node.js',
    text: 'Is Node.js single threaded?',
    answer: `Yes`
  },
  {
    category: 'backend',
    subcategory: 'Node.js',
    text: 'What does a Node.js package.json contain?',
    answer: 'The package.json file contains all metadata for a project where we define properties.'
  },
  {
    category: 'backend',
    subcategory: 'Node.js',
    text: 'What is an error-first callback in Node.js?',
    answer: 'Error-first callbacks in Node.js are used to process both errors and data. The first argument of the callback is reserved for an error that the callback can then process.'
  },
  {
    category: 'backend',
    subcategory: 'Node.js',
    text: 'In Node.js, what is module.exports?',
    answer: 'The module.exports object defines what data or object will be passed out of a module to be made available to any code that imports it. It promotes code availability and reuse.'
  },
  {
    category: 'backend',
    subcategory: 'Express',
    text: 'What is middleware in Express?',
    answer: 'Middleware receives the Request and Response objects along with a Next function. It can be used for updating/modifying Request or Response objects, finishing the request-response cycle, or invoking the next middleware in the stack.'
  },
  {
    category: 'backend',
    subcategory: 'Node.js',
    text: 'What is ESLint?',
    answer: 'ESLint provides automated code analysis (linting) for JavaScript through a plug-in. Linting is used to detect formatting errors as well as potential syntax and logic issues.'
  },
  {
    category: 'backend',
    subcategory: 'Node.js',
    text: 'What is NPM?',
    answer: 'NPM stands for Node Package Manager, a tool for managing packages and modules in Node.js.'
  }
];

const cardSeed = [
  {
    category: 'frontend',
    subcategory: '',
    title: 'Demo Day',
    text: 'Time to show off your work to some potential investors. Answer the question to score some bonus funding. No effect if your demo doesn’t go well.',
    success:
    {
      funding: 3,
      fep: 0,
      bep: 0,
      bugs: 0,
      special: 0
    },
    failure:
    {
      funding: 0,
      fep: 0,
      bep: 0,
      bugs: 0,
      special: 0
    }

  },
  {
    category: 'frontend',
    subcategory: '',
    title: 'In the Flow',
    text: 'You’re really feeling it today. Answer the question to score bonus back-end points. If you’re wrong, you went down a bad path and just broke things.',
    success:
    {
      funding: 0,
      fep: 3,
      bep: 0,
      bugs: 0,
      special: 0
    },
    failure:
    {
      funding: 0,
      fep: -1,
      bep: 0,
      bugs: 1,
      special: 0
    }
  },
  {
    category: 'frontend',
    subcategory: '',
    title: 'Design Consult',
    text: 'A designer friend of yours offers to work with you on some important layout issues. Answer the question to get bonus front-end points. If you’re wrong, you still get some work done but they end up charging for all the extra time it took.',
    success:
    {
      funding: 0,
      fep: 3,
      bep: 0,
      bugs: 0,
      special: 0
    },
    failure:
    {
      funding: -1,
      fep: 1,
      bep: 0,
      bugs: 0,
      special: 0
    }
  },
  {
    category: 'frontend',
    subcategory: '',
    title: 'New Framework',
    text: 'You’ve never used it before, but it sounds like it could be a lot better than what you’ve been using. Answer the question to score bonus front-end points. If you’re wrong, then you have to roll back and break some things in the process.',
    success:
    {
      funding: 0,
      fep: 5,
      bep: 0,
      bugs: 0,
      special: 0
    },
    failure:
    {
      funding: 0,
      fep: 0,
      bep: 0,
      bugs: 3,
      special: 0
    }
  },
  {
    category: 'frontend',
    subcategory: '',
    title: 'Refresher Course',
    text: 'You decide to brush up on your skills. Answer the question and it more than pays for itself: score some bonus front-end points. If you’re wrong, that’s money down the drain.',
    success:
    {
      funding: 0,
      fep: 2,
      bep: 0,
      bugs: 0,
      special: 0
    },
    failure:
    {
      funding: -2,
      fep: 0,
      bep: 0,
      bugs: 0,
      special: 0
    }
  },
  {
    category: 'frontend',
    subcategory: '',
    title: 'Midnight Inspiration',
    text: 'You wake up realizing exactly why that thing has been doing that thing. Answer the question to squash a major bug. If you’re wrong, it was all just a dream...',
    success:
    {
      funding: 0,
      fep: 0,
      bep: 0,
      bugs: -3,
      special: 0
    },
    failure:
    {
      funding: 0,
      fep: 0,
      bep: 0,
      bugs: 0,
      special: 0
    }
  },
  {
    category: 'frontend',
    subcategory: '',
    title: 'The Ol’ Reliable',
    text: 'After struggling with understanding why your code is not working, you decide to check Stack Overflow for some valuable insights. Answer the question to find the right example. If you’re wrong, you miss the right link and waste further time with no progress.',
    success:
    {
      funding: 0,
      fep: 2,
      bep: 0,
      bugs: -1,
      special: 0
    },
    failure:
    {
      funding: 0,
      fep: 0,
      bep: 0,
      bugs: 0,
      special: 0
    }
  },
  {
    category: 'frontend',
    subcategory: '',
    title: 'The Viral Opportunity',
    text: 'The project you’re working on was just brought up on a local media outlet in their tech showcase. Answer the following question for the demo to run smoothly and without bugs. If you’re wrong, a bug comes up during the presentation and the product stops working.',
    success:
    {
      funding: 4,
      fep: 0,
      bep: 0,
      bugs: 0,
      special: 0
    },
    failure:
    {
      funding: -1,
      fep: 0,
      bep: 0,
      bugs: 1,
      special: 0
    }
  },
  {
    category: 'frontend',
    subcategory: '',
    title: 'New Hire',
    text: 'Your boss introduces you to a new recruit that’s been brought on to help with project design. Answer the question to guide the new hire in the right direction. If you’re wrong, they don’t understand the instructions correctly and you are given a broken deliverable that sets you back on the front-end.',
    success:
    {
      funding: 0,
      fep: 3,
      bep: 0,
      bugs: 0,
      special: 0
    },
    failure:
    {
      funding: 0,
      fep: -2,
      bep: 0,
      bugs: 0,
      special: 0
    }
  },
  {
    category: 'frontend',
    subcategory: '',
    title: 'The Forbidden Push',
    text: 'You are about to push up a bit of code with Git. Right before you do, you think “Is there something I am forgetting right now?”. Answer the question to jog your memory and remember to pull before pushing. If you’re wrong, you forget and accidentally overwrite a bunch of a coworker\'s changes. When they later pull, they have some major setbacks getting things functioning again.',
    success:
    {
      funding: 0,
      fep: 2,
      bep: 0,
      bugs: 0,
      special: 0
    },
    failure:
    {
      funding: 0,
      fep: -3,
      bep: 0,
      bugs: 0,
      special: 0
    }
  },
  {
    category: 'backend',
    subcategory: '',
    title: 'Crunch Time',
    text: 'Time to buckle down and hammer out some server code. Answer the question to score bonus back-end points. If you’re wrong, you just created more bugs.',
    success:
    {
      funding: 0,
      fep: 0,
      bep: 3,
      bugs: 0,
      special: 0
    },
    failure:
    {
      funding: 0,
      fep: 0,
      bep: 0,
      bugs: 3,
      special: 0
    }
  },
  {
    category: 'backend',
    subcategory: '',
    title: 'Bug Hunt',
    text: 'You got your team together for a sprint towards solving some of those lingering issues. Answer the question to take a big chunk out of your bug backlog. No effect if you’re wrong.',
    success:
    {
      funding: 0,
      fep: 0,
      bep: 0,
      bugs: -5,
      special: 0
    },
    failure:
    {
      funding: 0,
      fep: 0,
      bep: 0,
      bugs: 0,
      special: 0
    }
  },
  {
    category: 'backend',
    subcategory: '',
    title: 'New Library Version',
    text: 'This could really help out with your database efficiency, if you can get it working. Answer the question for bonus back-end and bug reduction. If you’re wrong, you just break things.',
    success:
    {
      funding: 0,
      fep: 0,
      bep: 2,
      bugs: -2,
      special: 0
    },
    failure:
    {
      funding: 0,
      fep: 0,
      bep: -1,
      bugs: 1,
      special: 0
    }
  },
  {
    category: 'backend',
    subcategory: '',
    title: 'Database Refactor',
    text: 'It’s time to reorganize things to better suit your most recent needs. Answer the question to score some bonus back-end points. If you’re wrong, you still made some progress but you broke your front-end API integration along the way.',
    success:
    {
      funding: 0,
      fep: 0,
      bep: 3,
      bugs: 0,
      special: 0
    },
    failure:
    {
      funding: 0,
      fep: -1,
      bep: 1,
      bugs: 0,
      special: 0
    }
  },
  {
    category: 'backend',
    subcategory: '',
    title: 'Temporary Contract',
    text: 'A major company needs some extra hands for an upcoming release. Answer the question to score bonus funding. No effect if you mess up.',
    success:
    {
      funding: 3,
      fep: 0,
      bep: 0,
      bugs: 0,
      special: 0
    },
    failure:
    {
      funding: 0,
      fep: 0,
      bep: 0,
      bugs: 0,
      special: 0
    }
  },
  {
    category: 'backend',
    subcategory: '',
    title: 'Team Retreat',
    text: 'You decide to take the team on a weekend trip for some rope courses and escape rooms. Answer the question and score some big back-end points. No bonus if you’re wrong, but it’ll cost you either way.',
    success:
    {
      funding: -1,
      fep: 0,
      bep: 5,
      bugs: 0,
      special: 0
    },
    failure:
    {
      funding: -1,
      fep: 0,
      bep: 0,
      bugs: 0,
      special: 0
    }
  },
  {
    category: 'backend',
    subcategory: '',
    title: 'Good Communication',
    text: 'A problem comes up in the back-end. You and a teammate delegate what tasks you each should be working on. Answer the following question to delegate tasks efficiently. If you’re wrong, you both accidentally work on the same problems and waste a lot of time on back-end production.',
    success:
    {
      funding: 0,
      fep: 0,
      bep: 2,
      bugs: 0,
      special: 0
    },
    failure:
    {
      funding: 0,
      fep: 0,
      bep: 0,
      bugs: 0,
      special: 0
    }
  },
  {
    category: 'backend',
    subcategory: '',
    title: 'Potential Security Breach',
    text: 'You notice a flaw in the security system you are using. Answer the following question to fix the flaw. If you’re wrong, your answer doesn’t actually fix the problem and you suffer a database leak in the future.',
    success:
    {
      funding: 0,
      fep: 0,
      bep: 3,
      bugs: -1,
      special: 0
    },
    failure:
    {
      funding: 0,
      fep: 0,
      bep: -2,
      bugs: 1,
      special: 0
    }
  },
  {
    category: 'backend',
    subcategory: '',
    title: 'Product Success',
    text: 'The product your team has been working on has been extremely successful, so you decide to ask your boss for an increase in funding. Answer the following question to have a successful meeting with your boss. If you’re wrong they deny your request.',
    success:
    {
      funding: 3,
      fep: 0,
      bep: 0,
      bugs: 0,
      special: 0
    },
    failure:
    {
      funding: 0,
      fep: 0,
      bep: 0,
      bugs: 0,
      special: 0
    }
  },
  {
    category: 'backend',
    subcategory: '',
    title: 'App-Breaking Bugs',
    text: 'A recent push from a coworker introduced several app-breaking bugs. The code is crucial for a deadline in two days and your boss is intently focused on getting these worked out. Answer the question to fix it up and impress the leadership. If you’re wrong, these bugs aren’t fixed, the deadline passes, and your project group is even more behind.',
    success:
    {
      funding: 1,
      fep: 0,
      bep: 2,
      bugs: -2,
      special: 0
    },
    failure:
    {
      funding: 0,
      fep: 0,
      bep: 0,
      bugs: 2,
      special: 0
    }
  }
];

db.Question.deleteMany({})
  .then(() => db.Question.collection.insertMany(questionSeed))
  .then(data => {
    console.log(data.result.n + ' records inserted!');
  })
  .then(() => db.Card.deleteMany({}))
  .then(() => db.Card.collection.insertMany(cardSeed))
  .then(data => {
    console.log(data.result.n + ' records inserted!');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
