"use client";

import {useEffect, useRef, useState} from "react";
import styles from "./VoiceAssistant.module.css";
import TTSButton from "./TTSButton";

export default function VoiceAssistant({ compact = false }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(true);
  
  const recognitionRef = useRef(null);
  const [interimTranscript, setInterimTranscript] = useState("");

  useEffect(() => {
      if ("undefined" === typeof window) {
          return;
      }
    
    // Verificar soporte de Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      setError("Tu navegador no soporta reconocimiento de voz. Usa Chrome, Edge o Safari.");
      return;
    }

    // Inicializar reconocimiento de voz
    const recognition = new SpeechRecognition();
    recognition.lang = "es-CO"; // Español de Colombia
    recognition.continuous = false; // Parar después de una frase
    recognition.interimResults = true; // Mostrar resultados parciales
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log("🎤 Escuchando...");
      setIsListening(true);
      setError(null);
      setInterimTranscript("");
    };

    recognition.onresult = (event) => {
      let interim = "";
      let final = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }

      setInterimTranscript(interim);
      if (final) {
        console.log("📝 Transcripción final:", final);
        setTranscript(final);
        processVoiceCommand(final);
      }
    };

    recognition.onerror = (event) => {
      // Normalizar la clave de error (event.error puede ser string o un objeto)
      const rawErr = event?.error;
        const errKey = "string" === typeof rawErr
        ? rawErr
        : (rawErr && (rawErr.name || rawErr.message)) || String(rawErr);

      console.error("❌ Error de reconocimiento:", errKey, event);
      setIsListening(false);

      const errorMessages = {
        "no-speech": "No se detectó ninguna voz. Intenta de nuevo.",
        "audio-capture": "No se pudo acceder al micrófono. Verifica los permisos.",
        "not-allowed": "Permiso de micrófono denegado. Habilítalo en la configuración del navegador.",
        "network": "Error de conexión con el servicio de reconocimiento. Verifica tu internet.",
        "aborted": "Reconocimiento cancelado.",
      };

      // Mensaje por defecto si no está mapeado
      const friendly = errorMessages[errKey] || `Error de reconocimiento: ${errKey}`;
      setError(friendly);

      // Intento de reintento automático sólo para errores transitorios de red (una vez)
        if ("network" === errKey) {
        // Sólo reintentar si el navegador reporta estar online
        if (navigator.onLine) {
          console.log("🔁 Reintentando reconocimiento por error de red en 1.5s...");
          setTimeout(() => {
            try {
              recognition.start();
            } catch (e) {
              console.warn("No se pudo reanudar reconocimiento:", e);
            }
          }, 1500);
        }
      }
    };

    recognition.onend = () => {
      console.log("🔇 Reconocimiento detenido");
      setIsListening(false);
      setInterimTranscript("");
    };

    recognitionRef.current = recognition;

    return () => {
      // Al desmontar, detener el reconocimiento si está activo. Proteger con try/catch
      try {
          if (recognitionRef.current && 'function' === typeof recognitionRef.current.stop) {
          recognitionRef.current.stop();
        }
      } catch (err) {
        // Evitar lanzar errores durante el unmount
        console.warn('Warning: no se pudo detener el reconocimiento al desmontar:', err);
      }
    };
  }, []);

  const startListening = () => {
      if (!recognitionRef.current || isListening) {
          return;
      }
    
    setTranscript("");
    setResponse("");
    setError(null);
    
    try {
      recognitionRef.current.start();
    } catch (err) {
      console.error("Error al iniciar reconocimiento:", err);
      setError("No se pudo iniciar el reconocimiento de voz. Intenta de nuevo.");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const processVoiceCommand = async (text) => {
    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch("/api/ollama/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          query: text,
          context: "climate-resilience-assistant" 
        }),
      });

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setResponse(data.response);
      } else {
        throw new Error(data.error || "Error procesando la consulta");
      }
    } catch (err) {
      console.error("Error procesando comando de voz:", err);
      setError(`Error: ${err.message}`);
      setResponse("Lo siento, no pude procesar tu consulta. Intenta de nuevo.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isSupported) {
    return (
      <div className={styles.container}>
        <div className={styles.unsupported}>
          <div className={styles.icon}>🚫</div>
          <h3 className="text-h6">Voz no soportada</h3>
          <p className="text-body2">{error}</p>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className={styles.compactContainer}>
        <button
          onClick={isListening ? stopListening : startListening}
          disabled={isProcessing}
          className={`${styles.compactBtn} ${isListening ? styles.listening : ""}`}
          aria-label={isListening ? "Detener escucha" : "Activar asistente de voz"}
        >
          {isListening ? "🎙️" : "🎤"}
        </button>
        
        {(transcript || response) && (
          <div className={styles.compactPopup}>
            {transcript && (
              <div className={styles.compactTranscript}>
                <strong>Tú:</strong> {transcript}
              </div>
            )}
            {response && (
              <div className={styles.compactResponse}>
                <strong>Asistente:</strong> {response}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.iconLarge}>
            {isListening ? "🎙️" : isProcessing ? "🤖" : "🎤"}
          </div>
          <h3 className="text-h5">Asistente de Voz DIR-Soacha</h3>
          <p className="text-body2">
            Pregunta sobre alertas climáticas, riesgos de inundación y protocolos de emergencia
          </p>
        </div>

        <div className={styles.controls}>
          <button
            onClick={isListening ? stopListening : startListening}
            disabled={isProcessing}
            className={`${styles.micBtn} ${isListening ? styles.active : ""}`}
            aria-label={isListening ? "Detener escucha" : "Iniciar escucha"}
          >
            {isListening ? (
              <>
                <span className={styles.pulse}></span>
                🎙️ Escuchando...
              </>
            ) : isProcessing ? (
              "⏳ Procesando..."
            ) : (
              "🎤 Presiona para hablar"
            )}
          </button>
        </div>

        {interimTranscript && (
          <div className={styles.interim}>
            <span className={styles.label}>Transcribiendo:</span>
            <span className={styles.text}>{interimTranscript}</span>
          </div>
        )}

        {transcript && (
          <div className={styles.transcript}>
            <div className={styles.label}>
              <strong>🗣️ Tú preguntaste:</strong>
            </div>
            <p className="text-body1">{transcript}</p>
          </div>
        )}

        {response && (
          <div className={styles.response}>
            <div className={styles.labelRow}>
              <div className={styles.label}>
                <strong>🤖 Respuesta del asistente:</strong>
              </div>
              <TTSButton text={response} label="Escuchar respuesta" small />
            </div>
            <p className="text-body1">{response}</p>
          </div>
        )}

        {error && (
          <div className={styles.error}>
            <strong>⚠️ Error:</strong> {error}
          </div>
        )}

        <div className={styles.examples}>
          <p className="text-caption"><strong>Ejemplos de preguntas:</strong></p>
          <ul className="text-caption">
            <li>&ldquo;¿Cuál es el riesgo de inundación en El Danubio?&rdquo;</li>
            <li>&ldquo;¿Qué hacer en caso de alerta roja?&rdquo;</li>
            <li>&ldquo;¿Cuándo es temporada de lluvias?&rdquo;</li>
            <li>&ldquo;¿Cómo puedo reportar una inundación?&rdquo;</li>
            <li>&ldquo;¿Qué es el sistema AVCA?&rdquo;</li>
          </ul>
        </div>

        <div className={styles.info}>
          <p className="text-caption">
            💡 <strong>Consejo:</strong> Habla con claridad y espera la respuesta antes de hacer otra pregunta.
          </p>
        </div>
      </div>
    </div>
  );
}
