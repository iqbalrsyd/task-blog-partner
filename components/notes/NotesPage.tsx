'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Heart } from 'lucide-react';
import { addDoc, collection, deleteDoc, doc } from 'firebase/firestore';
import { format } from 'date-fns';
import { db } from '@/lib/firebase';
import { useHouseholdStore } from '@/lib/stores';
import { useHouseholdCollection } from '@/lib/household-realtime';
import type { Note } from '@/lib/types';

const mockNotes: Note[] = [
	{
		id: '1',
		householdId: 'demo-household-001',
		content: "Don't forget snacks for Puing 😾",
		author: 'Iqbal',
		noteTime: '10:30',
		createdAt: '2026-05-31T10:30:00.000Z',
		updatedAt: '2026-05-31T10:30:00.000Z'
	},
	{
		id: '2',
		householdId: 'demo-household-001',
		content: 'Good luck with your meeting ❤️',
		author: 'Mufti',
		noteTime: '09:15',
		createdAt: '2026-05-31T09:15:00.000Z',
		updatedAt: '2026-05-31T09:15:00.000Z'
	},
	{
		id: '3',
		householdId: 'demo-household-001',
		content: 'Movie night this weekend? 🎬',
		author: 'Iqbal',
		noteTime: '18:45',
		createdAt: '2026-05-30T18:45:00.000Z',
		updatedAt: '2026-05-30T18:45:00.000Z'
	}
];

const formatNoteTime = (value: string) => {
	const parsed = new Date(value);
	if (Number.isNaN(parsed.getTime())) return value;
	return format(parsed, 'PPP p');
};

export default function NotesPage() {
	const householdId = useHouseholdStore((state) => state.householdId);
	const { data: remoteNotes } = useHouseholdCollection<Note>('notes');
	const [notes, setNotes] = useState<Note[]>(mockNotes);
	const [showNewNote, setShowNewNote] = useState(false);
	const [newNoteContent, setNewNoteContent] = useState('');
	const [newNoteAuthor, setNewNoteAuthor] = useState<'Iqbal' | 'Mufti' | 'Puing'>('Iqbal');
	const [newNoteTime, setNewNoteTime] = useState(format(new Date(), 'HH:mm'));

	useEffect(() => {
		if (remoteNotes.length > 0) {
			setNotes(remoteNotes);
		}
	}, [remoteNotes]);

	const activeNotes = remoteNotes.length > 0 ? remoteNotes : notes;

	const deleteNote = (id: string) => {
		setNotes((prev) => prev.filter((note) => note.id !== id));
		if (householdId) {
			void deleteDoc(doc(db, 'notes', id));
		}
	};

	const createNote = async () => {
		if (!newNoteContent.trim()) return;

		const notePayload: Note = {
			id: crypto.randomUUID(),
			householdId: householdId || 'demo-household-001',
			content: newNoteContent.trim(),
			author: newNoteAuthor,
			noteTime: newNoteTime,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		};

		setNotes((prev) => [notePayload, ...prev]);

		if (householdId) {
			await addDoc(collection(db, 'notes'), {
				...notePayload,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			});
		}

		setNewNoteContent('');
		setNewNoteTime(format(new Date(), 'HH:mm'));
		setShowNewNote(false);
	};

	return (
		<div className="from-mochi-cream to-mochi-beige min-h-screen bg-gradient-to-br via-white px-4 pb-32 pt-6">
			<div className="mx-auto max-w-2xl">
				{/* Header */}
				<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
					<h1 className="mb-2 text-4xl font-bold">Shared Notes</h1>
					<p className="text-gray-600">Leave love notes for each other 💕</p>
				</motion.div>

				{/* Notes Grid */}
				<div className="mt-8 space-y-3">
					{activeNotes.map((note, index) => (
						<motion.div
							key={note.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1 }}
							className={`shadow-soft-lg group relative rounded-2xl p-6 pb-11 ${
								note.author === 'Iqbal'
									? 'bg-gradient-to-br from-blue-50 to-blue-100'
									: 'bg-gradient-to-br from-pink-50 to-pink-100'
							}`}
						>
							<div className="mb-3 flex items-start justify-between">
								<span
									className={`rounded-full px-3 py-1 text-xs font-bold ${
										note.author === 'Iqbal'
											? 'bg-blue-200 text-blue-700'
											: note.author === 'Mufti'
												? 'bg-pink-200 text-pink-700'
												: 'bg-green-200 text-green-700'
									}`}
								>
									{note.author}
								</span>
								<motion.button
									onClick={() => deleteNote(note.id)}
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
									className="opacity-0 transition-opacity group-hover:opacity-100"
								>
									<Trash2 size={18} className="text-red-500" />
								</motion.button>
							</div>
							<p className="mb-4 text-lg text-gray-900">{note.content}</p>
							<div className="absolute bottom-4 right-4 rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold text-gray-600 ring-1 ring-black/5">
								{note.noteTime ?? formatNoteTime(note.createdAt)}
							</div>
						</motion.div>
					))}
				</div>

				{/* New Note Button */}
				<motion.button
					onClick={() => setShowNewNote(!showNewNote)}
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.95 }}
					className="from-mochi-sage to-mochi-accent shadow-soft-lg fixed bottom-32 right-4 rounded-full bg-gradient-to-br p-4 text-white"
				>
					<Plus size={28} />
				</motion.button>

				{/* New Note Modal */}
				{showNewNote && (
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4"
					>
						<div className="shadow-soft-xl w-full max-w-sm rounded-3xl bg-white p-8">
							<h2 className="mb-6 text-2xl font-bold">Write a Note</h2>
							{/* Author selector */}
							<div className="mb-4 flex gap-2">
								<button
									className={`rounded-full px-3 py-1 text-xs font-bold ${
										newNoteAuthor === 'Iqbal' ? 'bg-blue-200 text-blue-700' : 'bg-gray-100 text-gray-700'
									}`}
									onClick={() => setNewNoteAuthor('Iqbal')}
								>
									Iqbal
								</button>
								<button
									className={`rounded-full px-3 py-1 text-xs font-bold ${
										newNoteAuthor === 'Mufti' ? 'bg-pink-200 text-pink-700' : 'bg-gray-100 text-gray-700'
									}`}
									onClick={() => setNewNoteAuthor('Mufti')}
								>
									Mufti
								</button>
								<button
									className={`rounded-full px-3 py-1 text-xs font-bold ${
										newNoteAuthor === 'Puing' ? 'bg-green-200 text-green-700' : 'bg-gray-100 text-gray-700'
									}`}
									onClick={() => setNewNoteAuthor('Puing')}
								>
									Puing
								</button>
							</div>
							<div className="space-y-4">
								<input
									type="time"
									value={newNoteTime}
									onChange={(e) => setNewNoteTime(e.target.value)}
									className="focus:border-mochi-sage w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none"
								/>
								<textarea
									placeholder="What do you want to say? 💕"
									value={newNoteContent}
									onChange={(e) => setNewNoteContent(e.target.value)}
									className="focus:border-mochi-sage w-full resize-none rounded-xl border border-gray-200 px-4 py-3 focus:outline-none"
									rows={4}
								/>
								<div className="grid grid-cols-2 gap-3">
									<button
										onClick={() => {
											setShowNewNote(false);
											setNewNoteContent('');
										}}
										className="rounded-xl bg-gray-200 px-4 py-2 font-medium text-gray-700"
									>
										Cancel
									</button>
									<button
										onClick={createNote}
										className="bg-mochi-sage flex items-center justify-center gap-2 rounded-xl px-4 py-2 font-medium text-white"
									>
										<Heart size={18} />
										Share
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
