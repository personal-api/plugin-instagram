const got = require('got');

const INSTAGRAM_BASE = 'https://api.instagram.com';
const INSTAGRAM_PATH = '/v1/users/{user_id}/media/recent';
const INSTAGRAM_QUERY = '?access_token={access_token}';

const PHOTOS_ENDPOINT = `${INSTAGRAM_BASE}${INSTAGRAM_PATH}${INSTAGRAM_QUERY}`;

const flatten = list => list.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);

const getPhotos = async (accessToken, userId, count = 3) => {
  let url = PHOTOS_ENDPOINT
    .replace(/{access_token}/g, accessToken)
    .replace(/{user_id}/g, userId);

  const acc = {pages: [], urls: []};
  let response;

  /* eslint-disable no-await-in-loop */
  while (url && acc.pages.length <= count && !acc.urls.includes(url)) {
    acc.urls.push(url);
    response = await got(url);

    const {
      data = [],
      pagination = {}
    } = JSON.parse(response.body);

    url = pagination.next_url;
    acc.pages.push(data);
  }
  /* eslint-enable no-await-in-loop */

  const {pages: photos} = acc;
  return {
    photos: flatten(photos)
  };
};

module.exports = getPhotos;
