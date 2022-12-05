const isProd = process.env.NODE_ENV === 'production';

require('esbuild')
	.build({
		entryPoints: ['./lambda.ts'],
		bundle: true,
		outfile: './dist/index.js',
		platform: 'node',
		target: ['node16'],
		minify: isProd,
	})
	.catch(() => process.exit(1));
