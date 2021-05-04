const mongoose = require('mongoose');
const db = require('../models');

mongoose.connect('mongodb://localhost/', {
  useNewUrlParser: true,
  useFindAndModify: false
});

const questionSeed = [
  {
    category: 'Front-End',
    subcategory: 'HTML',
    text: 'What is HTML?',
    answer: 'HTML is short for HyperText Markup Language and is the language of the World Wide Web. It is the standard text formatting language used for creating and displaying pages on the Web.'
  },
  {
    category: 'Front-End',
    subcategory: 'HTML',
    text: 'What are tags?',
    answer: 'Content is placed in between HTML tags in order to properly format it. It makes use of the less than symbol (<) and the greater than symbol (>). A slash symbol is also used as a closing tag.'
  },
  {
    category: 'Front-End',
    subcategory: 'HTML',
    text: 'Name at least two of the common lists that can be used when designing a page.',
    answer: `You can insert any or a combination of the following list types:
    – ordered list
    – unordered list
    – definition list
    – menu list
    – directory list
    Each of this list types makes use of a different tag set to compose`
  },
  {
    category: 'Front-End',
    subcategory: 'HTML',
    text: 'Do all character entities display properly on all systems?',
    answer: 'No, there are some character entities that cannot be displayed when the operating system that the browser is running on does not support the characters. When that happens, these characters are displayed as boxes.'
  },
  {
    category: 'Front-End',
    subcategory: 'HTML',
    text: 'What is the advantage of collapsing white space?',
    answer: 'White spaces are a blank sequence of space characters, which is treated as a single space character in HTML. Because the browser collapses multiple spaces into a single space, you can indent lines of text without worrying about multiple spaces. This enables you to organize the HTML code into a much more readable format.'
  },
  {
    category: 'Front-End',
    subcategory: 'HTML',
    text: 'Can attribute values be set to anything or are there specific values that they accept?',
    answer: 'Some attribute values can be set to only predefined values. Other attributes can accept any numerical value that represents the number of pixels for a size.'
  },
  {
    category: 'Front-End',
    subcategory: 'HTML',
    text: 'How do you create a link that will connect to another web page when clicked?',
    answer: 'To create hyperlinks, or links that connect to another web page, use the href tag. The general format for this is: <a href=”site”>text</a>Replace “site” with the actual page URL that is supposed to be linked to when the text is clicked.'
  },
  {
    category: 'Front-End',
    subcategory: 'HTML',
    text: 'What are two types of Web Storage in HTML5?',
    answer: `Two storage types of HTML5 are:

    Session Storage:
    
    It stores data of current sessions only. It means that the data stored in session storage clears automatically when the browser is closed.
    
    Local Storage:

    Local storage is another type of HTML5 Web Storage. In local storage, data is not deleted automatically when the current browser window is closed.`
  },
  {
    category: 'Front-End',
    subcategory: 'HTML',
    text: 'Does a hyperlink apply to text only?',
    answer: 'No, hyperlinks can be used in the text as well as images. That means you can convert an image into a link that will allow users to link to another page when clicked. Surround the image within the <a href=” “>…</a> tag combinations.'
  },
  {
    category: 'Front-End',
    subcategory: 'HTML',
    text: 'How do you insert a comment in HTML?',
    answer: 'Comments in HTML begins with “<!–“and ends with “–>”.'
  },
  {
    category: 'Back-End',
    subcategory: 'Databases',
    text: 'What is the primary difference between SQL and NoSQL databases?',
    answer: 'SQL databases are relational, NoSQL are non-relational.'
  },
  {
    category: 'Back-End',
    subcategory: 'Databases',
    text: 'Is MongoDB an example of a NoSQL or SQL database?',
    answer: 'MongoDB is a NoSQL database'
  },
  {
    category: 'Back-End',
    subcategory: 'Databases',
    text: 'What does DBMS stand for?',
    answer: 'Database Management System. A Database Management System is a collection of application programs which allow the user to organize, restore and retrieve information about data efficiently and as effectively as possible.'
  },
  {
    category: 'Back-End',
    subcategory: 'Databases',
    text: 'What is one example of a benefit of working with SQL?',
    answer: `Some examples, Simple SQL queries can be used to retrieve a large amount of data from the database very quickly and efficiently.

    SQL is easy to learn and almost every DBMS supports SQL.
    
    It is easier to manage the database using SQL as no large amount of coding is required.`
  },
  {
    category: 'Back-End',
    subcategory: 'Databases',
    text: 'What are tables and fields in SQL?',
    answer: 'A table is an organized collection of data stored in the form of rows and columns. Columns can be categorized as vertical and rows as horizontal. The columns in a table are called fields while the rows can be referred to as records.'
  },
  {
    category: 'Back-End',
    subcategory: 'Databases',
    text: 'What is a view in SQL?',
    answer: 'A view in SQL is a virtual table based on the result-set of an SQL statement. A view contains rows and columns, just like a real table. The fields in a view are fields from one or more real tables in the database.'
  },
  {
    category: 'Back-End',
    subcategory: 'Databases',
    text: 'What would VARCHAR(255) be expected to do when defining a column in SQL ?',
    answer: 'A varchar or Variable Character Field is a set of character data of indeterminate length. In this case, it would restrict the amount of characters used to 255 for the field.'
  },
  {
    category: 'Back-End',
    subcategory: 'Databases',
    text: 'What is a primary key?',
    answer: 'The PRIMARY KEY constraint uniquely identifies each row in a table. It must contain UNIQUE values and has an implicit NOT NULL constraint. A table in SQL is strictly restricted to have one and only one primary key, which consists of single or multiple fields (columns).'
  },
  {
    category: 'Back-End',
    subcategory: 'Databases',
    text: 'What is a query?',
    answer: 'A query is a request for data or information from a database table or combination of tables. A database query can be either a select query or an action query.'
  },
  {
    category: 'Back-End',
    subcategory: 'Databases',
    text: 'What does the SELECT statement do in SQL?',
    answer: 'SELECT operator in SQL is used to select data from a database. The data returned is stored in a result table, called the result-set.'
  }
];

