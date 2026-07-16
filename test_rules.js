import { evaluateMerchantRisk } from './src/utils/churnRules.js';
import { initialMerchants } from './src/utils/sampleData.js';

console.log('--- RUNNING RISK RULES ENGINE VERIFICATION (V2: 0-100 SCALE) ---');

let success = true;

const expectedScores = {
  'merch-1': { score: 0, level: 'Low' },
  'merch-2': { score: 6.0, level: 'Low' },
  'merch-3': { score: 6.0, level: 'Low' },
  'merch-4': { score: 6.0, level: 'Low' },
  'merch-5': { score: 0, level: 'Low' },
  'merch-6': { score: 41.5, level: 'Medium' },
  'merch-7': { score: 40.0, level: 'Medium' },
  'merch-8': { score: 38.3, level: 'Medium' },
  'merch-9': { score: 27.0, level: 'Low' },
  'merch-10': { score: 39.8, level: 'Medium' },
  'merch-11': { score: 100.0, level: 'High' },
  'merch-12': { score: 74.3, level: 'High' },
  'merch-13': { score: 56.5, level: 'Medium' },
  'merch-14': { score: 60.0, level: 'High' },
  'merch-15': { score: 68.0, level: 'High' }
};

initialMerchants.forEach((m) => {
  const result = evaluateMerchantRisk(m);
  const expected = expectedScores[m.id];
  
  console.log(`\nMerchant: ${m.businessName}`);
  console.log(`- Calculated Score: ${result.totalScore}/100 (Expected: ${expected.score}/100)`);
  console.log(`- Calculated Level: ${result.riskLevel} (Expected: ${expected.level})`);
  console.log(`- Recommended Action: ${result.recommendedAction}`);
  console.log('- Signal breakdown:');
  result.signals.forEach(s => {
    console.log(`  * ${s.name}: ${s.value} -> Points: ${s.points} (Weighted: ${s.weightedPoints.toFixed(1)} pts, ${s.badgeType})`);
  });

  if (Math.abs(result.totalScore - expected.score) > 0.1 || result.riskLevel !== expected.level) {
    console.error(`❌ Mismatch for ${m.businessName}! Calculated Score: ${result.totalScore}, Expected: ${expected.score}`);
    success = false;
  } else {
    console.log(`✓ Match for ${m.businessName}`);
  }
});

if (success) {
  console.log('\n✅ ALL CHURN RISK ENGINE CALCULATIONS MATCH THE SPECIFICATION!');
} else {
  console.error('\n❌ FAILURE: CHURN RISK ENGINE MISMATCH DETECTED!');
  process.exit(1);
}
