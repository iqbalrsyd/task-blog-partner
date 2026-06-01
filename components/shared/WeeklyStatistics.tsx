'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export type WeeklyStatisticDay = {
	key: string;
	weekdayLabel: string;
	dateLabel: string;
	monthLabel: string;
};

type WeeklyStatisticsProps = {
	title: string;
	description: string;
	days: WeeklyStatisticDay[];
	renderContent: (day: WeeklyStatisticDay) => React.ReactNode;
	defaultDayKey?: string;
};

export default function WeeklyStatistics({
	title,
	description,
	days,
	renderContent,
	defaultDayKey
}: WeeklyStatisticsProps) {
	const initialDayKey = useMemo(() => {
		if (defaultDayKey && days.some((day) => day.key === defaultDayKey)) {
			return defaultDayKey;
		}

		return days.at(-1)?.key || '';
	}, [days, defaultDayKey]);

	const [selectedDayKey, setSelectedDayKey] = useState(initialDayKey);

	useEffect(() => {
		setSelectedDayKey((current) => {
			if (days.some((day) => day.key === current)) return current;
			return initialDayKey;
		});
	}, [days, initialDayKey]);

	const selectedIndex = Math.max(
		days.findIndex((day) => day.key === selectedDayKey),
		days.length - 1
	);
	const selectedDay = days[selectedIndex] || days.at(-1);

	const move = (direction: -1 | 1) => {
		if (!days.length) return;
		const currentIndex = days.findIndex((day) => day.key === selectedDayKey);
		const safeIndex = currentIndex >= 0 ? currentIndex : days.length - 1;
		const nextIndex = Math.min(Math.max(safeIndex + direction, 0), days.length - 1);
		setSelectedDayKey(days[nextIndex].key);
	};

	if (!selectedDay) return null;

	return (
		<section className="mx-auto mb-8 max-w-2xl px-4">
			<div className="shadow-soft-lg overflow-hidden rounded-[28px] bg-white ring-1 ring-black/5">
				<div className="from-mochi-beige to-mochi-cream bg-gradient-to-r via-white px-5 py-5 sm:px-6">
					<div className="flex items-start justify-between gap-4">
						<div>
							<p className="text-mochi-brown/70 text-[11px] uppercase tracking-[0.3em]">Weekly Statistics</p>
							<h2 className="mt-2 text-2xl font-bold">{title}</h2>
							<p className="mt-1 text-sm text-gray-600">{description}</p>
						</div>
						<div className="flex items-center gap-2">
							<button
								type="button"
								onClick={() => move(-1)}
								className="shadow-soft flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 transition-transform hover:scale-105"
								aria-label="Previous day"
							>
								<ChevronLeft size={18} />
							</button>
							<button
								type="button"
								onClick={() => move(1)}
								className="shadow-soft flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 transition-transform hover:scale-105"
								aria-label="Next day"
							>
								<ChevronRight size={18} />
							</button>
						</div>
					</div>

					<div className="mt-4 flex gap-2 overflow-x-auto pb-1">
						{days.map((day, index) => {
							const isActive = day.key === selectedDayKey;
							return (
								<motion.button
									key={day.key}
									type="button"
									onClick={() => setSelectedDayKey(day.key)}
									whileTap={{ scale: 0.98 }}
									className={`min-w-20 shrink-0 rounded-2xl px-3 py-2 text-left transition-all ${
										isActive
											? 'bg-mochi-brown text-white shadow-soft'
											: 'bg-white/80 text-gray-600 hover:bg-white'
									}`}
									style={{ animationDelay: `${index * 40}ms` }}
								>
									<p className="text-[10px] uppercase tracking-[0.2em] opacity-80">{day.weekdayLabel}</p>
									<p className="mt-1 text-lg font-bold">{day.dateLabel}</p>
									<p className="text-[11px] opacity-80">{day.monthLabel}</p>
								</motion.button>
							);
						})}
					</div>
				</div>

				<div className="px-5 py-5 sm:px-6">{renderContent(selectedDay)}</div>
			</div>
		</section>
	);
}