const cardSeed = [
  {
    category: 'Front-End',
    subcategory: '',
    title: 'Demo Day',
    text: 'Time to show off your work to some potential investors. Answer the question to score some bonus funding. No effect if your demo doesn’t go well.',
    success: [
      {
        funding: 3,
        fep: 0,
        bep: 0,
        bugs: 0,
        special: 0
      }
    ],
    failure: [
      {
        funding: 0,
        fep: 0,
        bep: 0,
        bugs: 0,
        special: 0
      }
    ]
  },
  {
    category: 'Front-End',
    subcategory: '',
    title: 'In the Flow',
    text: 'You’re really feeling it today. Answer the question to score bonus back-end points. If you’re wrong, you went down a bad path and just broke things.',
    success: [
      {
        funding: 0,
        fep: 3,
        bep: 0,
        bugs: 0,
        special: 0
      }
    ],
    failure: [
      {
        funding: 0,
        fep: -1,
        bep: 0,
        bugs: 1,
        special: 0
      }
    ]
  },
  {
    category: 'Front-End',
    subcategory: '',
    title: 'Design Consult',
    text: 'A designer friend of yours offers to work with you on some important layout issues. Answer the question to get bonus front-end points. If you’re wrong, you still get some work done but they end up charging for all the extra time it took.',
    success: [
      {
        funding: 0,
        fep: 3,
        bep: 0,
        bugs: 0,
        special: 0
      }
    ],
    failure: [
      {
        funding: -1,
        fep: 1,
        bep: 0,
        bugs: 0,
        special: 0
      }
    ]
  },
  {
    category: 'Front-End',
    subcategory: '',
    title: 'New Framework',
    text: 'You’ve never used it before, but it sounds like it could be a lot better than what you’ve been using. Answer the question to score bonus front-end points. If you’re wrong, then you have to roll back and break some things in the process.',
    success: [
      {
        funding: 0,
        fep: 5,
        bep: 0,
        bugs: 0,
        special: 0
      }
    ],
    failure: [
      {
        funding: 0,
        fep: 0,
        bep: 0,
        bugs: 3,
        special: 0
      }
    ]
  },
  {
    category: 'Front-End',
    subcategory: '',
    title: 'Refresher Course',
    text: 'You decide to brush up on your skills. Answer the question and it more than pays for itself: score some bonus front-end points. If you’re wrong, that’s money down the drain.',
    success: [
      {
        funding: 0,
        fep: 2,
        bep: 0,
        bugs: 0,
        special: 0
      }
    ],
    failure: [
      {
        funding: -2,
        fep: 0,
        bep: 0,
        bugs: 0,
        special: 0
      }
    ]
  },
  {
    category: 'Front-End',
    subcategory: '',
    title: 'Midnight Inspiration',
    text: 'You wake up realizing exactly why that thing has been doing that thing. Answer the question to squash a major bug. If you’re wrong, it was all just a dream...',
    success: [
      {
        funding: 0,
        fep: 0,
        bep: 0,
        bugs: -3,
        special: 0
      }
    ],
    failure: [
      {
        funding: 0,
        fep: 0,
        bep: 0,
        bugs: 0,
        special: 0
      }
    ]
  },
  {
    category: 'Back-End',
    subcategory: '',
    title: 'Crunch Time',
    text: 'Time to buckle down and hammer out some server code. Answer the question to score bonus back-end points. If you’re wrong, you just created more bugs.',
    success: [
      {
        funding: 0,
        fep: 0,
        bep: 3,
        bugs: 0,
        special: 0
      }
    ],
    failure: [
      {
        funding: 0,
        fep: 0,
        bep: 0,
        bugs: 3,
        special: 0
      }
    ]
  },
  {
    category: 'Back-End',
    subcategory: '',
    title: 'Bug Hunt',
    text: 'You got your team together for a sprint towards solving some of those lingering issues. Answer the question to take a big chunk out of your bug backlog. No effect if you’re wrong.',
    success: [
      {
        funding: 0,
        fep: 0,
        bep: 0,
        bugs: -5,
        special: 0
      }
    ],
    failure: [
      {
        funding: 0,
        fep: 0,
        bep: 0,
        bugs: 0,
        special: 0
      }
    ]
  },
  {
    category: 'Back-End',
    subcategory: '',
    title: 'New Library Version',
    text: 'This could really help out with your database efficiency, if you can get it working. Answer the question for bonus back-end and bug reduction. If you’re wrong, you just break things.',
    success: [
      {
        funding: 0,
        fep: 0,
        bep: 2,
        bugs: -2,
        special: 0
      }
    ],
    failure: [
      {
        funding: 0,
        fep: 0,
        bep: -1,
        bugs: 1,
        special: 0
      }
    ]
  },
  {
    category: 'Back-end',
    subcategory: '',
    title: 'Database Refactor',
    text: 'It’s time to reorganize things to better suit your most recent needs. Answer the question to score some bonus back-end points. If you’re wrong, you still made some progress but you broke your front-end API integration along the way.',
    success: [
      {
        funding: 0,
        fep: 0,
        bep: 3,
        bugs: 0,
        special: 0
      }
    ],
    failure: [
      {
        funding: 0,
        fep: -1,
        bep: 1,
        bugs: 0,
        special: 0
      }
    ]
  },
  {
    category: 'Back-end',
    subcategory: '',
    title: 'Temporary Contract',
    text: 'A major company needs some extra hands for an upcoming release. Answer the question to score bonus funding. No effect if you mess up.',
    success: [
      {
        funding: 3,
        fep: 0,
        bep: 0,
        bugs: 0,
        special: 0
      }
    ],
    failure: [
      {
        funding: 0,
        fep: 0,
        bep: 0,
        bugs: 0,
        special: 0
      }
    ]
  },
  {
    category: 'Back-end',
    subcategory: '',
    title: 'Team Retreat',
    text: 'You decide to take the team on a weekend trip for some rope courses and escape rooms. Answer the question and score some big back-end points. No bonus if you’re wrong, but it’ll cost you either way.',
    success: [
      {
        funding: -1,
        fep: 0,
        bep: 5,
        bugs: 0,
        special: 0
      }
    ],
    failure: [
      {
        funding: -1,
        fep: 0,
        bep: 0,
        bugs: 0,
        special: 0
      }
    ]
  }
];

db.Question.deleteMany({})
  .then(() => db.Question.collection.insertMany(questionSeed))
  .then(data => {
    console.log(data.result.n + ' records inserted!');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

db.Card.deleteMany({})
  .then(() => db.Card.collection.insertMany(cardSeed))
  .then(data => {
    console.log(data.result.n + ' records inserted!');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
