"use client";

import React, {useEffect, useMemo, useState} from "react";
import styles from "./page.module.css";
import TTSButton from "../../components/TTSButton";
import PushNotifications from "../../components/PushNotifications";

function severityColor(sev) {
    if ("high" === sev) {
        return "var(--color-error)";
    }      // #C8102E (Cruz Roja red)
    if ("medium" === sev) {
        return "var(--color-alert)";
    }    // #FFD700 (yellow)
  return "var(--color-success)";                        // #2E7D32 (green)
}

// eslint-disable-next-line no-unused-vars
function _LineChart({ points, color = "var(--color-secondary)" }) {
  const width = 720;
  const height = 120;
  const padding = 6;
  const xs = points.map((_, i) => (i / (points.length - 1)) * (width - padding * 2) + padding);
  const ys = points.map((v) => height - padding - (v / Math.max(...points)) * (height - padding * 2));
  const d = xs
      .map((x, i) => `${0 === i ? "M" : "L"}${x.toFixed(1)},${ys[i].toFixed(1)}`)
    .join(" ");
  return (
    <svg className={styles.chart} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="forecast chart">
      <path d={d} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export default function AlertsPage() {
  // simple alert state so the report buttons update counts
  const [alerts, setAlerts] = useState([]);
  // Track which thresholds we've already notified to avoid duplicate sends
  const [notified, setNotified] = useState({
    high: false,
    medium: false,
    combined: false,
    low: false,
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  function generateId() {
    return `A-${Date.now().toString().slice(-6)}`;
  }

  function addFloodReport(severity) {
    const newAlert = {
      id: generateId(),
      title: "Inundación reportada",
      severity,
      date: new Date().toISOString(),
      status: "active",
    };
    // Update alerts and check thresholds on the updated list
    setAlerts((prev) => {
      const next = [newAlert, ...prev];

      // Compute counts
        const high = next.filter((a) => "high" === a.severity).length;
        const medium = next.filter((a) => "medium" === a.severity).length;
        const low = next.filter((a) => "low" === a.severity).length;
      const combined = high + medium;

      // Threshold logic (notify once per threshold)
        if (!notified.high && 5 <= high) {
        sendPushNotification("high");
        setNotified((s) => ({ ...s, high: true }));
        } else if (!notified.medium && 5 <= medium) {
        sendPushNotification("medium");
        setNotified((s) => ({ ...s, medium: true }));
        } else if (!notified.combined && 5 <= combined) {
        // If combined red+yellow reaches threshold but individual counts didn't, send a medium alert
        sendPushNotification("medium");
        setNotified((s) => ({ ...s, combined: true }));
        } else if (!notified.low && 10 <= low) {
        sendPushNotification("low");
        setNotified((s) => ({ ...s, low: true }));
      }

      return next;
    });
  }

  async function sendPushNotification(severity) {
    try {
      const severityMessages = {
        high: {
          title: "🚨 ALERTA ALTA - Inundación Severa",
          body: "Inundación severa reportada. Riesgo inmediato a vida y propiedades. Active protocolos de evacuación.",
        },
        medium: {
          title: "⚠️ ALERTA MEDIA - Inundación Local",
          body: "Inundación local reportada. Posible daño a infraestructura. Manténgase alerta.",
        },
        low: {
          title: "ℹ️ ALERTA BAJA - Monitoreo",
          body: "Inconvenientes menores detectados. Seguimiento recomendado.",
        },
      };

      const message = severityMessages[severity] || severityMessages.medium;

      await fetch("/api/notifications/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...message,
          severity,
          data: { url: "/alerts", alertId: generateId() },
        }),
      });
    } catch (error) {
      console.error("Error enviando notificación push:", error);
    }
  }

  const counts = useMemo(() => {
      const high = alerts.filter((a) => "high" === a.severity).length;
      const medium = alerts.filter((a) => "medium" === a.severity).length;
      const low = alerts.filter((a) => "low" === a.severity).length;
    return { high, medium, low };
  }, [alerts]);

  // Note: Chart placeholder available via _LineChart; provide points from API if needed.

  // Load the lottie-player web component (LottieFiles player) dynamically on client
  const [lottieReady, setLottieReady] = useState(false);
  useEffect(() => {
      if ("undefined" === typeof window) {
          return;
      }
    // If already defined, mark ready
    if (window.customElements && window.customElements.get && window.customElements.get("lottie-player")) {
      setLottieReady(true);
      return;
    }

    // only add the script once
    let script = document.querySelector('script[data-lottie-player]');
    if (!script) {
      script = document.createElement("script");
      script.src = "https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js";
      script.async = true;
      script.setAttribute("data-lottie-player", "true");
      document.body.appendChild(script);
    }

    // Wait until the component is defined
    const whenDefined = window.customElements && window.customElements.whenDefined;
    if (whenDefined) {
      window.customElements
        .whenDefined("lottie-player")
        .then(() => setLottieReady(true))
        .catch(() => setLottieReady(false));
    } else {
      // fallback: assume it will be ready shortly
      const t = setTimeout(() => setLottieReady(!!window.customElements && !!window.customElements.get("lottie-player")), 700);
      return () => clearTimeout(t);
    }
  }, []);

  return (
    <div className={styles.page}>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => setSidebarOpen((s) => !s)}
            aria-label={sidebarOpen ? "Ocultar sidebar" : "Mostrar sidebar"}
            className={styles.toggleBtn}
          >
            {sidebarOpen ? "«" : "☰"}
          </button>
          <div className={styles.brand}>
            <span aria-hidden>■</span>
            <span className="text-body1">Climate Resilience Tool</span>
          </div>
        </div>

      {/* Title */}

      {/* Layout: sidebar + main content */}
      <div className={`${styles.layout} ${!sidebarOpen ? styles.layoutCollapsed : ""}`}>
        {sidebarOpen && (
          <aside className={styles.sidebar} aria-label="Sidebar" aria-hidden={!sidebarOpen}>
            <div className={styles.brandBlock}>
              <div style={{ fontWeight: 800 }}>Cruz Roja Colombiana</div>
              <div style={{ color: "var(--color-text-secondary)", fontSize: 12 }}>Soacha</div>
            </div>

            {/* TTS for sidebar content: reads organization and alert level descriptions */}
            <div style={{ marginBottom: 12 }}>
              <TTSButton
                text={`Cruz Roja Colombiana, Soacha. Niveles de alerta: Alto — Inundaciones severas, riesgo inmediato a la vida y propiedades. Medio — Inundaciones locales, posible daño a infraestructura y servicios. Bajo — Inconvenientes menores, seguimiento recomendado.`}
                label="Leer información"
                small
              />
            </div>


            <div className={styles.levels}>
              <h3 style={{ margin: "6px 0 8px", fontSize: 14 }}>Niveles de alerta</h3>
              <div className={styles.levelItem}>
                <span className={styles.levelDot} style={{ background: "var(--color-error)" }} />
                <div>
                  <div style={{ fontWeight: 700 }}>Alto</div>
                  <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>Inundaciones severas, riesgo inmediato a la vida y propiedades.</div>
                </div>
              </div>

              <div className={styles.levelItem}>
                <span className={styles.levelDot} style={{ background: "var(--color-alert)" }} />
                <div>
                  <div style={{ fontWeight: 700 }}>Medio</div>
                  <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>Inundaciones locales, posible daño a infraestructura y servicios.</div>
                </div>
              </div>

              <div className={styles.levelItem}>
                <span className={styles.levelDot} style={{ background: "var(--color-success)" }} />
                <div>
                  <div style={{ fontWeight: 700 }}>Bajo</div>
                  <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>Inconvenientes menores, seguimiento recomendado.</div>
                </div>
              </div>
            </div>

                  <section className={styles.titleBlock}>
        <h1 className="text-h4">🚨 Sistema de Alertas Climáticas - Soacha</h1>
        <p className="text-body2">Monitoreo de condiciones meteorológicas y alertas preventivas para El Danubio y La María</p>
        
        <div className={styles.climateBanner}>
          <div className={styles.bannerItem}>
            <strong>🌊 Temporada Alta de Riesgo</strong>
            <p>Marzo - Junio, Octubre - Noviembre</p>
          </div>
          <div className={styles.bannerItem}>
            <strong>🌧️ Monitoreo IDEAM</strong>
            <p>Integración conceptual con datos en tiempo real</p>
          </div>
          <div className={styles.bannerItem}>
            <strong>📊 Histórico</strong>
            <p>71% incidencia de inundaciones</p>
          </div>
        </div>
      </section>

          </aside>
        )}

  <main className={styles.main}>
          {/* Dark dashboard tiles: three wide cards with big centered report buttons */}
          <section className={styles.darkGrid} aria-label="Resumen de alertas por severidad">
        {[
          { key: "high", label: "Severidad Alta", color: "var(--color-error)", count: 0 },
          { key: "medium", label: "Severidad Media", color: "var(--color-alert)", count: 0 },
          { key: "low", label: "Severidad Baja", color: "var(--color-success)", count: 0 },
        ].map((tile) => (
          <article key={tile.key} className={styles.tile}>
            <div className={styles.tileHeader}>
              <div className={styles.tileLabel}>{tile.label}</div>
              <div className={styles.tileCount} style={{ color: severityColor(tile.key) }}>{counts[tile.key]}</div>
            </div>

            <div className={styles.reportWrap}>
              <button
                onClick={() => addFloodReport(tile.key)}
                aria-label={`Reportar inundación ${tile.label}`}
                className={styles.reportBtn}
                style={{
                    background: tile.color,
                    color: "medium" === tile.key ? "var(--color-text-primary)" : "var(--color-blanco)"
                }}
              >
                <div style={{ fontSize: 36, marginBottom: 8 }}>
                    {"high" === tile.key ? (
                    <div className={styles.lottieWrap}>
                      {lottieReady ? (
                        <lottie-player
                          src="/animations/Weather-storm.json"
                          background="transparent"
                          speed="1"
                          style={{ width: 140, height: 140 }}
                          loop
                          autoplay
                          aria-label="storm animation"
                        />
                      ) : (
                        <div className={styles.svgWrap} aria-hidden>
                          <span style={{ fontSize: 80, lineHeight: 1 }}>🔴</span>
                        </div>
                      )}
                    </div>
                    ) : "medium" === tile.key ? (
                    <div className={styles.lottieWrap}>
                      {lottieReady ? (
                        <lottie-player
                          src="/animations/Rainy.json"
                          background="transparent"
                          speed="1"
                          style={{ width: 140, height: 140 }}
                          loop
                          autoplay
                          aria-label="rain animation"
                        />
                      ) : (
                        "🟡"
                      )}
                    </div>
                  ) : (
                    <div className={styles.lottieWrap}>
                      {lottieReady ? (
                        <lottie-player
                          src="/animations/Weather-partly-shower.json"
                          background="transparent"
                          speed="1"
                          style={{ width: 140, height: 140 }}
                          loop
                          autoplay
                          aria-label="weather animation"
                        />
                      ) : (
                        "🟢"
                      )}
                    </div>
                  )}
                </div>

                <div style={{ textAlign: "center" }}>
                  <div style={{ fontWeight: 800 }}>Reportar</div>
                    <div
                        style={{fontWeight: 900}}>{"high" === tile.key ? "Alto" : "medium" === tile.key ? "Medio" : "Bajo"}</div>
                </div>
              </button>
            </div>

            <div style={{ marginTop: 12, textAlign: "center" }}>
              <TTSButton
                text={`Reporte: ${tile.label}. Actualmente hay ${counts[tile.key]} reportes.`}
                label="Leer alerta"
                small
              />
            </div>
          </article>
        ))}
          </section>

          {/* Sección de notificaciones push */}
          {/* Sección de notificaciones push */}
          <section style={{ marginTop: 32 }}>
            <h2 className="text-h5" style={{ marginBottom: 16 }}>
              🔔 Configurar Notificaciones Push
            </h2>
            {/* Componente que maneja registro de service worker y suscripción push */}
            <PushNotifications />
          </section>
          </main>
        </div>
    </div>
  );
}
