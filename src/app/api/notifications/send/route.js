/* eslint-disable no-undef */
import {NextResponse} from 'next/server';
import webpush from 'web-push';
import {getSubscriptions} from '../subscribe/route';

// Configurar VAPID keys
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || '';
const vapidEmail = process.env.VAPID_EMAIL || 'mailto:admin@dir-soacha.org';

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(
    vapidEmail,
    vapidPublicKey,
    vapidPrivateKey
  );
}

export async function POST(request) {
  try {
    const { title, body, severity, icon, data } = await request.json();

    // Validar campos requeridos
    if (!title || !body) {
      return NextResponse.json(
        { error: 'Título y mensaje son requeridos' },
        { status: 400 }
      );
    }

    // Obtener todas las suscripciones activas
    const subscriptions = getSubscriptions();

      if (0 === subscriptions.length) {
      return NextResponse.json({
        success: true,
        message: 'No hay suscriptores registrados',
        sent: 0
      });
    }

    // Preparar el payload de la notificación
    const notificationPayload = JSON.stringify({
      title,
      body,
      icon: icon || '/icons/CR-ES-Vertical-RGB.png',
      badge: '/icons/CR-ES-Horizontal-RGB.png',
      severity: severity || 'medium',
      data: {
        url: data?.url || '/alerts',
        timestamp: new Date().toISOString(),
        ...data
      }
    });

    // Enviar notificación a todos los suscriptores
    const sendPromises = subscriptions.map(async (subscription) => {
      try {
        await webpush.sendNotification(subscription, notificationPayload);
        return { success: true, endpoint: subscription.endpoint };
      } catch (error) {
        console.error('Error enviando notificación:', error);
        // Si la suscripción expiró o es inválida, podríamos eliminarla aquí
        return { success: false, endpoint: subscription.endpoint, error: error.message };
      }
    });

    const results = await Promise.all(sendPromises);
    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    console.log(`Notificaciones enviadas: ${successCount} éxitos, ${failCount} fallos`);

    return NextResponse.json({
      success: true,
      sent: successCount,
      failed: failCount,
      total: subscriptions.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error al enviar notificaciones:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// Endpoint GET para probar el envío de una notificación de prueba
export async function GET() {
  try {
    const subscriptions = getSubscriptions();
    
    return NextResponse.json({
      subscribersCount: subscriptions.length,
      configured: !!(vapidPublicKey && vapidPrivateKey),
        message: 0 === subscriptions.length
        ? 'No hay suscriptores. Activa las notificaciones desde /alerts'
        : `${subscriptions.length} suscriptor(es) registrado(s)`
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
