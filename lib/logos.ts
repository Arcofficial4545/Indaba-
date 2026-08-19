/**
 * Vendor logo registry.
 *
 * Several products share one brand mark: six Sage products, two Zoho
 * products. Logos are therefore keyed by brand rather than by product, and
 * each product slug maps onto a brand.
 *
 * Using a vendor's mark to identify their product in an editorial review and
 * comparison directory is nominative use, which is the same basis every
 * software directory operates on. Marks are shown unaltered apart from
 * scaling, are never used as our own branding, and every file records where
 * it came from in `public/logos/manifest.json`.
 */

export type LogoSourceKind = "simple-icons" | "direct" | "domain";

export type BrandLogoSource = {
  /** Display name of the brand that owns the mark. */
  brand: string;
  kind: LogoSourceKind;
  /**
   * For simple-icons this is the icon slug. For direct it is the full URL of
   * the vendor's own asset. For domain it is the vendor's bare hostname, and
   * the mark is resolved from that one host by the icon service.
   */
  source: string;
  /** Official brand colour, used to paint monochrome marks. */
  hex: string;
  /**
   * `mark` is a square glyph, `wordmark` is a wide lockup. The component pads
   * wordmarks differently so they do not shrink to nothing in a square tile.
   */
  shape: "mark" | "wordmark";
  /** Where the asset came from, recorded for the audit trail. */
  note: string;
};

