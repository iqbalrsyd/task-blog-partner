'use client';

import { createContext, useContext, ReactNode, useEffect, useState } from 'react';

interface Theme {
	isDark: boolean;
	timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
}

const ThemeContext = createContext<Theme | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setTheme] = useState<Theme>({
		isDark: false,
		timeOfDay: 'morning'
	});

	useEffect(() => {
		const updateTheme = () => {
			const hour = new Date().getHours();
			let timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night' = 'morning';
			let isDark = false;

			if (hour >= 5 && hour < 12) {
				timeOfDay = 'morning';
			} else if (hour >= 12 && hour < 17) {
				timeOfDay = 'afternoon';
			} else if (hour >= 17 && hour < 21) {
				timeOfDay = 'evening';
			} else {
				timeOfDay = 'night';
				isDark = true;
			}

			setTheme({ isDark, timeOfDay });
		};

		updateTheme();
		const interval = setInterval(updateTheme, 60000);
		return () => clearInterval(interval);
	}, []);

	return (
		<ThemeContext.Provider value={theme}>
			<div className={theme.isDark ? 'dark' : ''}>{children}</div>
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error('useTheme must be used within ThemeProvider');
	}
	return context;
}
