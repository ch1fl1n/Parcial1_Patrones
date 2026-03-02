"use client";

import {useState} from "react";
import styles from "./page.module.css";
import InteractiveMap from "@/components/InteractiveMap";

export default function Home() {
  const [activeLayers, setActiveLayers] = useState({
    floodRisk: true,
    threats: true,
    capacities: true,
    communities: true
  });

  const [selectedCommunity, setSelectedCommunity] = useState("all");
  const [selectedRiskLevel, setSelectedRiskLevel] = useState("all");
  
  // AI Analysis state
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);

  const toggleLayer = (layer) => {
    setActiveLayers(prev => ({
      ...prev,
      [layer]: !prev[layer]
    }));
  };

  const handleZoneClick = async (zone) => {
    console.log("Zona seleccionada:", zone);
    
    // Trigger automatic AI analysis
    setIsAnalyzing(true);
    setAnalysisError(null);
    
    try {
      const response = await fetch('/api/ollama/structured', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: zone.properties?.Barrio || zone.name || 'Zona desconocida',
          threats: [
            'Inundaciones por desbordamiento',
            'Alcantarillado artesanal insuficiente',
            'Obstrucción de canales naturales'
          ],
          indicators: {
            noEvac: 62,
            noSavings: 81,
            foodInsec: 27
          }
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.result) {
        setAiAnalysis(data.result);
      } else {
        throw new Error(data.error || 'No se pudo obtener análisis');
      }
    } catch (error) {
      console.error('Error en análisis de IA:', error);
      setAnalysisError(error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Content */}
      <main className={styles.content}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <section className={styles.section}>
            <h2 className="text-h5">Capas Geoespaciales</h2>
            <label className={styles.checkboxRow}>
              <input 
                type="checkbox" 
                checked={activeLayers.floodRisk}
                onChange={() => toggleLayer('floodRisk')}
              /> 
              🌊 Riesgo de inundación
            </label>
            <label className={styles.checkboxRow}>
              <input 
                type="checkbox" 
                checked={activeLayers.threats}
                onChange={() => toggleLayer('threats')}
              /> 
              ⚠️ Puntos de amenaza
            </label>
            <label className={styles.checkboxRow}>
              <input 
                type="checkbox" 
                checked={activeLayers.capacities}
                onChange={() => toggleLayer('capacities')}
              /> 
              🏛️ Capacidades locales
            </label>
            <label className={styles.checkboxRow}>
              <input 
                type="checkbox" 
                checked={activeLayers.communities}
                onChange={() => toggleLayer('communities')}
              /> 
              🏘️ Límites de barrios
            </label>
          </section>

          <section className={styles.section}>
            <h2 className="text-h5">Filtros</h2>
            <div className={styles.selectWrap}>
              <select 
                aria-label="Comunidad"
                value={selectedCommunity}
                onChange={(e) => setSelectedCommunity(e.target.value)}
              >
                <option value="all">Todas las comunidades</option>
                <option value="el_danubio">El Danubio</option>
                <option value="la_maria">La María</option>
              </select>
            </div>
            <div className={styles.selectWrap}>
              <select 
                aria-label="Nivel de riesgo"
                value={selectedRiskLevel}
                onChange={(e) => setSelectedRiskLevel(e.target.value)}
              >
                <option value="all">Todos los niveles</option>
                <option value="high">🔴 Riesgo alto</option>
                <option value="medium">🟠 Riesgo medio</option>
                <option value="low">🟢 Riesgo bajo</option>
              </select>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className="text-h5">Leyenda</h2>
            <div className={styles.legend}>
              <div className={styles.legendItem}>
                <span className={styles.legendColor} style={{background: '#d32f2f'}}></span>
                <span>Riesgo Alto</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendColor} style={{background: '#ff9800'}}></span>
                <span>Riesgo Medio</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendColor} style={{background: '#4caf50'}}></span>
                <span>Riesgo Bajo</span>
              </div>
            </div>
          </section>
        </aside>

        {/* Main area */}
        <section className={styles.main}>
          <div className={styles.mapCard}>
            <InteractiveMap 
              center={[4.5850, -74.2310]}
              zoom={14}
              height="600px"
              activeLayers={activeLayers}
              onZoneClick={handleZoneClick}
              enableAI={true}
            />
          </div>

          <div className={styles.infoCard}>
            <h3 className="text-h5">📍 Soacha - El Danubio y La María</h3>
            <p className="text-body2">
              Comunidades vulnerables con alto riesgo de inundaciones por desbordamiento 
              del Río Bogotá y la Quebrada Tibanica. Población total: ~4,840 habitantes.
            </p>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <strong>62%</strong>
                <small>Sin protocolos de evacuación</small>
              </div>
              <div className={styles.stat}>
                <strong>81%</strong>
                <small>Sin ahorros para emergencias</small>
              </div>
              <div className={styles.stat}>
                <strong>71%</strong>
                <small>Incidencia de inundaciones</small>
              </div>
            </div>
          </div>

          {/* AI Analysis Panel */}
          {(isAnalyzing || aiAnalysis || analysisError) && (
            <div className={styles.aiPanel}>
              <h3 className="text-h5">🤖 Análisis de IA Automático</h3>
              
              {isAnalyzing && (
                <div className={styles.loading}>
                  <div className={styles.spinner}></div>
                  <p>Analizando zona con IA...</p>
                </div>
              )}
              
              {analysisError && (
                <div className={styles.error}>
                  <p>⚠️ Error: {analysisError}</p>
                </div>
              )}
              
              {aiAnalysis && !isAnalyzing && (
                <div className={styles.analysisResult}>
                  {/* Header with risk level and confidence */}
                  <div className={styles.analysisHeader}>
                    <div className={styles.riskBadge} data-risk={aiAnalysis.riskLevel?.toLowerCase()}>
                      {aiAnalysis.riskLevel}
                    </div>
                    <div className={styles.confidence}>
                      Confianza: {Math.round((aiAnalysis.confidence || 0) * 100)}%
                    </div>
                  </div>

                  {/* Location */}
                  <p className={styles.location}>
                    <strong>Ubicación:</strong> {aiAnalysis.location}
                  </p>

                  {/* Risk Categories */}
                  {aiAnalysis.riskCategories && (
                    <div className={styles.riskCategories}>
                      <h4>Categorías de Riesgo</h4>
                      <div className={styles.categoryGrid}>
                        <div className={styles.category}>
                          <span>🌊 Inundación</span>
                          <span className={styles.badge} data-level={aiAnalysis.riskCategories.flood?.toLowerCase()}>
                            {aiAnalysis.riskCategories.flood}
                          </span>
                        </div>
                        <div className={styles.category}>
                          <span>🏗️ Infraestructura</span>
                          <span className={styles.badge} data-level={aiAnalysis.riskCategories.infrastructure?.toLowerCase()}>
                            {aiAnalysis.riskCategories.infrastructure}
                          </span>
                        </div>
                        <div className={styles.category}>
                          <span>👥 Vulnerabilidad Social</span>
                          <span className={styles.badge} data-level={aiAnalysis.riskCategories.socialVulnerability?.toLowerCase()}>
                            {aiAnalysis.riskCategories.socialVulnerability}
                          </span>
                        </div>
                        <div className={styles.category}>
                          <span>💰 Resiliencia Económica</span>
                          <span className={styles.badge} data-level={aiAnalysis.riskCategories.economicResilience?.toLowerCase()}>
                            {aiAnalysis.riskCategories.economicResilience}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Key Factors */}
                  {aiAnalysis.keyFactors && 0 < aiAnalysis.keyFactors.length && (
                    <div className={styles.keyFactors}>
                      <h4>Factores Críticos</h4>
                      <ul>
                        {aiAnalysis.keyFactors.slice(0, 5).map((factor, idx) => (
                          <li key={idx}>{factor}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recommendations */}
                  {aiAnalysis.recommendations && 0 < aiAnalysis.recommendations.length && (
                    <div className={styles.recommendations}>
                      <h4>Recomendaciones Priorizadas</h4>
                      {aiAnalysis.recommendations.slice(0, 3).map((rec, idx) => (
                        <div key={idx} className={styles.recommendation} data-priority={rec.priority?.toLowerCase()}>
                          <div className={styles.recHeader}>
                            <span className={styles.priority}>{rec.priority}</span>
                            <span className={styles.timeline}>{rec.timeline}</span>
                          </div>
                          <p>{rec.action}</p>
                          <span className={styles.impact}>
                            Impacto estimado: <strong>{rec.estimatedImpact}</strong>
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Population affected */}
                  {aiAnalysis.affectedPopulation && (
                    <div className={styles.population}>
                      <h4>Población Afectada</h4>
                      <div className={styles.popStats}>
                        <div>
                          <strong>{aiAnalysis.affectedPopulation.total}</strong>
                          <small>Total</small>
                        </div>
                        <div>
                          <strong>{aiAnalysis.affectedPopulation.highRisk}</strong>
                          <small>Alto Riesgo</small>
                        </div>
                        <div>
                          <strong>{aiAnalysis.affectedPopulation.vulnerable}</strong>
                          <small>Vulnerables</small>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Metadata */}
                  <div className={styles.metadata}>
                    <small>
                      Análisis: {new Date(aiAnalysis.analysisDate).toLocaleString('es-CO')}
                    </small>
                    <small>
                      Fuente: {aiAnalysis.dataSource}
                    </small>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}