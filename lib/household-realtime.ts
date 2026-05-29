'use client';

import { useMemo } from 'react';
import { where, DocumentData } from 'firebase/firestore';
import { useFirestoreCollection } from './firestore-hooks';
import { useHouseholdStore } from './stores';

export function useHouseholdCollection<T extends DocumentData>(collectionName: string) {
	const householdId = useHouseholdStore((state) => state.householdId);

	const constraints = useMemo(() => {
		return householdId ? [where('householdId', '==', householdId)] : undefined;
	}, [householdId]);

	const queryState = useFirestoreCollection<T>(collectionName, constraints);

	return {
		...queryState,
		householdId
	};
}
