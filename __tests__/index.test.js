import test from 'ava';
import proxyquire from 'proxyquire';
import {stub} from 'sinon';

const mockApp = {get: stub()};
const mockReq = {};
const mockRes = {
  type: stub(),
  json: stub()
};

const mockValidCreds = {
  accessToken: 'abc',
  userId: '123'
};

const mockHandlers = {
  onError: stub(),
  onSuccess: stub()
};

const mockPhotos = [{
  id: 'fake-photo-123'
}];

const mockGetPhotos = stub().resolves(mockPhotos);

const Plugin = proxyquire('../index.js', {
  './get-photos': mockGetPhotos
});

test.afterEach(() => {
  [
    mockApp.get,
    mockRes.type,
    mockRes.json,
    mockGetPhotos,
    mockHandlers.onError,
    mockHandlers.onSuccess
  ].forEach(stubObj => {
    stubObj.resetHistory();
  });
});

test.serial('throws when called without an access token', t => {
  const error = t.throws(() => {
    const plugin = new Plugin(mockHandlers);
    plugin.apply(mockApp);
  }, Error);

  t.is(error.message, 'API calls require both an access_token and a user_id.');
});

test.serial('throws when called without error and success handlers', t => {
  const error = t.throws(() => {
    const plugin = new Plugin(mockValidCreds);
    plugin.apply(mockApp);
  }, Error);

  t.is(error.message, 'Both onError and onSuccess request handlers are requred.');
});

test.serial('throws when calling apply() without an express object', t => {
  const error = t.throws(() => {
    const params = {...mockHandlers, ...mockValidCreds};
    const plugin = new Plugin(params);
    plugin.apply();
  }, Error);

  t.is(error.message, 'apply() expects an express object where none was found.');
});

test.serial('it attaches a new route for instagram', t => {
  const params = {...mockHandlers, ...mockValidCreds};
  const plugin = new Plugin(params);
  plugin.apply(mockApp);

  t.is(mockApp.get.args[0][0], '/instagram');
});

test.serial('it passes results to the success handler', async t => {
  const params = {...mockHandlers, ...mockValidCreds};
  const plugin = new Plugin(params);

  mockHandlers.onSuccess.resetHistory();
  await plugin.controller(mockReq, mockRes);

  t.deepEqual(mockHandlers.onSuccess.args, [[
    mockRes,
    {
      photos: mockPhotos
    }
  ]]);
});

test.serial('it passes errors to the error handler', async t => {
  const params = {...mockHandlers, ...mockValidCreds};
  const plugin = new Plugin(params);
  const errorMessage = 'Something went wrong';
  const error = new Error(errorMessage);

  mockGetPhotos.throws(error);
  mockHandlers.onError.resetHistory();
  await plugin.controller(mockReq, mockRes);

  t.deepEqual(mockHandlers.onError.args, [[
    mockRes,
    {
      error
    }
  ]]);
});
