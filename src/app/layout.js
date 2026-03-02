import { Nunito } from "next/font/google";
import "./globals.css";
import NavBar from "../components/NavBar";
import ContactBubble from "../components/ContactBubble";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  // optionally add weights if desired: weights: ['400','700']
});

export const metadata = {
  title: "Algorythm",
  description: "Plataforma Geoespacial para la Resiliencia Climática Urbana en Soacha",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={nunito.variable}>
        <header style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 20px",
          borderBottom: "1px solid var(--color-border)",
          background: "var(--color-surface)",
          color: "var(--color-text-primary)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img
              src="/icons/CR-ES-Vertical-RGB.png"
              alt="Cruz Roja Colombiana vertical logo"
              style={{ height: 28, objectFit: "contain", display: "block" }}
            />
          </div>
          <NavBar />
        </header>
        {children}
        <ContactBubble />
      </body>
    </html>
  );
}
