import {URL} from "url";

function unknownLocationDataType() {
  throw new Error("Unknown location data type!");
}

/**
 * Convert Location object or string into URL object
 * @param {Location|string} location 
 * @returns {URL}
 */
export function locationToUrl(location) {
  if (location instanceof URL) return location;
  if (typeof location === "object") {
    if (location.href) {
      location = location.href;
    } else {
      return unknownLocationDataType(); 
    }
  }
  return new URL(location);
}

/**
 * Convert Location or URL object into string
 * @param {Location|URL} location 
 * @returns {string}
 */
export function locationToString(location) {
  if (typeof location === "string") return location;
  if (location instanceof URL) return location.toString();
  if (location.href) return location.href;
  return unknownLocationDataType(); 
}

export const pageRegexp = {
  supporter: /^#.+\/supporter(_raid)?\/\d+/,
  result: /^#result/,
  battle: /^#raid/
};

/**
 * Check if current location is a quest supporter page
 * @param {Object|string} location 
 * @returns {boolean}
 */
export function isSupporterPage(location) {
  const url = locationToUrl(location);
  return !!url.hash.match(pageRegexp.supporter);
}

/**
 * Check if current location is a quest battle page
 * @param {Object|string} location 
 * @returns {boolean}
 */
export function isBattlePage(location) {
  const url = locationToUrl(location);
  return url.hash.match(pageRegexp.battle);
}

/**
 * Check if current location is a quest result page
 * @param {Object|string} location 
 * @returns {boolean}
 */
export function isResultPage(location) {
  const url = locationToUrl(location);
  return url.hash.match(pageRegexp.result);
}

/**
 * @typedef {Object} Location
 * @property {string} href
 */
