'use strict';
var assert = require('assert');
var proxyquire = require('proxyquire');
var sinon = require('sinon');
var Router = require('../lib/router');
var inquirer = require('inquirer');

describe('help route', function () {
  beforeEach(function () {
    this.sandbox = sinon.sandbox.create();
    this.insight = {
      track: sinon.stub()
    };
    this.homeRoute = sinon.spy();
    this.router = new Router(this.insight);
    this.router.registerRoute('home', this.homeRoute);

    this.opn = sinon.stub();
    var helpRoute = proxyquire('../lib/routes/help', {
      opn: this.opn
    });
    this.router.registerRoute('help', helpRoute);
  });

  afterEach(function () {
    this.sandbox.restore();
  });

  it('allow returning home', function () {
    this.sandbox.stub(inquirer, 'prompt', function (arg, cb) {
      cb({ whereTo: 'home' });
    });
    this.router.navigate('help');
    sinon.assert.calledOnce(this.homeRoute);
  });

  it('track page and answer', function () {
    this.sandbox.stub(inquirer, 'prompt', function (arg, cb) {
      cb({ whereTo: 'home' });
    });
    this.router.navigate('help');
    sinon.assert.calledWith(this.insight.track, 'yoyo', 'help');
    sinon.assert.calledWith(this.insight.track, 'yoyo', 'help', { whereTo: 'home' });
  });

  it('open urls in browsers', function () {
    var url = 'http://yeoman.io';
    this.sandbox.stub(inquirer, 'prompt', function (arg, cb) {
      cb({ whereTo: url });
    });
    this.router.navigate('help');
    sinon.assert.calledWith(this.opn, url);
    sinon.assert.calledOnce(this.opn);
  });
});
