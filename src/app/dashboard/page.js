"use client";

import {useEffect, useRef} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import styles from "./page.module.css";
import VoiceAssistant from "@/components/VoiceAssistant";
// InteractiveMap import removed (not used) to satisfy linter

export default function DashboardPrincipal() {
  const iframeRef = useRef(null);
  const cardRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    function resize() {
      if (iframeRef.current && cardRef.current) {
        // Set iframe height to fill the wrapper exactly
        iframeRef.current.style.height = `${cardRef.current.clientHeight}px`;
      }
    }

    // Initial resize
    resize();

    // Resize on window resize
    window.addEventListener("resize", resize);

    // Observe wrapper size changes (safer for dynamic layout)
    let ro = null;
    try {
      ro = new ResizeObserver(resize);
        if (cardRef.current) {
            ro.observe(cardRef.current);
        }
    } catch {
      // ResizeObserver may not be available in old browsers; window resize covers most cases
    }

    return () => {
      window.removeEventListener("resize", resize);
        if (ro) {
            ro.disconnect();
        }
    };
  }, []);

  return (
    <div className={styles.layout}>
      {/* Sidebar nav */}
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <strong>Cruz Roja Colombiana</strong>
          <small>Soacha</small>
        </div>
        <nav className={styles.menu} aria-label="Secciones">
            <Link href="/alerts" className={"/alerts" === pathname ? styles.activeLink : undefined}>🔔 Alertas</Link>
            <Link href="/reports" className={"/reports" === pathname ? styles.activeLink : undefined}>🗂️ Reportes</Link>
            <Link href="/impact" className={"/impact" === pathname ? styles.activeLink : undefined}>📊 Análisis</Link>
            <Link href="/assistant" className={"/assistant" === pathname ? styles.activeLink : undefined}>🎤
                Asistente</Link>
        </nav>
        
        <div className={styles.voiceWidget}>
          <VoiceAssistant compact />
        </div>
      </aside>

      {/* Main content: embedded Looker Studio iframe (keeps sidebar) */}
      <main className={styles.main}>
        <header>
          <h1 className="text-h3">Resiliencia Climática Urbana</h1>
          <p className="text-body2" style={{ color: "var(--color-text-secondary)", marginTop: 8 }}>
            Panel integrado de análisis de vulnerabilidad y riesgo climático
          </p>
        </header>
  <section ref={cardRef} className={styles.mapCard}>
          <iframe
            ref={iframeRef}
            className={styles.map}
            title="Looker Studio - Panel de Resiliencia"
            src="https://lookerstudio.google.com/embed/reporting/8d93aad0-7396-47b7-902b-2799ec917ccc/page/p_v4y9yvcqxd"
            frameBorder="0"
            scrolling="no"
            style={{ border: 0 }}
            allowFullScreen
            sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          />
        </section>
      </main>
    </div>
  );
}
