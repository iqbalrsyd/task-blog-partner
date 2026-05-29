'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Heart } from 'lucide-react';
import { addDoc, collection, deleteDoc, doc } from 'firebase/firestore';
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
		createdAt: '10:30 AM Today',
		updatedAt: '10:30 AM Today'
	},
	{
		id: '2',
		householdId: 'demo-household-001',
		content: 'Good luck with your meeting ❤️',
		author: 'Mufti',
		createdAt: '09:15 AM Today',
		updatedAt: '09:15 AM Today'
	},
	{
		id: '3',
		householdId: 'demo-household-001',
		content: 'Movie night this weekend? 🎬',
		author: 'Iqbal',
		createdAt: 'Yesterday',
		updatedAt: 'Yesterday'
	}
];

export default function NotesPage() {
	const householdId = useHouseholdStore((state) => state.householdId);
	const { data: remoteNotes } = useHouseholdCollection<Note>('notes');
	const [notes, setNotes] = useState<Note[]>(mockNotes);
	const [showNewNote, setShowNewNote] = useState(false);
	const [newNoteContent, setNewNoteContent] = useState('');

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
			author: 'Iqbal',
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
							className={`shadow-soft-lg group rounded-2xl p-6 ${
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
											: 'bg-pink-200 text-pink-700'
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
							<p className="mb-3 text-lg text-gray-900">{note.content}</p>
							<p className="text-sm text-gray-600">{note.createdAt}</p>
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
							<div className="space-y-4">
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
