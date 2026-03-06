import {NextResponse} from 'next/server';
import {analyzeVulnerability, assessFloodRisk, generateEmergencyResponse} from '@/lib/ollama-service';
import { query } from '@/lib/db';

export async function POST(request) {
  try {
    const data = await request.json();
    const { zone_id, analysisType } = data;

    // Fetch zone and community data from PostgreSQL
    const zoneQuery = `
      SELECT z.id, z.name, z.risk_level, z.metadata,
             c.name as community_name, c.description as community_description
      FROM zones z
      LEFT JOIN communities c ON z.community_id = c.id
      WHERE z.id = $1
    `;
    const zoneResult = await query(zoneQuery, [zone_id]);
    if (zoneResult.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Zone not found' }, { status: 404 });
    }
    const zone = zoneResult.rows[0];

    // Fetch recent observations for the zone (last 30 days)
    const obsQuery = `
      SELECT source, value_json, recorded_at
      FROM observations
      WHERE zone_id = $1 AND recorded_at > NOW() - INTERVAL '30 days'
      ORDER BY recorded_at DESC
      LIMIT 10
    `;
    const obsResult = await query(obsQuery, [zone_id]);
    const recentObservations = obsResult.rows;

    // Helper: construir entrada para assessFloodRisk usando datos de DB
    const buildFloodRiskInput = (z, obs) => {
        const now = new Date();
        const month = now.getMonth();
        const seasons = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

        // Extract precipitation/temperature from observations if available
        let precipitation = 0;
        let temperature = 25; // default
        obs.forEach(o => {
          if (o.source === 'IDEAM' && o.value_json.precipitation) precipitation = o.value_json.precipitation;
          if (o.source === 'OpenWeather' && o.value_json.temperature) temperature = o.value_json.temperature;
        });

        return {
            name: z.name,
            coordinates: z.metadata?.center || '4.58, -74.23',
            waterBodies: z.metadata?.water_bodies || ['Río Bogotá', 'Quebrada Tibanica'],
            sewerageType: z.metadata?.infrastructure || 'artesanal/deficiente',
            soilImpermeability: 'alta',
            population: z.metadata?.population || 2000,
            season: seasons[month],
            recentPrecipitation: precipitation,
            recentTemperature: temperature
        };
    };

    // Use metadata from zone for vulnerabilities
    const vulnData = zone.metadata?.vulnerabilities || {};

    let result;

    switch (analysisType) {
      case 'vulnerability':
        result = await analyzeVulnerability({
            noEvacuationProtocol: vulnData.no_evacuation_knowledge ?? 62,
            noEmergencySavings: vulnData.no_emergency_savings ?? 81,
            foodInsecurity: vulnData.food_insecurity ?? 27,
            leadershipTrust: vulnData.leadership_trust ?? 55,
            threats: vulnData.threats || ['inundaciones', 'infraestructura deficiente'],
        });
        break;

      case 'flood-risk':
          result = await assessFloodRisk(buildFloodRiskInput(zone, recentObservations));
        break;

      case 'emergency':
        result = await generateEmergencyResponse({
            type: `Potencial inundación en ${zone.name}`,
            location: zone.name,
            severity: zone.risk_level,
            affectedPopulation: zone.metadata?.population || 2000,
            availableResources: ['CRMC', 'Líderes comunitarios'],
            localCapacities: ['brigadistas', 'puntos de encuentro']
        });
        break;

      default: {
        // Análisis completo por defecto
        const vulnData = zone.metadata?.vulnerabilities || {};
        const [vulnAnalysis, floodAnalysis, emergencyPlan] = await Promise.all([
          analyzeVulnerability({
              noEvacuationProtocol: vulnData.no_evacuation_knowledge ?? 62,
              noEmergencySavings: vulnData.no_emergency_savings ?? 81,
              foodInsecurity: vulnData.food_insecurity ?? 27,
              leadershipTrust: vulnData.leadership_trust ?? 55,
              threats: vulnData.threats || ['inundaciones', 'infraestructura deficiente'],
          }),
            assessFloodRisk(buildFloodRiskInput(zone, recentObservations)),
          generateEmergencyResponse({
              type: `Potencial evento climático en ${zone.name}`,
              location: zone.name,
              severity: zone.risk_level,
              affectedPopulation: zone.metadata?.population || 2000,
              availableResources: ['CRMC', 'Líderes comunitarios'],
              localCapacities: ['brigadistas', 'puntos de encuentro']
          })
        ]);

        result = {
          vulnerability: vulnAnalysis,
          floodRisk: floodAnalysis,
          emergency: emergencyPlan
        };
        break;
      }
    }

    // Optionally store the analysis result in observations or a new table
    // For now, just log or store in alerts if it's an emergency
    if (analysisType === 'emergency' || analysisType === 'default') {
      await query(`
        INSERT INTO observations (zone_id, source, value_json, recorded_at, metadata)
        VALUES ($1, $2, $3, $4, $5)
      `, [zone_id, 'ollama-analysis', { analysis: result }, new Date(), { analysis_type: analysisType }]);
    }

    return NextResponse.json({
      success: true,
      analysis: result,
        zone: zone.name,
        community: zone.community_name,
        recentObservations: recentObservations.length,
        timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en análisis de zona:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
