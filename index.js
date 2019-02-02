const getPhotos = require('./get-photos.js');

const sendSuccess = (res, result) => {
  const response = {};

  response.status = 'ok';

  if (result) {
    response.result = result;
  }

  res.type('json');
  res.status = 200;
  res.json(response);
};

class InstagramPlugin {
  constructor(options = {}) {
    this.options = options;

    this.controller = this.controller.bind(this);
    this.apply = this.apply.bind(this);
  }

  async controller(req, res) {
    const {
      accessToken,
      count = 12,
      userId
    } = this.options;

    const photos = await getPhotos(accessToken, userId, count);

    sendSuccess(res, photos);
  }

  apply(app) {
    const {
      accessToken,
      userId
    } = this.options;

    if (!accessToken || !userId) {
      throw new Error('API calls require both an access_token and a user_id.');
    }

    if (!app || !app.use) {
      throw new Error('apply() expects an express object where none was found.');
    }

    app.use('/instagram', this.controller);
  }
}

module.exports = InstagramPlugin;