export const BRAND_LOGOS: Record<string, BrandLogoSource> = {
  sage: {
    brand: "Sage",
    kind: "simple-icons",
    source: "sage",
    hex: "#00d639",
    shape: "mark",
    note: "Simple Icons, official brand glyph",
  },
  xero: {
    brand: "Xero",
    kind: "simple-icons",
    source: "xero",
    hex: "#13b5ea",
    shape: "mark",
    note: "Simple Icons, official brand glyph",
  },
  quickbooks: {
    brand: "QuickBooks",
    kind: "simple-icons",
    source: "quickbooks",
    hex: "#2ca01c",
    shape: "mark",
    note: "Simple Icons, official brand glyph",
  },
  zoho: {
    brand: "Zoho",
    kind: "simple-icons",
    source: "zoho",
    hex: "#e42527",
    shape: "mark",
    note: "Simple Icons, official brand glyph",
  },
  /*
    Salesforce was removed from Simple Icons, so it comes from their own CDN.
    The `no-type` variant is the cloud mark without the wordmark, which is the
    square glyph the tiles want.
  */
  salesforce: {
    brand: "Salesforce",
    kind: "direct",
    source:
      "https://a.sfdcstatic.com/shared/images/c360-nav/salesforce-no-type-logo.svg",
    hex: "#00a1e0",
    shape: "mark",
    note: "Salesforce own CDN, vector cloud mark",
  },
  hubspot: {
    brand: "HubSpot",
    kind: "simple-icons",
    source: "hubspot",
    hex: "#ff7a59",
    shape: "mark",
    note: "Simple Icons, official brand glyph",
  },
  odoo: {
    brand: "Odoo",
    kind: "simple-icons",
    source: "odoo",
    hex: "#714b67",
    shape: "mark",
    note: "Simple Icons, official brand glyph",
  },
  sap: {
    brand: "SAP",
    kind: "simple-icons",
    source: "sap",
    hex: "#0faaff",
    shape: "mark",
    note: "Simple Icons, official brand glyph",
  },
  asana: {
    brand: "Asana",
    kind: "simple-icons",
    source: "asana",
    hex: "#f06a6a",
    shape: "mark",
    note: "Simple Icons, official brand glyph",
  },
  trello: {
    brand: "Trello",
    kind: "simple-icons",
    source: "trello",
    hex: "#0079bf",
    shape: "mark",
    note: "Simple Icons, official brand glyph",
  },

  /* Brands Simple Icons does not carry, taken from the vendor's own site.
     Note that `bamboo` in Simple Icons is Atlassian Bamboo, a different
     product entirely, so it must never be used for BambooHR. */
  monday: {
    brand: "monday.com",
    kind: "direct",
    source:
      "https://cdn.prod.website-files.com/656da6fea306219773d04208/65af6bd6e742d497b5f23f69_645898132bbaac20f1963919_256x256.png",
    hex: "#ff3d57",
    shape: "mark",
    note: "monday.com own CDN, 256x256 PNG with alpha",
  },
  simplepay: {
    brand: "SimplePay",
    kind: "direct",
    source: "https://www.simplepay.co.za/assets/img/logos/favicon.png",
    hex: "#1e88e5",
    shape: "mark",
    note: "SimplePay own site, 80x80 PNG with alpha",
  },
  payspace: {
    brand: "PaySpace",
    kind: "direct",
    source: "https://www.payspace.com/images/dlp-logo.svg",
    hex: "#e4002b",
    shape: "wordmark",
    note: "PaySpace own site, vector wordmark",
  },
  bamboohr: {
    brand: "BambooHR",
    kind: "direct",
    source:
      "https://www.bamboohr.com/images/about/media-assets/bamboohr-logo-green.png",
    hex: "#73c41d",
    shape: "wordmark",
    note: "BambooHR published media assets, 1479x227 PNG with alpha",
  },
  clickup: {
    brand: "ClickUp",
    kind: "simple-icons",
    source: "clickup",
    hex: "#7b68ee",
    shape: "mark",
    note: "Simple Icons, official brand glyph",
  },
  wave: {
    brand: "Wave",
    kind: "direct",
    source:
      "https://cdn.prod.website-files.com/62446230dcb514b828a6e237/677ed61188695f2316217fc5_Wave-2_0-logo-fullcolour-rgb.svg",
    hex: "#1a73e8",
    shape: "wordmark",
    note: "Wave own CDN, full colour vector",
  },
  bitrix24: {
    brand: "Bitrix24",
    kind: "direct",
    source: "https://www.bitrix24.com/images/bitrix24-logo-en.svg",
    hex: "#2fc7f7",
    shape: "wordmark",
    note: "Bitrix24 own site, vector wordmark",
  },
  syspro: {
    brand: "SYSPRO",
    kind: "direct",
    source:
      "https://s48470.pcdn.co/wp-content/uploads/2025/10/SYSPRO_WORDMARK_COBALT.svg",
    hex: "#0033a0",
    shape: "wordmark",
    note: "SYSPRO own CDN, vector wordmark",
  },

  /*
     Brands Simple Icons dropped or never carried. Rather than hunting a
     bespoke asset URL per vendor, which rots the moment a marketing site is
     rebuilt, these resolve from the hostname already recorded against the
     product in the catalogue. One source, one shape of failure.
  */
  freshbooks: {
    brand: "FreshBooks",
    kind: "domain",
    source: "freshbooks.com",
    hex: "#0075dd",
    shape: "mark",
    note: "Resolved from the vendor's own domain, freshbooks.com",
  },
  omniaccounts: {
    brand: "Omni Accounts",
    kind: "domain",
    source: "omniaccounts.co.za",
    hex: "#e87722",
    shape: "mark",
    note: "Resolved from the vendor's own domain, omniaccounts.co.za",
  },
  quickeasy: {
    brand: "QuickEasy",
    kind: "domain",
    source: "quickeasy.co.za",
    hex: "#004b8d",
    shape: "mark",
    note: "Resolved from the vendor's own domain, quickeasy.co.za",
  },
  /*
     The domain lookup returns PaySoft's favicon, which is flattened onto an
     opaque white square and so reads as a box on a card. Their own vector
     wordmark is the same art with a real alpha channel.
  */
  paysoft: {
    brand: "PaySoft",
    kind: "direct",
    source:
      "https://paysoft.co.za/wp-content/uploads/2026/03/paysoft-logo-primary-WebRGB.svg",
    hex: "#002a77",
    shape: "wordmark",
    note: "PaySoft own site, vector wordmark",
  },
  labournet: {
    brand: "LabourNet",
    kind: "domain",
    source: "labournet.com",
    hex: "#005eb8",
    shape: "mark",
    note: "Resolved from the vendor's own domain, labournet.com",
  },
  peoplehr: {
    brand: "People HR",
    kind: "domain",
    source: "peoplehr.com",
    hex: "#5a2d82",
    shape: "mark",
    note: "Resolved from the vendor's own domain, peoplehr.com",
  },
  workday: {
    brand: "Workday",
    kind: "domain",
    source: "workday.com",
    hex: "#0875e1",
    shape: "mark",
    note: "Resolved from the vendor's own domain, workday.com",
  },
  pipedrive: {
    brand: "Pipedrive",
    kind: "domain",
    source: "pipedrive.com",
    hex: "#017737",
    shape: "mark",
    note: "Resolved from the vendor's own domain, pipedrive.com",
  },
  freshworks: {
    brand: "Freshworks",
    kind: "domain",
    source: "freshworks.com",
    hex: "#ff6600",
    shape: "mark",
    note: "Resolved from the vendor's own domain, freshworks.com",
  },
  insightly: {
    brand: "Insightly",
    kind: "domain",
    source: "insightly.com",
    hex: "#fdb913",
    shape: "mark",
    note: "Resolved from the vendor's own domain, insightly.com",
  },
  microsoftdynamics: {
    brand: "Microsoft Dynamics 365",
    kind: "domain",
    source: "microsoft.com",
    hex: "#002050",
    shape: "mark",
    note: "Resolved from the vendor's own domain, microsoft.com",
  },
  wrike: {
    brand: "Wrike",
    kind: "domain",
    source: "wrike.com",
    hex: "#08cf65",
    shape: "mark",
    note: "Resolved from the vendor's own domain, wrike.com",
  },
};

