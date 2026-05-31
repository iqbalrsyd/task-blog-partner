'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { BellRing, Clock3 } from 'lucide-react';
import { initializeNotifications } from '@/lib/notifications';
import { useHouseholdCollection } from '@/lib/household-realtime';
import type { Task } from '@/lib/types';

type TaskReminder = {
	id: string;
	label: string;
	time: string;
	emoji: string;
	status: 'upcoming' | 'due' | 'overdue';
};

const createReminderKey = (task: Task) => `${task.id}:${task.updatedAt}:${task.completed}`;

const parseDueDate = (task: Task) => {
	if (!task.dueTime) return null;

	const now = new Date();
	const [timePart, meridiemPart] = task.dueTime.trim().split(/\s+/);
	const [hourPart, minutePart] = timePart.split(':');
	let hour = Number(hourPart);
	const minute = Number(minutePart || '0');

	if (Number.isNaN(hour) || Number.isNaN(minute)) return null;

	if (meridiemPart) {
		const normalizedMeridiem = meridiemPart.toUpperCase();
		if (normalizedMeridiem === 'PM' && hour < 12) hour += 12;
		if (normalizedMeridiem === 'AM' && hour === 12) hour = 0;
	}

	const target = new Date(now);
	if (task.dueDate === 'tomorrow') {
		target.setDate(target.getDate() + 1);
	} else if (task.dueDate !== 'today') {
		const exactDate = new Date(task.dueDate);
		if (!Number.isNaN(exactDate.getTime())) {
			target.setTime(exactDate.getTime());
		}
	}

	target.setHours(hour, minute, 0, 0);
	return target;
};

