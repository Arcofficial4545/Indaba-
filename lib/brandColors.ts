/**
 * Each product carries its own brand colour, used for its logo ring, rating
 * dial, chart bars and "Visit website" button.
 *
 * Resolution order:
 *   1. software.brand_color, set by an admin
 *   2. this slug to hex map
 *   3. the fallback
 */

export const BRAND_COLOR_FALLBACK = "#00a86b";

export const BRAND_COLORS: Record<string, string> = {
  // Accounting
  "sage-accounting": "#00d639",
  xero: "#13b5ea",
  "quickbooks-online": "#2ca01c",
  "zoho-books": "#e42527",
  "sage-50cloud-pastel": "#008849",
  freshbooks: "#0075dd",
  "wave-accounting": "#1a73e8",
  "omni-accounts": "#e87722",
  "quickeasy-bos": "#004b8d",
  // Payroll
  simplepay: "#1e88e5",
  payspace: "#e4002b",
  "sage-pastel-payroll": "#00754a",
  "sage-business-cloud-payroll": "#00d639",
  paysoft: "#0b6e4f",
  paymaster: "#c8102e",
  "labournet-payroll": "#005eb8",
  // HR
  "sage-hr": "#008849",
  bamboohr: "#73c41d",
  "zoho-people": "#e42527",
  peoplehr: "#5a2d82",
  "sap-successfactors": "#0faaff",
  "workday-hcm": "#0875e1",
  // CRM
  "zoho-crm": "#e42527",
  "salesforce-sales-cloud": "#00a1e0",
  "hubspot-crm": "#ff7a59",
  pipedrive: "#017737",
  freshsales: "#ff6600",
  bitrix24: "#2fc7f7",
  insightly: "#fdb913",
  // ERP
  odoo: "#714b67",
  "sap-business-one": "#0faaff",
  "sage-200-evolution": "#008849",
  syspro: "#0033a0",
  "dynamics-365-business-central": "#002050",
  // Project management
  "monday-com": "#ff3d57",
  asana: "#f06a6a",
  trello: "#0079bf",
  clickup: "#7b68ee",
  wrike: "#08cf65",
};

export function getBrandColor(
  slug: string | null | undefined,
  override?: string | null,
): string {
  if (override && isHexColor(override)) return override;
  if (slug && BRAND_COLORS[slug]) return BRAND_COLORS[slug];
  return BRAND_COLOR_FALLBACK;
}

export function isHexColor(value: string): boolean {
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value.trim());
}

/** Expand `#abc` to `#aabbcc` so parsing only has to handle one shape. */
function expandHex(hex: string): string {
  const clean = hex.trim().replace(/^#/, "");
  if (clean.length === 3) {
    return clean
      .split("")
      .map((c) => c + c)
      .join("");
  }
  return clean;
}

/** Convert a hex to `rgba()` so a brand colour can be used as a soft tint. */
export function withAlpha(hex: string, alpha: number): string {
  const clean = expandHex(hex);
  if (clean.length !== 6) return `rgba(0, 0, 0, ${alpha})`;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Relative luminance per WCAG. Used to decide whether a vendor's brand colour
 * can carry white text, which matters because the palette here already has one
 * colour that cannot.
 */
export function luminance(hex: string): number {
  const clean = expandHex(hex);
  if (clean.length !== 6) return 0;
  const channels = [0, 2, 4].map((i) => {
    const value = parseInt(clean.slice(i, i + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

/** Contrast ratio between two hex colours, 1 to 21. */
export function contrastRatio(a: string, b: string): number {
  const [lighter, darker] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Pick readable ink for a given fill. A bright vendor colour such as
 * BambooHR's green would fail with white text, so this checks rather than
 * assuming.
 */
export function inkOn(hex: string): "#ffffff" | "#111827" {
  return contrastRatio(hex, "#ffffff") >= 4.5 ? "#ffffff" : "#111827";
}

/** The inline custom properties that recolour a GlossyButton per product. */
export function glossyButtonVars(hex: string): React.CSSProperties {
  return {
    "--btn-bg": hex,
    "--btn-ink": inkOn(hex),
    "--btn-glow": withAlpha(hex, 0.5),
  } as React.CSSProperties;
}
