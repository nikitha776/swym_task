import { getMerchantDisplayName } from './merchantDisplay.js';

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
 * Calculates the raw and weighted scores for each of the 5 key churn dimensions,
 * returning a total score from 0 to 100.
 */
export function calculateChurnScore(merchant) {
  const metrics = merchant.metrics || {};
  const riskAndDisputes = merchant.riskAndDisputes || {};
  const ecosystem = merchant.ecosystem || {};
  const engagement = merchant.engagement || {};

  // 1. Engagement (30%)
  const daysInactive = calculateDaysInactive(engagement.lastLoginDate);
  let engagementPoints = 0;
  if (daysInactive >= 14) engagementPoints = 100;
  else if (daysInactive >= 7) engagementPoints = 70;
  else if (daysInactive >= 3) engagementPoints = 40;
  const weightedEngagement = engagementPoints * 0.30;

  // 2. Financial (25%)
  const gmvDecline = metrics.gmvDeclineRate || 0;
  let financialPoints = 0;
  if (gmvDecline >= 40) financialPoints = 100;
  else if (gmvDecline >= 20) financialPoints = 75;
  else if (gmvDecline >= 5) financialPoints = 40;
  const weightedFinancial = financialPoints * 0.25;

  // 3. Support (20%)
  const tickets = engagement.supportTickets30d || 0;
  const csat = engagement.csatScore || 5;
  let supportPoints = 0;
  if (csat <= 2 || tickets >= 5) supportPoints = 100;
  else if (csat === 3 || tickets >= 3) supportPoints = 60;
  else if (csat === 4 || tickets >= 1) supportPoints = 30;
  const weightedSupport = supportPoints * 0.20;

  // 4. Integration (15%)
  const failRate = metrics.failedTransactionRate || 0;
  const webhookSuccess = ecosystem.webhookDeliverySuccessRate || 100;
  let integrationPoints = 0;
  if (failRate >= 5.0 || webhookSuccess < 95.0) integrationPoints = 100;
  else if (failRate >= 2.0 || webhookSuccess < 98.0) integrationPoints = 60;
  else if (failRate >= 0.5) integrationPoints = 30;
  const weightedIntegration = integrationPoints * 0.15;

  // 5. Dispute (10%)
  const chargebackRate = riskAndDisputes.chargebackRate || 0;
  let disputePoints = 0;
  if (chargebackRate >= 1.0) disputePoints = 100;
  else if (chargebackRate >= 0.5) disputePoints = 60;
  else if (chargebackRate >= 0.1) disputePoints = 30;
  const weightedDispute = disputePoints * 0.10;

  const totalScoreRaw = weightedEngagement + weightedFinancial + weightedSupport + weightedIntegration + weightedDispute;
  return Math.round(totalScoreRaw * 10) / 10;
}

/**
 * Maps a numerical churn score (0-100) to a qualitative risk level.
 */
export function getRiskLevel(score) {
  if (score >= 60) return 'High';
  if (score >= 30) return 'Medium';
  return 'Low';
}

/**
 * Returns the corresponding status color name based on the risk level.
 */
export function getRiskColor(riskLevel) {
  if (riskLevel === 'High') return 'danger';
  if (riskLevel === 'Medium') return 'warning';
  return 'success';
}

/**
 * Generates the recommended next best action for a merchant based on their primary churn risk driver.
 */
