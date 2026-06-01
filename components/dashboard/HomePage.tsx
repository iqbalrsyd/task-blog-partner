'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useHouseholdStore } from '@/lib/stores';
import { useTheme } from '@/lib/theme-context';
import { Clock } from 'lucide-react';
import { useHouseholdCollection } from '@/lib/household-realtime';
import type { Mood, Note, Task } from '@/lib/types';

type HomePageProps = {
	onOpenNotes: () => void;
};

export default function HomePage({ onOpenNotes }: HomePageProps) {
	const householdId = useHouseholdStore((state) => state.householdId);
	const { timeOfDay } = useTheme();
	const { data: tasks } = useHouseholdCollection<Task>('tasks');
	const { data: moods } = useHouseholdCollection<Mood>('moods');
	const { data: notes } = useHouseholdCollection<Note>('notes');
	const [homeTasks, setHomeTasks] = useState<Task[]>([]);

	useEffect(() => {
		setHomeTasks(tasks);
	}, [tasks]);

	const greeting = {
		morning: 'Good morning! ☀️',
		afternoon: 'Good afternoon! 🌤️',
		evening: 'Good evening! 🌅',
		night: 'Good night! 🌙'
	}[timeOfDay];

	const latestMood = (partner: 'Iqbal' | 'Mufti' | 'Puing') => {
		const partnerMoods = moods.filter((entry) => entry.partner === partner);
		if (partnerMoods.length === 0) return 'happy';
		return (
			partnerMoods.sort((a, b) => a.timestamp.localeCompare(b.timestamp)).at(-1)?.mood || 'happy'
		);
	};

	const sharedMood = (() => {
		const values = [latestMood('Iqbal'), latestMood('Mufti'), latestMood('Puing')];
		if (values.includes('stressed'))
			return { emoji: '🫶', label: 'Take it slow', description: 'Gentle support mode today.' };
		if (values.includes('hungry'))
			return { emoji: '🍽️', label: 'Snack break', description: 'A little food and a lot of love.' };
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

	const toggleHomeTask = async (task: Task) => {
		setHomeTasks((prev) =>
			prev.map((entry) =>
				entry.id === task.id ? { ...entry, completed: !entry.completed } : entry
			)
		);

		if (!householdId) return;

		await updateDoc(doc(db, 'tasks', task.id), {
			completed: !task.completed,
			updatedAt: new Date().toISOString()
		});
	};

	const liveTasks = homeTasks.slice(0, 3);
	const liveNotes = notes.slice(0, 2);
	const todaysTasks = homeTasks.filter((task) => task.dueDate === 'today');
	const completedToday = todaysTasks.filter((task) => task.completed).length;
	const pendingToday = todaysTasks.filter((task) => !task.completed).length;
	const highPriorityToday = todaysTasks.filter((task) => task.priority === 'high').length;
	const catPhotoTemplate = (
		<div className="shadow-soft flex h-16 w-16 items-center justify-center overflow-hidden rounded-[20px] border border-dashed border-white/60 bg-white/20 text-center backdrop-blur-sm">
			<div className="px-2 text-[10px] font-semibold uppercase leading-tight tracking-[0.2em] text-white/90">
				Cat photo template
			</div>
		</div>
	);

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
						className="flex items-center justify-center"
					>
						{catPhotoTemplate}
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

			{/* Mood Cards */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
				className="mx-auto mb-8 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3"
			>
				{(['Iqbal', 'Mufti', 'Puing'] as const).map((person) => {
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
									{mood === 'hungry' && '🍽️'}
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

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.18 }}
				className="mx-auto mb-8 max-w-2xl"
			>
				<div className="shadow-soft-lg rounded-[28px] bg-white/95 p-5 ring-1 ring-black/5">
					<div className="flex items-start justify-between gap-4">
						<div>
							<p className="text-mochi-brown/60 text-[11px] uppercase tracking-[0.3em]">Task stats</p>
							<h2 className="mt-2 text-2xl font-bold">Today&apos;s progress</h2>
							<p className="mt-1 text-sm text-gray-600">A quick snapshot of tasks due today.</p>
						</div>
						<div className="rounded-full bg-mochi-cream px-4 py-2 text-sm font-semibold text-gray-700">
							{completedToday}/{todaysTasks.length || 0} done
						</div>
					</div>
					<div className="mt-4 grid grid-cols-3 gap-3">
						{[
							{ label: 'Due today', value: todaysTasks.length },
							{ label: 'Completed', value: completedToday },
							{ label: 'Pending', value: pendingToday },
							{ label: 'High priority', value: highPriorityToday }
						].map((item) => (
							<div key={item.label} className="rounded-2xl bg-mochi-cream/70 p-3 text-center">
								<p className="text-xs text-gray-500">{item.label}</p>
								<p className="text-xl font-bold text-mochi-brown">{item.value}</p>
							</div>
						))}
					</div>
				</div>
			</motion.div>

			{/* Today's Overview */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.24 }}
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
								<motion.button
									type="button"
									onClick={() => void toggleHomeTask(task)}
									whileTap={{ scale: 0.92 }}
									className="flex-shrink-0"
								>
									<div
										className={`border-mochi-brown flex h-5 w-5 items-center justify-center rounded-full border-2 ${
											task.completed ? 'bg-mochi-sage' : 'bg-transparent'
										}`}
									>
										{task.completed && <span className="text-[11px] text-white">✓</span>}
									</div>
								</motion.button>
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



			{/* Quick Notes */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4 }}
				className="mx-auto max-w-2xl"
			>
				<h2 className="mb-4 text-2xl font-bold">Quick Notes</h2>
				<div className="space-y-3">
					{liveNotes.length > 0 && (
						<div className="grid gap-3">
								{liveNotes.map((note) => {
								const isIqbal = note.author === 'Iqbal';
								const isMufti = note.author === 'Mufti';
								return (
									<div
										key={note.id}
										className={`rounded-2xl border p-4 ${
											isIqbal
												? 'border-blue-200 bg-blue-100/60'
												: isMufti
													? 'border-pink-200 bg-pink-100/60'
													: 'border-green-200 bg-green-100/60'
										}`}
									>
										<div className="flex items-start justify-between gap-3">
											<p className="text-sm text-gray-700">{note.content}</p>
											<div className="text-right">
												<p className="text-xs font-semibold text-gray-600">{note.author}</p>
												<p className="mt-1 text-[11px] text-gray-500">
													{note.noteTime ?? format(new Date(note.createdAt), 'p')}
												</p>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					)}
					<button
						onClick={onOpenNotes}
						className="shadow-soft-lg hover:shadow-soft-xl w-full rounded-2xl border border-dashed border-mochi-brown/20 bg-white/80 p-4 text-left transition-shadow"
					>
						<p className="font-semibold text-gray-900">Leave a sweet note</p>
						<p className="mt-1 text-sm text-gray-600">Go straight to the notes page.</p>
					</button>
				</div>
			</motion.div>
		</main>
	);
}
