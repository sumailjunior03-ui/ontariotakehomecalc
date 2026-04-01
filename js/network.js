/**
 * Ontario Take Home Calc — CA Network Tools Registry
 * Source of truth for all related .ca calculator tools.
 * Only tools with live: true will be displayed.
 * This site must NOT include itself (filtered at render time).
 *
 * Hub: https://calc-hq.ca
 */

const NETWORK_TOOLS = [
  {
    name: "CPP Calc",
    desc: "Estimate your Canada Pension Plan contributions based on your earnings.",
    url: "https://cppcalc.ca",
    live: true
  },
  {
    name: "EI Calc",
    desc: "Estimate your Employment Insurance premiums and maximum insurable earnings.",
    url: "https://eicalc.ca",
    live: true
  },
  {
    name: "Ontario Take Home Calc",
    desc: "Estimate your Ontario net pay after federal tax, provincial tax, CPP, EI, and OHP.",
    url: "https://ontariotakehomecalc.ca",
    live: true
  }
];
