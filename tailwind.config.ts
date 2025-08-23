import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				modern: {
					dark: 'hsl(var(--modern-dark))',
					light: 'hsl(var(--modern-light))',
					beige: 'hsl(var(--modern-beige))',
					warm: 'hsl(var(--modern-warm))'
				},
				ragdoll: {
					cream: 'hsl(35 25% 97%)',       /* #FAF8F5 - Main cream background */
					'cream-dark': 'hsl(35 20% 92%)', /* #F0ECEA - Darker cream */
					blue: 'hsl(210 25% 55%)',        /* #7296B8 - Ragdoll eye blue */
					'blue-light': 'hsl(210 15% 80%)', /* #C2D1E0 - Light blue-gray */
					lavender: 'hsl(260 20% 85%)',    /* #D9D1E8 - Soft lavender */
					'lavender-light': 'hsl(240 15% 90%)', /* #E8E6F0 - Light lavender */
					gray: 'hsl(220 8% 50%)',         /* #737884 - Medium gray */
					'gray-dark': 'hsl(220 8% 25%)',  /* #3C3F47 - Charcoal gray */
					'gray-light': 'hsl(220 15% 85%)' /* #D1CFDB - Light gray */
				}
			},
			fontFamily: {
				playfair: ['Playfair Display', 'serif'],
				crimson: ['Crimson Text', 'serif'],
			},
			backgroundImage: {
				'gradient-subtle': 'var(--gradient-subtle)',
				'gradient-overlay': 'var(--gradient-overlay)',
			},
			boxShadow: {
				modern: 'var(--shadow-modern)',
				hover: 'var(--shadow-hover)',
				card: 'var(--shadow-card)',
			},
			transitionProperty: {
				smooth: 'var(--transition-smooth)',
				bounce: 'var(--transition-bounce)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'slow-float-1': {
					'0%, 100%': { 
						transform: 'translateY(0px) translateX(0px)', 
						opacity: '0.6'
					},
					'25%': { 
						transform: 'translateY(-40px) translateX(15px)', 
						opacity: '0.8'
					},
					'50%': { 
						transform: 'translateY(-20px) translateX(-10px)', 
						opacity: '1'
					},
					'75%': { 
						transform: 'translateY(30px) translateX(20px)', 
						opacity: '0.7'
					}
				},
				'slow-float-2': {
					'0%, 100%': { 
						transform: 'translateY(0px) translateX(0px)', 
						opacity: '0.5'
					},
					'30%': { 
						transform: 'translateY(25px) translateX(-20px)', 
						opacity: '0.8'
					},
					'60%': { 
						transform: 'translateY(-35px) translateX(10px)', 
						opacity: '0.9'
					},
					'90%': { 
						transform: 'translateY(15px) translateX(-5px)', 
						opacity: '0.6'
					}
				},
				'slow-float-3': {
					'0%, 100%': { 
						transform: 'translateY(0px) translateX(0px)', 
						opacity: '0.4'
					},
					'20%': { 
						transform: 'translateY(-50px) translateX(25px)', 
						opacity: '0.7'
					},
					'45%': { 
						transform: 'translateY(20px) translateX(-15px)', 
						opacity: '0.9'
					},
					'70%': { 
						transform: 'translateY(-30px) translateX(30px)', 
						opacity: '0.8'
					},
					'85%': { 
						transform: 'translateY(40px) translateX(-10px)', 
						opacity: '0.5'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'slow-float-1': 'slow-float-1 25s ease-in-out infinite',
				'slow-float-2': 'slow-float-2 30s ease-in-out infinite',
				'slow-float-3': 'slow-float-3 35s ease-in-out infinite'
			}
		}
	},
	plugins: [tailwindcssAnimate],
} satisfies Config;
