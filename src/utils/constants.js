export const SUBSCRIPTION_TYPES = ['ondemand', 'all'];

/**
 * @typedef {Object} SUBSCRIPTION_SKU_SUFFIXES
 * Used to identify a subscription line item's subscription type by its SKU.
 *
 * @property {'DSUB'}  ONDEMAND_ANY
 * @property {'DSUBA'} ONDEMAND_ANNUAL
 * @property {'DSUBM'} ONDEMAND_MONTHLY
 * @property {'ASUB'}  ALL_INCLUSIVE_ANY
 * @property {'ASUBA'} ALL_INCLUSIVE_ANNUAL
 * @property {'ASUBM'} ALL_INCLUSIVE_MONTHLY
 * @property {'SUBM'}  ANY_MONTHLY
 * @property {'SUBA'}  ANY_ANNUAL
 */

//  Where SKU breakdown is [XXXXX][A or D][SUB][A or M], e.g. 12345ASUBM
//
//  [XXXXX] = NBI backend product identifier, comprised of [0-9]
//  [A or D] = [A]ll Inclusive or On [D]emand specifier
//  [SUB] = Subscription Type product
//  [A or M] = [A]nnual or [M]onthly specifier
//
//  ex: 00001ASUBM = [A]ll Inclusive [M]onthly Subscription.
//      00005DSUBA = On [D]emand [A]nnual Subscription

/** @type {SUBSCRIPTION_SKU_SUFFIXES}*/
export const SUBSCRIPTION_SKU_SUFFIXES = {
  ONDEMAND_ANY: 'DSUB',
  ONDEMAND_ANNUAL: 'DSUBA',
  ONDEMAND_MONTHLY: 'DSUBM',
  ALL_INCLUSIVE_ANY: 'ASUB',
  ALL_INCLUSIVE_ANNUAL: 'ASUBA',
  ALL_INCLUSIVE_MONTHLY: 'ASUBM',
  ANY_MONTHLY: 'SUBM',
  ANY_ANNUAL: 'SUBA'
};

/**
 * @typedef {Object} CUSTOMER_SUBSCRIPTION_STATES
 * Used to describe a user's subscription state to the hook `useProductState`.
 *
 * @property {'all'}       ALL_INCLUSIVE_SUBSCRIBER
 * @property {'ondemand'}  ONDEMAND_SUBSCRIBER
 * @property {'nosub'}     NO_SUBCRIPTION
 */

/** @type {CUSTOMER_SUBSCRIPTION_STATES}*/
export const CUSTOMER_SUBSCRIPTION_STATES = {
  ALL_INCLUSIVE_SUBSCRIBER: 'all',
  NO_SUBCRIPTION: 'nosub',
  ONDEMAND_SUBSCRIBER: 'ondemand'
};

/**
 * @typedef {Object} PRODUCT_FORM_SUBSCRIPTION_STATES
 * Used to activate a specific register/access block based on what
 * subscriptions the customer may own or have in-cart.
 *
 * @property {'cartall'} ALL_INCLUSIVE_IN_CART
 * @property {'all'}     ALL_INCLUSIVE_SUBSCRIBER
 * @property {'allond'}  ALL_OR_ONDEMAND
 * @property {'nosub'}   NO_SUBCRIPTION_PRESENT
 * @property {'ond'}     ONDEMAND_SUBSCRIBER
 * @property {'cartond'} ONDEMAND_IN_CART
 */

/** @type {PRODUCT_FORM_SUBSCRIPTION_STATES}*/
export const PRODUCT_FORM_SUBSCRIPTION_STATES = {
  ALL_INCLUSIVE_IN_CART: 'cartall',
  ALL_INCLUSIVE_SUBSCRIBER: 'all',
  ALL_OR_ONDEMAND: 'allond',
  NO_SUBCRIPTION_PRESENT: 'nosub',
  ONDEMAND_IN_CART: 'cartond',
  ONDEMAND_SUBSCRIBER: 'ond'
};

/**
 * @typedef {Array} LIVE_VIDEO_FORMAT_CODES
 * All format codes that are considered "Live Video".
 * Format codes are loaded into the 'barcode' field on variants
 */
export const LIVE_VIDEO_FORMAT_CODES = [
  'WEBCAM',
  'LOSEM',
  'VWBCST',
  'INTWEB',
  'FASTTRACK',
  'VDRPL',
  'PREMIUM'
];

/**
 * @typedef {Array} LIVE_AUDIO_FORMAT_CODES
 * All format codes that are considered "Live Audio".
 * Format codes are loaded into the 'barcode' field on variants
 */
export const LIVE_AUDIO_FORMAT_CODES = ['TELEWEB', 'TELE'];

/**
 * @typedef {Array} ONDEMAND_VIDEO_FORMAT_CODES
 * All format codes that are considered "OnDemand Video".
 * Format codes are loaded into the 'barcode' field on variants
 */
export const ONDEMAND_VIDEO_FORMAT_CODES = ['SVDM', 'DVDM', 'ODONLY'];

/**
 * @typedef {Array} ONDEMAND_AUDIO_FORMAT_CODES
 * All format codes that are considered "OnDemand Audio".
 * Format codes are loaded into the 'barcode' field on variants
 */
export const ONDEMAND_AUDIO_FORMAT_CODES = ['SADM', 'DADM', 'SADMP'];

/**
 * @typedef {Array} LIVE_FORMAT_CODES
 * All format codes that are considered "Live".
 * Format codes are loaded into the 'barcode' field on variants
 */
export const LIVE_FORMAT_CODES = [
  ...LIVE_VIDEO_FORMAT_CODES,
  ...LIVE_AUDIO_FORMAT_CODES,
  'REG'
];

/**
 * @typedef {Array} ELEARN_FORMAT_CODES
 * All format codes that are considered "ELearning".
 * Format codes are loaded into the 'barcode' field on variants
 */
export const ELEARN_FORMAT_CODES = ['ELRN', 'INTOD'];

/**
 * @typedef {Boolean} IS_IPE
 * Is the current site an IPE derivative, will be false if it's an NBI derivative
 */
export const IS_IPE =
  import.meta.env.VITE_PUBLIC_STORE_DOMAIN.indexOf('ipe') > -1;
