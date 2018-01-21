import {URL} from "url";

/**
 * Convert string or plain object into URL object
 * @param {Object|string} location 
 * @returns {URL}
 */
export function locationToUrl(location) {
  if (typeof location === "object" && location.href) {
    location = location.href;
  }
  return new URL(location);
}

/**
 * Check if current location is a quest supporter page
 * @param {Object|string} location 
 * @returns {boolean}
 */
export function isSupporterPage(location) {
  const url = locationToUrl(location);
  return !!url.hash.match(/\/#quest\/.+\/supporter\/\d+/);
}

/**
 * Check if current location is a quest battle page
 * @param {Object|string} location 
 * @returns {boolean}
 */
export function isBattlePage(location) {
  const url = locationToUrl(location);
  return url.hash.startsWith("#raid");
}

/**
 * Check if current location is a quest result page
 * @param {Object|string} location 
 * @returns {boolean}
 */
export function isResultPage(location) {
  const url = locationToUrl(location);
  return url.hash.startsWith("#result");
}
