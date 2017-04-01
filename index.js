/*!
 * dush-promise <https://github.com/tunnckoCore/dush-promise>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (https://i.am.charlike.online)
 * Released under the MIT license.
 */

'use strict'

var extend = require('extend-shallow')
var Deferred = require('native-promise-deferred')

/**
 * > Adds a Promise methods such as `.resolve`, `.reject`
 * `.then` and `.catch` to your [dush][] application. Useful
 * from inside plugins. This plugin also emits `error` event
 * when `app.reject` is used.
 *
 * **Example**
 *
 * ```js
 * var dush = require('dush')
 * var promise = require('dush-promise')
 *
 * var app = dush().use(promise())
 *
 * console.log(app.then)
 * console.log(app.catch)
 * console.log(app.reject)
 * console.log(app.resolve)
 * ```
 *
 * @param  {Object} `opts` optional, passed directly to [native-promise-deferred][]
 * @return {Function} a plugin function that should be passed to `.use` method of [dush][]
 * @api public
 */

module.exports = function dushPromise (opts) {
  return function dushPromise_ (app) {
    var promise = Deferred(extend({}, app.options, opts))

    /**
     * > Handle resolved promise with `onresolved` or rejected promise
     * with `onrejected`. It is as any usual Promise `.then` method.
     *
     * **Example**
     *
     * ```js
     * app.then((res) => {
     *   console.log(res) // => 123
     * })
     * app.resolve(123)
     *
     * // or handle rejected promise
     * app.then(null, (er) => {
     *   console.log('err!', er) // => Error: foo bar
     * })
     * app.reject(new Error('foo bar'))
     * ```
     *
     * @name   .then
     * @param  {Function} `onresolved`
     * @param  {Function} `onrejected`
     * @return {Promise}
     * @api public
     */

    app.then = function then (onresolved, onrejected) {
      return promise.then(onresolved, onrejected)
    }

    /**
     * > Catch a rejected promise error. This method is mirror
     * of any usual promise `.catch` method.
     *
     * **Example**
     *
     * ```js
     * app.on('error', (err) => {
     *   console.log('er!', err) // => Error: sad err
     * })
     * app.catch((err) => {
     *   console.log('oops, error!', err) // => Error: sad err
     * })
     *
     * app.reject(new Error('sad err'))
     * ```
     *
     * @name   .catch
     * @param  {Function} `onrejected`
     * @return {Promise}
     * @api public
     */

    app.catch = function catch_ (onrejected) {
      return promise.catch(onrejected)
    }

    /**
     * > As any usual `Promise.resolve` method.
     *
     * **Example**
     *
     * ```js
     * app.use((app) => {
     *   app.foo = () => {
     *     return app.resolve(1222)
     *   }
     * })
     *
     * const promise = app.foo()
     * promise.then((val) => {
     *   console.log('res:', val) // => 1222
     * })
     * ```
     *
     * @name   .resolve
     * @param  {any} `val`
     * @return {Promise}
     * @api public
     */

    app.resolve = function resolve (val) {
      return promise.resolve(val)
    }

    /**
     * > As any usual `Promise.reject` method.
     *
     * **Example**
     *
     * ```js
     * app.on('error', (err) => {
     *   console.log('some error:', err) // => Error: quxie
     * })
     * app.reject(new Error('quxie'))
     * ```
     *
     * @name   .reject
     * @param  {Error} `err`
     * @return {Promise}
     * @api public
     */

    app.reject = function reject (err) {
      return promise.reject(err)
    }

    app.catch(function onRejected (er) {
      app.emit('error', er)
    })

    return app
  }
}
