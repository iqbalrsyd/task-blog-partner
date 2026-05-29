'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Camera } from 'lucide-react';
import { addDoc, collection } from 'firebase/firestore';
import { format } from 'date-fns';
import { db } from '@/lib/firebase';
import { useHouseholdStore } from '@/lib/stores';
import { useHouseholdCollection } from '@/lib/household-realtime';
import type { CatLog } from '@/lib/types';

const mockCatLogs: CatLog[] = [
	{
		id: '1',
		householdId: 'demo-household-001',
		type: 'feeding',
		description: 'Fed Puing with premium cat food',
		timestamp: '08:00 AM Today',
		createdAt: '08:00 AM Today',
		updatedAt: '08:00 AM Today'
	},
	{
		id: '2',
		householdId: 'demo-household-001',
		type: 'water',
		description: 'Fresh water bowl filled',
		timestamp: '10:30 AM Today',
		createdAt: '10:30 AM Today',
		updatedAt: '10:30 AM Today'
	},
	{
		id: '3',
		householdId: 'demo-household-001',
		type: 'grooming',
		description: "Brushed Puing's fur",
		timestamp: 'Yesterday at 5:00 PM',
		createdAt: 'Yesterday at 5:00 PM',
		updatedAt: 'Yesterday at 5:00 PM'
	},
	{
		id: '4',
		householdId: 'demo-household-001',
		type: 'note',
		description: 'Puing was very playful today! 🎾',
		timestamp: 'Yesterday at 3:00 PM',
		createdAt: 'Yesterday at 3:00 PM',
		updatedAt: 'Yesterday at 3:00 PM'
	}
];

type CareAction = 'feeding' | 'water' | 'grooming' | 'note';

const LogTypeConfig = {
	feeding: { icon: '🍖', color: 'bg-orange-100', label: 'Feeding' },
	water: { icon: '💧', color: 'bg-blue-100', label: 'Water' },
	grooming: { icon: '✂️', color: 'bg-purple-100', label: 'Grooming' },
	note: { icon: '📝', color: 'bg-yellow-100', label: 'Note' }
} as const;

