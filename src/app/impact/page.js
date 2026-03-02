"use client";

import {useState} from "react";
import styles from "./page.module.css";
import InteractiveMap from "@/components/InteractiveMap";

// Datos reales de El Danubio y La María
const communities = [
  { 
    name: "El Danubio", 
    total: 3640, 
    households: 910,
    children: Math.round(3640 * 0.28), // 28% estimado menores de 15
    seniors: Math.round(3640 * 0.08), // 8% estimado mayores de 65
    vulnerabilities: {
      noEvacuation: 62,
      noSavings: 81,
      foodInsecurity: 27,
      floodIncidence: 71
    }
  },
  { 
    name: "La María", 
    total: 1200, 
    households: 470,
    children: Math.round(1200 * 0.28),
    seniors: Math.round(1200 * 0.08),
    vulnerabilities: {
      noEvacuation: 62,
      noSavings: 81,
      foodInsecurity: 27,
      floodIncidence: 71
    }
  }
];

export default function ImpactDashboard() {
  const [impactCalculation, setImpactCalculation] = useState(null);

  const total = communities.reduce((sum, c) => sum + c.total, 0);
  const children = communities.reduce((sum, c) => sum + c.children, 0);
  const seniors = communities.reduce((sum, c) => sum + c.seniors, 0);
  const households = communities.reduce((sum, c) => sum + c.households, 0);

  // Calcular impacto cuando se selecciona una zona
  const handleZoneClick = (zone) => {
    // keep the selected zone in the impact calculation only
    
    // Estimar población afectada basándose en el nivel de riesgo
      const multiplier = 'high' === zone.level ? 0.85 :
          'medium' === zone.level ? 0.50 : 0.20;
    
    const affectedPopulation = Math.round(total * multiplier);
    const affectedChildren = Math.round(children * multiplier);
    const affectedSeniors = Math.round(seniors * multiplier);
    const affectedHouseholds = Math.round(households * multiplier);

    setImpactCalculation({
      zone: zone.name,
      level: zone.level,
      population: affectedPopulation,
      children: affectedChildren,
      seniors: affectedSeniors,
      households: affectedHouseholds,
        vulnerability: 'high' === zone.level ? 'CRÍTICA' :
            'medium' === zone.level ? 'MODERADA' : 'BAJA'
    });
  };

  // simple sparkline heights scaled from mock values
  // historic event series (kept for reference)

  return (
    <main className={styles.container}>
      {/* Sidebar with map and areas */}
      <aside className={styles.sidebar}>
        <div className={styles.mapThumb}>
          <InteractiveMap 
            center={[4.5850, -74.2310]}
            zoom={13}
            height="300px"
            activeLayers={{
              floodRisk: true,
              threats: false,
              capacities: false,
              communities: true
            }}
            onZoneClick={handleZoneClick}
          />
        </div>
        <h3 className="text-h6" style={{ marginTop: 12 }}>Zonas de Riesgo</h3>
        <div className={styles.riskList}>
          <div className={styles.riskItem}>🔴 Río Bogotá - Margen Norte</div>
          <div className={styles.riskItem}>🔴 Quebrada Tibanica</div>
          <div className={styles.riskItem}>🟠 El Danubio Central</div>
          <div className={styles.riskItem}>🟢 Zona Elevada</div>
        </div>
        <p className="text-caption" style={{ marginTop: 12, color: 'var(--color-text-secondary)' }}>
          Haz clic en una zona del mapa para calcular impacto poblacional
        </p>
      </aside>

      <section className={styles.main}>
        {/* Title */}
        <header className={styles.titleWrap}>
          <div className={styles.titleRow}>
            <h1 className="text-h3">Análisis de Impacto Poblacional</h1>
          </div>
          <p className={`text-body2 ${styles.subtitle}`}>
            Análisis detallado de resiliencia climática en Soacha, enfocado en las comunidades 
            El Danubio y La María. Población total: {total.toLocaleString()} habitantes en {households.toLocaleString()} hogares.
          </p>
        </header>

        {/* Top stats */}
        <div className={styles.statsGrid}>
          <article className={styles.statCard}>
            <div className="text-caption">Población Total</div>
            <div className={styles.statValue}>{total.toLocaleString()}</div>
            <div className="text-caption" style={{ marginTop: 4 }}>
              {households.toLocaleString()} hogares
            </div>
          </article>
          <article className={styles.statCard}>
            <div className="text-caption">Menores de 15 años</div>
            <div className={styles.statValue}>{children.toLocaleString()}</div>
            <div className="text-caption" style={{ marginTop: 4 }}>
              {Math.round((children/total)*100)}% población
            </div>
          </article>
          <article className={styles.statCard}>
            <div className="text-caption">Mayores de 65 años</div>
            <div className={styles.statValue}>{seniors.toLocaleString()}</div>
            <div className="text-caption" style={{ marginTop: 4 }}>
              {Math.round((seniors/total)*100)}% población
            </div>
          </article>
        </div>

        {/* Cálculo de impacto dinámico */}
        {impactCalculation && (
          <section className={styles.impactAlert}>
            <h3 className="text-h5">📊 Estimación de Impacto: {impactCalculation.zone}</h3>
            <div className={styles.impactGrid}>
              <div className={styles.impactStat}>
                <strong>{impactCalculation.population.toLocaleString()}</strong>
                <span>personas afectadas</span>
              </div>
              <div className={styles.impactStat}>
                <strong>{impactCalculation.households.toLocaleString()}</strong>
                <span>hogares afectados</span>
              </div>
              <div className={styles.impactStat}>
                <strong>{impactCalculation.children.toLocaleString()}</strong>
                <span>menores afectados</span>
              </div>
              <div className={styles.impactStat}>
                <strong>{impactCalculation.seniors.toLocaleString()}</strong>
                <span>adultos mayores afectados</span>
              </div>
            </div>
            <p className={styles.vulnerability}>
              <strong>Vulnerabilidad:</strong> {impactCalculation.vulnerability}
            </p>
          </section>
        )}

        {/* Table by community */}
        <section className={styles.sectionCard} aria-labelledby="by-neighborhood">
          <div className={styles.sectionHeader}>
            <h2 id="by-neighborhood" className="text-h5">
              Desglose por Comunidad
            </h2>
          </div>
          <div className={styles.sectionBody}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Comunidad</th>
                  <th>Población</th>
                  <th>Hogares</th>
                  <th>Menores</th>
                  <th>Adultos Mayores</th>
                </tr>
              </thead>
              <tbody>
                {communities.map((c) => (
                  <tr key={c.name}>
                    <td>
                      <strong>{c.name}</strong>
                    </td>
                    <td>{c.total.toLocaleString()}</td>
                    <td>{c.households.toLocaleString()}</td>
                    <td>{c.children.toLocaleString()}</td>
                    <td>{c.seniors.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Vulnerabilidades CRMC */}
        <section className={styles.sectionCard} aria-labelledby="vulnerabilities">
          <div className={styles.sectionHeader}>
            <h2 id="vulnerabilities" className="text-h5">
              Vulnerabilidades Críticas (CRMC)
            </h2>
          </div>
          <div className={styles.sectionBody}>
            <div className={styles.vulnGrid}>
              <div className={styles.vulnCard}>
                <div className={styles.vulnPercent}>62%</div>
                <p>Sin conocimiento de protocolos de evacuación</p>
              </div>
              <div className={styles.vulnCard}>
                <div className={styles.vulnPercent}>81%</div>
                <p>Sin ahorros para emergencias</p>
              </div>
              <div className={styles.vulnCard}>
                <div className={styles.vulnPercent}>27%</div>
                <p>Inseguridad alimentaria</p>
              </div>
              <div className={styles.vulnCard}>
                <div className={styles.vulnPercent}>71%</div>
                <p>Incidencia de inundaciones</p>
              </div>
              <div className={styles.vulnCard}>
                <div className={styles.vulnPercent}>48%</div>
                <p>Confianza en líderes comunitarios</p>
              </div>
              <div className={styles.vulnCard}>
                <div className={styles.vulnPercent}>100%</div>
                <p>Riesgo de inundación nivel D (muy alto)</p>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
