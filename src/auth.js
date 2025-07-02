// auth.js
// Provides userInfo fetching and user info structure

/**
 * Represents YouVersion user info.
 * @typedef {Object} YouVersionUserInfo
 * @property {string} firstName
 * @property {string} lastName
 * @property {number} userId
 * @property {string|null} avatarUrlFormat
 * @property {string|null} avatarUrl
 */

/**
 * Computes avatar URL from avatarUrlFormat, replacing {width} and {height} with 200 and prepending https: if needed.
 * @param {string|null} avatarUrlFormat
 * @returns {string|null}
 */
function computeAvatarUrl(avatarUrlFormat) {
  if (!avatarUrlFormat) return null;
  let urlString = avatarUrlFormat;
  if (urlString.startsWith('//')) {
    urlString = 'https:' + urlString;
  }
  urlString = urlString.replace('{width}', '200').replace('{height}', '200');
  return urlString;
}

/**
 * Fetches YouVersion user info from API.
 * @param {string} accessToken
 * @returns {Promise<YouVersionUserInfo>}
 */
export async function userInfo(accessToken) {
  const apiKey = window.youversionplatformkey || document.body?.dataset.youversionplatformkey;
  if (!apiKey) {
    throw new Error('The YouVersion Platform app key is required.');
  }
  const url = `https://api-dev.youversion.com/auth/me?lat=${accessToken}`;  // TODO remove the lat param once Apigee has been updated.
  const response = await fetch(url, {
    headers: {
      'lat': accessToken,
      'apikey': apiKey
    }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch user info');
  }
  const data = await response.json();
  const userInfo = {
    firstName: data.first_name,
    lastName: data.last_name,
    userId: data.id,
    avatarUrlFormat: data.avatar_url,
    avatarUrl: computeAvatarUrl(data.avatar_url),
  };
  return userInfo;
}
