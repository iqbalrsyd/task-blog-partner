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
const batchSize = 400;

async function updateCollection(collectionName, fieldName) {
	const snapshot = await db.collection(collectionName).where(fieldName, '==', 'Partner').get();
	if (snapshot.empty) return 0;

	let count = 0;
	let batch = db.batch();
	let batchCount = 0;

	for (const doc of snapshot.docs) {
		batch.update(doc.ref, { [fieldName]: 'Mufti', updatedAt: new Date().toISOString() });
		count += 1;
		batchCount += 1;

		if (batchCount >= batchSize) {
			await batch.commit();
			batch = db.batch();
			batchCount = 0;
		}
	}

	if (batchCount > 0) {
		await batch.commit();
	}

	return count;
}

async function migrate() {
	const results = await Promise.all([
		updateCollection('tasks', 'assignedTo'),
		updateCollection('moods', 'partner'),
		updateCollection('notes', 'author')
	]);

	const total = results.reduce((sum, value) => sum + value, 0);
	console.log(`Migration complete. Updated ${total} document fields.`);
}

migrate().catch((error) => {
	console.error(error);
	process.exit(1);
});
