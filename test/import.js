const firestoreService = require('firestore-export-import');
const serviceAccount = require('./localproduce-1-firebase-adminsdk-w90vg-3f49ebeadb.json');

const databaseURL = 'https://localproduce-1.firebaseio.com';

firestoreService.initializeApp(serviceAccount, databaseURL);

firestoreService.restore('./data/new.json');
