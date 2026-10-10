importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
firebase.initializeApp({
  apiKey: 'AIzaSyBOdxp-VRbYR6qnB1S_-7AbC-loUGwuM_A',
  authDomain: 'familee-a676c.firebaseapp.com',
  projectId: 'familee-a676c',
  storageBucket: 'familee-a676c.firebasestorage.app',
  messagingSenderId: '829984620525',
  appId: '1:829984620525:web:c5dbc65fb84ae80159b1e4'
});
firebase.messaging();
