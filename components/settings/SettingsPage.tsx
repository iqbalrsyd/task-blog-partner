'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LogOut, Bell, Moon, Sun, HelpCircle } from 'lucide-react';
import { useHouseholdStore } from '@/lib/stores';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/lib/theme-context';

export default function SettingsPage() {
	const [notificationsEnabled, setNotificationsEnabled] = useState(true);
	const { isDark } = useTheme();
	const logout = useHouseholdStore((state) => state.logout);
	const router = useRouter();

	useEffect(() => {
		document.documentElement.classList.toggle('dark', isDark);
	}, [isDark]);

	const handleLogout = () => {
		logout();
		router.push('/');
	};

	return (
		<div className="from-mochi-cream to-mochi-beige min-h-screen bg-gradient-to-br via-white px-4 pb-32 pt-6">
			<div className="mx-auto max-w-2xl">
				{/* Header */}
				<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
					<h1 className="mb-2 text-4xl font-bold">Settings</h1>
					<p className="text-gray-600">Customize your Puing House</p>
				</motion.div>

				{/* Settings Sections */}
				<div className="mt-8 space-y-6">
					{/* Notifications */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
					>
						<div className="shadow-soft-lg flex items-center justify-between rounded-2xl bg-white p-5">
							<div className="flex items-center gap-3">
								<div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
									<Bell size={20} className="text-blue-600" />
								</div>
								<div>
									<p className="font-semibold text-gray-900">Notifications</p>
									<p className="text-sm text-gray-600">Get reminders for tasks</p>
								</div>
							</div>
							<motion.button
								onClick={() => setNotificationsEnabled(!notificationsEnabled)}
								className={`relative h-7 w-12 rounded-full transition-colors ${
									notificationsEnabled ? 'bg-mochi-sage' : 'bg-gray-300'
								}`}
							>
								<motion.div
									layout
									className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white"
									animate={{
										x: notificationsEnabled ? 20 : 0
									}}
								/>
							</motion.button>
						</div>
					</motion.div>

					{/* Dark Mode */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
					>
						<div className="shadow-soft-lg flex items-center justify-between rounded-2xl bg-white p-5">
							<div className="flex items-center gap-3">
								<div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
									{isDark ? (
										<Moon size={20} className="text-purple-600" />
									) : (
										<Sun size={20} className="text-purple-600" />
									)}
								</div>
								<div>
									<p className="font-semibold text-gray-900">Appearance</p>
									<p className="text-sm text-gray-600">{isDark ? 'Dark' : 'Light'} mode</p>
								</div>
							</div>
							<div
								className={`relative h-7 w-12 rounded-full transition-colors ${isDark ? 'bg-mochi-sage' : 'bg-gray-300'}`}
							>
								<div
									className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white"
									style={{ transform: `translateX(${isDark ? 20 : 0}px)` }}
								/>
							</div>
						</div>
					</motion.div>

					{/* About */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
					>
						<button className="shadow-soft-lg hover:shadow-soft-xl flex w-full items-center gap-3 rounded-2xl bg-white p-5 transition-shadow">
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
								<HelpCircle size={20} className="text-green-600" />
							</div>
							<div className="flex-1 text-left">
								<p className="font-semibold text-gray-900">About Puing House</p>
								<p className="text-sm text-gray-600">Version 1.0.0</p>
							</div>
						</button>
					</motion.div>

					{/* Household PIN */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 }}
					>
						<div className="shadow-soft-lg rounded-2xl bg-white p-5">
							<h3 className="mb-3 font-semibold text-gray-900">Household PIN</h3>
							<p className="mb-4 text-sm text-gray-600">Current PIN: ••••</p>
							<button className="bg-mochi-beige text-mochi-brown hover:bg-mochi-warm w-full rounded-xl px-4 py-2 font-medium transition-colors">
								Change PIN
							</button>
						</div>
					</motion.div>

					{/* Logout */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.5 }}
					>
						<motion.button
							onClick={handleLogout}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className="shadow-soft-lg flex w-full items-center gap-3 rounded-2xl bg-red-100 p-5 transition-colors hover:bg-red-200"
						>
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-200">
								<LogOut size={20} className="text-red-600" />
							</div>
							<div className="flex-1 text-left">
								<p className="font-semibold text-red-600">Logout</p>
								<p className="text-sm text-red-500">Leave Puing House</p>
							</div>
						</motion.button>
					</motion.div>
				</div>
			</div>
		</div>
	);
}
