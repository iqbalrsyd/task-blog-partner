'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useHouseholdStore } from '@/lib/stores';
import { useHouseholdCollection } from '@/lib/household-realtime';
import type { Mood } from '@/lib/types';

type Partner = 'Iqbal' | 'Mufti';
type MoodKey = Mood['mood'];

const moodConfig: Record<
	MoodKey,
	{
		label: string;
		emoji: string;
		caption: string;
		bg: string;
		border: string;
	}
> = {
	happy: {
		label: 'Happy',
		emoji: '😊',
		caption: 'Soft and sunny',
		bg: 'from-amber-50 to-amber-100',
		border: 'border-amber-200'
	},
	tired: {
		label: 'Tired',
		emoji: '😌',
		caption: 'A slower pace',
		bg: 'from-slate-50 to-slate-100',
		border: 'border-slate-200'
	},
	productive: {
		label: 'Productive',
		emoji: '⚡',
		caption: 'Getting things done',
		bg: 'from-emerald-50 to-emerald-100',
		border: 'border-emerald-200'
	},
	sleepy: {
		label: 'Sleepy',
		emoji: '😴',
		caption: 'Quiet and cozy',
		bg: 'from-indigo-50 to-indigo-100',
		border: 'border-indigo-200'
	},
	stressed: {
		label: 'Stressed',
		emoji: '🌧️',
		caption: 'Needs extra care',
		bg: 'from-rose-50 to-rose-100',
		border: 'border-rose-200'
	}
};

const moodOptions: MoodKey[] = ['happy', 'tired', 'productive', 'sleepy', 'stressed'];

const initialMoods: Record<Partner, MoodKey> = {
	Iqbal: 'happy',
	Mufti: 'productive'
};

function getSharedMood(moods: Record<Partner, MoodKey>) {
	const values = Object.values(moods);

	if (values.includes('stressed')) {
		return {
			emoji: '🫶',
			label: 'Take it slow',
			description: 'Gentle support mode for today.',
			badge: 'soft support'
		};
	}

	if (values.includes('sleepy') || values.includes('tired')) {
		return {
			emoji: '🌙',
			label: 'Quiet and cozy',
			description: 'Low-key energy, lots of care.',
			badge: 'rest mode'
		};
	}

	if (values.every((value) => value === 'happy' || value === 'productive')) {
		return {
			emoji: '✨',
			label: 'Bright and buzzing',
			description: 'Lovely shared momentum.',
			badge: 'good flow'
		};
	}

	return {
		emoji: '🍵',
		label: 'Steady and warm',
		description: 'A calm little rhythm.',
		badge: 'calm flow'
	};
}

export default function MoodTracker() {
	const householdId = useHouseholdStore((state) => state.householdId);
	const { data: remoteMoods } = useHouseholdCollection<Mood>('moods');
	const [moods, setMoods] = useState<Record<Partner, MoodKey>>(initialMoods);
	const [hydrated, setHydrated] = useState(false);

	useEffect(() => {
		if (remoteMoods.length > 0) {
			const latest: Record<Partner, MoodKey> = { ...initialMoods };

			['Iqbal', 'Mufti'].forEach((partner) => {
				const records = remoteMoods
					.filter((entry) => entry.partner === partner)
					.sort((a, b) => a.timestamp.localeCompare(b.timestamp));

				if (records.length > 0) {
					latest[partner as Partner] = records[records.length - 1].mood;
				}
			});

			setMoods(latest);
		}

		setHydrated(true);
	}, [remoteMoods]);

	const sharedMood = useMemo(() => getSharedMood(moods), [moods]);

	const updateMood = async (partner: Partner, mood: MoodKey) => {
		setMoods((prev) => ({ ...prev, [partner]: mood }));

		if (!householdId) return;

		const now = new Date().toISOString();
		await addDoc(collection(db, 'moods'), {
			id: crypto.randomUUID(),
			householdId,
			partner,
			mood,
			date: new Date().toISOString().slice(0, 10),
			timestamp: now,
			createdAt: now,
			updatedAt: now
		});
	};

	if (!hydrated) return null;

	return (
		<section className="mx-auto mb-8 max-w-2xl px-4">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="shadow-soft-lg overflow-hidden rounded-[28px] bg-white"
			>
				<div className="from-mochi-beige to-mochi-cream bg-gradient-to-r via-white px-5 py-5 sm:px-6">
					<div className="flex items-start justify-between gap-4">
						<div>
							<p className="text-mochi-brown/70 text-[11px] uppercase tracking-[0.3em]">
								Mood Today
							</p>
							<h2 className="mt-2 text-2xl font-bold">Household feelings</h2>
							<p className="mt-1 text-sm text-gray-600">
								Pick a mood for each of you. Keep it soft and honest.
							</p>
						</div>
						<motion.div
							animate={{ y: [0, -6, 0] }}
							transition={{ duration: 3, repeat: Infinity }}
							className="shadow-soft flex h-16 w-16 items-center justify-center rounded-3xl bg-white/80 text-3xl"
						>
							{sharedMood.emoji}
						</motion.div>
					</div>

					<div className="mt-4 flex flex-wrap gap-2">
						<span className="shadow-soft rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-gray-600">
							Shared vibe: {sharedMood.label}
						</span>
						<span className="shadow-soft rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-gray-600">
							{sharedMood.badge}
						</span>
					</div>
				</div>

				<div className="grid gap-4 p-5 sm:p-6 md:grid-cols-2">
					{(['Iqbal', 'Mufti'] as const).map((partner) => {
						const currentMood = moods[partner];
						const activeConfig = moodConfig[currentMood];

						return (
							<motion.div
								key={partner}
								whileHover={{ y: -2 }}
								className={`rounded-3xl border ${activeConfig.border} bg-gradient-to-br ${activeConfig.bg} p-4`}
							>
								<div className="flex items-start justify-between gap-3">
									<div>
										<p className="text-sm font-medium text-gray-500">{partner}</p>
										<h3 className="mt-1 text-xl font-bold">{activeConfig.label}</h3>
										<p className="mt-1 text-sm text-gray-600">{activeConfig.caption}</p>
									</div>
									<motion.div
										animate={{ scale: [1, 1.08, 1] }}
										transition={{ duration: 2.4, repeat: Infinity }}
										className="text-4xl"
									>
										{activeConfig.emoji}
									</motion.div>
								</div>

								<div className="mt-4 flex flex-wrap gap-2">
									{moodOptions.map((mood) => {
										const option = moodConfig[mood];
										const isActive = currentMood === mood;

										return (
											<button
												key={mood}
												type="button"
												onClick={() => void updateMood(partner, mood)}
												className={`rounded-full px-3 py-2 text-xs font-medium transition-all ${
													isActive
														? 'bg-mochi-brown shadow-soft text-white'
														: 'bg-white/80 text-gray-600 hover:bg-white'
												}`}
											>
												{option.emoji} {option.label}
											</button>
										);
									})}
								</div>
							</motion.div>
						);
					})}
				</div>

				<div className="bg-mochi-cream/50 border-t border-gray-100 px-5 py-4 sm:px-6">
					<div className="flex items-center justify-between gap-3">
						<div>
							<p className="text-sm font-medium text-gray-500">Shared household vibe</p>
							<p className="mt-1 font-semibold text-gray-900">{sharedMood.label}</p>
							<p className="text-sm text-gray-600">{sharedMood.description}</p>
						</div>
						<div className="shadow-soft rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700">
							{sharedMood.emoji} {sharedMood.badge}
						</div>
					</div>
				</div>
			</motion.div>
		</section>
	);
}
