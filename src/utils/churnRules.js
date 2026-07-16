// Churn Risk Scoring Engine (0-100 Weighted System)

// Anchor date for relative time calculations to ensure the sample data behaves consistently
// The current local time from metadata is 2026-07-16
export const ANCHOR_DATE_STR = '2026-07-16';
export const ANCHOR_DATE = new Date(ANCHOR_DATE_STR);

/**
 * Calculates days elapsed between a given date and the anchor date.
 */
export function calculateDaysInactive(dateStr) {
  const activeDate = new Date(dateStr);
  if (isNaN(activeDate.getTime())) return 0;
  
  const diffTime = ANCHOR_DATE.getTime() - activeDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

/**
 * Evaluates the churn signals for a merchant and returns the points,
 * description, and category details for each signal, along with the total score and risk level.
 */
export function evaluateMerchantRisk(merchant) {
  const details = [];
  
  // Safeguards for inputs
  const metrics = merchant.metrics || {};
  const riskAndDisputes = merchant.riskAndDisputes || {};
  const ecosystem = merchant.ecosystem || {};
  const engagement = merchant.engagement || {};

  // 1. Engagement Score (Weight: 30%)
  const daysInactive = calculateDaysInactive(engagement.lastLoginDate);
  let engagementPoints = 0;
  if (daysInactive >= 14) engagementPoints = 100;
  else if (daysInactive >= 7) engagementPoints = 70;
  else if (daysInactive >= 3) engagementPoints = 40;
  
  const weightedEngagement = engagementPoints * 0.30;
  details.push({
    name: 'Portal Engagement',
    value: `${daysInactive} days inactive`,
    points: engagementPoints,
    weight: 0.30,
    weightedPoints: weightedEngagement,
    maxPoints: 100,
    explanation: `No platform login for ${daysInactive} days (last active: ${engagement.lastLoginDate || 'N/A'}).`,
    badgeType: engagementPoints >= 70 ? 'danger' : engagementPoints > 0 ? 'warning' : 'success'
  });

  // 2. Financial Score (Weight: 25%)
  const gmvDecline = metrics.gmvDeclineRate || 0;
  let financialPoints = 0;
  if (gmvDecline >= 40) financialPoints = 100;
  else if (gmvDecline >= 20) financialPoints = 75;
  else if (gmvDecline >= 5) financialPoints = 40;

  const weightedFinancial = financialPoints * 0.25;
  details.push({
    name: 'Financial Health',
    value: `${gmvDecline.toFixed(1)}% MoM decline`,
    points: financialPoints,
    weight: 0.25,
    weightedPoints: weightedFinancial,
    maxPoints: 100,
    explanation: `Gross Merchandise Value (GMV) declined by ${gmvDecline.toFixed(1)}% MoM. Current Month: $${(metrics.gmv || 0).toLocaleString()}.`,
    badgeType: financialPoints >= 75 ? 'danger' : financialPoints > 0 ? 'warning' : 'success'
  });

  // 3. Support & Service Score (Weight: 20%)
  const tickets = engagement.supportTickets30d || 0;
  const csat = engagement.csatScore || 5;
  let supportPoints = 0;
  if (csat <= 2 || tickets >= 5) supportPoints = 100;
  else if (csat === 3 || tickets >= 3) supportPoints = 60;
  else if (csat === 4 || tickets >= 1) supportPoints = 30;

  const weightedSupport = supportPoints * 0.20;
  details.push({
    name: 'Support & Satisfaction',
    value: `CSAT: ${csat}/5, ${tickets} tickets`,
    points: supportPoints,
    weight: 0.20,
    weightedPoints: weightedSupport,
    maxPoints: 100,
    explanation: `CSAT score is ${csat}/5 with ${tickets} support ticket(s) in the last 30 days.`,
    badgeType: supportPoints >= 60 ? 'danger' : supportPoints > 0 ? 'warning' : 'success'
  });

  // 4. Integration Health Score (Weight: 15%)
  const failRate = metrics.failedTransactionRate || 0;
  const webhookSuccess = ecosystem.webhookDeliverySuccessRate || 100;
  let integrationPoints = 0;
  if (failRate >= 5.0 || webhookSuccess < 95.0) integrationPoints = 100;
  else if (failRate >= 2.0 || webhookSuccess < 98.0) integrationPoints = 60;
  else if (failRate >= 0.5) integrationPoints = 30;

  const weightedIntegration = integrationPoints * 0.15;
  details.push({
    name: 'Integration Health',
    value: `Fail Rate: ${failRate.toFixed(1)}%, Webhook: ${webhookSuccess.toFixed(1)}%`,
    points: integrationPoints,
    weight: 0.15,
    weightedPoints: weightedIntegration,
    maxPoints: 100,
    explanation: `Transaction failure rate is ${failRate.toFixed(1)}% and webhook delivery success is ${webhookSuccess.toFixed(1)}%.`,
    badgeType: integrationPoints >= 60 ? 'danger' : integrationPoints > 0 ? 'warning' : 'success'
  });

  // 5. Dispute & Risk Score (Weight: 10%)
  const chargebackRate = riskAndDisputes.chargebackRate || 0;
  let disputePoints = 0;
  if (chargebackRate >= 1.0) disputePoints = 100;
  else if (chargebackRate >= 0.5) disputePoints = 60;
  else if (chargebackRate >= 0.1) disputePoints = 30;

  const weightedDispute = disputePoints * 0.10;
  details.push({
    name: 'Disputes & Compliance',
    value: `${chargebackRate.toFixed(2)}% chargeback rate`,
    points: disputePoints,
    weight: 0.10,
    weightedPoints: weightedDispute,
    maxPoints: 100,
    explanation: `Chargeback dispute rate is ${chargebackRate.toFixed(2)}% of total transaction volume.`,
    badgeType: disputePoints >= 60 ? 'danger' : disputePoints > 0 ? 'warning' : 'success'
  });

  // Calculate Total Weighted Score
  const totalScoreRaw = weightedEngagement + weightedFinancial + weightedSupport + weightedIntegration + weightedDispute;
  const totalScore = Math.round(totalScoreRaw * 10) / 10; // Round to 1 decimal place

  // Determine Risk Level
  let riskLevel = 'Low';
  let riskColor = 'success';
  if (totalScore >= 60) {
    riskLevel = 'High';
    riskColor = 'danger';
  } else if (totalScore >= 30) {
    riskLevel = 'Medium';
    riskColor = 'warning';
  }

  // Determine Recommended Action dynamically based on top risk contributors
  let recommendedAction = 'No immediate action required. Merchant is healthy. Continue standard automated monitoring.';
  
  if (riskLevel !== 'Low') {
    // Sort signals by weightedPoints to find the primary driver
    const drivers = [
      {
        name: 'Support',
        score: weightedSupport,
        action: `Contact ${merchant.businessName} within 24 hours to resolve critical open support issues and restore CSAT.`
      },
      {
        name: 'Financial',
        score: weightedFinancial,
        action: `Arrange an urgent account review for ${merchant.businessName} to investigate the MoM GMV decline of ${gmvDecline.toFixed(1)}%.`
      },
      {
        name: 'Engagement',
        score: weightedEngagement,
        action: `Initiate immediate outreach to ${merchant.businessName} to re-engage them and address potential technical or onboarding blockers.`
      },
      {
        name: 'Integration',
        score: weightedIntegration,
        action: `Direct integration support to investigate transaction failure rate of ${failRate.toFixed(1)}% for ${merchant.businessName}.`
      },
      {
        name: 'Dispute',
        score: weightedDispute,
        action: `Alert the Risk & Compliance team to review chargeback activity (${chargebackRate.toFixed(2)}%) for ${merchant.businessName}.`
      }
    ];

    // Find the one with highest score. Tie break goes to the order in the array.
    const topDriver = [...drivers].sort((a, b) => b.score - a.score)[0];
    
    if (topDriver && topDriver.score > 0) {
      recommendedAction = topDriver.action;
    } else {
      recommendedAction = `Escalate ${merchant.businessName} to Account Management for priority support and proactive outreach.`;
    }
  }

  return {
    totalScore,
    riskLevel,
    riskColor,
    signals: details,
    recommendedAction
  };
}
