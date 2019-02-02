const got = require('got');

const INSTAGRAM_BASE = 'https://api.instagram.com';
const INSTAGRAM_PATH = '/v1/users/{user_id}/media/recent';
const INSTAGRAM_QUERY = '?access_token={access_token}';

const PHOTOS_ENDPOINT = `${INSTAGRAM_BASE}${INSTAGRAM_PATH}${INSTAGRAM_QUERY}`;

const RESPONSE_FAILURE = 'FAILURE';
const RESPONSE_SUCCESS = 'SUCCESS';

const getPhotos = async (accessToken, userId, count) => {
  const url = PHOTOS_ENDPOINT
    .replace(/{access_token}/g, accessToken)
    .replace(/{count}/g, count)
    .replace(/{user_id}/g, userId);

  try {
    const response = await got(url);
    const {data} = JSON.parse(response.body);

    return {
      result: RESPONSE_SUCCESS,
      data
    };
  } catch (error) {
    return {
      result: RESPONSE_FAILURE,
      error
    };
  }
};

module.exports = getPhotos;
