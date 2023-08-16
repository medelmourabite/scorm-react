var scopackager = require('simple-scorm-packager');

scopackager(
  {
    version: '1.2',
    organization: 'Test Company',
    title: 'Child Course - 1.2',
    language: 'en-US',
    identifier: '00',
    masteryScore: 80,
    startingPage: 'index.html',
    source: './build',
    package: {
      version: '0.0.4',
      zip: true,
      outputFolder: './scormPackages',
    },
  },
  function (msg) {
    console.log(msg);
  }
);
