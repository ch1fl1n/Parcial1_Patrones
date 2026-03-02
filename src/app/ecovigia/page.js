"use client";

import {useState} from 'react';
import styles from './page.module.css';
import InteractiveMap from '@/components/InteractiveMap';
import OllamaStatus from '@/components/OllamaStatus';
import PushNotifications from '@/components/PushNotifications';
import AlertCounter from '@/components/AlertCounter';
import ChatBot from '@/components/ChatBot';
import Link from 'next/link';

export default function EcoVigiaPage() {
    const [selected, setSelected] = useState(null);

    return (
        <main className={styles.container}>
            <section className={styles.header}>
                <div>
                    <h1 className="text-h3">EcoVigía</h1>
                    <p className="text-body1">Sistema integrado de monitoreo y alerta ante inundaciones en Soacha.</p>
                    <p className="text-caption" style={{marginTop: 6}}>
                        Documentación: <Link href="/ecovigia/brief">Resumen ejecutivo y justificación</Link>
                    </p>
                </div>
                <OllamaStatus/>
            </section>

            <section className={styles.panel}>
                <div className={styles.mapCard}>
                    <div className={styles.mapHeader}>
                        <h2 className="text-h5">Mapa de Riesgo y Capacidades</h2>
                        <span className={styles.beta}>BETA</span>
                    </div>
                    <InteractiveMap
                        enableAI
                        height="70vh"
                        onZoneClick={(zone) => setSelected(zone)}
                    />
                </div>
                <aside className={styles.sidebar}>
                    <div className={styles.card}>
                        <h3 className="text-h6">Zona Seleccionada</h3>
                        {selected ? (
                            <div className={styles.selection}>
                                <p><strong>Nombre:</strong> {selected.name}</p>
                                <p><strong>Nivel:</strong> {selected.level}</p>
                                <p className="text-caption">{selected.description}</p>
                            </div>
                        ) : (
                            <p className="text-body2">Haz clic en una zona del mapa para ver detalles.</p>
                        )}
                    </div>

                    <AlertCounter title="Reportes ciudadanos"/>

                    <div className={styles.card}>
                        <h3 className="text-h6">Asistente Inteligente</h3>
                        <ChatBot compact context="climate-resilience-assistant"/>
                    </div>

                    <div className={styles.card}>
                        <h3 className="text-h6">Alertas en tu navegador</h3>
                        <PushNotifications/>
                    </div>
                </aside>
            </section>
        </main>
    );
}
