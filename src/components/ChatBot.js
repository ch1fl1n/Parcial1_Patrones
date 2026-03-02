"use client";

import {useEffect, useRef, useState} from "react";
import styles from "./ChatBot.module.css";
import TTSButton from "./TTSButton";

export default function ChatBot({ context = "climate-resilience-assistant", compact = false, chatEndpoint = "/api/ollama/chat-bot" }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "¡Hola! Soy el asistente virtual de DIR-Soacha. Puedo ayudarte con información sobre alertas climáticas, riesgos de inundación y protocolos de emergencia. ¿En qué puedo ayudarte?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const quickActions = [
    { label: "🌊 Riesgo de inundación", query: "¿Cuál es el riesgo de inundación en El Danubio?" },
    { label: "🚨 Alerta roja", query: "¿Qué hacer en caso de alerta roja?" },
    { label: "📅 Temporada de lluvias", query: "¿Cuándo es temporada de lluvias?" },
    { label: "📞 Reportar emergencia", query: "¿Cómo reporto una emergencia?" },
  ];

  const sendMessage = async (messageText = input) => {
      if (!messageText.trim()) {
          return;
      }

    const userMessage = {
      role: "user",
      content: messageText.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      // Construir historial de conversación (últimos 6 mensajes para contexto)
      const conversationHistory = messages.slice(-6).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch(chatEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: messageText.trim(),
          context: context,
          history: conversationHistory
        }),
      });

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        const assistantMessage = {
          role: "assistant",
          content: data.response || data.message || data.content || JSON.stringify(data),
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || "Error procesando el mensaje");
      }
    } catch (error) {
      console.error("Error enviando mensaje:", error);
      const errorMessage = {
        role: "assistant",
        content: `Lo siento, ocurrió un error: ${error.message}. Por favor intenta de nuevo.`,
        timestamp: new Date().toISOString(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  const handleQuickAction = (query) => {
    sendMessage(query);
  };

  const handleKeyPress = (e) => {
      if ("Enter" === e.key && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "Chat reiniciado. ¿En qué puedo ayudarte ahora?",
        timestamp: new Date().toISOString()
      }
    ]);
  };

  if (compact) {
    return (
      <div className={styles.compactContainer}>
        <div className={styles.compactHeader}>
          <span className={styles.compactTitle}>💬 Chat Asistente</span>
          <button onClick={clearChat} className={styles.compactClearBtn} title="Limpiar chat">
            🗑️
          </button>
        </div>
        
        <div className={styles.compactMessages}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`${styles.compactMessage} ${
                  "user" === msg.role ? styles.compactUser : styles.compactAssistant
              }`}
            >
              <div className={styles.compactContent}>{msg.content}</div>
            </div>
          ))}
          {isTyping && (
            <div className={`${styles.compactMessage} ${styles.compactAssistant}`}>
              <div className={styles.typingIndicator}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className={styles.compactInputArea}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe tu pregunta..."
            className={styles.compactInput}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isTyping}
            className={styles.compactSendBtn}
          >
            ➤
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.chatCard}>
        <div className={styles.chatHeader}>
          <div className={styles.headerInfo}>
            <div className={styles.headerIcon}>💬</div>
            <div>
              <h3 className="text-h6">Chat Asistente DIR-Soacha</h3>
              <p className={styles.headerSubtitle}>Conversación en tiempo real con IA</p>
            </div>
          </div>
          <button onClick={clearChat} className={styles.clearBtn} title="Reiniciar chat">
            🗑️ Limpiar
          </button>
        </div>

        <div className={styles.messagesContainer}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`${styles.message} ${
                  "user" === msg.role ? styles.userMessage : styles.assistantMessage
              } ${msg.isError ? styles.errorMessage : ""}`}
            >
              <div className={styles.messageAvatar}>
                  {"user" === msg.role ? "👤" : "🤖"}
              </div>
              <div className={styles.messageContent}>
                <div className={styles.messageText}>{msg.content}</div>
                <div className={styles.messageActions}>
                  <span className={styles.messageTime}>
                    {new Date(msg.timestamp).toLocaleTimeString("es-CO", {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </span>
                    {"assistant" === msg.role && !msg.isError && (
                    <TTSButton text={msg.content} label="🔊" small />
                  )}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className={`${styles.message} ${styles.assistantMessage}`}>
              <div className={styles.messageAvatar}>🤖</div>
              <div className={styles.messageContent}>
                <div className={styles.typingIndicator}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

          {2 >= messages.length && (
          <div className={styles.quickActions}>
            <p className={styles.quickActionsLabel}>Acciones rápidas:</p>
            <div className={styles.quickActionButtons}>
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickAction(action.query)}
                  className={styles.quickActionBtn}
                  disabled={isTyping}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className={styles.inputArea}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe tu pregunta aquí... (Enter para enviar, Shift+Enter para nueva línea)"
            className={styles.textarea}
            rows={2}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isTyping}
            className={styles.sendBtn}
          >
            {isTyping ? "⏳" : "➤"} Enviar
          </button>
        </div>

        <div className={styles.footer}>
          <p className="text-caption">
            💡 Este asistente usa IA para generar respuestas. Verifica información crítica con fuentes oficiales.
          </p>
        </div>
      </div>
    </div>
  );
}
