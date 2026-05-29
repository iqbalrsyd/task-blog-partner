/* eslint-disable no-restricted-globals */
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

firebase.initializeApp({
	apiKey: self.FIREBASE_API_KEY || 'AIzaSyDemoKey',
	authDomain: self.FIREBASE_AUTH_DOMAIN || 'mochi-house.firebaseapp.com',
	projectId: self.FIREBASE_PROJECT_ID || 'mochi-house',
	storageBucket: self.FIREBASE_STORAGE_BUCKET || 'mochi-house.appspot.com',
	messagingSenderId: self.FIREBASE_MESSAGING_SENDER_ID || '123456789',
	appId: self.FIREBASE_APP_ID || '1:123456789:web:abcdef123456'
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
	self.registration.showNotification(payload?.notification?.title || 'Mochi House', {
		body: payload?.notification?.body || 'You have a gentle reminder',
		icon: '/favicon.ico'
	});
});
