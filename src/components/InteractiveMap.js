"use client";

import {useEffect, useRef, useState} from 'react';
import styles from './InteractiveMap.module.css';
import AIAnalysisPanel from './AIAnalysisPanel';
import 'leaflet/dist/leaflet.css';

export default function InteractiveMap({ 
  center = [4.5850, -74.2310], 
  zoom = 14,
  height = '600px',
  onZoneClick,
  enableAI = false,
  activeLayers = {
    floodRisk: true,
    threats: true,
    capacities: true,
    communities: true
  }
}) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [geodata, setGeodata] = useState(null);
  const [participantsSummary, setParticipantsSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const layersRef = useRef({});

  // Cargar datos geoespaciales
  useEffect(() => {
    fetch('/data/soacha.geojson')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setGeodata(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error cargando geodata:', err);
        setIsLoading(false);
      });
  }, []);

  // Cargar lista de participantes (CSV)
  useEffect(() => {
    const isServer = !(globalThis && globalThis.window);
    if (isServer) return;

    fetch('/data/BASE DE DATOS LISTA.csv')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.text();
      })
      .then(text => {
        try {
          const lines = text.split(/\r?\n/).filter(Boolean);
          if (lines.length < 2) return setParticipantsSummary({ total: 0, byPlace: {} });

          const headers = lines[0].split(',').map(h => h.trim());
          const rows = lines.slice(1).map(l => {
            // simple CSV split that preserves simple commas inside quoted fields is not implemented here;
            // dataset appears regular so this is acceptable for the prototype
            const cols = l.split(',').map(c => c.trim());
            const obj = {};
            headers.forEach((h, i) => { obj[h] = cols[i] !== undefined ? cols[i] : ''; });
            return obj;
          });

          const summary = { total: rows.length, byPlace: {} };
          rows.forEach(r => {
            const place = r['LUGAR DE LA ACTIVIDAD'] || r['LUGAR DE LA ACTIVIDAD'] || r['LUGAR DE LA ACTIVIDAD '] || r['Lugar de la actividad'] || 'Desconocido';
            if (!summary.byPlace[place]) summary.byPlace[place] = 0;
            summary.byPlace[place]++;
          });

          setParticipantsSummary(summary);
        } catch (err) {
          console.warn('Error parseando CSV participantes', err);
        }
      })
      .catch(err => {
        console.warn('Error cargando CSV participantes:', err);
      });
  }, []);

  // Inicializar mapa
  useEffect(() => {
      const isServer = !(globalThis && globalThis.window);
      if (isServer || !mapRef.current || mapInstance.current) {
          return () => {
          };
      }

    // Cargar Leaflet dinámicamente (solo en cliente)
    const initMap = async () => {
      const L = (await import('leaflet')).default;
      
      // Fix para iconos de Leaflet
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

        // Si por HMR o remount quedó una instancia previa ligada al contenedor, limpiarla
        try {
            if (mapRef.current && mapRef.current._leaflet_id) {
                // Eliminar nodos hijos y clases que Leaflet dejó para permitir una nueva inicialización
                mapRef.current._leaflet_id = null;
                mapRef.current.classList.remove && mapRef.current.classList.remove('leaflet-container');
                while (mapRef.current.firstChild) {
                    mapRef.current.removeChild(mapRef.current.firstChild);
                }
            }
        } catch {
            // Silenciar errores de limpieza, proceder a crear el mapa
            console.warn('Limpieza previa del contenedor Leaflet falló');
        }

      const map = L.map(mapRef.current).setView(center, zoom);

      // Tile layer OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstance.current = map;
    };

    initMap();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }

        // Asegurar que el contenedor no mantenga el id interno de Leaflet
        try {
            if (mapRef.current && mapRef.current._leaflet_id) {
                mapRef.current._leaflet_id = null;
            }
        } catch {
            // noop
        }
    };
  }, [center, zoom]);

  // Agregar capas cuando los datos estén disponibles
  useEffect(() => {
      const isServer = !(globalThis && globalThis.window);
      if (!mapInstance.current || !geodata || isServer) {
          return;
      }

    const updateLayers = async () => {
      const L = (await import('leaflet')).default;
      const map = mapInstance.current;

      // Limpiar capas anteriores (capas y controles)
      Object.values(layersRef.current).forEach(layer => {
        const removeItem = (l) => {
            if (!l) {
                return;
            }
          try {
            map.removeLayer(l);
          } catch {
              if (l && l.remove instanceof Function) {
              l.remove();
            }
          }
        };

        if (Array.isArray(layer)) {
          layer.forEach(removeItem);
        } else {
          removeItem(layer);
        }
      });
      layersRef.current = {};

      // Soporte para GeoJSON estándar (FeatureCollection)
        if (Array.isArray(geodata.features) && String(geodata.type || '').toLowerCase().includes('featurecollection')) {
        if (activeLayers.floodRisk) {
          const riskColor = (nivel) => {
            const v = String(nivel || '').toLowerCase();
              if (v.includes('alta')) {
                  return '#d32f2f';
              }
              if (v.includes('media')) {
                  return '#ff9800';
              }
            return '#4caf50';
          };

            const riskLevelKey = (nivel) => {
                const v = String(nivel || '').toLowerCase();
                if (v.includes('alta')) {
                    return 'high';
                }
                if (v.includes('media')) {
                    return 'medium';
                }
                if (v.includes('baja')) {
                    return 'low';
                }
                return 'unknown';
            };

          const gj = L.geoJSON(geodata, {
            style: (feature) => ({
              color: riskColor(feature?.properties?.Nivel_Riesgo),
              weight: 2,
              fillOpacity: 0.25,
            }),
            onEachFeature: (feature, layer) => {
              const barrio = feature?.properties?.Barrio || 'Zona';
              const nivel = feature?.properties?.Nivel_Riesgo || 'N/A';
              const area = feature?.properties?.area_m2;

                const popupBody = `
                <div class="${styles.popup}">
                  <h3>🌊 ${barrio}</h3>
                  <p><strong>Nivel de riesgo:</strong> ${nivel}</p>
                  ${area ? `<p><strong>Área:</strong> ${Number(area).toLocaleString()} m²</p>` : ''}
                  ${enableAI ? '<button class="ai-analyze-btn">🤖 Analizar con IA</button>' : ''}
                </div>
              `;

                layer.bindPopup(popupBody);

                layer.on('click', () => {
                    const bounds = layer.getBounds?.();
                    const center = bounds?.getCenter?.();
                    const zoneObj = {
                        id: feature.id || `${barrio}`,
                        name: barrio,
                        level: riskLevelKey(nivel),
                        description: `Sector ${barrio} con nivel de riesgo ${nivel}.`,
                        center: center ? [center.lat, center.lng] : undefined,
                    };
                    if (onZoneClick) {
                        onZoneClick(zoneObj);
                    }
                });

                if (enableAI) {
                    layer.on('popupopen', () => {
                        const btn = document.querySelector('.ai-analyze-btn');
                        if (btn) {
                            btn.onclick = (e) => {
                                e.stopPropagation();
                                const bounds = layer.getBounds?.();
                                const center = bounds?.getCenter?.();
                                const zoneObj = {
                                    id: feature.id || `${barrio}`,
                                    name: barrio,
                                    level: riskLevelKey(nivel),
                                    description: `Sector ${barrio} con nivel de riesgo ${nivel}.`,
                                    center: center ? [center.lat, center.lng] : undefined,
                                };
                                setSelectedZone(zoneObj);
                                setSelectedCommunity(null);
                                setShowAIPanel(true);
                                map.closePopup();
                            };
                        }
                    });
                }
            }
          }).addTo(map);

          layersRef.current.floodRisk = gj;

            // Leyenda simple de niveles de riesgo (contenido sin comparaciones directas)
          const legend = L.control({ position: 'bottomright' });
          legend.onAdd = function() {
            const div = L.DomUtil.create('div', 'leaflet-control leaflet-bar');
            div.style.background = 'white';
            div.style.padding = '8px 10px';
            div.style.borderRadius = '8px';
            div.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
            div.innerHTML = `
              <div style="font: 600 12px/1.2 system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif; margin-bottom: 6px;">Riesgo de Inundación</div>
              <div style="display:flex; align-items:center; gap:6px; margin:4px 0;">
                <span style="display:inline-block; width:12px; height:12px; background:#d32f2f; border-radius:2px;"></span>
                <span style="font: 12px system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;">Alta</span>
              </div>
              <div style="display:flex; align-items:center; gap:6px; margin:4px 0;">
                <span style="display:inline-block; width:12px; height:12px; background:#ff9800; border-radius:2px;"></span>
                <span style="font: 12px system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;">Media</span>
              </div>
              <div style="display:flex; align-items:center; gap:6px; margin:4px 0;">
                <span style="display:inline-block; width:12px; height:12px; background:#4caf50; border-radius:2px;"></span>
                <span style="font: 12px system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;">Baja</span>
              </div>
            `;
            return div;
          };
          legend.addTo(map);
          layersRef.current.legend = legend;
          try {
            map.fitBounds(gj.getBounds(), { padding: [16, 16] });
          } catch {
            // Ignorar si no se puede ajustar a los límites
          }

          // Control con resumen de participantes (si está disponible)
          if (participantsSummary) {
            const pctrl = L.control({ position: 'bottomleft' });
            pctrl.onAdd = function() {
              const d = L.DomUtil.create('div', 'leaflet-control leaflet-bar');
              d.style.background = 'white';
              d.style.padding = '8px 10px';
              d.style.borderRadius = '8px';
              d.style.boxShadow = '0 2px 6px rgba(0,0,0,0.12)';
              let html = `<div style="font:600 12px/1.2 system-ui, -apple-system, 'Segoe UI', Roboto, Arial; margin-bottom:6px;">Participantes</div>`;
              html += `<div style="font-size:13px; margin-bottom:6px;"><strong>Total:</strong> ${participantsSummary.total}</div>`;
              html += `<div style="font-size:12px; max-height:140px; overflow:auto;">`;
              Object.entries(participantsSummary.byPlace).forEach(([place, cnt]) => {
                html += `<div style="margin-bottom:4px;"><strong>${place}</strong>: ${cnt}</div>`;
              });
              html += `</div>`;
              d.innerHTML = html;
              return d;
            };
            pctrl.addTo(map);
            layersRef.current.participantsControl = pctrl;
          }
        }

        // No continuar con el flujo de datos personalizado si es GeoJSON estándar
        return;
      }

      // Capa de comunidades (polígonos)
      if (activeLayers.communities && geodata.communities) {
        Object.values(geodata.communities).forEach(community => {
          const polygon = L.polygon(community.boundary, {
            color: '#C8102E',
            weight: 2,
            fillOpacity: 0.1
          }).addTo(map);

          polygon.bindPopup(`
            <div class="${styles.popup}">
              <h3>${community.name}</h3>
              <p><strong>Población:</strong> ${community.population.toLocaleString()} habitantes</p>
              <p><strong>Hogares:</strong> ${community.households.toLocaleString()}</p>
              <hr/>
              <p><small>📊 ${community.vulnerabilities.no_evacuation_knowledge}% sin protocolos evacuación</small></p>
              <p><small>💰 ${community.vulnerabilities.no_emergency_savings}% sin ahorros emergencia</small></p>
              <p><small>🌊 ${community.vulnerabilities.flood_incidence}% incidencia inundaciones</small></p>
            </div>
          `);

            if (!layersRef.current.communities) {
                layersRef.current.communities = [];
            }
          layersRef.current.communities.push(polygon);
        });
      }

      // Capa de zonas de riesgo de inundación
      if (activeLayers.floodRisk && geodata.flood_risk_zones) {
          const colorMap = {high: '#d32f2f', medium: '#ff9800'};
          const levelTextMap = {high: '🔴 Alto', medium: '🟠 Medio'};

        geodata.flood_risk_zones.forEach(zone => {
            const color = colorMap[zone.level] || '#4caf50';

          const polygon = L.polygon(zone.coordinates, {
            color: color,
            weight: 2,
            fillOpacity: 0.3
          }).addTo(map);

            const label = levelTextMap[zone.level] || '🟢 Bajo';
          const popupContent = `
            <div class="${styles.popup}">
              <h3>🌊 ${zone.name}</h3>
              <p><strong>Nivel:</strong> ${label}</p>
              <p>${zone.description}</p>
              ${enableAI ? '<button class="ai-analyze-btn" data-zone-id="' + zone.id + '">🤖 Analizar con IA</button>' : ''}
            </div>
          `;
          
          polygon.bindPopup(popupContent);

          polygon.on('click', () => {
              if (onZoneClick) {
                  onZoneClick(zone);
              }
          });

          if (enableAI) {
            polygon.on('popupopen', () => {
              const btn = document.querySelector('.ai-analyze-btn');
              if (btn) {
                btn.onclick = (e) => {
                  e.stopPropagation();
                  let community = null;
                  if (geodata.communities) {
                    Object.values(geodata.communities).forEach(comm => {
                      community = comm;
                    });
                  }
                  setSelectedZone(zone);
                  setSelectedCommunity(community);
                  setShowAIPanel(true);
                  map.closePopup();
                };
              }
            });
          }

            if (!layersRef.current.floodRisk) {
                layersRef.current.floodRisk = [];
            }
          layersRef.current.floodRisk.push(polygon);
        });
      }

      // Capa de amenazas
      if (activeLayers.threats && geodata.threat_points) {
          const sevLabel = (sev) => ({critical: '🔴 Crítico', high: '🟠 Alto'}[sev] || '🟡 Medio');
        geodata.threat_points.forEach(threat => {
          const icon = L.divIcon({
            className: styles.markerIcon,
            html: `<div class="${styles.threatMarker}" data-severity="${threat.severity}">⚠️</div>`,
            iconSize: [30, 30]
          });

          const marker = L.marker(threat.coordinates, { icon }).addTo(map);

          marker.bindPopup(`
            <div class="${styles.popup}">
              <h3>⚠️ ${threat.name}</h3>
              <p><strong>Tipo:</strong> ${getThreatTypeLabel(threat.type)}</p>
              <p><strong>Severidad:</strong> ${sevLabel(threat.severity)}</p>
              <p>${threat.description}</p>
            </div>
          `);

            if (!layersRef.current.threats) {
                layersRef.current.threats = [];
            }
          layersRef.current.threats.push(marker);
        });
      }

      // Capa de capacidades locales
      if (activeLayers.capacities && geodata.capacity_points) {
        geodata.capacity_points.forEach(capacity => {
          const icon = L.divIcon({
            className: styles.markerIcon,
            html: `<div class="${styles.capacityMarker}">${getCapacityIcon(capacity.type)}</div>`,
            iconSize: [30, 30]
          });

          const marker = L.marker(capacity.coordinates, { icon }).addTo(map);

          marker.bindPopup(`
            <div class="${styles.popup}">
              <h3>${getCapacityIcon(capacity.type)} ${capacity.name}</h3>
              <p><strong>Tipo:</strong> ${getCapacityTypeLabel(capacity.type)}</p>
              ${capacity.capacity ? `<p><strong>Capacidad:</strong> ${capacity.capacity} personas</p>` : ''}
              <p>${capacity.description}</p>
            </div>
          `);

            if (!layersRef.current.capacities) {
                layersRef.current.capacities = [];
            }
          layersRef.current.capacities.push(marker);
        });
      }

      // Infraestructura crítica (ríos)
      geodata.critical_infrastructure && geodata.critical_infrastructure.forEach(infra => {
          if (String(infra.type || '').toLowerCase().includes('water') && infra.path) {
          const polyline = L.polyline(infra.path, {
            color: '#1976d2',
            weight: 3,
            opacity: 0.7
          }).addTo(map);

          polyline.bindPopup(`
            <div class="${styles.popup}">
              <h3>💧 ${infra.name}</h3>
              <p>${infra.description}</p>
            </div>
          `);

              if (!layersRef.current.infrastructure) {
                  layersRef.current.infrastructure = [];
              }
          layersRef.current.infrastructure.push(polyline);
        }
      });
    };

    updateLayers();
  }, [geodata, activeLayers, onZoneClick, enableAI, participantsSummary]);

  if (isLoading) {
    return (
      <div className={styles.loading} style={{ height }}>
        <p>Cargando mapa interactivo...</p>
      </div>
    );
  }

  return (
    <>
        <div
        ref={mapRef} 
        className={styles.map}
        style={{ height, width: '100%' }}
      />
      
      {showAIPanel && selectedZone && (
        <AIAnalysisPanel 
          zone={selectedZone}
          community={selectedCommunity}
          onClose={() => {
            setShowAIPanel(false);
            setSelectedZone(null);
            setSelectedCommunity(null);
          }}
        />
      )}
    </>
  );
}

// Helpers
function getThreatTypeLabel(type) {
    const map = {
        flood: 'Inundación',
        landslide: 'Mov. en masa',
        electrical: 'Riesgo eléctrico',
        sanitation: 'Saneamiento',
  };
    return map[type] || type;
}

function getCapacityIcon(type) {
    switch (type) {
        case 'shelter':
            return '🏠';
        case 'health':
            return '🏥';
        case 'school':
            return '🏫';
        case 'fire':
            return '🚒';
        default:
            return '📍';
    }
}

function getCapacityTypeLabel(type) {
    const map = {
        shelter: 'Albergue',
        health: 'Centro de salud',
        school: 'Colegio',
        fire: 'Bomberos',
  };
    return map[type] || type;
}
