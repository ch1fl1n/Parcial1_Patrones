"use client";

import styles from './page.module.css';

export default function EcoVigiaBriefPage() {
    return (
        <main className={styles.container}>
            <header className={styles.header}>
                <h1 className="text-h4">EcoVigía – Documento del Proyecto</h1>
                <p className="text-body2">Programa de Resiliencia Climática Urbana (UCRP) – Soacha, 2025–2027</p>
            </header>

            <article className={styles.card}>
                <h2 className="text-h5">1. Resumen Ejecutivo</h2>
                <p className="text-body2">
                    El municipio de Soacha, particularmente los barrios La María y El Danubio, enfrenta un alto nivel de
                    riesgo de inundación debido al incremento de las lluvias, la deficiente infraestructura de drenaje y
                    la falta
                    de mecanismos efectivos de alerta y respuesta comunitaria. Estas condiciones han generado
                    afectaciones
                    recurrentes a la seguridad, la salud y la economía de los habitantes, evidenciando la necesidad de
                    fortalecer
                    la gestión del riesgo y la resiliencia local.
                </p>
                <p className="text-body2">
                    Ante esta situación, surge la propuesta EcoVigía: una solución tecnológica innovadora orientada al
                    fortalecimiento de la gestión del riesgo climático y la resiliencia comunitaria. Este proyecto
                    articula tres
                    componentes principales que trabajan de forma complementaria:
                </p>
                <ol className={styles.list}>
                    <li>
                        <strong>Dashboard Interactivo:</strong> herramienta digital que permite visualizar y analizar en
                        tiempo real los
                        datos proporcionados por la Cruz Roja Colombiana, facilitando la identificación de zonas de
                        riesgo,
                        vulnerabilidades y capacidades locales. Su diseño intuitivo permite convertir la información
                        técnica en
                        conocimiento accesible para la toma de decisiones.
                    </li>
                    <li>
                        <strong>Sistema de Alertas Tempranas:</strong> módulo que opera mediante un contador interactivo
                        de reportes
                        ciudadanos. Cada usuario puede notificar una situación de riesgo seleccionando el nivel de
                        alerta (alta,
                        media o baja). Cuando se registran cinco alertas en un mismo nivel, el sistema envía
                        automáticamente una
                        notificación a las entidades competentes, permitiendo una respuesta rápida y coordinada ante
                        posibles
                        emergencias.
                    </li>
                    <li>
                        <strong>Chatbot Inteligente e Inclusivo:</strong> asistente virtual que analiza los datos del
                        dashboard y genera
                        reportes automáticos de situación. Este chatbot incorpora un sistema de texto a voz
                        (Text-to-Speech) para
                        garantizar la inclusión de personas con discapacidad visual, fomentando la equidad tecnológica y
                        el acceso
                        universal a la información.
                    </li>
                </ol>
                <p className="text-body2">
                    Todas estas funcionalidades se integran dentro de una plataforma web unificada, que centraliza el
                    acceso al
                    dashboard, al sistema de alertas y al chatbot. Esta interfaz web facilita la interacción entre las
                    comunidades y
                    las instituciones encargadas de la gestión del riesgo, promoviendo una respuesta preventiva,
                    colaborativa e
                    inclusiva ante los impactos del cambio climático.
                </p>
            </article>

            <article className={styles.card}>
                <h2 className="text-h5">2. Contexto y Justificación</h2>
                <p className="text-body2">
                    El proyecto EcoVigía se enmarca dentro del Programa de Resiliencia Climática Urbana (UCRP), con un
                    periodo
                    de ejecución comprendido entre 2025 y 2027 en el municipio de Soacha (Cundinamarca). Este programa
                    es
                    financiado por la Z Zurich Foundation, con Zurich Colombia Seguros S.A. como socio estratégico, y es
                    implementado en las comunidades de La María y El Danubio en articulación con la Cruz Roja
                    Colombiana.
                </p>
                <p className="text-body2">
                    El objetivo general del proyecto UCRP consiste en fortalecer la resiliencia comunitaria con el fin
                    de reducir la
                    vulnerabilidad ante las inundaciones y las altas temperaturas, mediante la implementación de medidas
                    de
                    reducción del riesgo y adaptación al cambio climático, en coordinación con los sectores público,
                    privado y
                    comunitario.
                </p>
                <p className="text-body2">
                    La intervención en Soacha se justifica por la alta vulnerabilidad de la región frente al cambio
                    climático y los
                    fenómenos hidrometeorológicos extremos que afectan de manera recurrente a su población. Estas
                    condiciones
                    demandan soluciones innovadoras que permitan anticipar, prevenir y responder eficazmente a los
                    eventos de
                    inundación mediante la integración de tecnología y participación ciudadana.
                </p>
                <h3 className="text-h6">Amenaza Climática y Riesgo de Inundación</h3>
                <ol className={styles.list}>
                    <li>
                        <strong>Contexto nacional y local del riesgo:</strong> El cambio climático global ha
                        intensificado fenómenos
                        meteorológicos extremos, entre ellos las inundaciones y avenidas torrenciales, que se han vuelto
                        más
                        frecuentes y severas. Según la Organización Meteorológica Mundial (OMM), el fenómeno de La Niña
                        —
                        caracterizado por lluvias intensas— ha ampliado sus impactos debido al calentamiento global. A
                        nivel nacional,
                        se estima que cerca del 17% del territorio continental colombiano (190,935 km²) presenta
                        condiciones
                        favorables para la ocurrencia de inundaciones.
                    </li>
                    <li>
                        <strong>Vulnerabilidad de Soacha:</strong> El municipio de Soacha, colindante con Bogotá,
                        presenta una incidencia
                        elevada de inundaciones del 71.07%, convirtiéndose en una de las zonas más vulnerables del
                        departamento de
                        Cundinamarca. Esta situación se debe principalmente a deficiencias en la capacidad hidráulica de
                        sus canales
                        naturales y artificiales, agravadas durante los periodos de lluvias intensas. El río Bogotá y
                        sus afluentes
                        atraviesan el territorio municipal, generando un alto riesgo hidrológico en sectores como La
                        María y El Danubio.
                    </li>
                </ol>
            </article>

            <article className={styles.card}>
                <h2 className="text-h5">3. Descripción de la Solución</h2>
                <p className="text-body2">
                    El proyecto EcoVigía propone una solución tecnológica integral orientada a la reducción del riesgo
                    de
                    inundaciones en las comunidades de La María y El Danubio en el municipio de Soacha. Esta herramienta
                    digital
                    busca fortalecer la capacidad de monitoreo, alerta y respuesta tanto de las comunidades como de las
                    instituciones locales, mediante el uso de inteligencia de datos, participación ciudadana e inclusión
                    tecnológica.
                </p>
                <p className="text-body2">
                    La propuesta integra un ecosistema digital compuesto por tres módulos funcionales que operan de
                    manera
                    interconectada:
                </p>
                <ol className={styles.list}>
                    <li>
                        <strong>Dashboard Interactivo:</strong> Es una plataforma de visualización de los datos
                        proporcionados por la
                        Cruz Roja Colombiana y los diagnósticos comunitarios del Proyecto de Resiliencia Climática
                        Urbana (UCRP).
                        Permite identificar zonas críticas de riesgo a partir de mapas interactivos con niveles de
                        amenaza (alta,
                        media y baja), y superponer capas de información sobre infraestructura, población y
                        vulnerabilidad.
                    </li>
                    <li>
                        <strong>Sistema de Alertas Tempranas (SAT):</strong> funciona a través de un contador
                        interactivo de reportes
                        ciudadanos. Los usuarios pueden emitir alertas de diferentes niveles (alta, media o baja) según
                        la gravedad
                        del evento. Cuando se alcanza un umbral de cinco activaciones entre rojo y amarillo, se envía
                        una alerta; y
                        al llegar a diez en verde, se notifica automáticamente a las entidades competentes (Cruz Roja,
                        Alcaldía de
                        Soacha y organismos de respuesta), promoviendo la vigilancia comunitaria y la coordinación
                        interinstitucional.
                    </li>
                    <li>
                        <strong>Chatbot Inteligente e Inclusivo:</strong> asistente virtual basado en inteligencia
                        artificial que analiza
                        información en tiempo real, genera reportes automáticos de riesgo y brinda recomendaciones ante
                        emergencias.
                    </li>
                </ol>
            </article>

            <article className={styles.card}>
                <h2 className="text-h5">4. Plataforma Web Integrada</h2>
                <p className="text-body2">
                    Todos los módulos se alojan en una plataforma web unificada, accesible desde cualquier dispositivo.
                    La
                    plataforma centraliza el acceso al dashboard, al sistema de alertas y al chatbot, ofreciendo una
                    experiencia
                    digital participativa e inclusiva. Esta integración facilita la interacción entre las comunidades y
                    las
                    instituciones encargadas de la gestión del riesgo, promoviendo una respuesta preventiva, coordinada
                    e
                    inclusiva ante los impactos del cambio climático.
                </p>
            </article>

            <article className={styles.card}>
                <h2 className="text-h5">5. Ventajas y Desventajas</h2>
                <h3 className="text-h6">Ventajas</h3>
                <ol className={styles.list}>
                    <li><strong>Participación comunitaria:</strong> Involucra directamente a los habitantes en el
                        reporte de alertas y observaciones locales.
                    </li>
                    <li><strong>Inclusión digital:</strong> Integra funciones de accesibilidad como texto a voz,
                        garantizando la participación de personas con discapacidad visual.
                    </li>
                    <li><strong>Interoperabilidad institucional:</strong> Facilita la comunicación entre la Cruz Roja,
                        la Alcaldía de Soacha y los organismos de gestión del riesgo.
                    </li>
                    <li><strong>Escalabilidad y sostenibilidad:</strong> Su arquitectura modular y de código abierto
                        permite replicar la herramienta en otros municipios.
                    </li>
                    <li><strong>Fortalecimiento de la resiliencia local:</strong> Promueve la educación climática y la
                        acción temprana ante riesgos de inundación.
                    </li>
                </ol>
                <h3 className="text-h6" style={{marginTop: 8}}>Desventajas</h3>
                <ol className={styles.list}>
                    <li><strong>Dependencia tecnológica:</strong> Requiere conexión estable a internet y dispositivos
                        digitales.
                    </li>
                    <li><strong>Mantenimiento continuo:</strong> Necesita soporte técnico y actualización constante.
                    </li>
                    <li><strong>Participación irregular:</strong> Depende de la constancia de los reportes ciudadanos.
                    </li>
                    <li><strong>Limitaciones en la actualización de datos:</strong> Dado que las bases de datos
                        oficiales y comunitarias se actualizan de forma trimestral, la plataforma puede estar
                        temporalmente desactualizada, afectando la precisión de los reportes.
                    </li>
                    <li><strong>Dependencia de fuentes externas:</strong> Retrasos o falta de acceso a datos oficiales
                        pueden afectar el funcionamiento del sistema.
                    </li>
                    <li><strong>Riesgo de saturación de alertas:</strong> Si no se gestionan adecuadamente los niveles
                        de reporte, puede generarse sobrecarga informativa en las entidades de respuesta.
                    </li>
                </ol>
            </article>
        </main>
    );
}
