/**
 * South African reviewer corpus.
 *
 * Names are drawn across the country's main language groups rather than
 * defaulting to English and Afrikaans, because a review wall that is all
 * Van der Merwes and Smiths does not look like South Africa and readers
 * notice. Cities, industries and company sizes are weighted toward where the
 * businesses actually are.
 */

export const FIRST_NAMES = [
  // Nguni
  "Thabo", "Nomsa", "Sipho", "Zanele", "Bongani", "Nokuthula", "Andile",
  "Lindiwe", "Sibusiso", "Thandiwe", "Mandla", "Nonhlanhla", "Musa", "Ayanda",
  "Sizwe", "Busisiwe", "Lwazi", "Zodwa", "Mpho", "Refilwe", "Kagiso", "Naledi",
  "Tshepo", "Palesa", "Karabo", "Boitumelo", "Katlego", "Dineo",
  // Afrikaans
  "Riaan", "Annelize", "Pieter", "Marlene", "Johan", "Elmarie", "Hennie",
  "Suzette", "Dirk", "Ilse", "Francois", "Chantelle", "Wynand", "Marika",
  // English
  "James", "Sarah", "Michael", "Claire", "David", "Emma", "Craig", "Nicole",
  "Grant", "Tanya", "Ryan", "Lauren", "Shaun", "Megan",
  // Indian South African
  "Priya", "Rajesh", "Anisha", "Deshan", "Kavitha", "Yusuf", "Fatima",
  "Imraan", "Zaheera", "Nadia", "Riaz", "Shabnam",
  // Portuguese and Greek communities
  "Manuel", "Ana", "Costa", "Eleni",
];

export const LAST_NAMES = [
  "Dlamini", "Nkosi", "Mokoena", "Ndlovu", "Khumalo", "Mahlangu", "Zulu",
  "Sithole", "Mthembu", "Mabaso", "Molefe", "Sibanda", "Maseko", "Radebe",
  "Tshabalala", "Mnguni", "Ngcobo", "Motaung", "Baloyi", "Mashaba",
  "Van der Merwe", "Botha", "Nel", "Pretorius", "Fourie", "Coetzee",
  "Van Zyl", "Steyn", "Du Plessis", "Erasmus", "Venter", "Joubert",
  "Smith", "Naidoo", "Pillay", "Govender", "Reddy", "Moodley", "Singh",
  "Patel", "Cassim", "Ebrahim", "Adams", "Jacobs", "Williams", "September",
  "October", "Arendse", "Hendricks", "Petersen", "Da Silva", "Ferreira",
];

export const CITIES = [
  "Johannesburg", "Cape Town", "Durban", "Pretoria", "Port Elizabeth",
  "Bloemfontein", "East London", "Nelspruit", "Polokwane", "Kimberley",
  "Stellenbosch", "Centurion", "Sandton", "Midrand", "Pietermaritzburg",
  "George", "Rustenburg", "Vanderbijlpark", "Somerset West", "Randburg",
];

export const INDUSTRIES = [
  "Accounting", "Retail", "Construction", "Manufacturing", "Logistics",
  "Professional services", "Hospitality", "Agriculture", "Mining services",
  "Healthcare", "Education", "Non profit", "Information technology",
  "Marketing and advertising", "Legal services", "Property management",
  "Security services", "Motor trade", "Wholesale", "Engineering",
];

export const JOB_TITLES = [
  "Financial Manager", "Bookkeeper", "Managing Director", "Operations Manager",
  "Accountant", "Payroll Administrator", "HR Manager", "Business Owner",
  "Financial Director", "Office Manager", "Sales Manager", "Systems Accountant",
  "Group Financial Manager", "Practice Manager", "Chief Financial Officer",
  "Company Secretary", "Credit Controller", "Management Accountant",
  "Head of People", "IT Manager", "Project Manager", "Branch Manager",
];

export const COMPANY_SIZES = [
  "1 to 10 employees",
  "11 to 50 employees",
  "51 to 200 employees",
  "201 to 500 employees",
  "501 or more employees",
];

/** Weighted toward smaller businesses, which is where the market actually is. */
export const COMPANY_SIZE_WEIGHTS = [40, 30, 17, 8, 5];

export const DURATIONS = [
  "Less than 6 months",
  "6 to 12 months",
  "1 to 2 years",
  "2 to 5 years",
  "More than 5 years",
];

export const COMPANY_PREFIXES = [
  "Highveld", "Table Bay", "Karoo", "Umhlanga", "Sandton", "Vaal", "Drakensberg",
  "Cape", "Zambezi", "Kalahari", "Midrand", "Southern Cross", "Protea",
  "Baobab", "Marula", "Aloe", "Stellar", "Summit", "Anchor", "Meridian",
];

export const COMPANY_SUFFIXES = [
  "Holdings", "Trading", "Group", "Solutions", "Consulting", "Logistics",
  "Distributors", "Projects", "Services", "Manufacturing", "Retail",
  "Partners", "Associates", "Enterprises", "Supplies",
];

