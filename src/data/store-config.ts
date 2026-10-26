/**
 * Verified PHONEX Store Configuration and Business Policies
 */

export const STORE_CONFIG = {
  // Free shipping threshold in INR
  freeShippingThreshold: 499,
  // Standard shipping fee in INR
  standardShippingFee: 49,
  // Express dispatch promise
  dispatchClaim: "Dispatched within 24 hours from Tamil Nadu hubs",
  // Standard delivery timeline
  deliveryTimelineTN: "2 to 4 business days across Tamil Nadu",
  deliveryTimelineNational: "4 to 6 business days for rest of India",
  // Return & Replacement policy
  returnWindowDays: 7,
  returnPolicyText: "7-day replacement guarantee for fit, alignment, or product defects",
  // Genuine materials
  materialGuarantee: "Genuine 3M Automotive Cast Vinyl • Residue-free removal",
  screenProtectorType: "9H Flexible Hybrid Ceramic PMMA • Shatterproof",
} as const;

/**
 * Consistent shipping fee calculation across the entire application
 * @param subtotal Cart subtotal in INR
 * @param isPickup Whether customer selected in-store pickup
 */
export function calculateShippingFee(subtotal: number, isPickup: boolean = false): number {
  if (isPickup) return 0;
  if (subtotal <= 0) return 0;
  return subtotal >= STORE_CONFIG.freeShippingThreshold ? 0 : STORE_CONFIG.standardShippingFee;
}

/**
 * Returns user-facing shipping label
 */
export function getShippingLabel(subtotal: number, isPickup: boolean = false): string {
  if (isPickup) return "FREE (Store Pickup)";
  if (subtotal <= 0) return "₹0";
  return subtotal >= STORE_CONFIG.freeShippingThreshold
    ? "FREE"
    : `₹${STORE_CONFIG.standardShippingFee} (Free above ₹${STORE_CONFIG.freeShippingThreshold})`;
}
