'use client';

import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { db } from './firebase';
import type { Household } from './types';

export async function findHouseholdByPin(pin: string): Promise<Household | null> {
	const normalizedPin = pin.trim();
	if (!normalizedPin) return null;

	try {
		const householdQuery = query(
			collection(db, 'household'),
			where('pin', '==', normalizedPin),
			limit(1)
		);
		const snapshot = await getDocs(householdQuery);
		if (snapshot.empty) return null;

		const doc = snapshot.docs[0];
		return {
			id: doc.id,
			...(doc.data() as Omit<Household, 'id'>)
		};
	} catch (error) {
		console.error('Failed to validate household PIN', error);
		return null;
	}
}
