'use client';

import { useEffect, useState } from 'react';
import { useHouseholdStore } from '@/lib/stores';
import PINAuthPage from '@/components/auth/PINAuth';
import Dashboard from '@/components/dashboard/Dashboard';

export default function Home() {
	const [hydrated, setHydrated] = useState(false);
	const isAuthenticated = useHouseholdStore((state) => state.isAuthenticated);

	useEffect(() => {
		setHydrated(true);
	}, []);

	if (!hydrated) {
		return (
			<div className="from-mochi-cream to-mochi-beige flex min-h-screen items-center justify-center bg-gradient-to-br via-white">
				<div className="animate-pulse text-4xl">🏠</div>
			</div>
		);
	}

	return isAuthenticated ? <Dashboard /> : <PINAuthPage />;
}
