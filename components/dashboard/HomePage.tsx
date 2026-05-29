'use client';

import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { useTheme } from '@/lib/theme-context';
import { Clock } from 'lucide-react';
import { useHouseholdCollection } from '@/lib/household-realtime';
import type { CatLog, Mood, Note, Task } from '@/lib/types';

export default function HomePage() {
	const { timeOfDay } = useTheme();
	const { data: tasks } = useHouseholdCollection<Task>('tasks');
	const { data: moods } = useHouseholdCollection<Mood>('moods');
	const { data: notes } = useHouseholdCollection<Note>('notes');
	const { data: catLogs } = useHouseholdCollection<CatLog>('cat_logs');

	const greeting = {
		morning: 'Good morning! ☀️',
		afternoon: 'Good afternoon! 🌤️',
		evening: 'Good evening! 🌅',
		night: 'Good night! 🌙'
	}[timeOfDay];

	const latestMood = (partner: 'Iqbal' | 'Mufti') => {
		const partnerMoods = moods.filter((entry) => entry.partner === partner);
		if (partnerMoods.length === 0) return 'happy';
		return (
			partnerMoods.sort((a, b) => a.timestamp.localeCompare(b.timestamp)).at(-1)?.mood || 'happy'
		);
	};

	const sharedMood = (() => {
		const values = [latestMood('Iqbal'), latestMood('Mufti')];
		if (values.includes('stressed'))
			return { emoji: '🫶', label: 'Take it slow', description: 'Gentle support mode today.' };
		if (values.includes('sleepy') || values.includes('tired'))
			return { emoji: '🌙', label: 'Quiet and cozy', description: 'Low-key energy, lots of care.' };
		if (values.every((value) => value === 'happy' || value === 'productive'))
			return {
				emoji: '✨',
				label: 'Bright and buzzing',
				description: 'Lovely shared momentum today.'
			};
		return { emoji: '🍵', label: 'Steady and warm', description: 'A calm little rhythm.' };
	})();

	const liveTasks = tasks.slice(0, 3);
	const liveNotes = notes.slice(0, 2);
	const latestCatLog = catLogs[0];
	const primaryNote = liveNotes[0];
	const secondaryNote = liveNotes[1];
	const latestMeal = catLogs.find((log) => log.type === 'feeding');

	return (
		<main className="from-mochi-cream/90 to-mochi-beige/90 min-h-screen bg-gradient-to-b via-white/95 px-4 pb-28 pt-6">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className="mx-auto max-w-2xl"
			>
				<div className="mb-8 flex items-start justify-between">
					<div>
						<h1 className="mb-2 text-4xl font-bold">{greeting}</h1>
						<p className="text-gray-600">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
					</div>
					<motion.div
						animate={{ y: [0, -6, 0] }}
						transition={{ duration: 3, repeat: Infinity }}
						className="text-5xl"
					>
						🐱
					</motion.div>
				</div>
			</motion.div>

			{/* Shared Mood */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.15 }}
				className="mx-auto mb-8 max-w-2xl"
			>
				<div className="shadow-soft-lg rounded-[28px] bg-white/95 p-5 ring-1 ring-black/5">
					<div className="flex items-start justify-between gap-4">
						<div>
							<p className="text-mochi-brown/60 text-[11px] uppercase tracking-[0.3em]">
								Mood Today
							</p>
							<h2 className="mt-2 text-2xl font-bold">{sharedMood.label}</h2>
							<p className="mt-1 text-sm text-gray-600">{sharedMood.description}</p>
						</div>
						<div className="bg-mochi-brown text-mochi-cream shadow-soft flex h-14 w-14 items-center justify-center rounded-3xl text-3xl">
							{sharedMood.emoji}
						</div>
					</div>
				</div>
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.18 }}
				className="mx-auto mb-8 max-w-2xl"
			>
				<div className="shadow-soft-lg rounded-[28px] border border-black/5 bg-white/95 p-5">
					<div className="flex items-start justify-between gap-4">
						<div>
							<p className="text-mochi-brown/60 text-[11px] uppercase tracking-[0.3em]">
								Puing status
							</p>
							<h2 className="mt-2 text-2xl font-bold">Last time I ate</h2>
							<p className="mt-1 text-sm text-gray-600">
								{latestMeal
									? format(new Date(latestMeal.timestamp), 'PPP p')
									: 'No feeding log yet'}
							</p>
						</div>
						<div className="bg-mochi-brown text-mochi-cream shadow-soft flex h-12 w-12 items-center justify-center rounded-2xl text-2xl">
							🍽️
						</div>
					</div>
				</div>
			</motion.div>

			{/* Mood Cards */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
				className="mx-auto mb-8 grid max-w-2xl grid-cols-2 gap-4"
			>
				{(['Iqbal', 'Mufti'] as const).map((person) => {
					const mood = latestMood(person);
					return (
						<div
							key={person}
							className="shadow-soft-lg rounded-3xl bg-white/95 p-6 ring-1 ring-black/5"
						>
							<p className="mb-3 text-sm font-medium text-gray-600">{person}</p>
							<div className="flex items-center gap-3">
								<span className="text-3xl">
									{mood === 'happy' && '😊'}
									{mood === 'tired' && '😴'}
									{mood === 'productive' && '⚡'}
									{mood === 'sleepy' && '😪'}
									{mood === 'stressed' && '😰'}
								</span>
								<p className="font-semibold capitalize">{mood}</p>
							</div>
						</div>
					);
				})}
			</motion.div>

			{/* Today's Overview */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
				className="mx-auto mb-8 max-w-2xl"
			>
				<h2 className="mb-4 text-2xl font-bold">Today&apos;s Tasks</h2>
				<div className="space-y-3">
					{liveTasks.map((task) => (
						<motion.div
							key={task.id}
							whileHover={{ scale: 1.02 }}
							className="shadow-soft-lg hover:shadow-soft-xl flex items-center justify-between rounded-2xl bg-white p-4 transition-shadow"
						>
							<div className="flex flex-1 items-center gap-4">
								<div
									className={`border-mochi-brown h-5 w-5 rounded-full border-2 ${
										task.completed ? 'bg-mochi-sage' : 'bg-transparent'
									}`}
								/>
								<div>
									<p
										className={`font-medium ${task.completed ? 'text-gray-400 line-through' : ''}`}
									>
										{task.title}
									</p>
									<p className="text-sm text-gray-500">{task.assignedTo}</p>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<Clock size={16} className="text-gray-400" />
								<p className="text-sm text-gray-600">{task.dueTime}</p>
							</div>
						</motion.div>
					))}
				</div>
			</motion.div>

			{/* Cat Status Card */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
				className="mx-auto max-w-2xl"
			>
				<div className="from-mochi-warm to-mochi-sage shadow-soft-lg mb-8 rounded-3xl bg-gradient-to-br p-8 text-white">
					<div className="mb-6 flex items-start justify-between">
						<div>
							<h3 className="mb-2 text-2xl font-bold">Puing&apos;s Status</h3>
							<p className="opacity-90">
								{latestMeal
									? `Last time I ate: ${format(new Date(latestMeal.timestamp), 'PPP p')}`
									: 'No feeding log yet'}
							</p>
						</div>
						<span className="text-5xl">🐱</span>
					</div>
					<div className="grid grid-cols-3 gap-4">
						<div className="rounded-2xl bg-white/20 p-4 backdrop-blur">
							<p className="mb-2 text-sm opacity-80">Fed</p>
							<p className="text-lg font-bold">✅ 08:00 AM</p>
						</div>
						<div className="rounded-2xl bg-white/20 p-4 backdrop-blur">
							<p className="mb-2 text-sm opacity-80">Water</p>
							<p className="text-lg font-bold">✅ 10:00 AM</p>
						</div>
						<div className="rounded-2xl bg-white/20 p-4 backdrop-blur">
							<p className="mb-2 text-sm opacity-80">Play</p>
							<p className="text-lg font-bold">❌ Later</p>
						</div>
					</div>
				</div>
			</motion.div>

			{/* Quick Notes */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4 }}
				className="mx-auto max-w-2xl"
			>
				<h2 className="mb-4 text-2xl font-bold">Quick Notes</h2>
				<div className="space-y-3">
					<div className="rounded-2xl border border-yellow-200 bg-yellow-100/50 p-4">
						<p className="text-sm text-gray-700">
							{primaryNote ? `${primaryNote.content} - ${primaryNote.author}` : 'No notes yet'}
						</p>
					</div>
					<div className="rounded-2xl border border-pink-200 bg-pink-100/50 p-4">
						<p className="text-sm text-gray-700">
							{secondaryNote
								? `${secondaryNote.content} - ${secondaryNote.author}`
								: 'Leave a sweet note'}
						</p>
					</div>
				</div>
			</motion.div>
		</main>
	);
}
