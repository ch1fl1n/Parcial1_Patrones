"use client";

import {useState} from 'react';
import styles from './AIAnalysisPanel.module.css';

export default function AIAnalysisPanel({ zone, community, onClose }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisType, setAnalysisType] = useState('complete');

  const runAnalysis = async (type = analysisType) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/ollama/zone-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zone, community, analysisType: type })
      });

      const data = await response.json();
      
      if (data.success) {
        setAnalysis(data.analysis);
      } else {
        setError(data.error || 'Error en el análisis');
      }
    } catch (err) {
      setError('Error de conexión con el servicio de IA');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className="text-h4">🤖 Análisis de IA</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </div>

        <div className={styles.zoneInfo}>
          <h3 className="text-h5">{zone.name}</h3>
          <p className="text-body2">{zone.description}</p>
          <div className={styles.badge} data-level={zone.level}>
              {'high' === zone.level ? '🔴 Riesgo Alto' :
                  'medium' === zone.level ? '🟠 Riesgo Medio' : '🟢 Riesgo Bajo'}
          </div>
          {community && (
            <p className="text-caption" style={{ marginTop: 8 }}>
              <strong>{community.name}</strong>: {community.population?.toLocaleString()} habitantes
            </p>
          )}
        </div>

        <div className={styles.actions}>
          <button 
            className={styles.btn}
            onClick={() => { setAnalysisType('complete'); runAnalysis('complete'); }}
            disabled={loading}
          >
            📊 Análisis Completo
          </button>
          <button 
            className={styles.btn}
            onClick={() => { setAnalysisType('vulnerability'); runAnalysis('vulnerability'); }}
            disabled={loading}
          >
            🔍 Vulnerabilidad
          </button>
          <button 
            className={styles.btn}
            onClick={() => { setAnalysisType('flood-risk'); runAnalysis('flood-risk'); }}
            disabled={loading}
          >
            🌊 Riesgo de Inundación
          </button>
          <button 
            className={styles.btn}
            onClick={() => { setAnalysisType('emergency'); runAnalysis('emergency'); }}
            disabled={loading}
          >
            🚨 Plan de Emergencia
          </button>
        </div>

        <div className={styles.content}>
          {loading && (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Analizando con IA...</p>
            </div>
          )}

          {error && (
            <div className={styles.error}>
              <p>⚠️ {error}</p>
            </div>
          )}

          {analysis && !loading && (
            <div className={styles.results}>
                {'string' === typeof analysis ? (
                <div className={styles.resultSection}>
                  <pre className={styles.analysisText}>{analysis}</pre>
                </div>
              ) : (
                <>
                  {analysis.vulnerability && (
                    <div className={styles.resultSection}>
                      <h4 className="text-h6">🔍 Análisis de Vulnerabilidad</h4>
                      <pre className={styles.analysisText}>{analysis.vulnerability}</pre>
                    </div>
                  )}
                  {analysis.floodRisk && (
                    <div className={styles.resultSection}>
                      <h4 className="text-h6">🌊 Evaluación de Riesgo de Inundación</h4>
                      <pre className={styles.analysisText}>{analysis.floodRisk}</pre>
                    </div>
                  )}
                  {analysis.emergency && (
                    <div className={styles.resultSection}>
                      <h4 className="text-h6">🚨 Plan de Emergencia</h4>
                      <pre className={styles.analysisText}>{analysis.emergency}</pre>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {!analysis && !loading && !error && (
            <div className={styles.placeholder}>
              <p className="text-body2">
                Selecciona un tipo de análisis para obtener recomendaciones basadas en IA.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
