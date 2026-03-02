import {NextResponse} from 'next/server';
import {analyzeVulnerability, assessFloodRisk, generateEmergencyResponse} from '@/lib/ollama-service';

export async function POST(request) {
  try {
    const data = await request.json();
    const { zone, community, analysisType } = data;

      // Helper: construir entrada para assessFloodRisk
      const buildFloodRiskInput = (z) => {
          const now = new Date();
          const month = now.getMonth();
          const seasons = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
          return {
              name: z?.name || 'Zona de Soacha',
              coordinates: z?.center || '4.58, -74.23',
              waterBodies: ['Río Bogotá', 'Quebrada Tibanica'],
              sewerageType: z?.infrastructure || 'artesanal/deficiente',
              soilImpermeability: 'alta',
              population: community?.population || 2000,
              season: seasons[month],
          };
      };

    let result;

    switch (analysisType) {
      case 'vulnerability':
        result = await analyzeVulnerability({
            noEvacuationProtocol: community?.vulnerabilities?.no_evacuation_knowledge ?? 62,
            noEmergencySavings: community?.vulnerabilities?.no_emergency_savings ?? 81,
            foodInsecurity: community?.vulnerabilities?.food_insecurity ?? 27,
            leadershipTrust: community?.vulnerabilities?.leadership_trust ?? 55,
            threats: ['inundaciones', 'infraestructura deficiente'],
        });
        break;

      case 'flood-risk':
          result = await assessFloodRisk(buildFloodRiskInput(zone || {}));
        break;

      case 'emergency':
        result = await generateEmergencyResponse({
            type: `Potencial inundación en ${zone?.name || 'Soacha'}`,
            location: zone?.name || 'Soacha',
            severity: zone?.level || 'medium',
            affectedPopulation: community?.population || 2000,
            availableResources: ['CRMC', 'Líderes comunitarios'],
            localCapacities: ['brigadistas', 'puntos de encuentro']
        });
        break;

      default: {
        // Análisis completo por defecto
        const [vulnAnalysis, floodAnalysis, emergencyPlan] = await Promise.all([
          analyzeVulnerability({
              noEvacuationProtocol: community?.vulnerabilities?.no_evacuation_knowledge ?? 62,
              noEmergencySavings: community?.vulnerabilities?.no_emergency_savings ?? 81,
              foodInsecurity: community?.vulnerabilities?.food_insecurity ?? 27,
              leadershipTrust: community?.vulnerabilities?.leadership_trust ?? 55,
              threats: ['inundaciones', 'infraestructura deficiente'],
          }),
            assessFloodRisk(buildFloodRiskInput(zone || {})),
          generateEmergencyResponse({
              type: `Potencial evento climático en ${zone?.name || 'Soacha'}`,
              location: zone?.name || 'Soacha',
              severity: zone?.level || 'medium',
              affectedPopulation: community?.population || 2000,
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

    return NextResponse.json({ 
      success: true, 
      analysis: result,
        zone: zone?.name || 'Soacha',
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
