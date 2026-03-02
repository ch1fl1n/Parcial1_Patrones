"use client";

import {useState} from "react";
import styles from "./page.module.css";
import InteractiveMap from "@/components/InteractiveMap";

export default function CommunityReports() {
  const [reports, setReports] = useState([
    {
      id: 1,
      type: "sewage",
      location: "El Danubio - Calle 5",
      coordinates: [4.5855, -74.2305],
      description: "Alcantarilla colapsada bloqueando drenaje",
      severity: "critical",
      date: "2025-11-01T10:30:00",
      reporter: "Líder JAC",
      status: "pending"
    },
    {
      id: 2,
      type: "waste",
      location: "Quebrada Tibanica",
      coordinates: [4.5818, -74.2272],
      description: "Acumulación de residuos sólidos en la quebrada",
      severity: "high",
      date: "2025-11-01T15:45:00",
      reporter: "Voluntario CRC",
      status: "in-progress"
    },
    {
      id: 3,
      type: "flooding",
      location: "La María - Sector Norte",
      coordinates: [4.5825, -74.2285],
      description: "Desbordamiento menor por lluvia",
      severity: "medium",
      date: "2025-10-31T20:00:00",
      reporter: "Comunidad",
      status: "resolved"
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    tipo: "sewage",
    descripcion: "",
    estado: "pending",
    foto: null
  });
  const [status, setStatus] = useState("");

  function onChange(e) {
    const { name, value, files } = e.target;
    setForm((f) => ({ ...f, [name]: files ? files[0] : value }));
  }

  function onSubmit(e) {
    e.preventDefault();
    if (!form.tipo || !form.descripcion || !form.estado) {
      setStatus("Por favor completa los campos obligatorios.");
      return;
    }
    const newReport = {
      id: reports.length + 1,
      type: form.tipo,
      location: "Ubicación reportada",
      coordinates: [4.5850, -74.2310],
      description: form.descripcion,
      severity: "medium",
      date: new Date().toISOString(),
      reporter: "Usuario",
      status: form.estado
    };
    setReports([newReport, ...reports]);
    setStatus("¡Reporte enviado correctamente!");
    setForm({ tipo: "sewage", descripcion: "", estado: "pending", foto: null });
  }

  const getTypeLabel = (type) => {
    const labels = {
      sewage: "🚰 Alcantarillado",
      waste: "🗑️ Residuos",
      flooding: "🌊 Inundación",
      infrastructure: "🏗️ Infraestructura",
      "Alcantarilla obstruida": "🚰 Alcantarilla obstruida",
      "Acumulación de residuos": "🗑️ Acumulación de residuos",
      "Inundación": "🌊 Inundación",
      "Árbol caído": "🌳 Árbol caído"
    };
    return labels[type] || type;
  };

  return (
    <div className={styles.layout}>
      {/* Sidebar: recent reports and filters */}
      <aside className={styles.sidebar}>
        <h2 className="text-h6">Reportes Recientes ({reports.length})</h2>
        <div className={styles.stats}>
          <div className={styles.statBox}>
              <strong>{reports.filter(r => "pending" === r.status).length}</strong>
            <span>Pendientes</span>
          </div>
          <div className={styles.statBox}>
              <strong>{reports.filter(r => "resolved" === r.status).length}</strong>
            <span>Resueltos</span>
          </div>
        </div>

        {reports.slice(0, 5).map((r) => (
          <div key={r.id} className={styles.reportItem}>
            <div className={styles.reportTitle}>{getTypeLabel(r.type)}</div>
            <div className={styles.reportType}>{r.location}</div>
            <div className={styles.reportTime}>
              {new Date(r.date).toLocaleDateString('es-CO')}
            </div>
          </div>
        ))}
      </aside>

      {/* Main: map + form */}
      <main className={styles.main}>
        <div className={styles.header}>
          <div>
            <h1 className="text-h3">📋 Módulo de Reporte Comunitario</h1>
            <p className="text-body2">Sistema de registro y monitoreo de incidentes</p>
          </div>
          <button 
            className={styles.toggleBtn}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? '✕ Cerrar' : '➕ Nuevo Reporte'}
          </button>
        </div>

        <section className={styles.mapCard}>
          <InteractiveMap 
            center={[4.5850, -74.2310]}
            zoom={14}
            height="400px"
            activeLayers={{
              floodRisk: false,
              threats: true,
              capacities: false,
              communities: true
            }}
          />
        </section>

        {showForm && (
          <form className={styles.form} onSubmit={onSubmit}>
            <h3 className="text-h5">Reportar Nuevo Incidente</h3>
            <div className={styles.field}>
              <label htmlFor="tipo" className="text-body2">Tipo de incidente</label>
              <select id="tipo" name="tipo" value={form.tipo} onChange={onChange} className={styles.select}>
                <option value="sewage">Alcantarilla obstruida</option>
                <option value="waste">Acumulación de residuos</option>
                <option value="flooding">Inundación</option>
                <option value="infrastructure">Infraestructura</option>
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="descripcion" className="text-body2">Descripción</label>
              <textarea 
                id="descripcion" 
                name="descripcion" 
                value={form.descripcion} 
                onChange={onChange} 
                className={styles.textarea} 
                placeholder="Describe el incidente..." 
                rows="4"
              />
            </div>

            <div className={styles.field}>
              <label className="text-body2">Añadir fotografía (opcional)</label>
              <div className={styles.dropzone}>
                <input id="foto" name="foto" type="file" accept="image/*" onChange={onChange} style={{ display: "none" }} />
                <label htmlFor="foto" style={{ cursor: "pointer" }}>
                  📷 Haz clic para añadir una imagen
                </label>
                {form.foto && (
                  <div className="text-caption" style={{ marginTop: 8 }}>
                    Seleccionado: {form.foto.name}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="estado" className="text-body2">Estado</label>
              <select id="estado" name="estado" value={form.estado} onChange={onChange} className={styles.select}>
                <option value="pending">Pendiente</option>
                <option value="in-progress">En proceso</option>
                <option value="resolved">Resuelto</option>
              </select>
            </div>

            {status && (
              <div className={styles.statusMessage} role="status">
                {status}
              </div>
            )}

            <div className={styles.actions}>
              <button className={styles.button} type="submit">✓ Enviar Reporte</button>
            </div>
          </form>
        )}

        <section className={styles.reportsList}>
          <h2 className="text-h5">Registro de Reportes</h2>
          {reports.map((report) => (
            <div key={report.id} className={styles.reportCard}>
              <div className={styles.reportHeader}>
                <h4>{getTypeLabel(report.type)}</h4>
                <span className={styles.statusBadge}>{report.status}</span>
              </div>
              <p className={styles.reportDesc}>{report.description}</p>
              <div className={styles.reportFooter}>
                <span>{report.location}</span>
                <span>{new Date(report.date).toLocaleString('es-CO')}</span>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
