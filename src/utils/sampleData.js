export const initialMerchants = [
  // ================= LOW RISK MERCHANTS (0 - 29) =================
  {
    id: "merch-1",
    businessName: "Apex Gear Co.",
    primaryEmail: "ops@apexgear.com",
    country: "US",
    planName: "Shopify Plus",
    createdAt: "2024-03-12T10:00:00Z",
    metrics: {
      gmv: 125000.00,
      gmvDeclineRate: 0.0,
      transactionCount: 1500,
      averageOrderValue: 83.33,
      failedTransactionRate: 0.2
    },
    riskAndDisputes: {
      chargebackRate: 0.04,
      refundRate: 1.50,
      disputedAmount: 83.33
    },
    ecosystem: {
      activeAppCount: 12,
      webhookDeliverySuccessRate: 100.0,
      apiErrorCount: 2
    },
    engagement: {
      lastLoginDate: "2026-07-16T18:30:00Z",
      supportTickets30d: 0,
      avgResolutionTimeHrs: 0,
      csatScore: 5
    }
  },
  {
    id: "merch-2",
    businessName: "Bakehouse Artisans",
    primaryEmail: "hello@bakehouse.co",
    country: "IN",
    planName: "Basic Shopify",
    createdAt: "2025-05-20T07:15:00Z",
    metrics: {
      gmv: 8500.00,
      gmvDeclineRate: 2.1,
      transactionCount: 420,
      averageOrderValue: 20.24,
      failedTransactionRate: 0.1
    },
    riskAndDisputes: {
      chargebackRate: 0.00,
      refundRate: 0.50,
      disputedAmount: 0.00
    },
    ecosystem: {
      activeAppCount: 3,
      webhookDeliverySuccessRate: 99.9,
      apiErrorCount: 0
    },
    engagement: {
      lastLoginDate: "2026-07-15T12:00:00Z",
      supportTickets30d: 1,
      avgResolutionTimeHrs: 12.0,
      csatScore: 4
    }
  },
  {
    id: "merch-3",
    businessName: "Zen Yoga Studio",
    primaryEmail: "billing@zenyoga.ca",
    country: "CA",
    planName: "Razorpay Pro",
    createdAt: "2023-11-01T09:45:00Z",
    metrics: {
      gmv: 18200.00,
      gmvDeclineRate: 0.0,
      transactionCount: 240,
      averageOrderValue: 75.83,
      failedTransactionRate: 0.3
    },
    riskAndDisputes: {
      chargebackRate: 0.02,
      refundRate: 0.20,
      disputedAmount: 0.00
    },
    ecosystem: {
      activeAppCount: 5,
      webhookDeliverySuccessRate: 99.8,
      apiErrorCount: 1
    },
    engagement: {
      lastLoginDate: "2026-07-14T15:20:00Z",
      supportTickets30d: 1,
      avgResolutionTimeHrs: 6.5,
      csatScore: 5
    }
  },
  {
    id: "merch-4",
    businessName: "Glow Skincare",
    primaryEmail: "info@glowskin.com",
    country: "US",
    planName: "Shopify Pro",
    createdAt: "2025-09-10T14:30:00Z",
    metrics: {
      gmv: 35000.00,
      gmvDeclineRate: 4.5,
      transactionCount: 700,
      averageOrderValue: 50.00,
      failedTransactionRate: 0.4
    },
    riskAndDisputes: {
      chargebackRate: 0.08,
      refundRate: 2.20,
      disputedAmount: 100.00
    },
    ecosystem: {
      activeAppCount: 6,
      webhookDeliverySuccessRate: 100.0,
      apiErrorCount: 3
    },
    engagement: {
      lastLoginDate: "2026-07-16T19:00:00Z",
      supportTickets30d: 2,
      avgResolutionTimeHrs: 8.0,
      csatScore: 4
    }
  },
  {
    id: "merch-5",
    businessName: "TechGadget Hub",
    primaryEmail: "partners@techgadget.co.uk",
    country: "UK",
    planName: "Shopify Plus",
    createdAt: "2024-07-04T11:20:00Z",
    metrics: {
      gmv: 95000.00,
      gmvDeclineRate: 0.0,
      transactionCount: 450,
      averageOrderValue: 211.11,
      failedTransactionRate: 0.2
    },
    riskAndDisputes: {
      chargebackRate: 0.04,
      refundRate: 1.10,
      disputedAmount: 211.11
    },
    ecosystem: {
      activeAppCount: 15,
      webhookDeliverySuccessRate: 99.9,
      apiErrorCount: 5
    },
    engagement: {
      lastLoginDate: "2026-07-15T09:40:00Z",
      supportTickets30d: 0,
      avgResolutionTimeHrs: 0,
      csatScore: 5
    }
  },

  // ================= MEDIUM RISK MERCHANTS (30 - 59) =================
  {
    id: "merch-6",
    businessName: "Urban Threads",
    primaryEmail: "support@urbanthreads.in",
    country: "IN",
    planName: "Razorpay Pro",
    createdAt: "2025-02-18T16:10:00Z",
    metrics: {
      gmv: 22000.00,
      gmvDeclineRate: 18.5,
      transactionCount: 550,
      averageOrderValue: 40.00,
      failedTransactionRate: 1.1
    },
    riskAndDisputes: {
      chargebackRate: 0.45,
      refundRate: 3.80,
      disputedAmount: 180.00
    },
    ecosystem: {
      activeAppCount: 4,
      webhookDeliverySuccessRate: 98.5,
      apiErrorCount: 24
    },
    engagement: {
      lastLoginDate: "2026-07-12T10:15:00Z",
      supportTickets30d: 3,
      avgResolutionTimeHrs: 36.0,
      csatScore: 3
    }
  },
  {
    id: "merch-7",
    businessName: "Sole Therapy",
    primaryEmail: "contact@soletherapy.com",
    country: "US",
    planName: "Basic Shopify",
    createdAt: "2024-10-05T08:00:00Z",
    metrics: {
      gmv: 14000.00,
      gmvDeclineRate: 8.2,
      transactionCount: 180,
      averageOrderValue: 77.78,
      failedTransactionRate: 2.5
    },
    riskAndDisputes: {
      chargebackRate: 0.15,
      refundRate: 5.50,
      disputedAmount: 77.78
    },
    ecosystem: {
      activeAppCount: 2,
      webhookDeliverySuccessRate: 96.5,
      apiErrorCount: 18
    },
    engagement: {
      lastLoginDate: "2026-07-10T14:45:00Z",
      supportTickets30d: 2,
      avgResolutionTimeHrs: 48.0,
      csatScore: 4
    }
  },
  {
    id: "merch-8",
    businessName: "Cyber Bytes",
    primaryEmail: "billing@cyberbytes.io",
    country: "IE",
    planName: "Razorpay Enterprise",
    createdAt: "2023-05-30T13:00:00Z",
    metrics: {
      gmv: 60000.00,
      gmvDeclineRate: 22.0,
      transactionCount: 800,
      averageOrderValue: 75.00,
      failedTransactionRate: 0.8
    },
    riskAndDisputes: {
      chargebackRate: 0.22,
      refundRate: 1.80,
      disputedAmount: 225.00
    },
    ecosystem: {
      activeAppCount: 7,
      webhookDeliverySuccessRate: 99.2,
      apiErrorCount: 8
    },
    engagement: {
      lastLoginDate: "2026-07-14T11:10:00Z",
      supportTickets30d: 1,
      avgResolutionTimeHrs: 24.0,
      csatScore: 3
    }
  },
  {
    id: "merch-9",
    businessName: "Green Grocer Ltd",
    primaryEmail: "ops@greengrocer.co.uk",
    country: "UK",
    planName: "Basic Shopify",
    createdAt: "2025-11-12T09:00:00Z",
    metrics: {
      gmv: 12000.00,
      gmvDeclineRate: 3.5,
      transactionCount: 610,
      averageOrderValue: 19.67,
      failedTransactionRate: 3.2
    },
    riskAndDisputes: {
      chargebackRate: 0.52,
      refundRate: 2.00,
      disputedAmount: 120.00
    },
    ecosystem: {
      activeAppCount: 3,
      webhookDeliverySuccessRate: 95.8,
      apiErrorCount: 35
    },
    engagement: {
      lastLoginDate: "2026-07-13T16:00:00Z",
      supportTickets30d: 4,
      avgResolutionTimeHrs: 72.0,
      csatScore: 4
    }
  },
  {
    id: "merch-10",
    businessName: "Pixel Prints",
    primaryEmail: "info@pixelprints.us",
    country: "US",
    planName: "Basic Shopify",
    createdAt: "2025-06-25T14:15:00Z",
    metrics: {
      gmv: 9800.00,
      gmvDeclineRate: 32.5,
      transactionCount: 300,
      averageOrderValue: 32.66,
      failedTransactionRate: 0.4
    },
    riskAndDisputes: {
      chargebackRate: 0.05,
      refundRate: 1.50,
      disputedAmount: 32.66
    },
    ecosystem: {
      activeAppCount: 5,
      webhookDeliverySuccessRate: 99.5,
      apiErrorCount: 4
    },
    engagement: {
      lastLoginDate: "2026-07-08T10:30:00Z",
      supportTickets30d: 0,
      avgResolutionTimeHrs: 0,
      csatScore: 5
    }
  },

  // ================= HIGH RISK MERCHANTS (60 - 100) =================
  {
    id: "merch-11",
    businessName: "Gadget Nest",
    primaryEmail: "fraud-alert@gadgetnest.com",
    country: "US",
    planName: "Shopify Plus",
    createdAt: "2024-01-10T12:00:00Z",
    metrics: {
      gmv: 120000.00,
      gmvDeclineRate: 45.0,
      transactionCount: 1200,
      averageOrderValue: 100.00,
      failedTransactionRate: 6.2
    },
    riskAndDisputes: {
      chargebackRate: 1.25,
      refundRate: 9.50,
      disputedAmount: 1850.00
    },
    ecosystem: {
      activeAppCount: 11,
      webhookDeliverySuccessRate: 92.5,
      apiErrorCount: 145
    },
    engagement: {
      lastLoginDate: "2026-07-01T09:00:00Z",
      supportTickets30d: 8,
      avgResolutionTimeHrs: 96.0,
      csatScore: 1
    }
  },
  {
    id: "merch-12",
    businessName: "Luxe Leather IT",
    primaryEmail: "info@luxeleather.it",
    country: "IT",
    planName: "Basic Shopify",
    createdAt: "2025-04-14T11:00:00Z",
    metrics: {
      gmv: 28000.00,
      gmvDeclineRate: 38.0,
      transactionCount: 140,
      averageOrderValue: 200.00,
      failedTransactionRate: 1.8
    },
    riskAndDisputes: {
      chargebackRate: 1.15,
      refundRate: 12.00,
      disputedAmount: 650.00
    },
    ecosystem: {
      activeAppCount: 2,
      webhookDeliverySuccessRate: 98.0,
      apiErrorCount: 12
    },
    engagement: {
      lastLoginDate: "2026-07-06T14:00:00Z",
      supportTickets30d: 5,
      avgResolutionTimeHrs: 52.0,
      csatScore: 2
    }
  },
  {
    id: "merch-13",
    businessName: "Boutique Bites",
    primaryEmail: "orders@boutiquebites.co.uk",
    country: "UK",
    planName: "Razorpay Pro",
    createdAt: "2025-08-01T08:30:00Z",
    metrics: {
      gmv: 19500.00,
      gmvDeclineRate: 42.5,
      transactionCount: 480,
      averageOrderValue: 40.62,
      failedTransactionRate: 0.5
    },
    riskAndDisputes: {
      chargebackRate: 0.05,
      refundRate: 2.20,
      disputedAmount: 40.00
    },
    ecosystem: {
      activeAppCount: 4,
      webhookDeliverySuccessRate: 99.1,
      apiErrorCount: 5
    },
    engagement: {
      lastLoginDate: "2026-07-02T13:40:00Z",
      supportTickets30d: 1,
      avgResolutionTimeHrs: 24.0,
      csatScore: 4
    }
  },
  {
    id: "merch-14",
    businessName: "Cloud Services Group",
    primaryEmail: "sysadmin@cloudgroup.com",
    country: "US",
    planName: "Razorpay Enterprise",
    createdAt: "2024-05-18T10:15:00Z",
    metrics: {
      gmv: 75000.00,
      gmvDeclineRate: 10.0,
      transactionCount: 620,
      averageOrderValue: 120.96,
      failedTransactionRate: 5.5
    },
    riskAndDisputes: {
      chargebackRate: 0.25,
      refundRate: 1.50,
      disputedAmount: 250.00
    },
    ecosystem: {
      activeAppCount: 9,
      webhookDeliverySuccessRate: 91.2,
      apiErrorCount: 210
    },
    engagement: {
      lastLoginDate: "2026-07-12T15:00:00Z",
      supportTickets30d: 6,
      avgResolutionTimeHrs: 18.0,
      csatScore: 2
    }
  },
  {
    id: "merch-15",
    businessName: "Retro Apparel",
    primaryEmail: "vintage@retroapparel.com",
    country: "US",
    planName: "Basic Shopify",
    createdAt: "2025-10-30T10:00:00Z",
    metrics: {
      gmv: 5200.00,
      gmvDeclineRate: 55.0,
      transactionCount: 100,
      averageOrderValue: 52.00,
      failedTransactionRate: 2.2
    },
    riskAndDisputes: {
      chargebackRate: 1.40,
      refundRate: 14.50,
      disputedAmount: 420.00
    },
    ecosystem: {
      activeAppCount: 3,
      webhookDeliverySuccessRate: 97.2,
      apiErrorCount: 15
    },
    engagement: {
      lastLoginDate: "2026-07-09T16:45:00Z",
      supportTickets30d: 2,
      avgResolutionTimeHrs: 30.0,
      csatScore: 3
    }
  },
  {
    id: "merch-16",
    name: "Northstar Labs",
    email: "ops@northstarlabs.com",
    category: "SaaS",
    country: "DE",
    planName: "Shopify Plus",
    createdAt: "2024-11-01T09:00:00Z",
    metrics: {
      gmv: 88000.00,
      gmvDeclineRate: 6.0,
      transactionCount: 910,
      averageOrderValue: 96.70,
      failedTransactionRate: 0.9
    },
    riskAndDisputes: {
      chargebackRate: 0.11,
      refundRate: 1.20,
      disputedAmount: 150.00
    },
    ecosystem: {
      activeAppCount: 8,
      webhookDeliverySuccessRate: 99.4,
      apiErrorCount: 6
    },
    engagement: {
      lastLoginDate: "2026-07-14T08:10:00Z",
      supportTickets30d: 2,
      avgResolutionTimeHrs: 10.0,
      csatScore: 4
    }
  },
  {
    id: "merch-17",
    businessName: "Harbor Market",
    primaryEmail: "care@harbormarket.com",
    category: "Food & Beverage",
    country: "AU",
    planName: "Razorpay Pro",
    createdAt: "2023-07-20T12:45:00Z",
    metrics: {
      gmv: 21000.00,
      gmvDeclineRate: 24.0,
      transactionCount: 300,
      averageOrderValue: 70.00,
      failedTransactionRate: 3.8
    },
    riskAndDisputes: {
      chargebackRate: 0.75,
      refundRate: 4.20,
      disputedAmount: 280.00
    },
    ecosystem: {
      activeAppCount: 6,
      webhookDeliverySuccessRate: 96.8,
      apiErrorCount: 30
    },
    engagement: {
      lastLoginDate: "2026-07-11T17:30:00Z",
      supportTickets30d: 4,
      avgResolutionTimeHrs: 40.0,
      csatScore: 3
    }
  },
  {
    id: "merch-18",
    businessName: "Evergreen Goods",
    primaryEmail: "hello@evergreengoods.com",
    category: "Home & Living",
    country: "FR",
    planName: "Shopify Pro",
    createdAt: "2022-09-09T07:20:00Z",
    metrics: {
      gmv: 46000.00,
      gmvDeclineRate: 48.0,
      transactionCount: 600,
      averageOrderValue: 76.67,
      failedTransactionRate: 5.8
    },
    riskAndDisputes: {
      chargebackRate: 1.02,
      refundRate: 7.40,
      disputedAmount: 620.00
    },
    ecosystem: {
      activeAppCount: 10,
      webhookDeliverySuccessRate: 93.0,
      apiErrorCount: 88
    },
    engagement: {
      lastLoginDate: "2026-07-04T10:05:00Z",
      supportTickets30d: 7,
      avgResolutionTimeHrs: 90.0,
      csatScore: 2
    }
  }
];
