import type { Config } from "tailwindcss";

/**
 * Tokens de design (ver README.md § Direção visual).
 * Conceito: um "instrumento de precisão editorial" — o produto trata o
 * currículo como um documento real que será impresso, não como mais um
 * dashboard SaaS. Paleta fria e neutra (não o cliché "creme + serifada +
 * terracota"), com um único acento "selo/carimbo aprovado" em vez de
 * gradiente roxo-azul. Tipografia: serifada com caráter só em títulos,
 * grotesca técnica no corpo (não Inter), monoespaçada para metadados.
 *
 * Estes tokens alimentam tanto os componentes de tela (Fase 2-4) quanto,
 * futuramente, um módulo compartilhado consumido pelos templates de PDF
 * (Fase 7), para as duas renderizações não divergirem.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./templates/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#F5F6F8",
        surface: "#FFFFFF",
        ink: {
          DEFAULT: "#14213A",
          muted: "#5B6472",
        },
        accent: {
          DEFAULT: "#B8862E",
          ink: "#7A5A1E",
        },
        border: "#E2E5EA",
        success: "#1C6E5C",
        danger: "#B3432B",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        sm: "4px",
        md: "6px",
        lg: "10px",
      },
    },
  },
  plugins: [],
};

export default config;
