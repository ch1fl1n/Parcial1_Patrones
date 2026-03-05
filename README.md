# Parcial - Renace Soacha :p

## Visión general

Renace Soacha es la plataforma que combina mapas interactivos, dashboards de impacto y un backend sólido para que la Cruz Roja y aliados puedan anticipar eventos climáticos extremos, monitorear poblaciones vulnerables (El Danubio, La María) y validar intervenciones de resiliencia urbana. El frontend Next.js consume APIs propias y servicios de IA (Ollama, etc.), mientras que el backend se conecta a un PostgreSQL gestionado por Helm para mantener los datos persistentes.

## Arquitectura y componentes clave

- **Helm `myapp` chart**: empaqueta el dashboard Next.js junto a su dependencia PostgreSQL (Bitnami). Separar cada subchart permite controlar imágenes, recursos y secretos por entorno. El HPA adjunto escala sobre CPU si la demanda crece.
- **Next.js + OpenStreetMap**: las páginas bajo `src/app` (monitoring, impact, ecovigia, dashboard, assistant, etc.) reutilizan componentes como `InteractiveMap`, `AIAnalysisPanel` y `ContactBubble` para mostrar capas geoespaciales, alertas y canales ciudadanos. Estas decisiones priorizan usabilidad para líderes comunitarios al ofrecer visualizaciones filtrables por localidad y evento.
- **Servicios y API**: el chart expone un `Service` (ClusterIP) y un `Ingress` con host `myapp.local`. Las APIs `/api/*` (nodes en `src/app/api`) alimentan widgets, mientras que rutas integradas con `ollama` trazan alertas inteligentes desde datos climáticos históricos.
- **Datos abiertos**: la base geoespacial `public/data/soacha.geojson` y los datasets del reto (AVCA, CRMC) alimentan la vista territorial, y la configuración de producción respeta buenas prácticas (configmap/secret, requests & limits, HPA).

## Uso de Helm (instalación manual)

1. **Requisitos previos**: asegúrate de tener una instalación de Kubernetes local (Minikube), Helm 3 y `kubectl` apuntando al clúster.
2. **Preparar el entorno**:
	```bash
	minikube start
	helm repo add bitnami https://charts.bitnami.com/bitnami
	kubectl create namespace myapp-dev
	kubectl create namespace myapp-prod
	```
3. **Instalar el chart en el entorno dev**:
	```bash
	helm upgrade --install parcial-dev helm/myapp --namespace myapp-dev --values helm/myapp/values-dev.yaml
	```
4. **Instalar en prod (puede apuntar al mismo clúster para pruebas)**:
	```bash
	helm upgrade --install parcial-prod helm/myapp --namespace myapp-prod --values helm/myapp/values-prod.yaml
	```
5. **Personalizar valores**: modifica `helm/myapp/values-{dev,prod}.yaml` para cambiar la imagen, credenciales, recursos, réplicas o variables de entorno. El chart principal controla la contraseña de PostgreSQL y la configuración de la app vía ConfigMap/Secret.

## ArgoCD + Minikube (sincronización automática)

1. **Instala ArgoCD en Minikube** (puedes usar el manifiesto oficial):
	```bash
	kubectl create namespace argocd
	kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
	```
2. **Exponer el servidor ArgoCD**:
	```bash
	kubectl port-forward svc/argocd-server -n argocd 8080:443
	```
	Luego accede a `https://localhost:8080` y usa las credenciales por defecto. Obtén el token con:
	```bash
	kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 --decode
	```
	(el usuario es `admin`).

	*Windows PowerShell users* can decode with:
	```powershell
	kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | % { [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($_)) }
	```
3. **Aplica las aplicaciones declaradas**: las carpetas `environments/dev/application.yaml` y `environments/prod/application.yaml` describen las aplicaciones `myapp-dev` y `myapp-prod`. Puedes crearlas directamente:
	```bash
	kubectl apply -f environments/dev/application.yaml
	kubectl apply -f environments/prod/application.yaml
	```
4. **Sincronización GitOps**: ambos manifests apuntan al repositorio `https://github.com/ch1fl1n/Parcial1_Patrones.git`, rama `main` y al chart `helm/myapp`. ArgoCD usa `syncPolicy.automated` para `prune` y `selfHeal`, por lo que cualquier cambio en `values-dev.yaml` o `values-prod.yaml` en `main` se despliega automáticamente.
5. **Minikube networking**: ejecuta `minikube tunnel` (en terminal separado) para habilitar IPs de LoadBalancer si necesitas exponer servicios; los `Ingress` requieren mapear `myapp.local` a la IP de Minikube en tu archivo `hosts`.

## Endpoints accesibles

- **Frontend principal**:
  - Host: `http://myapp.local` (o la IP de `Ingress` si usas `minikube tunnel`). Añade la entrada `$(minikube ip) myapp.local` en `/etc/hosts`.
  - Página inicial con dashboard climático y canales de contacto.
- **API / Backend**: todas las rutas bajo `http://myapp.local/api/*` gestionan alertas, análisis IA y notificaciones (`/api/ollama/*`, `/api/reports/export`, `/api/notifications`).
- **Otras vistas**: las rutas en `src/app/` (impact, monitoring, ecovigia, assistant, attention-lines) están disponibles vía la misma host y se navegan como páginas Next (`/impact`, `/monitoring`, etc.).

## Lógica de diseño

- Usamos Helm para versionar y parametrizar despliegues completos: cada subchart (PostgreSQL y app) encapsula configuración reutilizable, y los `values-*.yaml` por ambiente aseguran que recursos, réplicas y variables sean independientes.
- El HPA asegura que el frontend escale ante picos de CPU, mientras que ConfigMap/Secret separan configuración pública y sensible. Esto mantiene el cumplimiento de buenas prácticas (recursos, autoscaling, no exponer credenciales adjuntas).
- Las páginas Next.js combinan mapas (componentes `InteractiveMap`, `AIAnalysisPanel`) con microservicios del backend (rutas en `src/app/api`). De esta forma las comunidades ven capas geográficas ricas y datos de resiliencia (AVCA/CRMC) sin saber de la infraestructura.
- ArgoCD cierra el ciclo GitOps: solo se requiere hacer push a `main` y la plataforma, gracias al `syncPolicy.automated`, actualiza los entornos transparentemente.

## Posibles mejoras

1. **Pipeline CI/CD completo**: integrar GitHub Actions o tekton que valide la build del frontend/backend antes de actualizar `values` y notifiquen a ArgoCD.
2. **Control de acceso**: añadir OAuth/OpenID para proteger dashboards sensibles y registrar quién genera alertas o exporta reportes.
3. **Monitoreo y alertas**: conectar Prometheus/Grafana para métricas de latencia y errores; agregar alertmanager para que ArgoCD notifique fallos en sincronización.
4. **Escalado geográfico**: separar los datos de El Danubio y La María en múltiples namespaces/values y habilitar MultiCluster o Remote Writing para escalar a otros municipios.

## Notas adicionales

- Ajusta las credenciales de PostgreSQL (`helm/myapp/values.yaml`) y del secret `DB_PASSWORD` antes de exponer a producción.
- Para pruebas rápidas en Minikube puedes usar `helm upgrade --install --wait` para verificar la salud de todos los recursos antes de confiar en ArgoCD.
- ArgoCD ya está preparado para `prune` y `selfHeal`, por lo que cualquier recurso manual creado fuera de Helm será eliminado o restaurado si no figura en la plantilla del chart.

