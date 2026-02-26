/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
  	extend: {
  		fontFamily: {
  			TextFontLight: [
  				'Light'
  			],
  			TextFontRegular: [
  				'Regular'
  			],
  			TextFontMedium: [
  				'Medium'
  			],
  			TextFontSemiBold: [
  				'SemiBold'
  			],
  			TextFontBold: [
  				'Bold'
  			]
  		},
  		colors: {
			mainColor: '#1E1E2F',
			secoundColor: '#F58220',
  			thirdColor: '#6B6A6A',
			fourthColor: '#565656',
			fifthColor: '#E8E8EA',
  			AddText: '#5E5E5E',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		boxShadow: {
  			'4xl': '0 10px 30px rgba(0, 0, 0, 0.5)'
  		},
  		backgroundColor: {
  			mainBgColor: '#1E1E2F',
  			secoundBgColor: '#F58220',
  			thirdBgColor: '#9D9D9D',
  			fourthColor: '#E7F1F8',
  			AddButton: '#ffffff'
  		},
  		screens: {
  			sm: '320px',
  			md: '640px',
  			lg: '740px',
  			xl: '1280px'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
