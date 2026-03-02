"use client";

import styles from "./page.module.css";

export default function TechnicalMonitoring() {
  return (
    <div className={styles.page}>

      <h1 className={`text-h4 ${styles.title}`}>Technical Monitoring</h1>

      {/* Geospatial Data Status */}
      <section className={styles.section} aria-labelledby="geo-status">
        <h2 id="geo-status" className="text-h6">Geospatial Data Status</h2>
        <div className={styles.mapCard}>
          <iframe
            className={styles.map}
            title="Mapa técnico de Soacha"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3986.745019894008!2d-74.231!3d4.585!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9ed3d8e5c7d1%3A0x9d63e8cb2e0b9b0a!2sSoacha%2C%20Cundinamarca!5e0!3m2!1ses!2sCO!4v1699999999999"
            allowFullScreen
          />
        </div>
        <div className={styles.rows}>
          <div className={styles.row}>
            <div>
              <a className={styles.muted} href="#">Leaflet/OpenStreetMap Layer Load</a>
            </div>
            <div className={styles.status}>Complete</div>
          </div>
          <div className={styles.row}>
            <div>
              <a className={styles.muted} href="#">PostGIS Data Load Performance</a>
            </div>
            <div className={styles.status}>Optimal</div>
          </div>
        </div>
      </section>

      {/* Data Synchronization */}
      <section className={styles.section} aria-labelledby="sync">
        <h2 id="sync" className="text-h6">Data Synchronization</h2>
        <div className={styles.rows}>
          <div className={styles.row}>
            <div className={styles.muted}>External Data Source 1 Sync</div>
            <div className={`${styles.status} ${styles.ok}`}>Synchronized</div>
          </div>
          <div className={styles.row}>
            <div className={styles.muted}>External Data Source 2 Sync</div>
            <div className={`${styles.status} ${styles.ok}`}>Synchronized</div>
          </div>
        </div>
      </section>

      {/* Alerts */}
      <section className={styles.section} aria-labelledby="alerts">
        <h2 id="alerts" className="text-h6">Alerts</h2>
        <div className={styles.rows}>
          <div className={styles.alertItem}>
            <span className={styles.bullet} aria-hidden>✓</span>
            <div>
              <div className="text-body2">Geocoding Status</div>
              <div className={styles.muted}>No issues detected</div>
            </div>
          </div>
          <div className={styles.alertItem}>
            <span className={styles.bullet} aria-hidden>✓</span>
            <div>
              <div className="text-body2">Data Consistency</div>
              <div className={styles.muted}>No issues detected</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
