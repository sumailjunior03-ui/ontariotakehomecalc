/**
 * Ontario Take Home Calc — Central Tax Configuration
 * Tax Year: 2026
 * Source: Canada Revenue Agency (CRA), Employment and Social Development Canada
 * Last Updated: 2026
 *
 * THIS IS THE SINGLE SOURCE OF TRUTH FOR ALL RATES, BRACKETS, AND THRESHOLDS.
 * All calculator logic, example calculations, and displayed values reference this file.
 * To update for a new tax year, only this file needs to be changed.
 */

const TAX_CONFIG = {

  taxYear: 2026,

  // ─── FEDERAL INCOME TAX ─────────────────────────────────────────────────────
  federal: {
    brackets: [
      { min: 0,       max: 58523,  rate: 0.14   },
      { min: 58523,   max: 117045, rate: 0.205  },
      { min: 117045,  max: 181440, rate: 0.26   },
      { min: 181440,  max: 258482, rate: 0.29   },
      { min: 258482,  max: Infinity, rate: 0.33 }
    ],
    // Basic Personal Amount — full amount for income under $181,440
    bpa: 16452,
    bpaBase: 14829,
    bpaAdditional: 1623,
    bpaPhaseoutStart: 181440,
    bpaPhaseoutEnd: 258482,
    // Non-refundable credit rate = lowest bracket rate
    creditRate: 0.14
  },

  // ─── ONTARIO PROVINCIAL INCOME TAX ──────────────────────────────────────────
  ontario: {
    brackets: [
      { min: 0,       max: 53891,  rate: 0.0505 },
      { min: 53891,   max: 107785, rate: 0.0915 },
      { min: 107785,  max: 150000, rate: 0.1116 },
      { min: 150000,  max: 220000, rate: 0.1216 },
      { min: 220000,  max: Infinity, rate: 0.1316 }
    ],
    // Ontario Basic Personal Amount
    bpa: 12399,
    creditRate: 0.0505,
    // Surtax thresholds (applied to basic Ontario tax)
    surtax: {
      threshold1: 5818,  rate1: 0.20,
      threshold2: 7444,  rate2: 0.36
    }
  },

  // ─── ONTARIO HEALTH PREMIUM ──────────────────────────────────────────────────
  // Applied based on taxable income at tax filing
  ohp: [
    { min: 0,       max: 20000,  calc: () => 0 },
    { min: 20000,   max: 25000,  calc: (inc) => Math.min(300, (inc - 20000) * 0.06) },
    { min: 25000,   max: 36000,  calc: () => 300 },
    { min: 36000,   max: 38500,  calc: (inc) => Math.min(450, 300 + (inc - 36000) * 0.06) },
    { min: 38500,   max: 48000,  calc: () => 450 },
    { min: 48000,   max: 48600,  calc: (inc) => Math.min(600, 450 + (inc - 48000) * 0.25) },
    { min: 48600,   max: 72000,  calc: () => 600 },
    { min: 72000,   max: 72600,  calc: (inc) => Math.min(750, 600 + (inc - 72000) * 0.25) },
    { min: 72600,   max: 200000, calc: () => 750 },
    { min: 200000,  max: 200600, calc: (inc) => Math.min(900, 750 + (inc - 200000) * 0.25) },
    { min: 200600,  max: Infinity, calc: () => 900 }
  ],

  // ─── CANADA PENSION PLAN (CPP) ───────────────────────────────────────────────
  cpp: {
    basicExemption: 3500,
    ympe: 74600,           // Year's Maximum Pensionable Earnings (first ceiling)
    yampe: 85000,          // Year's Additional Maximum Pensionable Earnings (second ceiling)
    rate1: 0.0595,         // CPP1 employee rate
    rate2: 0.04,           // CPP2 employee rate (earnings between YMPE and YAMPE)
    maxContribution1: 4230.45,
    maxContribution2: 416.00,
    maxContributionTotal: 4646.45
  },

  // ─── EMPLOYMENT INSURANCE (EI) ───────────────────────────────────────────────
  ei: {
    mie: 68900,            // Maximum Insurable Earnings
    rate: 0.0163,          // Employee premium rate ($1.63 per $100)
    maxPremium: 1123.07    // Maximum annual employee EI premium
  },

  // ─── PAY FREQUENCIES ─────────────────────────────────────────────────────────
  payFrequencies: {
    weekly:      { label: "Weekly",      periodsPerYear: 52   },
    biweekly:    { label: "Bi-Weekly",   periodsPerYear: 26   },
    semimonthly: { label: "Semi-Monthly",periodsPerYear: 24   },
    monthly:     { label: "Monthly",     periodsPerYear: 12   },
    annually:    { label: "Annually",    periodsPerYear: 1    }
  }

};
