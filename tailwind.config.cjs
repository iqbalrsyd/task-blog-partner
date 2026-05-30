/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./lib/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				mochi: {
					cream: '#FFF9F5',
					beige: '#F5E6D3',
					warm: '#E8D5C4',
					brown: '#8B7355',
					sage: '#A4B5A0',
					accent: '#D4A574',
				},
			},
			fontSize: {
				xs: ['12px', '16px'],
				sm: ['14px', '20px'],
				base: ['16px', '24px'],
				lg: ['18px', '28px'],
				xl: ['20px', '28px'],
				'2xl': ['24px', '32px'],
				'3xl': ['32px', '40px'],
			},
			borderRadius: {
				DEFAULT: '16px',
				sm: '8px',
				lg: '20px',
				xl: '24px',
			},
			boxShadow: {
				soft: '0 4px 12px rgba(0, 0, 0, 0.05)',
				'soft-lg': '0 8px 24px rgba(0, 0, 0, 0.08)',
				'soft-xl': '0 12px 32px rgba(0, 0, 0, 0.1)',
			},
			animation: {
				float: 'float 3s ease-in-out infinite',
				'gentle-bounce': 'gentle-bounce 2s ease-in-out infinite',
			},
			keyframes: {
				float: {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-8px)' },
				},
				'gentle-bounce': {
					'0%, 100%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.02)' },
				},
			},
		},
	},
	plugins: [],
};