/**
 * Product slug to brand key.
 *
 * Every catalogue product currently maps to a mark. Anything added without an
 * entry here falls back to the brand coloured initials mark, which is the
 * normal state for a listing on the day it is created.
 */
export const BRAND_BY_SLUG: Record<string, string> = {
  // Sage, one mark across the whole local range
  "sage-accounting": "sage",
  "sage-50cloud-pastel": "sage",
  "sage-pastel-payroll": "sage",
  "sage-business-cloud-payroll": "sage",
  "sage-hr": "sage",
  "sage-200-evolution": "sage",

  // Zoho, one mark across the suite
  "zoho-books": "zoho",
  "zoho-crm": "zoho",
  "zoho-people": "zoho",

  // SAP, one mark across both products
  "sap-business-one": "sap",
  "sap-successfactors": "sap",

  xero: "xero",
  "quickbooks-online": "quickbooks",
  "wave-accounting": "wave",
  simplepay: "simplepay",
  payspace: "payspace",
  bamboohr: "bamboohr",
  "salesforce-sales-cloud": "salesforce",
  "hubspot-crm": "hubspot",
  bitrix24: "bitrix24",
  odoo: "odoo",
  syspro: "syspro",
  "monday-com": "monday",
  asana: "asana",
  trello: "trello",
  clickup: "clickup",
  freshbooks: "freshbooks",
  "omni-accounts": "omniaccounts",
  "quickeasy-bos": "quickeasy",
  paysoft: "paysoft",
  /*
     Deliberately unmapped. paymaster.co.za now redirects to hrmaster.co.za,
     so the only mark the domain resolves is an HR Master wordmark, and
     putting that above a heading reading Paymaster would misbrand the
     listing. The initials mark holds the space until the catalogue entry is
     updated to whatever the product is actually called now.
  */
  "labournet-payroll": "labournet",
  peoplehr: "peoplehr",
  "workday-hcm": "workday",
  pipedrive: "pipedrive",
  // Freshsales is a Freshworks product and carries the Freshworks mark.
  freshsales: "freshworks",
  insightly: "insightly",
  "dynamics-365-business-central": "microsoftdynamics",
  wrike: "wrike",
};

export function getBrandKey(slug: string): string | null {
  return BRAND_BY_SLUG[slug] ?? null;
}

export function getBrandLogo(slug: string): BrandLogoSource | null {
  const key = getBrandKey(slug);
  return key ? (BRAND_LOGOS[key] ?? null) : null;
}
