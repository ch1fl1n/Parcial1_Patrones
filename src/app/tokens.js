// Design tokens for colors and typography

export const COLORS = {
  // === Colores Institucionales ===
  "Rojo oficial": "#C8102E", // RGB (200, 16, 46)
  Blanco: "#FFFFFF",
  "Gris institucional": "#6E6E6E",
  "Rojo brillante (alterno)": "#FF4136",
  "Amarillo bandera": "#FFD700",
  "Azul bandera": "#007BFF",

  // === Modo Claro (principal) ===
  "light.background": "#FFFFFF",
  "light.surface": "#F8F8F8",
  "light.text.primary": "#333333",
  "light.text.secondary": "#6E6E6E",
  "light.primary": "#C8102E",
  "light.primary.hover": "#FF4136",
  "light.secondary": "#007BFF",
  "light.secondary.hover": "#005BB5",
  "light.accent.muted": "rgba(200,16,46,0.06)",
  "light.accent.soft": "rgba(0,123,255,0.06)",
  "light.border": "#DADADA",
  "light.alert": "#FFD700",
  "light.info": "#007BFF",
  "light.error": "#C8102E",

  // === Modo Oscuro ===
  "dark.background": "#121212",
  "dark.surface": "#1E1E1E",
  "dark.text.primary": "#FFFFFF",
  "dark.text.secondary": "#CCCCCC",
  "dark.primary": "#FF4136",
  "dark.primary.hover": "#FF5C5C",
  "dark.secondary": "#339CFF",
  "dark.secondary.hover": "#66BFFF",
  "dark.border": "#333333",
  "dark.alert": "#FFD700",
  "dark.info": "#339CFF",
  "dark.error": "#FF4136",
};

export const TEXT_STYLES = {
  // === Encabezados ===
  heading1: {
    fontSize: "3rem", // ≈ 48px
    fontWeight: 700,
    lineHeight: 1.2,
    usage: "Títulos principales, secciones hero",
  },
  heading2: {
    fontSize: "2.25rem", // ≈ 36px
    fontWeight: 600,
    lineHeight: 1.3,
    usage: "Encabezados de secciones",
  },
  heading3: {
    fontSize: "1.75rem", // ≈ 28px
    fontWeight: 600,
    lineHeight: 1.3,
    usage: "Subtítulos importantes",
  },
  heading4: {
    fontSize: "1.375rem", // ≈ 22px
    fontWeight: 600,
    lineHeight: 1.4,
    usage: "Subtítulos menores o encabezados secundarios",
  },
  heading5: {
    fontSize: "1.125rem", // ≈ 18px
    fontWeight: 600,
    lineHeight: 1.4,
    usage: "Títulos de sección, tarjetas",
  },
  heading6: {
    fontSize: "1rem", // ≈ 16px
    fontWeight: 600,
    lineHeight: 1.5,
    usage: "Encabezados pequeños o destacados internos",
  },

  // === Cuerpo de texto ===
  body1: {
    fontSize: "1rem", // ≈ 16px
    fontWeight: 400,
    lineHeight: 1.6,
    usage: "Texto principal, párrafos",
  },
  body2: {
    fontSize: "0.875rem", // ≈ 14px
    fontWeight: 400,
    lineHeight: 1.6,
    usage: "Texto secundario, metadatos o detalles",
  },

  // === Pequeños textos ===
  caption: {
    fontSize: "0.75rem", // ≈ 12px
    fontWeight: 400,
    lineHeight: 1.4,
    usage: "Leyendas, créditos o etiquetas pequeñas",
  },
  buttonText: {
    fontSize: "1rem", // ≈ 16px
    fontWeight: 600,
    lineHeight: 1.2,
    textTransform: "uppercase",
    usage: "Texto en botones o llamadas a la acción",
  },

  // === Modos de color aplicados a texto ===
  lightMode: {
    textPrimary: "#333333",
    textSecondary: "#6E6E6E",
    background: "#FFFFFF",
  },
  darkMode: {
    textPrimary: "#FFFFFF",
    textSecondary: "#CCCCCC",
    background: "#121212",
  },

  // === Fuente recomendada ===
  fontFamily: {
    // Integrate with Next.js Geist font if available
    primary:
      "var(--font-geist-sans, Inter, 'Open Sans', 'Helvetica Neue', Arial, sans-serif)",
    fallback: "sans-serif",
    usage:
      "Fuentes modernas, legibles y accesibles para cuerpo y encabezados",
  },
};
