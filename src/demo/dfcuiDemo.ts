/**
 * DFCUI Demo - Corrosion Under Insulation Calculation Examples
 * 
 * This demo showcases the newly implemented DFCUI (Damage Factor Corrosion Under Insulation)
 * calculations with realistic industrial scenarios.
 */

import { formulaService } from '@/services/formulaService';
import { DFCuiInput } from '@/types/formulas';

/**
 * Demo scenarios for DFCUI calculations
 */
export const dfcuiDemoScenarios = [
  {
    name: "High Risk CUI Scenario - Steam Line",
    description: "Steam line with poor insulation condition in marine environment",
    inputs: {
      operatingTemperature: 150, // °C - High risk zone
      insulationType: "Mineral Wool",
      insulationCondition: "Poor",
      moistureIngress: "High",
      coatingCondition: "Fair",
      environmentalSeverity: "High",
      weatherExposure: "Marine",
      operatingCycles: 100,
      maintenanceFrequency: 0.5,
      age: 20
    } as DFCuiInput,
    expectedRisk: "High"
  },
  {
    name: "Moderate Risk CUI Scenario - Process Line",
    description: "Process line with good maintenance in sheltered environment",
    inputs: {
      operatingTemperature: 120, // °C - Moderate risk
      insulationType: "Calcium Silicate",
      insulationCondition: "Good",
      moistureIngress: "Low",
      coatingCondition: "Good",
      environmentalSeverity: "Moderate",
      weatherExposure: "Sheltered",
      operatingCycles: 25,
      maintenanceFrequency: 2,
      age: 10
    } as DFCuiInput,
    expectedRisk: "Moderate"
  },
  {
    name: "Low Risk CUI Scenario - Indoor Line",
    description: "Indoor line with excellent insulation and regular maintenance",
    inputs: {
      operatingTemperature: 80, // °C - Lower risk
      insulationType: "Cellular Glass",
      insulationCondition: "Excellent",
      moistureIngress: "None",
      coatingCondition: "Excellent",
      environmentalSeverity: "Low",
      weatherExposure: "Indoor",
      operatingCycles: 5,
      maintenanceFrequency: 4,
      age: 5
    } as DFCuiInput,
    expectedRisk: "Low"
  },
  {
    name: "Critical CUI Scenario - Offshore Platform",
    description: "Offshore equipment with severe environmental exposure",
    inputs: {
      operatingTemperature: 160, // °C - High risk zone
      insulationType: "Perlite",
      insulationCondition: "Very Poor",
      moistureIngress: "Severe",
      coatingCondition: "Poor",
      environmentalSeverity: "Severe",
      weatherExposure: "Marine",
      operatingCycles: 200,
      maintenanceFrequency: 0.2,
      age: 25
    } as DFCuiInput,
    expectedRisk: "Critical"
  }
];

/**
 * Run DFCUI demonstration
 */
