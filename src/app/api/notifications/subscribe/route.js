/* eslint-disable no-undef */
import {NextResponse} from 'next/server';
import webpush from 'web-push';

// Configurar VAPID keys (deberían estar en variables de entorno)
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || '';
const vapidEmail = process.env.VAPID_EMAIL || 'mailto:admin@dir-soacha.org';

// Validar que las keys estén configuradas
const isVapidConfigured = vapidPublicKey && vapidPrivateKey &&
    50 < vapidPublicKey.length && 20 < vapidPrivateKey.length;

if (isVapidConfigured) {
  try {
    webpush.setVapidDetails(
      vapidEmail,
      vapidPublicKey,
      vapidPrivateKey
    );
    console.log('✅ VAPID configurado correctamente');
  } catch (error) {
    console.error('❌ Error configurando VAPID:', error.message);
  }
} else {
  console.warn('⚠️ VAPID keys no configuradas o inválidas. Ejecuta: npm run generate-vapid-keys');
}

// En producción, esto debería guardarse en una base de datos
// Para el prototipo, usamos un módulo compartido
let subscriptions = new Set();

// Función para obtener todas las suscripciones
export function getSubscriptions() {
  return Array.from(subscriptions).map(s => JSON.parse(s));
}

export async function POST(request) {
  try {
    const subscription = await request.json();
    
    // Validar que la suscripción tenga los campos necesarios
    if (!subscription || !subscription.endpoint) {
      return NextResponse.json(
        { error: 'Suscripción inválida' },
        { status: 400 }
      );
    }

    // Guardar suscripción (en producción: guardar en DB)
    subscriptions.add(JSON.stringify(subscription));
    
    console.log('Nueva suscripción registrada:', subscription.endpoint.slice(-20));
    
    return NextResponse.json({
      success: true,
      message: 'Suscripción registrada exitosamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error al registrar suscripción:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// Endpoint para obtener la clave pública VAPID
export async function GET() {
  console.log('📡 Solicitud GET para obtener clave VAPID pública');
  console.log('   Public Key presente:', !!vapidPublicKey);
  console.log('   Public Key longitud:', vapidPublicKey?.length || 0);
  console.log('   Configuración VAPID válida:', isVapidConfigured);
  
  if (!isVapidConfigured) {
    const errorMsg = 'VAPID keys no configuradas correctamente.\n\n' +
                     'Pasos para solucionar:\n' +
                     '1. Ejecuta: npm run generate-vapid-keys\n' +
                     '2. Verifica que .env tenga las keys\n' +
                     '3. Reinicia el servidor: npm run dev';
    
    console.error('❌', errorMsg);
    
    return NextResponse.json(
      { 
        error: errorMsg,
        publicKey: null,
        configured: false
      },
      { status: 500 }
    );
  }

  console.log('✅ Enviando clave VAPID pública al cliente');
  
  return NextResponse.json({
    publicKey: vapidPublicKey,
    configured: true
  });
}
