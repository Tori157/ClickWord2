/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'custom-teal': '#19C3B2',
        'custom-white': '#FFFFFF',
        'custom-yellow': '#FFCB77'
      },
      borderWidth: {
        2: '2px'
      },
      borderRadius: {
        '2xl': '1rem'
      },
      fontSize: {
        '40px': '40px'
      }
    }
  },
  plugins: [
    require('daisyui'),
    function ({ addUtilities }) {
      addUtilities({
        '.box-base': {
          'text-align': 'center',
          display: 'flex',
          'justify-content': 'center',
          'align-items': 'center',
          width: '5rem',
          height: '5rem',
          'border-width': '2px',
          'border-radius': '1rem',
          'font-size': '40px'
        },
        '.unfilled-box': {
          'border-color': '#19C3B2',
          color: '#19C3B2'
        },
        '.filled-box': {
          'background-color': '#19C3B2',
          color: '#FFFFFF',
          'border-color': '#19C3B2'
        },
        '.hinted-box': {
          'background-color': '#FFCB77',
          color: '#FFFFFF',
          'border-color': '#FFCB77'
        },
        '.correct-box': {
          'background-color': '#18d144',
          color: '#FFFFFF',
          'border-color': '#18d144'
        },
        '.incorrect-box': {
          'background-color': '#ee6363',
          color: '#FFFFFF',
          'border-color': '#ee6363'
        }
      });
    }
  ]
};
