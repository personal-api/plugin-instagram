import test from 'ava';
import proxyquire from 'proxyquire';
import {stub} from 'sinon';

const mockGetPhotos = stub();
const mockApp = {use: stub()};
const mockReq = {};
const mockRes = {
  type: stub(),
  json: stub()
};

const mockValidCreds = {
  accessToken: 'abc',
  userId: '123'
};

const Plugin = proxyquire('../index.js', {
  './get-photos.js': mockGetPhotos
});

test.afterEach(() => {
  mockGetPhotos.resetHistory();
  mockApp.use.resetHistory();
  mockRes.type.resetHistory();
  mockRes.json.resetHistory();
});

test.serial('throws when called without an access token', t => {
  const error = t.throws(() => {
    const plugin = new Plugin();
    plugin.apply(mockApp);
  }, Error);

  t.is(error.message, 'API calls require both an access_token and a user_id.');
});

test.serial('throws when calling apply() without an express object', t => {
  const error = t.throws(() => {
    const plugin = new Plugin(mockValidCreds);
    plugin.apply();
  }, Error);

  t.is(error.message, 'apply() expects an express object where none was found.');
});

test.serial('it attaches a new route for instagram', t => {
  const plugin = new Plugin(mockValidCreds);
  plugin.apply(mockApp);

  t.is(mockApp.use.args[0][0], '/instagram');
});

test.serial('it forwards user options to the getter function', t => {
  const plugin = new Plugin(mockValidCreds);

  plugin.apply(mockApp);
  plugin.controller(mockReq, mockRes);

  t.deepEqual(mockGetPhotos.args, [['abc', '123', 3]]);
});
