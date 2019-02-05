import test from 'ava';
import proxyquire from 'proxyquire';
import {stub} from 'sinon';

const expectedPath = 'https://api.instagram.com/v1/users/12345/media/recent?access_token=npBfF79JwN';
const mockNextURL = 'https://next-url.com';
const mockPhotoObject = {name: 'Photo #1'};

const mockGot = stub();

/* eslint-disable camelcase */
mockGot.withArgs(expectedPath).resolves({
  body: JSON.stringify({
    data: [mockPhotoObject],
    pagination: {
      next_url: mockNextURL
    }
  })
});

mockGot.resolves({
  body: JSON.stringify({
    meta: {
      code: 400,
      error_type: 'OAuthAccessTokenException',
      error_message: 'The access_token provided is invalid.'
    }
  })
});
/* eslint-enable camelcase */

const getPhotos = proxyquire('../get-photos.js', {
  got: mockGot
});

test.afterEach(() => {
  mockGot.resetHistory();
});

test.serial('constructs the endpoint using the args', async t => {
  await getPhotos('npBfF79JwN', '12345');
  t.deepEqual(mockGot.args, [[expectedPath], [mockNextURL]]);
});

test.serial('it returns the expected data on response', async t => {
  const response = await getPhotos('npBfF79JwN', '12345');
  t.deepEqual(response, {
    photos: [mockPhotoObject]
  });
});
