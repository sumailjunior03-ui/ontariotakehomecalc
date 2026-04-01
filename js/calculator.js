/**
 * Ontario Take Home Calc — Calculator Logic
 * All calculations reference TAX_CONFIG from config.js exclusively.
 * No hardcoded values here.
 */

/**
 * Calculate progressive tax using a bracket array from TAX_CONFIG
 */
function calcProgressiveTax(income, brackets) {
  let tax = 0;
  for (const bracket of brackets) {
    if (income <= bracket.min) break;
    const taxable = Math.min(income, bracket.max) - bracket.min;
    tax += taxable * bracket.rate;
  }
  return tax;
}

/**
 * Calculate federal basic personal amount credit
 * Phases out for high earners per CRA rules
 */
function calcFederalBPA(income) {
  const cfg = TAX_CONFIG.federal;
  if (income <= cfg.bpaPhaseoutStart) return cfg.bpa;
  if (income >= cfg.bpaPhaseoutEnd) return cfg.bpaBase;
  const ratio = (income - cfg.bpaPhaseoutStart) / (cfg.bpaPhaseoutEnd - cfg.bpaPhaseoutStart);
  return cfg.bpa - (cfg.bpaAdditional * ratio);
}

/**
 * Calculate federal income tax
 */
function calcFederalTax(grossIncome) {
  const cfg = TAX_CONFIG.federal;
  const bpa = calcFederalBPA(grossIncome);
  const bpaCredit = bpa * cfg.creditRate;
  const grossTax = calcProgressiveTax(grossIncome, cfg.brackets);
  return Math.max(0, grossTax - bpaCredit);
}

/**
 * Calculate Ontario surtax
 * Applied to basic Ontario tax (before credits)
 */
function calcOntarioSurtax(basicOntarioTax) {
  const st = TAX_CONFIG.ontario.surtax;
  let surtax = 0;
  if (basicOntarioTax > st.threshold1) {
    surtax += (basicOntarioTax - st.threshold1) * st.rate1;
  }
  if (basicOntarioTax > st.threshold2) {
    surtax += (basicOntarioTax - st.threshold2) * st.rate2;
  }
  return surtax;
}

/**
 * Calculate Ontario provincial income tax (including surtax)
 */
function calcOntarioTax(grossIncome) {
  const cfg = TAX_CONFIG.ontario;
  const bpaCredit = cfg.bpa * cfg.creditRate;
  const basicOntarioTax = calcProgressiveTax(grossIncome, cfg.brackets);
  const surtax = calcOntarioSurtax(basicOntarioTax);
  const totalBeforeCredits = basicOntarioTax + surtax;
  return Math.max(0, totalBeforeCredits - bpaCredit);
}

/**
 * Calculate Ontario Health Premium based on taxable income
 */
function calcOHP(grossIncome) {
  const tiers = TAX_CONFIG.ohp;
  for (const tier of tiers) {
    if (grossIncome > tier.min && grossIncome <= tier.max) {
      return tier.calc(grossIncome);
    }
  }
  // Above all tiers (shouldn't happen due to Infinity in last tier)
  return 900;
}

/**
 * Calculate CPP1 employee contribution
 */
function calcCPP1(grossIncome) {
  const cfg = TAX_CONFIG.cpp;
  if (grossIncome <= cfg.basicExemption) return 0;
  const pensionableEarnings = Math.min(grossIncome, cfg.ympe) - cfg.basicExemption;
  return Math.min(pensionableEarnings * cfg.rate1, cfg.maxContribution1);
}

/**
 * Calculate CPP2 employee contribution (enhanced CPP)
 */
function calcCPP2(grossIncome) {
  const cfg = TAX_CONFIG.cpp;
  if (grossIncome <= cfg.ympe) return 0;
  const cpp2Earnings = Math.min(grossIncome, cfg.yampe) - cfg.ympe;
  return Math.min(cpp2Earnings * cfg.rate2, cfg.maxContribution2);
}

/**
 * Calculate EI employee premium
 */
function calcEI(grossIncome) {
  const cfg = TAX_CONFIG.ei;
  const insurableEarnings = Math.min(grossIncome, cfg.mie);
  return Math.min(insurableEarnings * cfg.rate, cfg.maxPremium);
}

/**
 * Main calculator function
 * Returns a complete breakdown object
 */
function calculateTakeHome(grossIncome, frequency) {
  grossIncome = Math.max(0, Number(grossIncome) || 0);

  const federalTax  = calcFederalTax(grossIncome);
  const ontarioTax  = calcOntarioTax(grossIncome);
  const ohp         = calcOHP(grossIncome);
  const cpp1        = calcCPP1(grossIncome);
  const cpp2        = calcCPP2(grossIncome);
  const ei          = calcEI(grossIncome);

  const totalCPP         = cpp1 + cpp2;
  const totalDeductions  = federalTax + ontarioTax + ohp + totalCPP + ei;
  const annualTakeHome   = Math.max(0, grossIncome - totalDeductions);

  const freqConfig      = TAX_CONFIG.payFrequencies[frequency] || TAX_CONFIG.payFrequencies.biweekly;
  const periods         = freqConfig.periodsPerYear;
  const perPeriodGross  = grossIncome / periods;
  const perPeriodNet    = annualTakeHome / periods;
  const monthlyNet      = annualTakeHome / 12;

  const effectiveRate   = grossIncome > 0 ? (totalDeductions / grossIncome) * 100 : 0;

  return {
    taxYear:        TAX_CONFIG.taxYear,
    frequency:      freqConfig.label,
    periods:        periods,

    // Annual figures
    grossAnnual:    grossIncome,
    federalTax:     federalTax,
    ontarioTax:     ontarioTax,
    ohp:            ohp,
    cpp1:           cpp1,
    cpp2:           cpp2,
    totalCPP:       totalCPP,
    ei:             ei,
    totalDeductions: totalDeductions,
    annualTakeHome: annualTakeHome,

    // Per-period figures
    perPeriodGross: perPeriodGross,
    perPeriodNet:   perPeriodNet,
    monthlyNet:     monthlyNet,

    // Summary
    effectiveRate:  effectiveRate
  };
}

/**
 * Format currency for display
 */
function fmt(amount) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Format percentage
 */
function fmtPct(pct) {
  return pct.toFixed(1) + "%";
}
