const getPhotos = require('./get-photos');

/**
 * Instagram Plugin (JS Personal API)
 *
 * Applies a route to an Express server returning recent
 * photos fetched from the Instagram API.
 *
 * Options:
 *
 *  accessToken<String>: (required) The Instagram access token.
 *  count<Number>: The number of pages to request from Instagram.
 *  middleware<Function>: An optional middleware for the route.
 *  onError<Function>: (required) The error handler.
 *  onSuccess<Function>: (required) The success handler.
 *  userId<String>: (required) The Instagram's ID.
 *
 * @class
 */
class InstagramPlugin {
  constructor(options = {}) {
    this.options = options;

    this.controller = this.controller.bind(this);
    this.apply = this.apply.bind(this);
  }

  validateRequiredOptions() {
    const {
      accessToken,
      onError,
      onSuccess,
      userId
    } = this.options;

    if (!accessToken || !userId) {
      throw new Error('API calls require both an access_token and a user_id.');
    }

    if (!onError || !onSuccess) {
      throw new Error('Both onError and onSuccess request handlers are requred.');
    }
  }

  async controller(req, res) {
    const {
      accessToken,
      count = 3,
      onError: handleError,
      onSuccess: handleSuccess,
      userId
    } = this.options;

    try {
      const photos = await getPhotos(accessToken, userId, count);
      handleSuccess(res, {photos});
    } catch (error) {
      handleError(res, {error});
    }
  }

  apply(app) {
    const {
      middleware
    } = this.options;

    if (!app || !app.get) {
      throw new Error('apply() expects an express object where none was found.');
    }

    this.validateRequiredOptions();

    const routeMethodParams = [
      '/instagram',
      ...(middleware ? [middleware] : []),
      this.controller
    ].filter(Boolean);

    app.get(...routeMethodParams);
  }
}

module.exports = InstagramPlugin;
