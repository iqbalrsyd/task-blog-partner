/** @type {import('next').NextConfig} */
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const nextConfig = {
	images: {
		unoptimized: true
	},
	outputFileTracingRoot: __dirname
};

export default nextConfig;
