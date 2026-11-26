import definition from './site-texts.json';

/**
 * Texts of the website that are not part of a page (labels, notices, e-mail texts), maintained in DatoCMS under
 * «Texte & Beschriftungen». site-texts.json defines them once, for the CMS migration and as defaults here.
 */
export type SiteTextKey =
  | 'menuOverviewLabel'
  | 'menuShopOverviewLabel'
  | 'breadcrumbHomeLabel'
  | 'projectsBlockTitle'
  | 'projectsAllLink'
  | 'projectsCardLink'
  | 'projectsRelatedTitle'
  | 'projectFactClient'
  | 'projectFactLocation'
  | 'projectFactYear'
  | 'projectFactArea'
  | 'projectFactServices'
  | 'faqBlockEyebrow'
  | 'faqBlockTitle'
  | 'faqAllLink'
  | 'faqSearchPlaceholder'
  | 'faqNoResultsTitle'
  | 'faqNoResultsText'
  | 'faqContactTitle'
  | 'faqContactText'
  | 'faqContactLink'
  | 'allLightsTitle'
  | 'allLightsIntro'
  | 'allLightsSeoTitle'
  | 'allLightsSeoDescription'
  | 'categoryCardLink'
  | 'productAddToCart'
  | 'productViewingLink'
  | 'productQuestionTitle'
  | 'productQuestionLink'
  | 'shippingPickupLabel'
  | 'shippingPickupText'
  | 'shippingPostLabel'
  | 'paymentPrepaymentLabel'
  | 'paymentPrepaymentText'
  | 'paymentCashLabel'
  | 'paymentCashText'
  | 'paymentOnlineLabel'
  | 'paymentOnlineText'
  | 'orderEmailIntro'
  | 'orderEmailPrepayment'
  | 'orderEmailCash'
  | 'orderEmailOnline'
  | 'contactSubmit'
  | 'contactSuccessTitle'
  | 'contactSuccessText'
  | 'contactPrivacyNote'
  | 'cookieText'
  | 'cookieAccept'
  | 'cookieDecline'
  | 'notFoundTitle'
  | 'notFoundText'
  | 'notFoundHomeLink'
  | 'footerRights';

export type SiteTexts = Record<SiteTextKey, string> & {
  /** Bank details for prepayment e-mails, one line each; null if not set. */
  bankDetails: string | null;
};

type Definition = { groups: { fields: { key: string; default: string }[] }[] };

const toCamelCase = (key: string): string => key.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());

/** The texts as defined in site-texts.json, used for every text that is empty in the CMS. */
export const DEFAULT_SITE_TEXTS = Object.fromEntries(
  (definition as Definition).groups.flatMap((group) => group.fields.map((field) => [toCamelCase(field.key), field.default])),
) as Record<SiteTextKey, string>;

/** Replaces `{name}` placeholders, e.g. in «Zum {shop}». */
export const fillText = (text: string, values: Record<string, string>): string =>
  text.replace(/\{\{(\w+)\}\}/g, (match, name: string) => values[name] ?? match);

const FAQ_TEXT_KEYS = [
  'faqBlockEyebrow',
  'faqSearchPlaceholder',
  'faqNoResultsTitle',
  'faqNoResultsText',
  'faqContactTitle',
  'faqContactText',
  'faqContactLink',
] as const satisfies readonly SiteTextKey[];

/** Texts of the FAQ page: only these go to the browser (not e.g. the bank details). */
export type FaqTexts = Pick<SiteTexts, (typeof FAQ_TEXT_KEYS)[number]>;

export const pickFaqTexts = (texts: SiteTexts): FaqTexts =>
  Object.fromEntries(FAQ_TEXT_KEYS.map((key) => [key, texts[key]])) as FaqTexts;
