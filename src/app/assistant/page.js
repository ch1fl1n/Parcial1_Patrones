"use client";

import React, {useState} from "react";
import styles from "./page.module.css";
import VoiceAssistant from "@/components/VoiceAssistant";
import ChatBot from "@/components/ChatBot";

export default function AssistantPage() {
  const [mode, setMode] = useState("chat"); // "chat" or "voice"

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className="text-h3">🤖 Asistente Virtual DIR-Soacha</h1>
          <p className="text-body1">
            Interactúa con nuestro asistente de IA especializado en resiliencia climática.
            Elige entre conversación por texto o voz.
          </p>
        </section>

        <section className={styles.modeSwitcher}>
          <button
              className={`${styles.modeBtn} ${"chat" === mode ? styles.active : ""}`}
            onClick={() => setMode("chat")}
          >
            💬 Chat de Texto
          </button>
          <button
              className={`${styles.modeBtn} ${"voice" === mode ? styles.active : ""}`}
            onClick={() => setMode("voice")}
          >
            🎤 Asistente de Voz
          </button>
        </section>

        <section className={styles.assistantSection}>
            {"chat" === mode ? (
            <div className={styles.modeContent}>
              <div className={styles.modeInfo}>
                <h3 className="text-h6">💬 Chat Conversacional</h3>
                <p className="text-body2">
                  Escribe tus preguntas y recibe respuestas personalizadas. El chat mantiene
                  el contexto de la conversación para respuestas más precisas.
                </p>
                <ul className={styles.featureList}>
                  <li>✓ Historial de conversación</li>
                  <li>✓ Respuestas contextualizadas</li>
                  <li>✓ Acciones rápidas predefinidas</li>
                  <li>✓ Lectura de respuestas con TTS</li>
                </ul>
              </div>
              <ChatBot />
            </div>
          ) : (
            <div className={styles.modeContent}>
              <div className={styles.modeInfo}>
                <h3 className="text-h6">🎤 Asistente de Voz</h3>
                <p className="text-body2">
                  Habla naturalmente para hacer preguntas. Ideal para situaciones donde
                  no puedes usar las manos o prefieres interacción por voz.
                </p>
                <ul className={styles.featureList}>
                  <li>✓ Reconocimiento de voz en español</li>
                  <li>✓ Transcripción en tiempo real</li>
                  <li>✓ Respuestas habladas (TTS)</li>
                  <li>✓ Manos libres para emergencias</li>
                </ul>
              </div>
              <VoiceAssistant />
            </div>
          )}
        </section>

        <section className={styles.infoCards}>
          <div className={styles.infoCard}>
            <div className={styles.cardIcon}>🌊</div>
            <h4 className="text-body1"><strong>Riesgos de Inundación</strong></h4>
            <p className="text-body2">
              Consulta niveles de riesgo por zona, factores agravantes y medidas preventivas.
            </p>
          </div>
          
          <div className={styles.infoCard}>
            <div className={styles.cardIcon}>🚨</div>
            <h4 className="text-body1"><strong>Protocolos de Emergencia</strong></h4>
            <p className="text-body2">
              Aprende qué hacer en cada nivel de alerta y cómo evacuar de forma segura.
            </p>
          </div>
          
          <div className={styles.infoCard}>
            <div className={styles.cardIcon}>📊</div>
            <h4 className="text-body1"><strong>Sistema AVCA/CRMC</strong></h4>
            <p className="text-body2">
              Información sobre análisis de vulnerabilidad y capacidades comunitarias.
            </p>
          </div>
        </section>

        <section className={styles.privacyNotice}>
          <h3 className="text-h6">🔒 Privacidad y Datos</h3>
          <p className="text-body2">
            Las conversaciones se procesan en tiempo real y no se almacenan permanentemente.
            Los datos de voz se transcriben mediante los servicios del navegador y solo el
            texto se envía a nuestro servidor de IA. Toda la información se maneja según
            las políticas de Cruz Roja Colombiana.
          </p>
        </section>
      </main>

      <footer className={styles.footer}>
        <p className="text-caption">
          DIR-Soacha © 2025 - Cruz Roja Colombiana | Sistema de Resiliencia Climática
        </p>
      </footer>
    </div>
  );
}