export async function runDFCUIDemo() {
  console.log('🔥 DFCUI (Corrosion Under Insulation) Demo');
  console.log('==========================================\n');
  
  console.log('📋 CUI Risk Assessment Guidelines:');
  console.log('• Temperature Range 60-175°C: Highest CUI susceptibility');
  console.log('• Moisture Ingress: Primary accelerating factor');
  console.log('• Insulation Condition: Critical for CUI prevention');
  console.log('• Marine Environment: Increases chloride exposure');
  console.log('• Thermal Cycling: Promotes insulation degradation\n');
  
  for (const scenario of dfcuiDemoScenarios) {
    console.log(`🎯 ${scenario.name}`);
    console.log(`   ${scenario.description}`);
    console.log('   ─────────────────────────────────────────');
    
    // Calculate with basic variant
    const basicResult = await formulaService.calculate('DFCUI', 'DFCUI_BASIC', scenario.inputs);
    
    // Calculate with advanced variant
    const advancedResult = await formulaService.calculate('DFCUI', 'DFCUI_ADVANCED', scenario.inputs);
    
    if ('value' in basicResult && 'value' in advancedResult) {
      console.log(`   DFCUI Basic:    ${basicResult.value.toFixed(4)}`);
      console.log(`   DFCUI Advanced: ${advancedResult.value.toFixed(4)}`);
      
      // Risk interpretation
      const riskLevel = getRiskLevel(advancedResult.value);
      console.log(`   Risk Level:     ${riskLevel}`);
      console.log(`   Expected:       ${scenario.expectedRisk}`);
      
      // Key factors
      if (basicResult.metadata?.notes) {
        console.log(`   Note:           ${basicResult.metadata.notes}`);
      }
      
      console.log('');
    } else {
      console.log(`   Error: ${('error' in basicResult) ? basicResult.error : 'Unknown error'}`);
      console.log('');
    }
  }
  
  // Temperature sensitivity analysis
  console.log('🌡️  Temperature Sensitivity Analysis');
  console.log('───────────────────────────────────────');
  
  const baseInputs: DFCuiInput = {
    insulationType: "Mineral Wool",
    insulationCondition: "Fair",
    moistureIngress: "Moderate",
    coatingCondition: "Fair",
    environmentalSeverity: "Moderate",
    weatherExposure: "Exposed",
    operatingCycles: 50,
    maintenanceFrequency: 1,
    age: 15
  };
  
  const temperatures = [40, 60, 80, 100, 120, 140, 160, 180, 200, 250, 300];
  
  for (const temp of temperatures) {
    const inputs = { ...baseInputs, operatingTemperature: temp };
    const result = await formulaService.calculate('DFCUI', 'DFCUI_BASIC', inputs);
    
    if ('value' in result) {
      const riskLevel = getRiskLevel(result.value);
      console.log(`   ${temp}°C: DFCUI = ${result.value.toFixed(4)} (${riskLevel})`);
    }
  }
  
  console.log('\n📊 CUI Risk Factors Summary');
  console.log('──────────────────────────────');
  console.log('• Cellular Glass: Lowest CUI susceptibility (0.3x factor)');
  console.log('• Perlite: Highest CUI susceptibility (1.5x factor)');
  console.log('• Marine Environment: 1.5x risk multiplier');
  console.log('• Poor Insulation Condition: 2.0x risk multiplier');
  console.log('• Severe Moisture Ingress: 3.0x risk multiplier');
  console.log('• High Thermal Cycling: Up to 2.0x risk multiplier');
  console.log('• Regular Maintenance: Up to 0.3x risk reduction');
  console.log('\n✅ DFCUI Implementation Complete!\n');
}

/**
 * Get risk level based on DFCUI value
 */
function getRiskLevel(dfcuiValue: number): string {
  if (dfcuiValue < 0.5) return 'Low';
  if (dfcuiValue < 1.0) return 'Moderate';
  if (dfcuiValue < 2.0) return 'High';
  if (dfcuiValue < 3.0) return 'Very High';
  return 'Critical';
}

/**
 * DFCUI Quick Reference Guide
 */
export const dfcuiQuickReference = {
  temperatureZones: {
    'Low Risk': '< 60°C or > 175°C',
    'High Risk': '60-175°C (CUI most active)',
    'Moderate Risk': '175-300°C'
  },
  insulationTypes: {
    'Best': 'Cellular Glass (0.3x factor)',
    'Good': 'Polyurethane (0.8x factor), Calcium Silicate (1.0x factor)',
    'Moderate': 'Mineral Wool (1.2x factor)',
    'Worst': 'Perlite (1.5x factor)'
  },
  moistureControl: {
    'Critical': 'Prevent moisture ingress through vapor barriers',
    'Maintenance': 'Regular inspection of insulation condition',
    'Environment': 'Consider weather protection in marine environments'
  },
  recommendations: {
    'Design': 'Use moisture-resistant insulation in CUI-prone zones',
    'Maintenance': 'Increase inspection frequency for high-risk scenarios',
    'Coating': 'Apply high-performance coatings under insulation',
    'Monitoring': 'Consider CUI-specific NDE techniques'
  }
};

export default {
  runDFCUIDemo,
  dfcuiDemoScenarios,
  dfcuiQuickReference
};