export function getRecommendation(merchant) {
  const score = calculateChurnScore(merchant);
  const riskLevel = getRiskLevel(score);

  if (riskLevel === 'Low') {
    return 'No immediate action required. Merchant is healthy. Continue standard automated monitoring.';
  }

  const metrics = merchant.metrics || {};
  const riskAndDisputes = merchant.riskAndDisputes || {};
  const ecosystem = merchant.ecosystem || {};
  const engagement = merchant.engagement || {};

  // Re-calculate individual weighted points to identify the primary driver
  const daysInactive = calculateDaysInactive(engagement.lastLoginDate);
  const engagementPoints = daysInactive >= 14 ? 100 : daysInactive >= 7 ? 70 : daysInactive >= 3 ? 40 : 0;
  const weightedEngagement = engagementPoints * 0.30;

  const gmvDecline = metrics.gmvDeclineRate || 0;
  const financialPoints = gmvDecline >= 40 ? 100 : gmvDecline >= 20 ? 75 : gmvDecline >= 5 ? 40 : 0;
  const weightedFinancial = financialPoints * 0.25;

  const tickets = engagement.supportTickets30d || 0;
  const csat = engagement.csatScore || 5;
  const supportPoints = (csat <= 2 || tickets >= 5) ? 100 : (csat === 3 || tickets >= 3) ? 60 : (csat === 4 || tickets >= 1) ? 30 : 0;
  const weightedSupport = supportPoints * 0.20;

  const failRate = metrics.failedTransactionRate || 0;
  const webhookSuccess = ecosystem.webhookDeliverySuccessRate || 100;
  const integrationPoints = (failRate >= 5.0 || webhookSuccess < 95.0) ? 100 : (failRate >= 2.0 || webhookSuccess < 98.0) ? 60 : failRate >= 0.5 ? 30 : 0;
  const weightedIntegration = integrationPoints * 0.15;

  const chargebackRate = riskAndDisputes.chargebackRate || 0;
  const disputePoints = chargebackRate >= 1.0 ? 100 : chargebackRate >= 0.5 ? 60 : chargebackRate >= 0.1 ? 30 : 0;
  const weightedDispute = disputePoints * 0.10;

  const drivers = [
    {
      name: 'Support',
      score: weightedSupport,
      action: `Contact ${getMerchantDisplayName(merchant)} within 24 hours to resolve critical open support issues and restore CSAT.`
    },
    {
      name: 'Financial',
      score: weightedFinancial,
      action: `Arrange an urgent account review for ${getMerchantDisplayName(merchant)} to investigate the MoM GMV decline of ${(metrics.gmvDeclineRate || 0).toFixed(1)}%.`
    },
    {
      name: 'Engagement',
      score: weightedEngagement,
      action: `Initiate immediate outreach to ${getMerchantDisplayName(merchant)} to re-engage them and address potential technical or onboarding blockers.`
    },
    {
      name: 'Integration',
      score: weightedIntegration,
      action: `Direct integration support to investigate transaction failure rate of ${(metrics.failedTransactionRate || 0).toFixed(1)}% for ${getMerchantDisplayName(merchant)}.`
    },
    {
      name: 'Dispute',
      score: weightedDispute,
      action: `Alert the Risk & Compliance team to review chargeback activity (${(riskAndDisputes.chargebackRate || 0).toFixed(2)}%) for ${getMerchantDisplayName(merchant)}.`
    }
  ];

  // Find the driver with the highest score
  const topDriver = [...drivers].sort((a, b) => b.score - a.score)[0];
  
  if (topDriver && topDriver.score > 0) {
    return topDriver.action;
  }
  return `Escalate ${getMerchantDisplayName(merchant)} to Account Management for priority support and proactive outreach.`;
}

/**
 * Evaluates the churn signals for a merchant and returns the points,
 * description, and category details for each signal, along with the total score and risk level.
 * Maintained for backwards compatibility in UI displays.
 */
