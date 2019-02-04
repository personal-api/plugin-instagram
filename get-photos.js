const got = require('got');

const INSTAGRAM_BASE = 'https://api.instagram.com';
const INSTAGRAM_PATH = '/v1/users/{user_id}/media/recent';
const INSTAGRAM_QUERY = '?access_token={access_token}';

const PHOTOS_ENDPOINT = `${INSTAGRAM_BASE}${INSTAGRAM_PATH}${INSTAGRAM_QUERY}`;

const getPhotos = async (accessToken, userId, maxPageCount) => {
  let url = PHOTOS_ENDPOINT
    .replace(/{access_token}/g, accessToken)
    .replace(/{user_id}/g, userId);

  const acc = {orig: url, pages: [], urls: []};
  let response;

  while (url && acc.pages.length <= maxPageCount) {
    acc.urls.push(url);

    response = await got(url);
    const {
      data,
      pagination
    } = JSON.parse(response.body);

    url = pagination.next_url;

    acc.pages.push(data);
  }

  const {pages: photos} = acc;
  return {
    photos
  };
};

module.exports = getPhotos;
