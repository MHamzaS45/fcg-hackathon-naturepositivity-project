import { CalculatorInputs, CalculationResults } from '@/types/calculator';

export function calculateImpact(inputs: CalculatorInputs): CalculationResults {
  // Step 1: Determine System Tier
  const tier = determineTier(inputs);
  const tierDescription = getTierDescription(tier);
  
  // Step 2: Calculate Installation Costs
  const roofCostBase = { 1: 120, 2: 180, 3: 280 };
  const retrofitPremium = { 1: 25, 2: 30, 3: 40 };
  
  const roofCostPerM2 = roofCostBase[tier] + 
    (inputs.projectType === 'Retrofit/Renovation' ? retrofitPremium[tier] : 0);
  const roofCost = inputs.roofArea * roofCostPerM2;
  
  const wallCostPerM2 = { 1: 500, 2: 750, 3: 1000 }[tier];
  const wallCost = inputs.wallArea * wallCostPerM2;
  
  let technologyCost = 3500;
  if (inputs.wallArea > 0) technologyCost += 2000;
  if (tier === 3) technologyCost += 1500;
  
  const maintenanceRates = {
    roof: { 1: 6, 2: 9, 3: 13 },
    wall: { 1: 12, 2: 18, 3: 25 }
  };
  
  const annualMaintenance = (inputs.roofArea * maintenanceRates.roof[tier]) + 
                           (inputs.wallArea * maintenanceRates.wall[tier]);
  const maintenanceCost5Year = annualMaintenance * 5;
  
  const totalInvestment = roofCost + wallCost + technologyCost + maintenanceCost5Year;
  
  // Step 3: Calculate Environmental Impacts (Annual)
  const carbonCoefficients = {
    roof: { 1: 0.4, 2: 0.8, 3: 1.8 },
    wall: 0.3
  };
  
  const carbonRoof = inputs.roofArea * carbonCoefficients.roof[tier];
  const carbonWall = inputs.wallArea * carbonCoefficients.wall;
  const carbonKg = carbonRoof + carbonWall;
  const carbonTonnes = carbonKg / 1000;
  
  const stormwaterCoefficients = { 1: 0.025, 2: 0.035, 3: 0.045 };
  const stormwaterDetention = inputs.roofArea * stormwaterCoefficients[tier];
  
  let energyCoefficient: number;
  if (inputs.projectType === 'Retrofit/Renovation' && inputs.buildingAge) {
    const ageCoefficients = {
      'Pre-2005': 120,
      '2005-2020': 45,
      'Post-2020': 25
    };
    energyCoefficient = ageCoefficients[inputs.buildingAge];
  } else {
    energyCoefficient = { 1: 25, 2: 35, 3: 50 }[tier];
  }
  const energySavingsAnnual = (inputs.roofArea + inputs.wallArea) * energyCoefficient;
  
  const biodiversityCoefficients = { 1: 0.0025, 2: 0.0040, 3: 0.0065 };
  const biodiversityUnits = (inputs.roofArea + inputs.wallArea) * biodiversityCoefficients[tier];
  
  // Step 4: Calculate Financial Returns (5-year period)
  // Private Returns
  const electricityPrice = 0.16;
  const energySavings5Year = energySavingsAnnual * electricityPrice * 5;
  const membraneLifeSavings = inputs.roofArea * 7 * 5;
  const appreciationRate = { 1: 0.05, 2: 0.07, 3: 0.10 }[tier];
  const propertyValueIncrease = (roofCost + wallCost) * appreciationRate;
  const totalPrivateReturns = energySavings5Year + membraneLifeSavings + propertyValueIncrease;
  
  // Public Returns
  const stormwaterValue = stormwaterDetention * 40 * 5;
  const airQualityValue = (inputs.roofArea + inputs.wallArea) * 7.5 * 5;
  const heatMitigationValue = inputs.roofArea * 4 * 5;
  
  const noiseValue = inputs.locationContext === 'Near highway/airport (noise sensitive)' 
    ? inputs.roofArea * 8 * 5 
    : 0;
  
  let biodiversityWellbeingValue: number;
  if (inputs.publicAccess === 'Yes') {
    biodiversityWellbeingValue = inputs.roofArea * 15 * 5;
  } else {
    biodiversityWellbeingValue = inputs.roofArea * 3 * 5;
  }
  
  const totalPublicReturns = stormwaterValue + airQualityValue + heatMitigationValue + 
                            noiseValue + biodiversityWellbeingValue;
  
  // Combined Analysis
  const totalSocietalValue = totalPrivateReturns + totalPublicReturns;
  const privateROI = totalPrivateReturns - totalInvestment;
  const societalROI = totalSocietalValue - totalInvestment;
  const sroiRatio = totalSocietalValue / totalInvestment;
  
  const subsidyNeeded = Math.max(0, totalInvestment - totalPrivateReturns);
  const subsidyPercentage = (subsidyNeeded / totalInvestment) * 100;
  
  return {
    tier,
    tierDescription,
    totalInvestment,
    roofCost,
    wallCost,
    technologyCost,
    maintenanceCost5Year,
    annualMaintenance,
    carbonKg,
    carbonTonnes,
    stormwaterDetention,
    energySavingsAnnual,
    biodiversityUnits,
    energySavings5Year,
    membraneLifeSavings,
    propertyValueIncrease,
    totalPrivateReturns,
    stormwaterValue,
    airQualityValue,
    heatMitigationValue,
    noiseValue,
    biodiversityWellbeingValue,
    totalPublicReturns,
    totalSocietalValue,
    privateROI,
    societalROI,
    sroiRatio,
    subsidyNeeded,
    subsidyPercentage
  };
}

function determineTier(inputs: CalculatorInputs): 1 | 2 | 3 {
  // Tier 3: Intensive Multi-Use
  if (inputs.publicAccess === 'Yes' && inputs.communityProgramming === 'Yes') {
    return 3;
  }
  
  // Tier 2: Enhanced Performance
  if (
    inputs.communityProgramming === 'Yes' || 
    inputs.wallArea > 50 || 
    inputs.buildingType === 'School' || 
    inputs.publicAccess === 'Yes'
  ) {
    return 2;
  }
  
  // Tier 1: Standard Extensive
  return 1;
}

function getTierDescription(tier: 1 | 2 | 3): string {
  const descriptions = {
    1: "Standard extensive green roof with sedum vegetation. Cost-effective stormwater management and basic biodiversity.",
    2: "Enhanced performance system with diverse native species. Suitable for educational programming and moderate engagement.",
    3: "Intensive multi-use infrastructure with accessible gardens. Maximizes environmental impact and community wellbeing."
  };
  return descriptions[tier];
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fi-FI', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

export function formatNumber(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('fi-FI', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
}
