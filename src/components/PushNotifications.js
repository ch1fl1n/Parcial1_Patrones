"use client";

import {useEffect, useState} from "react";
import styles from "./PushNotifications.module.css";

export default function PushNotifications() {
  const [permission, setPermission] = useState("default");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [registration, setRegistration] = useState(null);

  useEffect(() => {
      if ("undefined" === typeof window || !("serviceWorker" in navigator)) {
      return;
    }

    // Verificar estado actual de permisos
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }

    // Registrar service worker
    const registerServiceWorker = async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js");
        console.log("Service Worker registrado:", reg.scope);
        setRegistration(reg);

        // Verificar si ya está suscrito
        const subscription = await reg.pushManager.getSubscription();
        setIsSubscribed(!!subscription);
      } catch (error) {
        console.error("Error registrando Service Worker:", error);
        setError("No se pudo registrar el Service Worker");
      }
    };

    registerServiceWorker();
  }, []);

  const urlBase64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const subscribeToPush = async () => {
    setLoading(true);
    setError(null);

    try {
      // Verificar que el Service Worker esté listo
      if (!registration) {
        throw new Error("Service Worker no está registrado. Por favor recarga la página.");
      }

      // Esperar a que el service worker esté completamente activo
      await navigator.serviceWorker.ready;
      console.log("Service Worker listo");

      // Solicitar permiso para notificaciones
      const permissionResult = await Notification.requestPermission();
      setPermission(permissionResult);

        if ("granted" !== permissionResult) {
        throw new Error("Permiso de notificaciones denegado");
      }

      // Obtener clave pública VAPID del servidor
      console.log("Obteniendo clave VAPID del servidor...");
      const keyResponse = await fetch("/api/notifications/subscribe", {
        method: "GET",
        cache: "no-cache",
      });
      
      if (!keyResponse.ok) {
        const errorData = await keyResponse.json();
        throw new Error(errorData.error || "Error al obtener clave VAPID");
      }
      
      const keyData = await keyResponse.json();

      if (!keyData.publicKey) {
        throw new Error("VAPID keys no configuradas. Ejecuta: npm run generate-vapid-keys y reinicia el servidor");
      }

      console.log("Clave VAPID obtenida exitosamente");

      // Primero, verificar si ya existe una suscripción y eliminarla
      const existingSubscription = await registration.pushManager.getSubscription();
      if (existingSubscription) {
        console.log("Eliminando suscripción anterior...");
        await existingSubscription.unsubscribe();
      }

      // Validar que la clave VAPID sea válida antes de intentar suscribir
      const applicationServerKey = urlBase64ToUint8Array(keyData.publicKey);
      console.log("Clave VAPID convertida, longitud:", applicationServerKey.length);

      // Crear nueva suscripción push con timeout
      console.log("Creando suscripción push...");
      const subscribePromise = registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey,
      });

      // Agregar timeout de 10 segundos
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Timeout: La suscripción tardó demasiado")), 10000)
      );

      const subscription = await Promise.race([subscribePromise, timeoutPromise]);
      console.log("Suscripción creada exitosamente");

      // Enviar suscripción al servidor
      const response = await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscription),
      });

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setIsSubscribed(true);
        console.log("✅ Suscripción registrada en el servidor");
        
        // Enviar notificación de prueba después de un pequeño delay
        setTimeout(() => {
          sendTestNotification().catch(err => 
            console.warn("No se pudo enviar notificación de prueba:", err)
          );
        }, 1000);
      } else {
        throw new Error(result.error || "Error al registrar suscripción");
      }
    } catch (error) {
      console.error("Error al suscribirse:", error);
      
      // Mensajes de error más específicos
      let errorMessage = error.message;

        if ("AbortError" === error.name || errorMessage.includes("push service error")) {
        errorMessage = "❌ Error del servicio push.\n\n" +
                      "Soluciones:\n" +
                      "1. Verifica que las VAPID keys estén en .env\n" +
                      "2. Reinicia completamente el servidor (Ctrl+C y npm run dev)\n" +
                      "3. Limpia el cache del navegador (Ctrl+Shift+Del)\n" +
                      "4. En DevTools > Application > Service Workers > Unregister\n" +
                      "5. Recarga la página (Ctrl+Shift+R)";
        } else if ("NotAllowedError" === error.name) {
        errorMessage = "❌ Permisos de notificación bloqueados.\n\n" +
                      "Ve a Configuración del sitio > Notificaciones > Permitir";
      } else if (errorMessage.includes("VAPID")) {
        errorMessage = "❌ Configuración VAPID incorrecta.\n\n" +
                      "Ejecuta: npm run generate-vapid-keys\n" +
                      "Luego reinicia: npm run dev";
      } else if (errorMessage.includes("Timeout")) {
        errorMessage = "⏱️ Timeout: El navegador no pudo conectar con el servicio push.\n\n" +
                      "Verifica tu conexión a internet e intenta nuevamente.";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const unsubscribeFromPush = async () => {
    setLoading(true);
    setError(null);

    try {
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        setIsSubscribed(false);
        console.log("Suscripción cancelada");
      }
    } catch (error) {
      console.error("Error al cancelar suscripción:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const sendTestNotification = async () => {
    try {
      const response = await fetch("/api/notifications/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "¡Bienvenido a DIR-Soacha!",
          body: "Has activado las notificaciones de alertas climáticas. Recibirás alertas sobre inundaciones y eventos meteorológicos.",
          severity: "low",
          data: {
            url: "/alerts",
          },
        }),
      });

      const result = await response.json();
      console.log("Notificación de prueba enviada:", result);
    } catch (error) {
      console.error("Error enviando notificación de prueba:", error);
    }
  };

  // Si el navegador no soporta notificaciones
    if ("undefined" !== typeof window && !("Notification" in window)) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.icon}>❌</div>
          <h3 className="text-h6">Notificaciones no soportadas</h3>
          <p className="text-body2">
            Tu navegador no soporta notificaciones push.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.icon}>
          {isSubscribed ? "🔔" : "🔕"}
        </div>
        
        <h3 className="text-h6">Notificaciones de Alerta</h3>
        
        <p className="text-body2" style={{ marginBottom: 16 }}>
          {isSubscribed
            ? "Estás suscrito a las alertas climáticas. Recibirás notificaciones en tiempo real."
            : "Activa las notificaciones para recibir alertas de inundaciones y eventos meteorológicos."}
        </p>

          {"denied" === permission && (
          <div className={styles.warning}>
            <strong>⚠️ Permisos bloqueados</strong>
            <p className="text-caption">
              Has bloqueado las notificaciones. Debes habilitarlas en la configuración de tu navegador.
            </p>
          </div>
        )}

        {error && (
          <div className={styles.error}>
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className={styles.actions}>
          {!isSubscribed ? (
            <button
              onClick={subscribeToPush}
              disabled={loading || "denied" === permission}
              className={styles.primaryBtn}
            >
              {loading ? "Activando..." : "🔔 Activar Notificaciones"}
            </button>
          ) : (
            <>
              <button
                onClick={unsubscribeFromPush}
                disabled={loading}
                className={styles.secondaryBtn}
              >
                {loading ? "Desactivando..." : "🔕 Desactivar Notificaciones"}
              </button>
              <button
                onClick={sendTestNotification}
                disabled={loading}
                className={styles.testBtn}
              >
                📨 Enviar Prueba
              </button>
            </>
          )}
        </div>

        <div className={styles.info}>
          <p className="text-caption">
            <strong>Recibirás alertas sobre:</strong>
          </p>
          <ul className="text-caption">
            <li>🌊 Riesgo de inundaciones (alta, media, baja)</li>
            <li>🌧️ Precipitaciones intensas previstas</li>
            <li>⚠️ Alertas emitidas por líderes comunitarios</li>
            <li>📊 Actualizaciones del sistema de monitoreo</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
