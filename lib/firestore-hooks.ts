import { useEffect, useState } from 'react';
import {
	collection,
	onSnapshot,
	query,
	where,
	Query,
	DocumentData,
	QueryConstraint
} from 'firebase/firestore';
import { db } from './firebase';

export function useFirestoreCollection<T extends DocumentData>(
	collectionName: string,
	constraints?: QueryConstraint[]
) {
	const [data, setData] = useState<T[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		try {
			const ref = collection(db, collectionName);
			const q = constraints && constraints.length > 0 ? query(ref, ...constraints) : ref;

			const unsubscribe = onSnapshot(
				q as Query<DocumentData>,
				(snapshot) => {
					const docs = snapshot.docs.map(
						(doc) =>
							({
								...doc.data(),
								id: doc.id
							}) as unknown as T
					);
					setData(docs);
					setLoading(false);
				},
				(err) => {
					setError(err);
					setLoading(false);
				}
			);

			return () => unsubscribe();
		} catch (err) {
			setError(err instanceof Error ? err : new Error('Unknown error'));
			setLoading(false);
		}
	}, [collectionName, constraints]);

	return { data, loading, error };
}

export function useFirestoreDoc<T extends DocumentData>(
	collectionName: string,
	docId: string | null
) {
	const [data, setData] = useState<T | null>(null);
	const [loading, setLoading] = useState(!!docId);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		if (!docId) {
			setLoading(false);
			return;
		}

		try {
			const ref = collection(db, collectionName);
			const q = query(ref, where('__name__', '==', docId));

			const unsubscribe = onSnapshot(
				q,
				(snapshot) => {
					if (snapshot.docs.length > 0) {
						const doc = snapshot.docs[0];
						setData({
							...doc.data(),
							id: doc.id
						} as unknown as T);
					}
					setLoading(false);
				},
				(err) => {
					setError(err);
					setLoading(false);
				}
			);

			return () => unsubscribe();
		} catch (err) {
			setError(err instanceof Error ? err : new Error('Unknown error'));
			setLoading(false);
		}
	}, [collectionName, docId]);

	return { data, loading, error };
}
