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
					title: 'GroundLens',
					description: 'Guardrails for LLM answers. GroundLens checks an LLM answer against its sources without a model, decides PASS, REVIEW or FAIL under your policy, and keeps a signed record.',
				},
				blog: {
					title: 'Blog',
					description: 'Research behind GroundLens: hallucination, grounding and verification of LLM answers.',
				},
				projects: {
				    title: 'Projects',
				    description: 'GroundLens, guardrails for LLM answers, and the research it grew from.',
				},
			},
		}),
	],
});

export default config;
