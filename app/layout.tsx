import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { ThemeProvider } from '@/lib/theme-context';

export const metadata: Metadata = {
	title: 'Puing House - Cozy Couple Productivity',
	description: 'A warm and cozy productivity app for you and your partner'
};

export const viewport = {
	width: 'device-width',
	initialScale: 1,
	maximumScale: 5
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className="bg-mochi-cream font-sans text-gray-900 transition-colors duration-500">
				<ThemeProvider>
					<div className="min-h-screen">{children}</div>
				</ThemeProvider>
			</body>
		</html>
	);
}
