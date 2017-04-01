/*!
 * dush-promise <https://github.com/tunnckoCore/dush-promise>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (https://i.am.charlike.online)
 * Released under the MIT license.
 */

/* jshint asi:true */

'use strict'

var test = require('mukla')
var promise = require('./index')
var dush = require('dush')

var app = dush().use(promise())

function fakePlugin (app) {
  app.foo = function (val) {
    if (val === 1) {
      app.reject(new Error('foo bar'))
      return app
    }
    app.bar = val
    return app
  }
  return app
}

test('should app have `.resolve`, `.reject`, `.then` and `.catch` methods', function (done) {
  test.strictEqual(typeof app.then, 'function')
  test.strictEqual(typeof app.catch, 'function')
  test.strictEqual(typeof app.reject, 'function')
  test.strictEqual(typeof app.resolve, 'function')
  done()
})

test('should emit `error` event when app.reject', function (done) {
  app.use(fakePlugin)
  app.on('error', function onError (er) {
    test.strictEqual(er.message, 'foo bar')
    done()
  })

  app.foo(1)
})

test('should pass error to `.catch` handler', function (done) {
  app.use(fakePlugin)
  app.foo(1)
  app.catch(function (er) {
    test.strictEqual(er instanceof Error, true)
    test.strictEqual(er.message, 'foo bar')
    done()
  })
})

test('should handle value with `app.then` method', function (done) {
  var emitter = dush().use(promise())
  emitter.then(function (res) {
    test.strictEqual(res, 123)
    done()
  })
  emitter.resolve(123)
})
