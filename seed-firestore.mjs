import admin from 'firebase-admin';
import fs from 'fs';

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './service-account.json';

if (!fs.existsSync(serviceAccountPath)) {
	console.log(
		'Missing service account JSON. Add FIREBASE_SERVICE_ACCOUNT_PATH or ./service-account.json'
	);
	process.exit(0);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

if (!admin.apps.length) {
	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount)
	});
}

const db = admin.firestore();
const householdId = 'demo-household-001';
const now = new Date().toISOString();

const seed = async () => {
	await db
		.collection('household')
		.doc(householdId)
		.set({
			id: householdId,
			pin: '1234',
			createdAt: now,
			updatedAt: now,
			members: [
				{ name: 'Iqbal', role: 'Partner' },
				{ name: 'Mufti', role: 'Partner' }
			]
		});

	const batch = db.batch();
	const collections = {
		tasks: [
			{
				title: 'Laundry',
				assignedTo: 'Iqbal',
				dueTime: '14:00',
				dueDate: 'today',
				priority: 'high'
			},
			{
				title: 'Feed Puing',
				assignedTo: 'Mufti',
				dueTime: '19:00',
				dueDate: 'today',
				priority: 'high'
			},
			{
				title: 'Grocery Shopping',
				assignedTo: 'Iqbal',
				dueTime: '16:00',
				dueDate: 'tomorrow',
				priority: 'medium'
			}
		],
		notes: [
			{ content: "Don't forget snacks for Mochi 😾", author: 'Iqbal' },
			{ content: 'Good luck with your meeting ❤️', author: 'Mufti' }
		],
		moods: [
			{ partner: 'Iqbal', mood: 'happy' },
			{ partner: 'Mufti', mood: 'productive' }
		],
		cat_logs: [
			{
				type: 'feeding',
				description: 'Fed Mochi with premium cat food',
				timestamp: '08:00 AM Today'
			},
			{ type: 'water', description: 'Fresh water bowl filled', timestamp: '10:30 AM Today' }
		]
	};

	for (const [collectionName, items] of Object.entries(collections)) {
		for (const item of items) {
			const docRef = db.collection(collectionName).doc();
			const id = docRef.id;
			batch.set(docRef, {
				id,
				householdId,
				...item,
				createdAt: now,
				updatedAt: now
			});
		}
	}

	await batch.commit();
	console.log('Seeded Mochi House Firestore data.');
};

seed().catch((error) => {
	console.error(error);
	process.exit(1);
});
