'use client';

import { getMessaging, getToken, isSupported, onMessage } from 'firebase/messaging';
import { firebaseApp } from './firebase';

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || '';

export async function initializeNotifications() {
	if (!(await isSupported())) return { supported: false, token: null };

	const messaging = getMessaging(firebaseApp);
	if (!('serviceWorker' in navigator)) {
		return { supported: true, token: null, error: 'service-worker-missing' as const };
	}

	const registration = await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js');
	if (!registration) {
		try {
			await navigator.serviceWorker.register('/firebase-messaging-sw.js');
		} catch (error) {
			console.error('Failed to register service worker', error);
			return { supported: true, token: null, error: 'service-worker-registration-failed' as const };
		}
	}

	const permission = await Notification.requestPermission();
	if (permission !== 'granted') {
		return { supported: true, token: null, error: 'permission-denied' as const };
	}

	try {
		const token = await getToken(messaging, {
			vapidKey: VAPID_KEY,
			serviceWorkerRegistration:
				registration ||
				(await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js')) ||
				undefined
		});

		return { supported: true, token };
	} catch (error) {
		console.error('Failed to create push subscription', error);
		return { supported: true, token: null, error: 'subscription-failed' as const };
	}
}

export async function listenForNotifications(onMessageHandler: (payload: unknown) => void) {
	if (!(await isSupported())) return null;
	const messaging = getMessaging(firebaseApp);
	return onMessage(messaging, onMessageHandler);
}
