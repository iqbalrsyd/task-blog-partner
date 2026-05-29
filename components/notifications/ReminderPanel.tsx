'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BellRing, Clock3 } from 'lucide-react';
import { initializeNotifications } from '@/lib/notifications';

const reminders = [
	{ id: '1', label: 'Feed Puing', time: '18:30', emoji: '🐱', tone: 'warm' },
	{ id: '2', label: 'Laundry check', time: '20:00', emoji: '🧺', tone: 'soft' },
	{ id: '3', label: 'Good night note', time: '22:00', emoji: '💌', tone: 'gentle' }
];

export default function ReminderPanel() {
	const [enabled, setEnabled] = useState(false);
	const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'blocked'>('idle');
	const [token, setToken] = useState<string | null>(null);
	const [message, setMessage] = useState('Enable reminders for deadlines and Puing care.');

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
					{reminders.map((reminder) => (
						<div
							key={reminder.id}
							className="bg-mochi-cream flex items-center justify-between rounded-2xl px-4 py-3"
						>
							<div className="flex items-center gap-3">
								<span className="text-2xl">{reminder.emoji}</span>
								<div>
									<p className="font-medium text-gray-900">{reminder.label}</p>
									<p className="text-xs text-gray-600">Overdue and deadline reminders</p>
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
								<p className="font-medium text-gray-900">Push reminders</p>
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