/* -------------------------------------------------------------------------- */
/* Sentence banks                                                             */
/*                                                                            */
/* Written to the editorial standard: plain sentences, varied length, real     */
/* specifics, and no em dashes anywhere. Praise is balanced by genuine         */
/* criticism, because a wall of five star reviews reads as fake.               */
/* -------------------------------------------------------------------------- */

export const PROS_POSITIVE = [
  "The VAT201 report matches what SARS expects, so eFiling submissions go through without rebuilding the figures.",
  "Bank feeds from FNB and Standard Bank pull in cleanly and the reconciliation suggestions are usually right.",
  "Support answers in South African hours, which sounds small until you have waited overnight for an answer from overseas.",
  "Setting up a new user takes minutes and the permissions are granular enough to keep sales out of the ledger.",
  "The mobile app is genuinely usable, not a cut down afterthought.",
  "Month end close went from four days to about a day and a half.",
  "Pricing is in rand, so there is no exchange rate surprise on renewal.",
  "The audit trail is thorough, which made our first external audit far less painful.",
  "Reporting is flexible enough that we stopped exporting everything to Excel.",
  "Onboarding documentation is clear and the training videos are short and to the point.",
  "It handles multi currency invoicing without the workarounds our old system needed.",
  "Integration with our payroll meant we stopped double capturing salary journals.",
];

export const PROS_MIXED = [
  "Once it is configured properly it is stable and we rarely think about it.",
  "It does the core job well, provided you do not need anything unusual.",
  "The basics are solid even if the interface is dated.",
  "It is reliable, which counts for more than a pretty dashboard.",
  "The price is fair for what you get at our size.",
];

export const CONS_CRITICAL = [
  "The interface feels like it was designed a decade ago and never revisited.",
  "Support response times slip badly at month end, which is exactly when you need them.",
  "Getting historical data in was a genuine project, not the afternoon the sales team suggested.",
  "Custom reports need someone who knows the system well, so we depend on one person.",
  "The per user pricing gets expensive quickly once the team grows past about fifteen.",
  "It is slow on a weak connection, which matters when load shedding pushes you onto mobile data.",
  "The stock module is weaker than the financial side and we still track some things separately.",
  "Documentation for the more advanced features is thin.",
  "There is no proper sandbox, so testing changes on live data makes everyone nervous.",
  "Occasional updates change where things are without warning.",
  "The local support partner network is uneven, so your experience depends on who you get.",
  "Exporting to e@syFile needed a workaround the first time and support took a while to explain it.",
];

export const CONS_MILD = [
  "Nothing serious, though I would like better dashboard customisation.",
  "The search could be faster when the ledger gets large.",
  "A few reports need an extra click more than they should.",
  "Minor gripe, but the notification settings are buried.",
];

export const SUMMARY_POSITIVE = [
  "We moved across from a desktop package two years ago and have not looked back. The reconciliation alone saves a day a month.",
  "It does what we need without drama. Our accountant was already familiar with it, which made the switch far easier than expected.",
  "For a business our size it is the right balance of capability and cost. I have recommended it to two other owners in our industry.",
  "The compliance side is the reason we chose it. VAT and payroll submissions have been clean since day one.",
  "Setup took about three weeks with our practitioner and it has been steady since. Support has been responsive when we needed them.",
];

export const SUMMARY_MIXED = [
  "It is capable software that asks something of you in return. Budget properly for setup and training and it works well.",
  "Good on the financials, weaker on stock. We use it alongside a separate system for the warehouse and that arrangement works.",
  "Solid choice if your requirements are standard. We hit some friction with our slightly unusual billing model.",
  "It has improved over the three years we have used it, though a few rough edges remain.",
];

export const SUMMARY_NEGATIVE = [
  "It works, but the experience has been frustrating. Support is slow and the migration was far harder than we were told it would be.",
  "We are actively looking at alternatives. The software is fine, the cost increases each year are not.",
  "Capable, but it needs a specialist. We underestimated how much internal knowledge it would require.",
];

export const TITLE_POSITIVE = [
  "Does the compliance work properly",
  "The switch was worth the effort",
  "Reliable and priced fairly for our size",
  "Saves us a day every month end",
  "Local support makes the difference",
  "Exactly what a growing business needs",
  "Solid, and our accountant already knew it",
];

export const TITLE_MIXED = [
  "Good software, plan the setup properly",
  "Strong on finance, weaker on stock",
  "Capable once you learn it",
  "Works well within its limits",
  "Fine for standard requirements",
];

export const TITLE_NEGATIVE = [
  "Capable but the price keeps climbing",
  "Harder to implement than promised",
  "Support is the weak point",
  "Looking at alternatives next renewal",
];

export const VENDOR_RESPONSES = [
  "Thank you for the detailed feedback. We have passed the reporting comments to our product team, and our local support lead will be in touch about the month end response times.",
  "We appreciate you taking the time to write this. Migration support is something we have invested in over the past year, and we would like to hear whether that has changed your experience.",
  "Thanks for the review. Your point about per user pricing is fair and we are reviewing our tiers for smaller teams.",
  "We are glad the compliance side is working for you. If the dashboard customisation is still a problem, our support team can show you the newer report builder.",
];
