/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta base CIBA
        'azul-suave': '#E8F1FA',
        'azul-profundo': '#1E3A5F',
        'crema': '#FDF8F0',
        'blanco': '#FFFFFF',
        'negro-suave': '#1A1A1A',
        'gris-texto': '#3F3F46',
        'gris-borde': '#E4E4E7',

        // Acentos por área
        'crianza': {
          DEFAULT: '#FF8A7A',
          suave: '#FFE1DC',
          fuerte: '#E5644F'
        },
        'informatica': {
          DEFAULT: '#3EC5B5',
          suave: '#D6F4F0',
          fuerte: '#1F9A8C'
        },
        'bienestar': {
          DEFAULT: '#8FCB9B',
          suave: '#E3F3E6',
          fuerte: '#5AA86B'
        },
        'acompanamiento': {
          DEFAULT: '#A99BE0',
          suave: '#ECE7F8',
          fuerte: '#7B69C9'
        },

        // Semánticos
        'exito': '#2E9E5B',
        'advertencia': '#D97706',
        'peligro': '#C81E1E',
        'info': '#2563EB'
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Manrope', 'Inter', 'system-ui', 'sans-serif']
      },
      fontSize: {
        // Base 17 px en móvil (accesibilidad lectura)
        'base': ['17px', { lineHeight: '1.65' }],
        'base-lg': ['18px', { lineHeight: '1.7' }],
        'h1': ['clamp(1.75rem, 4vw, 2.5rem)', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['clamp(1.4rem, 3vw, 1.875rem)', { lineHeight: '1.3', fontWeight: '700' }],
        'h3': ['clamp(1.2rem, 2.5vw, 1.5rem)', { lineHeight: '1.35', fontWeight: '600' }],
        'small': ['15px', { lineHeight: '1.5' }],
        'tiny': ['13px', { lineHeight: '1.4' }]
      },
      borderRadius: {
        'card': '16px',
        'btn': '12px',
        'pill': '9999px'
      },
      boxShadow: {
        'suave': '0 1px 2px rgba(30, 58, 95, 0.06), 0 2px 8px rgba(30, 58, 95, 0.04)',
        'media': '0 2px 4px rgba(30, 58, 95, 0.08), 0 8px 24px rgba(30, 58, 95, 0.08)',
        'elevada': '0 4px 8px rgba(30, 58, 95, 0.10), 0 16px 40px rgba(30, 58, 95, 0.12)'
      },
      transitionDuration: {
        'rapida': '150ms',
        'media': '200ms',
        'lenta': '250ms'
      },
      maxWidth: {
        'contenido': '72rem',
        'lectura': '44rem'
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem'
      }
    }
  },
  plugins: []
};
