# Instagram Plugin [![Build Status](https://travis-ci.org/personal-api/plugin-instagram.svg?branch=master)](https://travis-ci.org/personal-api/plugin-instagram) [![codecov](https://codecov.io/gh/personal-api/plugin-instagram/branch/master/graph/badge.svg)](https://codecov.io/gh/personal-api/plugin-instagram?branch=master)

> Add recent photos to JS Personal API


## Install

```
$ npm install --save @personal-api/plugin-instagram
```


## Usage

In your [JS Personal API plugins file](https://github.com/personal-api/core/blob/master/src/plugins/index.js) instantiate the `InstagramPlugin` class, passing the following required options defined below under _Options_, and call `apply()` with the Express `app` object.

```js
import InstagramPlugin from '@personal-api/plugin-instagram';

export default (app) => {
  const Instagram = new InstagramPlugin({
    accessToken: '0000000000.0000000.00000000000000000000000000000000',
    onError: () => {},
    onSuccess: () => {},
    userId: '0000000000'
  });

  Instagram.apply(app);
};
```


## Options

Configuration options for the plugin class.

#### accessToken

Type: `String`

Your Instagram [access token](https://www.instagram.com/developer/authentication/) for API access.

#### count

Type: `Number`
Default: `3`

(Optional) The maximum number of pagination pages to fetch from Instagram.

#### middleware

Type: `Function`

(Optional) An Express middleware run before the route's controller.

#### onError

Type: `Function`

The error handler for API responses.

#### onSuccess

Type: `Function`

The success handler for API responses.

#### userId

Type: `String`

The Instagram User ID for API access.


## License

MIT © [Chris Vogt](https://www.chrisvogt.me)
