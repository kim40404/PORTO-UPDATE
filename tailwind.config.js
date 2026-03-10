export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                'bg-void': '#080808',
                'bg-deep': '#0d0d0d',
                'metal-dark': '#1a1a1a',
                'metal-mid': '#2a2a2a',
                'metal-surface': '#3d3d3d',
                'molten-gold': '#c8860a',
                'molten-ember': '#e8a020',
                'molten-glow': '#f5c842',
                'liquid-silver': '#b0b8c8',
                'liquid-chrome': '#d0d8e8',
                'electric-cyan': '#00d4ff',
                'cool-accent': '#7c3aed',
            },
            fontFamily: {
                display: ['Bebas Neue', 'sans-serif'],
                body: ['Syne', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'shimmer': 'shimmer 3s linear infinite',
                'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
                'molten-flow': 'molten-flow 8s ease infinite',
            },
        },
    },
    plugins: [],
};
