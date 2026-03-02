"use client";

import React from "react";
import styles from "./page.module.css";
import TTSButton from "../../components/TTSButton";

const LINES = [
  {
    entity: "Línea única de emergencias (todas las urgencias)",
    number: "123",
    url: "https://www.colombia.com/turismo/guia-del-viajero/telefonia/telefonos-de-emergencia.aspx?utm_source=chatgpt.com",
  },
  {
    entity: "Cruz Roja Colombiana",
    number: "132",
    url: "https://cruzrojands.org/contacto/?utm_source=chatgpt.com",
  },
  {
    entity: "Defensa Civil Colombiana",
    number: "144",
    url: "https://www.defensacivil.gov.co/nuestra-institucion-1/seccionales/magdalena/institucional/contactenos?utm_source=chatgpt.com",
  },
  {
    entity: "Unidad Nacional para la Gestión del Riesgo de Desastres (UNGRD)",
    number: "018000 113 200",
    url: "https://portal.gestiondelriesgo.gov.co/Documents/Circulares/CIRCULAR-032-DE-05-DE-JUNIO-DE-2025.pdf?utm_source=chatgpt.com",
  },
  {
    entity: "Policía Nacional de Colombia",
    number: "112",
    url: "https://www.colombia.com/turismo/guia-del-viajero/telefonia/telefonos-de-emergencia.aspx?utm_source=chatgpt.com",
  },
  {
    entity: "Cuerpo de Bomberos de Colombia",
    number: "119",
    url: "https://www.colombia.com/turismo/guia-del-viajero/telefonia/telefonos-de-emergencia.aspx?utm_source=chatgpt.com",
  },
];

function buildReadText(lines) {
  return (
    "Líneas de atención disponibles: " +
    lines
      .map((l) => `${l.entity} — número ${l.number}`)
      .join(". ") +
    ". En caso de emergencia, comuníquese con la entidad correspondiente."
  );
}

export default function Page() {
  const readText = buildReadText(LINES);

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className="text-h4">Líneas de atención</h1>
        <p className="text-body2">Números de contacto útiles en casos de emergencia. Llame siempre a los servicios de emergencia locales primero.</p>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Entidad</th>
                <th>Número</th>
              </tr>
            </thead>
            <tbody>
              {LINES.map((row) => (
                <tr key={row.number + row.entity}>
                  <td>{row.entity}</td>
                  <td>
                    <div className={styles.numberCell}>
                      <a href={row.url} target="_blank" rel="noopener noreferrer" className={styles.numberLink}>
                        <strong>{row.number}</strong>
                      </a>
                      <div className={styles.miniTts}>
                        <TTSButton text={`${row.entity}, número ${row.number}`} label="Leer" small />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.controls}>
          <TTSButton text={readText} label="Leer teléfonos" />
        </div>
      </div>
    </div>
  );
}
