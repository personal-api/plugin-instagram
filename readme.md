# Instagram Plugin [![Build Status](https://travis-ci.org/personal-api/plugin-instagram.svg?branch=master)](https://travis-ci.org/personal-api/plugin-instagram) [![codecov](https://codecov.io/gh/personal-api/plugin-instagram/branch/master/graph/badge.svg)](https://codecov.io/gh/personal-api/plugin-instagram?branch=master)

> Add recent photos to JS Personal API


## Install

```
$ npm install --save @personal-api/plugin-instagram
```


## Usage

Call `apply()` with your Express `app` object to apply.

```js
import InstagramPlugin from '@personal-api/plugin-instagram';

export default (app) => {
  const Instagram = new InstagramPlugin({
    accessToken: process.env.INSTAGRAM_ACCESS_TOKEN,
    userId: process.env.INSTAGRAM_USER_ID,
    count: 2,
  });

  Instagram.apply(app);
};
```


## License

MIT © [Chris Vogt](https://www.chrisvogt.me)
