export function getMerchantDisplayName(merchant) {
  if (!merchant) return 'Unnamed Merchant';
  return merchant.businessName || merchant.name || merchant.merchantName || 'Unnamed Merchant';
}

export function getMerchantEmail(merchant) {
  if (!merchant) return 'no-email';
  return merchant.primaryEmail || merchant.email || merchant.contactEmail || 'no-email';
}

export function getMerchantCategory(merchant) {
  if (!merchant) return 'Retail';
  return merchant.category || merchant.segment || merchant.type || 'Retail';
}
