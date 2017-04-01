/*!
 * dush-promise <https://github.com/tunnckoCore/dush-promise>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (https://i.am.charlike.online)
 * Released under the MIT license.
 */

'use strict'

var Deferred = require('native-promise-deferred')

module.exports = function dushPromise (opts) {
  return function dushPromise_ (app) {
    var promise = Deferred(opts)

    app.then = function (fn, rej) {
      return promise.then(fn, rej)
    }
    app.catch = function (fn) {
      return promise.catch(fn)
    }
    app.resolve = function resolve (val) {
      return promise.resolve(val)
    }
    app.reject = function (er) {
      return promise.reject(er)
    }
    app.catch(function (er) {
      app.emit('error', er)
    })

    return app
  }
}
