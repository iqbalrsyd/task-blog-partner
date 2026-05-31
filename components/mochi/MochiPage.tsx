'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Plus } from 'lucide-react';
import { addDoc, collection } from 'firebase/firestore';
import { format } from 'date-fns';
import { db } from '@/lib/firebase';
import { useHouseholdStore } from '@/lib/stores';
import { useHouseholdCollection } from '@/lib/household-realtime';
import type { CatLog } from '@/lib/types';

type CareAction = 'feeding' | 'water' | 'poo' | 'play_outside' | 'bath';

const templates: Array<{
	type: CareAction;
	label: string;
	icon: string;
	description: string;
}> = [
	{ type: 'feeding', label: 'Fed', icon: '🍖', description: 'Meal time' },
	{ type: 'water', label: 'Water', icon: '💧', description: 'Fresh water' },
	{ type: 'poo', label: 'Poo', icon: '💩', description: 'Litter box' },
	{ type: 'play_outside', label: 'Play outside', icon: '🌿', description: 'Outdoor play' },
	{ type: 'bath', label: 'Bath', icon: '🛁', description: 'Bath time' },
];

const templateStyles: Record<CareAction, string> = {
	feeding: 'bg-orange-100',
	water: 'bg-sky-100',
	poo: 'bg-amber-100',
	play_outside: 'bg-emerald-100',
	bath: 'bg-pink-100',
};

const mockCatLogs: CatLog[] = [
	{
		id: '1',
		householdId: 'demo-household-001',
		type: 'feeding',
		description: 'Fed Puing',
		timestamp: '2026-05-30T08:00:00.000Z',
		createdAt: '2026-05-30T08:00:00.000Z',
		updatedAt: '2026-05-30T08:00:00.000Z'
	},
	{
		id: '2',
		householdId: 'demo-household-001',
		type: 'water',
		description: 'Fresh water bowl filled',
		timestamp: '2026-05-30T10:30:00.000Z',
		createdAt: '2026-05-30T10:30:00.000Z',
		updatedAt: '2026-05-30T10:30:00.000Z'
	}
];

