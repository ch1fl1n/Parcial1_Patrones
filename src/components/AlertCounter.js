"use client";

import {useMemo, useState} from "react";
import TTSButton from "./TTSButton";

function countSeverities(list) {
    const init = {high: 0, medium: 0, low: 0};
    return list.reduce((acc, a) => {
        const key = a && a.severity;
        if (key && Object.prototype.hasOwnProperty.call(acc, key)) {
            acc[key] += 1;
        }
        return acc;
    }, {...init});
}

export default function AlertCounter({title = "Reportes ciudadanos", thresholds = {high: 5, medium: 5, low: 10}}) {
    const [alerts, setAlerts] = useState([]);
    const [notified, setNotified] = useState({high: false, medium: false, combined: false, low: false});

    const counts = useMemo(() => countSeverities(alerts), [alerts]);

    function generateId() {
        return `A-${Date.now().toString().slice(-6)}`;
    }

    async function sendPushNotification(severity) {
        try {
            const severityMessages = {
                high: {
                    title: "🚨 ALERTA ALTA - Inundación Severa",
                    body: "Inundación severa reportada. Riesgo inmediato a vida y propiedades. Active protocolos de evacuación.",
                },
                medium: {
                    title: "⚠️ ALERTA MEDIA - Inundación Local",
                    body: "Inundación local reportada. Posible daño a infraestructura. Manténgase alerta.",
                },
                low: {
                    title: "ℹ️ ALERTA BAJA - Monitoreo",
                    body: "Inconvenientes menores detectados. Seguimiento recomendado.",
                },
            };
            const message = severityMessages[severity] || severityMessages.medium;
            await fetch("/api/notifications/send", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({...message, severity, data: {url: "/alerts", alertId: generateId()}}),
            });
        } catch (error) {
            console.error("Error enviando notificación push:", error);
        }
    }

    function addFloodReport(severity) {
        const newAlert = {
            id: generateId(),
            title: "Inundación reportada",
            severity,
            date: new Date().toISOString(),
            status: "active"
        };
        setAlerts((prev) => {
            const next = [newAlert, ...prev];
            const nextCounts = countSeverities(next);
            const combined = nextCounts.high + nextCounts.medium;

            if (!notified.high && nextCounts.high >= (thresholds.high || 5)) {
                sendPushNotification("high");
                setNotified((s) => ({...s, high: true}));
            } else if (!notified.medium && nextCounts.medium >= (thresholds.medium || 5)) {
                sendPushNotification("medium");
                setNotified((s) => ({...s, medium: true}));
            } else if (!notified.combined && combined >= (thresholds.medium || 5)) {
                sendPushNotification("medium");
                setNotified((s) => ({...s, combined: true}));
            } else if (!notified.low && nextCounts.low >= (thresholds.low || 10)) {
                sendPushNotification("low");
                setNotified((s) => ({...s, low: true}));
            }

            return next;
        });
    }

    return (
        <div style={{
            border: "1px solid var(--color-border)",
            borderRadius: 12,
            padding: 12,
            background: "var(--color-surface)"
        }}>
            <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8}}>
                <h3 className="text-h6">{title}</h3>
                <TTSButton
                    text={`Reportes ciudadanos. Nivel alto: ${counts.high}. Nivel medio: ${counts.medium}. Nivel bajo: ${counts.low}.`}
                    label="🔊 Leer"
                    small
                />
            </div>

            <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8}}>
                {[
                    {key: "high", label: "Alto", color: "var(--color-error)"},
                    {key: "medium", label: "Medio", color: "var(--color-alert)"},
                    {key: "low", label: "Bajo", color: "var(--color-success)"},
                ].map((t) => (
                    <div key={t.key} style={{border: "1px solid var(--color-border)", borderRadius: 10, padding: 8}}>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: 6
                        }}>
                            <span className="text-body2" style={{fontWeight: 700}}>{t.label}</span>
                            <span style={{fontWeight: 900, color: t.color}}>{counts[t.key]}</span>
                        </div>
                        <button
                            onClick={() => addFloodReport(t.key)}
                            className="btn"
                            style={{width: "100%", background: t.color, color: "var(--color-blanco)"}}
                        >
                            Reportar
                        </button>
                    </div>
                ))}
            </div>
            <p className="text-caption" style={{marginTop: 8, color: "var(--color-text-secondary)"}}>
                Cuando se registren 5 reportes en un mismo nivel (alto o medio), se enviará una notificación automática.
            </p>
        </div>
    );
}
