var assert = require('chai').assert;
var jsdom = require('mocha-jsdom');

var template = {}

describe('Boost JS Carousel', function () {

    jsdom()

    before(function ( done ) {
        $ = require('jquery')
        boost = require('boost-js')
        collapse = require('../dist/collapse.min.js')
        $.fn.collapse = boost( collapse.plugin, collapse.defaults );
        done();
    });

    describe('creation', function () {

    });

    describe('instantiation', function () {

    });

    describe('settings', function () {

    });

    describe('changeTo()', function () {

    });

    describe('next()', function () {

    });

    describe('prev()', function () {

    });

    describe('start()', function () {

    });

    describe('stop()', function () {

    });

    describe('reset()', function () {

    });

});