export default function PuingPage() {
	const householdId = useHouseholdStore((state) => state.householdId);
	const { data: remoteLogs } = useHouseholdCollection<CatLog>('cat_logs');
	const [logs, setLogs] = useState<CatLog[]>(mockCatLogs);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [showPhotoHint, setShowPhotoHint] = useState(false);

	useEffect(() => {
		if (remoteLogs.length > 0) setLogs(remoteLogs);
	}, [remoteLogs]);

	const activeLogs = remoteLogs.length > 0 ? remoteLogs : logs;
	const latestFeed = activeLogs.find((log) => log.type === 'feeding');

	const stats = useMemo(
		() => ({
			fed: activeLogs.filter((log) => log.type === 'feeding').length,
			water: activeLogs.filter((log) => log.type === 'water').length,
			poo: activeLogs.filter((log) => log.type === 'poo').length,
			play: activeLogs.filter((log) => log.type === 'play_outside').length,
			bath: activeLogs.filter((log) => log.type === 'bath').length,
		}),
		[activeLogs]
	);

	const createCareLog = async (type: CareAction) => {
		const now = new Date().toISOString();
		const labels: Record<CareAction, string> = {
			feeding: 'Fed Puing',
			water: 'Fresh water given',
			poo: 'Cleaned the litter box',
			play_outside: 'Played outside with Puing',
			bath: 'Bath time for Puing'
		};

		const payload: CatLog = {
			id: crypto.randomUUID(),
			householdId: householdId || 'demo-household-001',
			type,
			description: labels[type],
			timestamp: now,
			createdAt: now,
			updatedAt: now
		};

		setLogs((prev) => [payload, ...prev]);

		if (householdId) {
			await addDoc(collection(db, 'cat_logs'), payload);
		}
	};

	const handlePhotoFeature = () => {
		setShowPhotoHint(true);
		window.setTimeout(() => setShowPhotoHint(false), 2500);
	};

	return (
		<div className="from-mochi-cream to-mochi-beige min-h-screen bg-gradient-to-br via-white px-4 pb-32 pt-6">
			<div className="mx-auto max-w-2xl">
				<motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mb-12 text-center">
					<div className="mb-4 inline-block text-8xl">🐱</div>
					<h1 className="mb-2 text-4xl font-bold">Puing&apos;s Care</h1>
					<p className="text-gray-600">Track feeding, water, poo, play outside, and bath</p>
				</motion.div>

				<div className="mb-8 grid grid-cols-5 gap-2">
					{([
						{ label: 'Fed', value: stats.fed },
						{ label: 'Water', value: stats.water },
						{ label: 'Poo', value: stats.poo },
						{ label: 'Play', value: stats.play },
						{ label: 'Bath', value: stats.bath }
					]).map((item) => (
						<div key={item.label} className="shadow-soft rounded-2xl bg-white p-3 text-center">
							<p className="text-xs text-gray-500">{item.label}</p>
							<p className="text-lg font-bold text-mochi-brown">{item.value}</p>
						</div>
					))}
				</div>

				<div className="mb-8 grid grid-cols-2 gap-3">
					{templates.map((template) => (
						<motion.button
							key={template.type}
							whileHover={{ scale: 1.03 }}
							whileTap={{ scale: 0.97 }}
							onClick={() => void createCareLog(template.type)}
							className={`${templateStyles[template.type]} rounded-2xl p-4 text-left text-gray-900 transition-shadow hover:shadow-soft-lg`}
						>
							<div className="mb-2 text-2xl">{template.icon}</div>
							<p className="font-semibold">{template.label}</p>
							<p className="text-sm text-gray-700">{template.description}</p>
						</motion.button>
					))}
				</div>

				<div className="shadow-soft-lg mb-8 grid gap-4 rounded-[28px] bg-white p-5 sm:grid-cols-[1.2fr_0.8fr]">
					<div>
						<h2 className="mb-2 text-2xl font-bold">Photo diary</h2>
						<p className="text-sm text-gray-600">Photos are the next feature. For now this button gives a reminder.</p>
						<div className="mt-4 flex items-center gap-3">
							<label className="bg-mochi-cream shadow-soft hover:bg-mochi-beige flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-gray-700">
								<Camera size={16} />
								<input type="file" accept="image/*" className="hidden" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
								Choose photo
							</label>
							<button onClick={handlePhotoFeature} className="bg-mochi-sage shadow-soft rounded-full px-4 py-2 text-sm font-medium text-white">
								Next feature
							</button>
						</div>
						{showPhotoHint && <p className="mt-3 text-sm text-gray-600">Photo upload will be added next.</p>}
					</div>
					<div className="from-mochi-warm to-mochi-sage shadow-soft-lg rounded-3xl bg-gradient-to-br p-5 text-white">
						<p className="text-sm opacity-80">Last time fed</p>
						<p className="mt-2 text-lg font-bold">{latestFeed ? format(new Date(latestFeed.timestamp), 'PPP p') : 'No feeding log yet'}</p>
						<p className="mt-3 text-sm opacity-90">A full bowl, a soft nap, and a cozy day.</p>
					</div>
				</div>

				<div className="space-y-3">
					{activeLogs.map((log, index) => (
						<motion.div key={log.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="shadow-soft-lg rounded-2xl bg-white p-5">
							<div className="flex items-start justify-between gap-4">
								<div>
									<p className="font-semibold text-gray-900">{log.type.replace('_', ' ')}</p>
									<p className="mt-1 text-sm text-gray-700">{log.description}</p>
								</div>
								<p className="text-xs text-gray-500">{format(new Date(log.timestamp), 'PP p')}</p>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</div>
	);
}