export function evaluateMerchantRisk(merchant) {
  const totalScore = calculateChurnScore(merchant);
  const riskLevel = getRiskLevel(totalScore);
  const riskColor = getRiskColor(riskLevel);
  const recommendedAction = getRecommendation(merchant);

  const metrics = merchant.metrics || {};
  const riskAndDisputes = merchant.riskAndDisputes || {};
  const ecosystem = merchant.ecosystem || {};
  const engagement = merchant.engagement || {};

  const details = [];

  // 1. Engagement
  const daysInactive = calculateDaysInactive(engagement.lastLoginDate);
  const engagementPoints = daysInactive >= 14 ? 100 : daysInactive >= 7 ? 70 : daysInactive >= 3 ? 40 : 0;
  details.push({
    name: 'Portal Engagement',
    value: `${daysInactive} days inactive`,
    points: engagementPoints,
    weight: 0.30,
    weightedPoints: engagementPoints * 0.30,
    maxPoints: 100,
    explanation: `No platform login for ${daysInactive} days (last active: ${engagement.lastLoginDate || 'N/A'}).`,
    badgeType: engagementPoints >= 70 ? 'danger' : engagementPoints > 0 ? 'warning' : 'success'
  });

  // 2. Financial
  const gmvDecline = metrics.gmvDeclineRate || 0;
  const financialPoints = gmvDecline >= 40 ? 100 : gmvDecline >= 20 ? 75 : gmvDecline >= 5 ? 40 : 0;
  details.push({
    name: 'Financial Health',
    value: `${gmvDecline.toFixed(1)}% MoM decline`,
    points: financialPoints,
    weight: 0.25,
    weightedPoints: financialPoints * 0.25,
    maxPoints: 100,
    explanation: `Gross Merchandise Value (GMV) declined by ${gmvDecline.toFixed(1)}% MoM. Current Month: $${(metrics.gmv || 0).toLocaleString()}.`,
    badgeType: financialPoints >= 75 ? 'danger' : financialPoints > 0 ? 'warning' : 'success'
  });

  // 3. Support
  const tickets = engagement.supportTickets30d || 0;
  const csat = engagement.csatScore || 5;
  const supportPoints = (csat <= 2 || tickets >= 5) ? 100 : (csat === 3 || tickets >= 3) ? 60 : (csat === 4 || tickets >= 1) ? 30 : 0;
  details.push({
    name: 'Support & Satisfaction',
    value: `CSAT: ${csat}/5, ${tickets} tickets`,
    points: supportPoints,
    weight: 0.20,
    weightedPoints: supportPoints * 0.20,
    maxPoints: 100,
    explanation: `CSAT score is ${csat}/5 with ${tickets} support ticket(s) in the last 30 days.`,
    badgeType: supportPoints >= 60 ? 'danger' : supportPoints > 0 ? 'warning' : 'success'
  });

  // 4. Integration
  const failRate = metrics.failedTransactionRate || 0;
  const webhookSuccess = ecosystem.webhookDeliverySuccessRate || 100;
  const integrationPoints = (failRate >= 5.0 || webhookSuccess < 95.0) ? 100 : (failRate >= 2.0 || webhookSuccess < 98.0) ? 60 : failRate >= 0.5 ? 30 : 0;
  details.push({
    name: 'Integration Health',
    value: `Fail Rate: ${failRate.toFixed(1)}%, Webhook: ${webhookSuccess.toFixed(1)}%`,
    points: integrationPoints,
    weight: 0.15,
    weightedPoints: integrationPoints * 0.15,
    maxPoints: 100,
    explanation: `Transaction failure rate is ${failRate.toFixed(1)}% and webhook delivery success is ${webhookSuccess.toFixed(1)}%.`,
    badgeType: integrationPoints >= 60 ? 'danger' : integrationPoints > 0 ? 'warning' : 'success'
  });

  // 5. Dispute
  const chargebackRate = riskAndDisputes.chargebackRate || 0;
  const disputePoints = chargebackRate >= 1.0 ? 100 : chargebackRate >= 0.5 ? 60 : chargebackRate >= 0.1 ? 30 : 0;
  details.push({
    name: 'Disputes & Compliance',
    value: `${chargebackRate.toFixed(2)}% chargeback rate`,
    points: disputePoints,
    weight: 0.10,
    weightedPoints: disputePoints * 0.10,
    maxPoints: 100,
    explanation: `Chargeback dispute rate is ${chargebackRate.toFixed(2)}% of total transaction volume.`,
    badgeType: disputePoints >= 60 ? 'danger' : disputePoints > 0 ? 'warning' : 'success'
  });

  return {
    totalScore,
    riskLevel,
    riskColor,
    signals: details,
    recommendedAction
  };
}
