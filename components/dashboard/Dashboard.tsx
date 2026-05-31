'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/lib/theme-context';
import BottomNav from '@/components/layout/BottomNav';
import TasksPage from '@/components/tasks/TasksPage';
import MoodTracker from '@/components/mood/MoodTracker';
import PuingPage from '@/components/mochi/MochiPage';
import NotesPage from '@/components/notes/NotesPage';
import SettingsPage from '@/components/settings/SettingsPage';
import HomePage from '@/components/dashboard/HomePage';

export default function Dashboard() {
	const [currentPage, setCurrentPage] = useState('home');
	const [hydrated, setHydrated] = useState(false);
	const { timeOfDay } = useTheme();

	useEffect(() => {
		setHydrated(true);
	}, []);

	if (!hydrated) {
		return null;
	}

	const bgGradientMap = {
		morning: 'from-mochi-cream via-white to-mochi-beige',
		afternoon: 'from-white via-mochi-beige to-mochi-warm',
		evening: 'from-mochi-warm via-mochi-beige to-mochi-sage',
		night: 'from-gray-900 via-gray-800 to-gray-900'
	};

	const finalGradient = bgGradientMap[timeOfDay as keyof typeof bgGradientMap];

	return (
		<div className={`min-h-screen bg-gradient-to-br ${finalGradient} transition-all duration-500`}>
			{/* Render current page */}
			{currentPage === 'home' && <HomePage onOpenNotes={() => setCurrentPage('notes')} />}
			{currentPage === 'tasks' && <TasksPage />}
			{currentPage === 'mood' && <MoodTracker />}
			{currentPage === 'mochi' && <PuingPage />}
			{currentPage === 'notes' && <NotesPage />}
			{currentPage === 'settings' && <SettingsPage />}

			{/* Bottom Navigation */}
			<BottomNav currentPage={currentPage} setCurrentPage={setCurrentPage} />
		</div>
	);
}
