import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import expressiveCode from 'astro-expressive-code';
import spectre from './package/src';
import { spectreDark } from './src/ec-theme';

const config = defineConfig({
	site: 'https://groundlens.dev',
	output: 'static',
	integrations: [
		expressiveCode({
			themes: [spectreDark],
		}),
		mdx(),
		sitemap(),
		spectre({
			name: 'groundlens',
			themeColor: '#fc7604',
			openGraph: {
				home: {
					title: 'groundlens',
					description: 'Triage for LLM outputs. Geometric detection. No second LLM. Deterministic. Auditable.',
				},
				blog: {
					title: 'Blog',
					description: 'News and guides for groundlens.',
				},
				projects: {
					title: 'Projects',
				},
			},
		}),
	],
});

export default config;
