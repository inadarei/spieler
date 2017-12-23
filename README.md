# Spieler

A wrapper for [express-validator](https://github.com/ctavan/express-validator) for easier input validation in Express.js

## Motivation

If you use vanilla [express-validator](https://github.com/ctavan/express-validator) you will have to add code
similar to the following to each and every route-processing callback function:

```Javascript

// either this:
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    ...
  }

// or something like this:
  try {
    validationResult(req).throw();

    res.json(...);
  } catch (err) {
    res.status(422).json(...);
  }
```

And that despite the fact that you are already providing all of the
validtaion configuration in the route mapping! This is wasteful.

Spieler allows you to do validation in one place (mapping) and skip a whole
bunch of unnecessary boilerplate code. Other than that, it acts exactly like
`express-validator`. In essence, Spieler is a convenience wrapper for the
wonderful express-validator module.

## Setup:

1. Add Spieler to your package.json
2. Enable middleware, wherever you enable Express middleware

   ```Javascript
   const express = require('express');
   const app = express();
   // ...
   const {spieler, expressValidator} = require('spieler')();
   app.use(expressValidator());
   // Make sure the app.use() goes before any route handler mappings.
   ```

3. In your route mappings, instead of providing just an array of checks, as
   you would do for a vanilla express-validator, wrap the checks in
   a spieler() function call, as shown here:

  ```javascript
    const addUserValidator = spieler([
      check("email").exists().isEmail().withMessage('must be an email')
      .trim().normalizeEmail(),

      check('password', 'passwords must be at least 5 chars long and contain one number')
      .exists()
      .isLength({ min: 5 })
      .matches(/\d/)
    ]);

    router.post('/', addUserValidator, actions.addUser);
  ```

You can see the full example of Spieler in action in [NodeBootstrap](https://github.com/inadarei/nodebootstrap), specifically files:

1. [appConfig.js](https://github.com/inadarei/nodebootstrap-microservice/blob/master/appConfig.js) and
2. [controllers/mapping.js](https://github.com/inadarei/nodebootstrap-microservice/blob/master/lib/users/controllers/mappings.js)