export default function ReminderPanel() {
	const { data: tasks } = useHouseholdCollection<Task>('tasks');
	const [enabled, setEnabled] = useState(false);
	const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'blocked'>('idle');
	const [token, setToken] = useState<string | null>(null);
	const [message, setMessage] = useState('Enable reminders for deadlines and Puing care.');
	const timersRef = useRef<Map<string, number>>(new Map());
	const notifiedRef = useRef<Set<string>>(new Set());

	const taskReminders = useMemo<TaskReminder[]>(() => {
		const now = Date.now();
		return tasks
			.filter((task) => !task.completed && task.dueTime)
			.map((task) => {
				const dueDate = parseDueDate(task);
				if (!dueDate) return null;

				const remaining = dueDate.getTime() - now;
				const status: TaskReminder['status'] = remaining <= 0 ? 'overdue' : remaining <= 30 * 60 * 1000 ? 'due' : 'upcoming';
				return {
					id: task.id,
					label: task.title,
					time: task.dueTime,
					emoji: task.assignedTo === 'Iqbal' ? '💙' : '💗',
					status
				};
			})
			.filter((item): item is TaskReminder => item !== null)
			.sort((a, b) => a.time.localeCompare(b.time));
	}, [tasks]);

	useEffect(() => {
		const clearTimers = () => {
			timersRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
			timersRef.current.clear();
		};

		clearTimers();

		if (!enabled || typeof Notification === 'undefined' || Notification.permission !== 'granted') {
			return clearTimers;
		}

		for (const task of tasks) {
			if (task.completed || !task.dueTime) continue;

			const dueDate = parseDueDate(task);
			if (!dueDate) continue;

			const key = createReminderKey(task);
			if (notifiedRef.current.has(key)) continue;

			const delay = dueDate.getTime() - Date.now();
			const fireReminder = () => {
				if (Notification.permission !== 'granted') return;
				const isOverdue = dueDate.getTime() <= Date.now();
				new Notification(isOverdue ? 'Task overdue' : 'Task reminder', {
					body: `${task.title} for ${task.assignedTo} is ${isOverdue ? 'overdue' : 'due now'}.`,
					icon: '/favicon.ico'
				});
				notifiedRef.current.add(key);
			};

			if (delay <= 0) {
				fireReminder();
				continue;
			}

			const timeoutId = window.setTimeout(fireReminder, delay);
			timersRef.current.set(key, timeoutId);
		}

		return clearTimers;
	}, [enabled, tasks]);

	const handleEnable = async () => {
		setStatus('loading');
		const result = await initializeNotifications();
		if (!result.supported) {
			setStatus('blocked');
			setMessage('Push notifications are not supported in this browser.');
			return;
		}

		if (result.error === 'service-worker-missing') {
			setStatus('blocked');
			setMessage('Please refresh once so the service worker can register, then try again.');
			return;
		}

		if (result.error === 'service-worker-registration-failed') {
			setStatus('blocked');
			setMessage('Service worker could not register. Check your deployment path.');
			return;
		}

		if (result.error === 'permission-denied') {
			setStatus('blocked');
			setMessage('Notification permission was denied. You can enable it in your browser settings.');
			return;
		}

		if (result.error === 'subscription-failed') {
			setStatus('blocked');
			setMessage('Push subscription failed. Make sure the service worker is active, then retry.');
			return;
		}

		setToken(result.token);
		setEnabled(Boolean(result.token));
		setMessage(
			result.token ? 'Notifications are ready.' : 'Push reminders could not be enabled yet.'
		);
		setStatus(result.token ? 'ready' : 'blocked');
		if (result.token || Notification.permission === 'granted') {
			setMessage('Task timer notifications are active.');
		}
	};

	return (
		<section className="mx-auto mb-8 max-w-2xl px-4">
			<motion.div
				initial={{ opacity: 0, y: 18 }}
				animate={{ opacity: 1, y: 0 }}
				className="shadow-soft-lg overflow-hidden rounded-[28px] bg-white"
			>
				<div className="from-mochi-warm/80 to-mochi-beige bg-gradient-to-r via-white px-5 py-5 sm:px-6">
					<div className="flex items-start justify-between gap-4">
						<div>
							<p className="text-mochi-brown/70 text-[11px] uppercase tracking-[0.3em]">
								Reminder Magic
							</p>
							<h2 className="mt-2 text-2xl font-bold">Soft reminders</h2>
							<p className="mt-1 text-sm text-gray-600">
								Gentle nudges for unfinished tasks and cat care.
							</p>
						</div>
						<div className="shadow-soft h-14 w-14 rounded-3xl bg-white" />
					</div>
				</div>

				<div className="space-y-3 p-5 sm:p-6">
					{taskReminders.length === 0 && (
						<div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
							No task timers set yet. Add a due time on a task to get reminders.
						</div>
					)}
					{taskReminders.map((reminder) => (
						<div
							key={reminder.id}
							className={`flex items-center justify-between rounded-2xl px-4 py-3 ${
								reminder.status === 'overdue'
									? 'bg-red-50'
									: reminder.status === 'due'
										? 'bg-amber-50'
										: 'bg-mochi-cream'
							}`}
						>
							<div className="flex items-center gap-3">
								<span className="text-2xl">{reminder.emoji}</span>
								<div>
									<p className="font-medium text-gray-900">{reminder.label}</p>
									<p className="text-xs text-gray-600">
										{reminder.status === 'overdue'
											? 'Overdue'
											: reminder.status === 'due'
												? 'Due soon'
												: 'Scheduled'}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-2 text-sm text-gray-600">
								<Clock3 size={14} />
								{reminder.time}
							</div>
						</div>
					))}
				</div>

				<div className="border-t border-gray-100 p-5 sm:p-6">
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<div className="flex items-center gap-3">
							<div
								className={`flex h-10 w-10 items-center justify-center rounded-full ${enabled ? 'bg-emerald-100' : 'bg-gray-100'}`}
							>
								<BellRing size={18} className={enabled ? 'text-emerald-600' : 'text-gray-500'} />
							</div>
							<div>
								<p className="font-medium text-gray-900">Task timer reminders</p>
								<p className="text-sm text-gray-600">{message}</p>
							</div>
						</div>
						<button
							onClick={() => void handleEnable()}
							className="bg-mochi-sage shadow-soft rounded-full px-4 py-2 text-sm font-medium text-white"
						>
							{status === 'loading' ? 'Enabling...' : enabled ? 'Enabled' : 'Enable'}
						</button>
					</div>
					{token && (
						<p className="mt-3 break-all text-[11px] text-gray-500">Device token: {token}</p>
					)}
				</div>
			</motion.div>
		</section>
	);
}
