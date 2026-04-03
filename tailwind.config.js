/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-container": "#1a233b",
        "on-error-container": "#93000a",
        "inverse-surface": "#2d3133",
        "tertiary-fixed-dim": "#dec29a",
        "primary-fixed": "#dae2fd",
        "on-tertiary-fixed": "#271901",
        "tertiary": "#6366f1", /* Violet Accent */
        "surface-container-highest": "#e0e3e5",
        "on-tertiary-container": "#98805d",
        "on-surface": "#191c1e",
        "error": "#ba1a1a",
        "secondary-fixed": "#d5e3fc",
        "inverse-primary": "#bec6e0",
        "surface-variant": "#e0e3e5",
        "on-secondary": "#ffffff",
        "surface-container": "#eceef0",
        "outline": "#76777d",
        "on-primary-fixed-variant": "#3f465c",
        "surface-container-high": "#e6e8ea",
        "on-primary-container": "#7c839b",
        "background": "#fdfdfe",
        "on-tertiary": "#ffffff",
        "tertiary-fixed": "#fcdeb5",
        "primary-fixed-dim": "#bec6e0",
        "surface-bright": "#f7f9fb",
        "inverse-on-surface": "#eff1f3",
        "on-background": "#191c1e",
        "tertiary-container": "#271901",
        "on-secondary-fixed-variant": "#3a485b",
        "outline-variant": "#c6c6cd",
        "surface": "#fdfdfe",
        "on-secondary-container": "#57657a",
        "on-error": "#ffffff",
        "on-secondary-fixed": "#0d1c2e",
        "on-primary-fixed": "#131b2e",
        "surface-tint": "#565e74",
        "surface-dim": "#d8dadc",
        "secondary": "#10b981", /* Emerald Accent */
        "on-primary": "#ffffff",
        "secondary-fixed-dim": "#b9c7df",
        "on-surface-variant": "#45464d",
        "surface-container-low": "#f2f4f6",
        "secondary-container": "#fef3c7", /* Amber Accent */
        "primary": "#0f172a",
        "surface-container-lowest": "#ffffff",
        "on-tertiary-fixed-variant": "#574425",
        "error-container": "#ffdad6"
      },
      fontFamily: {
        "headline": ["Epilogue", "sans-serif"],
        "body": ["Inter", "sans-serif"],
        "label": ["Inter", "sans-serif"]
      },
      borderRadius: {"DEFAULT": "0.125rem", "lg": "0.25rem", "xl": "0.5rem", "full": "0.75rem"},
      animation: {
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'fade-in': 'fadeIn 1s ease-out forwards',
        'float-slow': 'floatSlow 12s ease-in-out infinite',
        'float-medium': 'floatMedium 15s ease-in-out infinite',
        'float-fast': 'floatFast 10s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '33%': { transform: 'translate(30px, -50px) rotate(5deg)' },
          '66%': { transform: 'translate(-20px, 20px) rotate(-5deg)' },
        },
        floatMedium: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '50%': { transform: 'translate(-40px, 60px) rotate(-8deg)' },
        },
        floatFast: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(25px, -30px) scale(1.05)' },
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}
