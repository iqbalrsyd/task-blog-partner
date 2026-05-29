'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useHouseholdStore } from '@/lib/stores';
import { useHouseholdCollection } from '@/lib/household-realtime';
import type { Task } from '@/lib/types';

type TaskItem = Task;

const fallbackTasks: TaskItem[] = [
	{
		id: '1',
		householdId: 'demo-household-001',
		title: 'Laundry',
		assignedTo: 'Iqbal',
		dueTime: '14:00',
		dueDate: 'today',
		completed: false,
		priority: 'high',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	},
	{
		id: '2',
		householdId: 'demo-household-001',
		title: 'Feed Puing',
		assignedTo: 'Mufti',
		dueTime: '19:00',
		dueDate: 'today',
		completed: false,
		priority: 'high',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	},
	{
		id: '3',
		householdId: 'demo-household-001',
		title: 'Grocery Shopping',
		assignedTo: 'Iqbal',
		dueTime: '16:00',
		dueDate: 'tomorrow',
		completed: false,
		priority: 'medium',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	}
];

export default function TasksPage() {
	const householdId = useHouseholdStore((state) => state.householdId);
	const { data: remoteTasks, loading } = useHouseholdCollection<TaskItem>('tasks');
	const [tasks, setTasks] = useState<TaskItem[]>(fallbackTasks);
	const [showNewTask, setShowNewTask] = useState(false);
	const [newTaskTitle, setNewTaskTitle] = useState('');
	const [newTaskAssignee, setNewTaskAssignee] = useState<'Iqbal' | 'Mufti'>('Iqbal');
	const [newTaskTime, setNewTaskTime] = useState('');
	const [selectedPriority, setSelectedPriority] = useState<'low' | 'medium' | 'high' | null>(null);

	useEffect(() => {
		if (remoteTasks.length > 0) {
			setTasks(remoteTasks);
		}
	}, [remoteTasks]);

	const activeTasks = remoteTasks.length > 0 ? remoteTasks : tasks;

	const toggleTask = (id: string) => {
		const current = activeTasks.find((task) => task.id === id);
		if (!current) return;

		setTasks((prev) =>
			prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
		);

		if (householdId) {
			void updateDoc(doc(db, 'tasks', id), {
				completed: !current.completed,
				updatedAt: new Date().toISOString()
			});
		}
	};

	const deleteTask = (id: string) => {
		setTasks((prev) => prev.filter((task) => task.id !== id));
		if (householdId) {
			void deleteDoc(doc(db, 'tasks', id));
		}
	};

	const createTask = async () => {
		if (!newTaskTitle.trim()) return;

		const taskPayload: TaskItem = {
			id: crypto.randomUUID(),
			householdId: householdId || 'demo-household-001',
			title: newTaskTitle.trim(),
			assignedTo: newTaskAssignee,
			dueTime: newTaskTime || undefined,
			dueDate: 'today',
			completed: false,
			priority: selectedPriority,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		};

		setTasks((prev) => [taskPayload, ...prev]);

		if (householdId) {
			await addDoc(collection(db, 'tasks'), {
				...taskPayload,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			});
		}

		setNewTaskTitle('');
		setNewTaskAssignee('Iqbal');
		setNewTaskTime('');
		setSelectedPriority(null);
		setShowNewTask(false);
	};

	const completedCount = activeTasks.filter((t) => t.completed).length;
	const totalCount = activeTasks.length || 1;

	return (
		<div className="from-mochi-cream to-mochi-beige min-h-screen bg-gradient-to-br via-white px-4 pb-32 pt-6">
			<div className="mx-auto max-w-2xl">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="mb-8"
				>
					<h1 className="mb-2 text-4xl font-bold">Tasks</h1>
					<p className="text-gray-600">
						{completedCount} of {activeTasks.length} completed
					</p>
					<div className="bg-mochi-beige mt-4 h-2 overflow-hidden rounded-full">
						<motion.div
							animate={{ width: `${(completedCount / totalCount) * 100}%` }}
							className="from-mochi-sage to-mochi-accent h-full bg-gradient-to-r"
						/>
					</div>
				</motion.div>

				{loading && remoteTasks.length === 0 && (
					<p className="mb-4 text-sm text-gray-500">Loading household tasks...</p>
				)}

				{/* Filter Tabs */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
					className="mb-8 flex gap-3 overflow-x-auto"
				>
					{['All', 'Iqbal', 'Mufti', 'Today', 'Overdue'].map((filter) => (
						<button
							key={filter}
							className="shadow-soft hover:bg-mochi-beige whitespace-nowrap rounded-full bg-white px-4 py-2 text-sm font-medium transition-colors"
						>
							{filter}
						</button>
					))}
				</motion.div>

				{/* Tasks List */}
				<div className="mb-8 space-y-3">
					{activeTasks.map((task, index) => (
						<motion.div
							key={task.id}
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: index * 0.05 }}
							whileHover={{ scale: 1.02 }}
							className="shadow-soft-lg group flex items-center gap-4 rounded-2xl bg-white p-5"
						>
							<motion.button
								onClick={() => toggleTask(task.id)}
								whileHover={{ scale: 1.2 }}
								whileTap={{ scale: 0.9 }}
								className="flex-shrink-0"
							>
								<div
									className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all ${
										task.completed
											? 'bg-mochi-sage border-mochi-sage'
											: 'border-mochi-brown hover:bg-mochi-beige'
									}`}
								>
									{task.completed && <CheckCircle2 size={20} className="text-white" />}
								</div>
							</motion.button>

							<div className="min-w-0 flex-1">
								<p
									className={`font-medium ${
										task.completed ? 'text-gray-400 line-through' : 'text-gray-900'
									}`}
								>
									{task.title}
								</p>
								<div className="mt-2 flex items-center gap-3 text-sm text-gray-500">
									<span
										className={`rounded-full px-2 py-1 text-xs font-medium ${
											task.assignedTo === 'Iqbal'
												? 'bg-blue-100 text-blue-700'
												: 'bg-pink-100 text-pink-700'
										}`}
									>
										{task.assignedTo}
									</span>
									{task.dueTime && <span>📍 {task.dueTime}</span>}
									<span
										className={`rounded-full px-2 py-1 text-xs font-medium ${
											task.priority === 'high'
												? 'bg-red-100 text-red-700'
												: task.priority === 'medium'
													? 'bg-yellow-100 text-yellow-700'
													: 'bg-green-100 text-green-700'
										}`}
									>
										{task.priority}
									</span>
								</div>
							</div>

							<motion.button
								onClick={() => deleteTask(task.id)}
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.95 }}
								className="flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
							>
								<Trash2 size={20} className="text-red-500" />
							</motion.button>
						</motion.div>
					))}
				</div>

				{/* New Task Button */}
				<motion.button
					onClick={() => setShowNewTask(!showNewTask)}
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.95 }}
					className="from-mochi-sage to-mochi-accent shadow-soft-lg fixed bottom-32 right-4 rounded-full bg-gradient-to-br p-4 text-white"
				>
					<Plus size={28} />
				</motion.button>

				{/* New Task Form */}
				{showNewTask && (
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4"
					>
						<div className="shadow-soft-xl w-full max-w-sm rounded-3xl bg-white p-8">
							<h2 className="mb-6 text-2xl font-bold">New Task</h2>
							<div className="space-y-4">
								<input
									type="text"
									placeholder="Task title..."
									value={newTaskTitle}
									onChange={(e) => setNewTaskTitle(e.target.value)}
									className="focus:border-mochi-sage w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none"
								/>
								<select
									value={newTaskAssignee}
									onChange={(e) => setNewTaskAssignee(e.target.value as 'Iqbal' | 'Mufti')}
									className="focus:border-mochi-sage w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none"
								>
									<option value="Iqbal">Iqbal</option>
									<option value="Mufti">Mufti</option>
								</select>
								<input
									type="time"
									value={newTaskTime}
									onChange={(e) => setNewTaskTime(e.target.value)}
									className="focus:border-mochi-sage w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none"
								/>
								<div>
									<p className="mb-2 text-sm font-medium text-gray-600">Priority (optional)</p>
									<div className="grid grid-cols-4 gap-2">
										{[null, 'low', 'medium', 'high'].map((priority) => {
											const label = priority === null ? 'None' : priority;
											const isActive = selectedPriority === priority;
											return (
												<button
													key={label}
													type="button"
													onClick={() =>
														setSelectedPriority(priority as 'low' | 'medium' | 'high' | null)
													}
													className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
														isActive ? 'bg-mochi-sage text-white' : 'bg-gray-100 text-gray-700'
													}`}
												>
													{label}
												</button>
											);
										})}
									</div>
								</div>
								<div className="grid grid-cols-2 gap-3">
									<button
										onClick={() => setShowNewTask(false)}
										className="rounded-xl bg-gray-200 px-4 py-2 font-medium text-gray-700"
									>
										Cancel
									</button>
									<button
										onClick={createTask}
										className="bg-mochi-sage rounded-xl px-4 py-2 font-medium text-white"
									>
										Create
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
