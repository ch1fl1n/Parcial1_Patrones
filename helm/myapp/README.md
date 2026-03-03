# Chart Helm Parcial

Este chart de Helm despliega una aplicación Next.js con una base de datos PostgreSQL usando subcharts.

## Arquitectura

- **Chart principal**: Orquesta el despliegue
- **Subchart PostgreSQL**: Usa el chart de Helm de Bitnami para PostgreSQL
- **Subchart de la aplicación**: Despliega la aplicación Next.js con ConfigMap y Secret para la conexión a la BD

## Requisitos previos

- Clúster de Kubernetes
- Helm 3.x
- Docker

## Instalación

1. Iniciar Minikube:
   ```bash
   minikube start
   ```

2. Construir y cargar la imagen Docker:
   ```bash
   # Desde la raíz del proyecto
   docker build -t parcial:latest .
   minikube image load parcial:latest
   ```

3. Instalar el chart:
   ```bash
   helm dependency update ./helm/myapp
   helm install parcial ./helm/myapp
   ```

4. Acceder a la aplicación:
   ```bash
   minikube service parcial-app
   ```

## Configuración

La siguiente tabla lista los parámetros configurables del chart Parcial y sus valores por defecto.

| Parámetro | Descripción | Valor por defecto |
|-----------|-------------|-------------------|
| `postgresql.enabled` | Habilitar PostgreSQL | `true` |
| `postgresql.auth.postgresPassword` | Contraseña de administrador de PostgreSQL | `"changeme"` |
| `app.image.repository` | Repositorio de la imagen de la aplicación | `"parcial"` |
| `app.image.tag` | Etiqueta de la imagen | `"latest"` |
| `app.service.type` | Tipo de servicio | `ClusterIP` |

## Lógica y decisiones de diseño

### Uso de subcharts
- **Modularidad**: Separa preocupaciones de la base de datos y la aplicación para mantenimiento y reutilización más fácil.
- **Gestión de dependencias**: PostgreSQL se maneja como una dependencia externa, permitiendo control de versiones y actualizaciones.
- **Escalabilidad**: Cada subchart puede escalarse o modificarse independientemente.

### ConfigMap y Secret
- **Seguridad**: Datos sensibles en Secret, no sensibles en ConfigMap.
- **Flexibilidad**: Variables de entorno inyectadas en el pod para una configuración sencilla.

### Compromisos
- **Complejidad**: Los subcharts añaden sobrecarga comparados con un chart monolítico.
- **Rendimiento**: Sin impacto significativo; recursos estándar de Kubernetes.
- **Eficiencia**: Mejor para equipos grandes y aplicaciones complejas.

## Uso en el mundo real

En un entorno de producción:
1. Usar un registro privado para las imágenes.
2. Configurar almacenamiento persistente para PostgreSQL.
3. Configurar Ingress para acceso externo.
4. Usar gestión de secretos como Vault.
5. Implementar pipelines CI/CD para despliegues automatizados.