export default function PuingPage() {
	const householdId = useHouseholdStore((state) => state.householdId);
	const { data: remoteLogs } = useHouseholdCollection<CatLog>('cat_logs');
	const [logs, setLogs] = useState<CatLog[]>(mockCatLogs);
	const [showNewLog, setShowNewLog] = useState(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	useEffect(() => {
		if (remoteLogs.length > 0) {
			setLogs(remoteLogs);
		}
	}, [remoteLogs]);

	const activeLogs = remoteLogs.length > 0 ? remoteLogs : logs;
	const formatTimelineTime = (value: string) => {
		const parsed = new Date(value);
		if (Number.isNaN(parsed.getTime())) return value;
		return format(parsed, 'PP p');
	};

	const stats = useMemo(
		() => ({
			fed: activeLogs.filter((log) => log.type === 'feeding').length,
			water: activeLogs.filter((log) => log.type === 'water').length,
			care: activeLogs.length
		}),
		[activeLogs]
	);

	const createCareLog = async (type: CareAction, description: string) => {
		const now = new Date().toISOString();
		const payload: CatLog = {
			id: crypto.randomUUID(),
			householdId: householdId || 'demo-household-001',
			type,
			description,
			timestamp: now,
			createdAt: now,
			updatedAt: now
		};

		setLogs((prev) => [payload, ...prev]);

		if (householdId) {
			const docData: Record<string, unknown> = {
				...payload,
				createdAt: now,
				updatedAt: now
			};

			await addDoc(collection(db, 'cat_logs'), docData);
		}
	};

	const uploadPhoto = async () => {
		if (!selectedFile || !householdId) return;
		window.alert('Photo diary upload is the next feature. This will open a cute upload flow soon.');
		setSelectedFile(null);
	};

	return (
		<div className="from-mochi-cream to-mochi-beige min-h-screen bg-gradient-to-br via-white px-4 pb-32 pt-6">
			<div className="mx-auto max-w-2xl">
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					className="mb-12 text-center"
				>
					<motion.div
						animate={{ y: [0, -10, 0] }}
						transition={{ duration: 2, repeat: Infinity }}
						className="mb-4 inline-block text-8xl"
					>
						🐱
					</motion.div>
					<h1 className="mb-2 text-4xl font-bold">Puing&apos;s Care</h1>
					<p className="text-gray-600">Track Puing&apos;s health, photos, and little moments</p>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
					className="mb-8 grid grid-cols-3 gap-3"
				>
					{[
						{ icon: '🍖', label: 'Fed', status: `${stats.fed} entries` },
						{ icon: '💧', label: 'Water', status: `${stats.water} entries` },
						{ icon: '❤️', label: 'Care', status: `${stats.care} notes` }
					].map((stat, i) => (
						<div key={i} className="shadow-soft rounded-2xl bg-white p-4 text-center">
							<div className="mb-2 text-3xl">{stat.icon}</div>
							<p className="text-sm font-medium text-gray-600">{stat.label}</p>
							<p className="text-mochi-brown text-lg font-bold">{stat.status}</p>
						</div>
					))}
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className="mb-8 grid grid-cols-2 gap-3"
				>
					{Object.entries(LogTypeConfig).map(([type, config]) => (
						<motion.button
							key={type}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={() =>
								void createCareLog(type as CareAction, `${config.label} log for Puing`)
							}
							className={`${config.color} hover:shadow-soft-lg rounded-2xl p-4 font-medium text-gray-900 transition-all`}
						>
							<div className="mb-2 text-2xl">{config.icon}</div>
							<p className="text-sm">{config.label}</p>
						</motion.button>
					))}
				</motion.div>

				<div className="shadow-soft-lg mb-8 grid gap-4 rounded-[28px] bg-white p-5 sm:grid-cols-[1.2fr_0.8fr]">
					<div>
						<h2 className="mb-2 text-2xl font-bold">Photo diary</h2>
						<p className="text-sm text-gray-600">
							Upload cute photos and keep a soft timeline of Puing&apos;s little adventures.
						</p>
						<div className="mt-4 flex items-center gap-3">
							<label className="bg-mochi-cream shadow-soft hover:bg-mochi-beige flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-gray-700">
								<Camera size={16} />
								<input
									type="file"
									accept="image/*"
									className="hidden"
									onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
								/>
								Choose photo
							</label>
							<button
								onClick={() => void uploadPhoto()}
								className="bg-mochi-sage shadow-soft rounded-full px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
							>
								Next feature
							</button>
						</div>
					</div>
					<div className="from-mochi-warm to-mochi-sage shadow-soft-lg rounded-3xl bg-gradient-to-br p-5 text-white">
						<p className="text-sm opacity-80">Today&apos;s mood</p>
						<div className="mt-3 text-4xl">🐾</div>
						<p className="mt-3 text-lg font-bold">Puing is feeling cozy</p>
						<p className="mt-1 text-sm opacity-90">
							A warm afternoon, a full bowl, and a very soft nap.
						</p>
					</div>
				</div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
				>
					<h2 className="mb-4 text-2xl font-bold">Care Timeline</h2>
					<div className="space-y-3">
						{activeLogs.map((log, index) => {
							const config = LogTypeConfig[log.type as keyof typeof LogTypeConfig];
							return (
								<motion.div
									key={log.id}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: index * 0.05 }}
									className={`${config.color} flex items-start gap-4 rounded-2xl p-5`}
								>
									<span className="flex-shrink-0 text-3xl">{config.icon}</span>
									<div className="min-w-0 flex-1">
										<p className="font-semibold text-gray-900">{config.label}</p>
										<p className="mt-1 text-sm text-gray-700">{log.description}</p>
										{log.photoUrl && (
											<div className="mt-3 inline-flex items-center gap-2 rounded-2xl bg-white/80 px-3 py-2 text-sm text-gray-700">
												<Camera size={14} />
												Photo attached
											</div>
										)}
										<p className="mt-2 text-xs text-gray-600">
											{formatTimelineTime(log.timestamp)}
										</p>
									</div>
								</motion.div>
							);
						})}
					</div>
				</motion.div>

				<motion.button
					onClick={() => setShowNewLog(!showNewLog)}
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.95 }}
					className="from-mochi-sage to-mochi-accent shadow-soft-lg fixed bottom-32 right-4 rounded-full bg-gradient-to-br p-4 text-white"
				>
					<Plus size={28} />
				</motion.button>

				{showNewLog && (
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4"
					>
						<div className="shadow-soft-xl w-full max-w-sm rounded-3xl bg-white p-8">
							<h2 className="mb-6 text-2xl font-bold">Log Care</h2>
							<div className="space-y-4">
								<p className="text-sm text-gray-600">
									Use the quick action buttons to add feeding, water, or grooming entries.
								</p>
								<div className="grid grid-cols-2 gap-3">
									<button
										onClick={() => setShowNewLog(false)}
										className="rounded-xl bg-gray-200 px-4 py-2 font-medium text-gray-700"
									>
										Cancel
									</button>
									<button
										onClick={() => {
											void createCareLog('note', 'Added a tiny Puing note from the modal');
											setShowNewLog(false);
										}}
										className="bg-mochi-sage rounded-xl px-4 py-2 font-medium text-white"
									>
										Log Care
									</button>
								</div>
							</div>
						</div>
					</motion.div>
				)}
			</div>
		</div>
	);
}
