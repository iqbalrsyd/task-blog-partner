'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useHouseholdStore } from '@/lib/stores';

export default function PINAuthPage() {
	const [pin, setPin] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const authenticate = useHouseholdStore((state) => state.authenticate);

	const handlePinInput = (digit: string) => {
		if (pin.length < 4) {
			const nextPin = pin + digit;
			setPin(nextPin);
			setError('');
			if (nextPin.length === 4) {
				void handleSubmit(nextPin);
			}
		}
	};

	const handleBackspace = () => {
		setPin(pin.slice(0, -1));
	};

	const handleSubmit = async (value: string) => {
		if (value.length !== 4 || loading) return;
		setLoading(true);
		const success = await authenticate(value);
		setLoading(false);

		if (success) {
			window.location.reload();
		} else {
			setError('Invalid PIN. Try again.');
			setPin('');
		}
	};

	const handleManualSubmit = () => {
		void handleSubmit(pin);
	};

	return (
		<div className="from-mochi-cream to-mochi-beige flex min-h-screen items-center justify-center bg-gradient-to-br via-white p-4">
			{/* Decorative elements */}
			<div className="absolute right-10 top-10 text-6xl opacity-10">🐱</div>
			<div className="absolute bottom-10 left-10 text-6xl opacity-10">🏠</div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="w-full max-w-sm"
			>
				<div className="mb-12 text-center">
					<motion.div
						animate={{ y: [0, -8, 0] }}
						transition={{ duration: 2, repeat: Infinity }}
						className="mb-4 inline-block text-6xl"
					>
						🏠
					</motion.div>
					<h1 className="mb-2 text-4xl font-bold text-gray-900">Puing House</h1>
					<p className="text-gray-600">Welcome home, you two 💕</p>
				</div>

				<div className="shadow-soft-lg mb-6 rounded-3xl bg-white p-8">
					<p className="mb-8 text-center font-medium text-gray-700">Enter your household PIN</p>

					{/* PIN Display */}
					<div className="mb-8 flex justify-center gap-3">
						{[0, 1, 2, 3].map((index) => (
							<motion.div
								key={index}
								initial={{ scale: 0.8 }}
								animate={{ scale: 1 }}
								className="from-mochi-beige to-mochi-warm text-mochi-brown shadow-soft flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl font-bold"
							>
								{pin[index] ? '●' : '○'}
							</motion.div>
						))}
					</div>

					{/* Error Message */}
					{error && (
						<motion.div
							initial={{ opacity: 0, x: -10 }}
							animate={{ opacity: 1, x: 0 }}
							className="mb-6 text-center text-sm font-medium text-red-500"
						>
							{error}
						</motion.div>
					)}

					{/* Number Pad */}
					<div className="mb-6 grid grid-cols-3 gap-3">
						{[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
							<button
								key={num}
								onClick={() => handlePinInput(String(num))}
								disabled={pin.length >= 4}
								className="bg-mochi-beige hover:bg-mochi-warm text-mochi-brown shadow-soft rounded-xl py-4 text-lg font-semibold transition-colors disabled:opacity-50"
							>
								{num}
							</button>
						))}
					</div>

					<div className="grid grid-cols-3 gap-3">
						<div />
						<button
							onClick={() => handlePinInput('0')}
							disabled={pin.length >= 4}
							className="bg-mochi-beige hover:bg-mochi-warm text-mochi-brown shadow-soft rounded-xl py-4 text-lg font-semibold transition-colors disabled:opacity-50"
						>
							0
						</button>
						<button
							onClick={handleBackspace}
							className="shadow-soft rounded-xl bg-red-100 py-4 text-lg font-semibold text-red-600 transition-colors hover:bg-red-200"
						>
							⌫
						</button>
					</div>

					{/* Submit Button */}
					<motion.button
						onClick={handleManualSubmit}
						disabled={pin.length !== 4 || loading}
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						className="from-mochi-sage to-mochi-sage shadow-soft mt-8 w-full rounded-2xl bg-gradient-to-r py-4 font-semibold text-white transition-all disabled:cursor-not-allowed disabled:opacity-50"
					>
						{loading ? 'Unlocking...' : 'Enter Puing House'}
					</motion.button>
				</div>

				{/* Hint */}
				<p className="text-center text-sm text-gray-500">Local demo PIN: 1234</p>
			</motion.div>
		</div>
	);
}
