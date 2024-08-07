import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config = {
	darkMode: ["class"],
	content: ["./public/**/*.{html,pug,js}", "./views/**/*.{html,pug,js}"],
	theme: {
		screens: {
			xs: "425px",
			...defaultTheme.screens,
		},
		container: {
			center: true,
			padding: {
				DEFAULT: "0",
			},
			/* screens: {
				"2xl": "1400px",
			}, */
		},
		extend: {
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				cetek: {
					50: "#ffe2ec",
					100: "#ffb1c5",
					200: "#ff7f9e",
					300: "#ff4d78",
					400: "#fe1d51",
					500: "#e50637",
					600: "#b3002b",
					700: "#81001f",
					800: "#4f0011",
					900: "#200005",
				},
			},
			fontFamily: { sans: ["Inter", ...defaultTheme.fontFamily.sans] },
		},
	},
	plugins: [
		require("tailwindcss-animate"),
		require("@tailwindcss/typography"),
		require("@tailwindcss/forms"),
		({ addComponents }: any) => {
			addComponents({
				".container": {
					"@apply max-sm:max-w-none sm:px-4": {},
				},
			});
		},
	],
} satisfies Config;

export default config;
