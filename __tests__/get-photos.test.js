import test from 'ava';
import proxyquire from 'proxyquire';
import {stub} from 'sinon';

const expectedPath = 'https://api.instagram.com/v1/users/12345/media/recent?access_token=npBfF79JwN';

const mockFailureResult = 'FAILURE';
const mockFailureResponse = 'EXTERMINATE, EXTERMINATE';

const mockSuccessResult = 'SUCCESS';
const mockSuccessResponse = [{name: 'Photo #1'}];

const mockGot = stub();

mockGot.withArgs(expectedPath).resolves({
  body: JSON.stringify({
    result: mockSuccessResult,
    data: mockSuccessResponse
  })
});

mockGot.resolves({
  result: mockFailureResult,
  error: mockFailureResponse
});

const getPhotos = proxyquire('../get-photos.js', {
  got: mockGot
});

test.afterEach(() => {
  mockGot.resetHistory();
});

test.serial('responds as expected for failures', async t => {
  const response = await getPhotos('abc', 'xyz');
  t.is(response.result, mockFailureResult);
});

test.serial('constructs the endpointusing the args', async t => {
  await getPhotos('npBfF79JwN', '12345');
  t.deepEqual(mockGot.args, [[expectedPath]]);
});

test.serial('it returns the expected data on response', async t => {
  const response = await getPhotos('npBfF79JwN', '12345');
  t.deepEqual(response, {
    result: mockSuccessResult,
    data: mockSuccessResponse
  });
});
