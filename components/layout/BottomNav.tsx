'use client';

import { motion } from 'framer-motion';
import { Home, CheckSquare, Cat, Feather, Settings, Heart } from 'lucide-react';

interface BottomNavProps {
	currentPage: string;
	setCurrentPage: (page: string) => void;
}

const navItems = [
	{ id: 'home', label: 'Home', icon: Home },
	{ id: 'tasks', label: 'Tasks', icon: CheckSquare },
	{ id: 'mood', label: 'Mood', icon: Heart },
	{ id: 'mochi', label: 'Puing', icon: Cat },
	{ id: 'notes', label: 'Notes', icon: Feather },
	{ id: 'settings', label: 'Settings', icon: Settings }
];

export default function BottomNav({ currentPage, setCurrentPage }: BottomNavProps) {
	return (
		<motion.nav
			initial={{ y: 100 }}
			animate={{ y: 0 }}
			className="shadow-soft-xl fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white"
		>
			<div className="mx-auto flex max-w-2xl items-center justify-around px-4 py-4">
				{navItems.map((item) => {
					const Icon = item.icon;
					const isActive = currentPage === item.id;

					return (
						<motion.button
							key={item.id}
							onClick={() => setCurrentPage(item.id)}
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.95 }}
							className="flex flex-col items-center gap-1 rounded-xl px-3 py-2 transition-colors"
						>
							<motion.div
								animate={{
									backgroundColor: isActive ? '#A4B5A0' : 'transparent',
									color: isActive ? 'white' : '#8B7355'
								}}
								className="rounded-lg p-2"
							>
								<Icon size={24} />
							</motion.div>
							<span
								className={`text-xs font-medium ${isActive ? 'text-mochi-brown' : 'text-gray-500'}`}
							>
								{item.label}
							</span>
						</motion.button>
					);
				})}
			</div>
		</motion.nav>
	);
}
