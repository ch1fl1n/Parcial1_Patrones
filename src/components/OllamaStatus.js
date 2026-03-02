/**
 * Ollama Status Component
 * Displays connection status to Ollama cloud service
 */

"use client";

import { useState, useEffect } from 'react';
import styles from './OllamaStatus.module.css';

export default function OllamaStatus() {
  const [status, setStatus] = useState({
    loading: true,
    success: false,
    configured: false,
    message: 'Verificando conexión...',
  });

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const response = await fetch('/api/ollama/status');
      const data = await response.json();
      setStatus({
        loading: false,
        ...data,
      });
    } catch {
      setStatus({
        loading: false,
        success: false,
        configured: false,
        message: 'Error al verificar conexión',
      });
    }
  };

  if (status.loading) {
    return (
      <div className={styles.status} data-loading="true">
        <span className={styles.indicator}>⏳</span>
        <span className={styles.message}>{status.message}</span>
      </div>
    );
  }

  if (!status.configured) {
    return (
      <div className={styles.status} data-configured="false">
        <span className={styles.indicator}>⚙️</span>
        <span className={styles.message}>
          Ollama no configurado
        </span>
      </div>
    );
  }

  return (
    <div 
      className={styles.status} 
      data-success={status.success}
    >
      <span className={styles.indicator}>
        {status.success ? '✅' : '❌'}
      </span>
      <span className={styles.message}>
        {status.success ? `Ollama conectado (${status.model})` : status.message}
      </span>
      <button 
        className={styles.refreshButton}
        onClick={checkConnection}
        title="Verificar conexión"
      >
        🔄
      </button>
    </div>
  );
}
