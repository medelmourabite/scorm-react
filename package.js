var scopackager = require('simple-scorm-packager');

scopackager(
  {
    version: '1.2',
    organization: 'Test Company',
    title: 'Test Course - 1.2',
    language: 'fr-FR',
    identifier: '00',
    masteryScore: 80,
    startingPage: 'index.html',
    source: './build',
    package: {
      version: '0.0.2',
      zip: false,
      outputFolder: './scormPackages',
    },
  },
  function (msg) {
    console.log(msg);
  }
);
