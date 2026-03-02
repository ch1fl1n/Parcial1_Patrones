"use client";

import React, {useEffect, useRef, useState} from "react";

export default function TTSButton({ text = "", lang = "es-CO", label = "Leer alerta", small = false }) {
  // Do not access `window` during render to avoid SSR/client markup mismatch.
  const synthRef = useRef(null);
  const [supported, setSupported] = useState(false); // initially false so server and initial client markup match
  // voices list is stored in selectedVoiceRef; we avoid keeping an extra state to prevent unnecessary re-renders
  const [isSpeaking, setIsSpeaking] = useState(false);
  const selectedVoiceRef = useRef(null);

  useEffect(() => {
      if ("undefined" === typeof window) {
          return;
      }
      if (!("speechSynthesis" in window)) {
          return;
      }

    synthRef.current = window.speechSynthesis;
    setSupported(true);

    const load = () => {
      const v = (synthRef.current && synthRef.current.getVoices()) || [];
      selectedVoiceRef.current = v.find((vv) => vv.lang && vv.lang.startsWith(lang)) || v[0] || null;
    };

    load();
      if (synthRef.current) {
          synthRef.current.onvoiceschanged = load;
      }

    return () => {
        if (synthRef.current) {
            synthRef.current.onvoiceschanged = null;
        }
    };
  }, [lang]);

  useEffect(() => {
      if ("undefined" === typeof window) {
          return;
      }
      if (!("speechSynthesis" in window)) {
          return;
      }

    const onEnd = () => setIsSpeaking(false);
    window.addEventListener("speechend", onEnd);
    return () => window.removeEventListener("speechend", onEnd);
  }, []);

  const speak = () => {
    const synth = synthRef.current;
    if (!synth) {
      alert("Text-to-speech no disponible en este navegador.");
      return;
    }
    if (synth.speaking) {
      synth.cancel();
    }
      if (!text || 0 === text.trim().length) {
          return;
      }
    const u = new SpeechSynthesisUtterance(text);
      if (selectedVoiceRef.current) {
          u.voice = selectedVoiceRef.current;
      }
    u.lang = lang;
    u.rate = 1;
    u.pitch = 1;
    u.onstart = () => setIsSpeaking(true);
    u.onend = () => setIsSpeaking(false);
    u.onpause = () => setIsSpeaking(false);
    u.onerror = () => setIsSpeaking(false);
    synth.speak(u);
  };

  const stop = () => {
    const synth = synthRef.current;
      if (!synth) {
          return;
      }
    synth.cancel();
    setIsSpeaking(false);
  };

  // Render a disabled button by default (server and initial client render will match).
  if (!supported) {
    return (
      <button className={small ? "btn" : "btn btn-ghost"} disabled title="TTS no disponible">
        {label}
      </button>
    );
  }

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <button
        onClick={() => (isSpeaking ? stop() : speak())}
        className={isSpeaking ? "btn btn-primary" : "btn"}
        aria-pressed={isSpeaking}
        title={isSpeaking ? "Detener lectura" : "Leer texto"}
      >
        {isSpeaking ? "Detener" : label}
      </button>
      {isSpeaking && (
        <button onClick={stop} className="btn btn-ghost" title="Parar">
          Parar
        </button>
      )}
    </div>
  );
}
