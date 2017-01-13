var assert = require('chai').assert;
var jsdom = require('mocha-jsdom');

var template = {
    default: '<ol id="carousel">'+
        '<li>Slide 1</li><li class="is-active">Slide 2</li><li>Slide 3</li>'+
    '</ol>'+
    '<a href="#carousel" data-role="next">Next</a>'+
    '<a href="#carousel" data-role="prev">Previous</a>'+
    '<ol data-bind="#carousel" data-role="nav">'+
        '<li>1</li><li class="is-active">2</li><li>3</li>'+
    '</ol>',
    noActive: '<ol id="carousel">'+
        '<li></li><li></li><li></li>'+
    '</ol><ol data-bind="#carousel" data-role="nav">'+
        '<li></li><li></li><li></li>'+
    '</ol>',
    activeClass: '<ol id="carousel" data-active-class="foo-bar">'+
        '<li></li><li></li><li></li>'+
    '</ol><ol data-bind="#carousel" data-role="nav">'+
        '<li></li><li></li><li></li>'+
    '</ol>',
    nextClass: '<ol id="carousel" data-next-class="foo-bar">'+
        '<li></li><li></li><li></li>'+
    '</ol><ol data-bind="#carousel" data-role="nav">'+
        '<li></li><li></li><li></li>'+
    '</ol>',
    prevClass: '<ol id="carousel" data-prev-class="foo-bar">'+
        '<li></li><li></li><li></li>'+
    '</ol><ol data-bind="#carousel" data-role="nav">'+
        '<li></li><li></li><li></li>'+
    '</ol>',
    intervalSpeed: '<ol id="carousel" data-interval-speed="100">'+
        '<li></li><li></li><li></li>'+
    '</ol><ol data-bind="#carousel" data-role="nav">'+
        '<li></li><li></li><li></li>'+
    '</ol>',
    startAfter: '<ol id="carousel" data-start-after="100">'+
        '<li></li><li></li><li></li>'+
    '</ol><ol data-bind="#carousel" data-role="nav">'+
        '<li></li><li></li><li></li>'+
    '</ol>',
    startOnSlide: '<ol id="carousel" data-start-on-slide="1">'+
        '<li></li><li></li><li></li>'+
    '</ol><ol data-bind="#carousel" data-role="nav">'+
        '<li></li><li></li><li></li>'+
    '</ol>',
    pauseOnHover: '<ol id="carousel" data-pause-on-hover="false">'+
        '<li></li><li></li><li></li>'+
    '</ol><ol data-bind="#carousel" data-role="nav">'+
        '<li></li><li></li><li></li>'+
    '</ol>',
    resetInterval: '<ol id="carousel" data-reset-interval="false">'+
        '<li></li><li></li><li></li>'+
    '</ol><ol data-bind="#carousel" data-role="nav">'+
        '<li></li><li></li><li></li>'+
    '</ol>',
    noID: '<ol><li></li><li></li><li></li></ol>',
    slideID: '<ol id="carousel">'+
        '<li id="slide1" role="test"></li><li></li><li></li>'+
    '</ol>'
}

describe('Boost JS Carousel', function () {

    jsdom()

    before(function ( done ) {
        $ = require('jquery')
        boost = require('boost-js')
        carousel = require('../dist/carousel.min.js')
        $.fn.carousel = boost( carousel.plugin, carousel.defaults );
        done();
    });

    describe('creation', function () {

        it('should have added plugin to jQuery\'s prototype', function () {
            assert.isDefined( $.fn.carousel );
        });

    });

    describe('instantiation', function () {

        var inst;

        before(function ( done ) {
            document.body.innerHTML = template.default;
            inst = $('#carousel').carousel();
            done();
        });

        it('should save each slide to attribute', function () {
            assert.lengthOf( inst.slides, 3 );
        });

        it('should set active slide to slide with activeClass', function () {
            assert.isTrue( inst.slides[1].first().hasClass( 'is-active' ) );
            assert.strictEqual( inst.activeSlide, 1 );
        });

        it('should add nav items to corresponding slide', function () {
            assert.lengthOf( inst.slides[0], 2 );
            assert.lengthOf( inst.slides[1], 2 );
            assert.lengthOf( inst.slides[2], 2 );
        });

        it('should add attributes to each slide element', function () {
            var exist = true;
            for( var i=0; i<inst.slides.length; i++ ) {
                var slide = inst.slides[i].first();
                // role="tabpanel"
                if( slide.attr('role') !== 'tabpanel' ) {
                    exists = false;
                    break;
                }
                // id="carousel-slide-[i]"
                if( slide.attr('id') !== inst.id+'-slide-'+i ) {
                    exists = false;
                    break;
                }
            }
            assert.isTrue( exist );
        });

        it('should add attributes to \'next\' slide trigger', function () {
            assert.match( inst.roles.next.attr('role'), /button/ );
            assert.match( inst.roles.next.attr('aria-label'), /Show slide 3 of 3/ );
        });

        it('should active next slide on click of \'next\' trigger', function () {
            assert.strictEqual( inst.activeSlide, 1 );
            inst.roles.next.trigger( 'click' );
            assert.strictEqual( inst.activeSlide, 2 );
        });

        it('should add attributes to \'prev\' slide trigger', function () {
            assert.match( inst.roles.prev.attr('role'), /button/ );
            assert.match( inst.roles.prev.attr('aria-label'), /Show slide 2 of 3/ );
        });

        it('should active next slide on click of \'prev\' trigger', function () {
            assert.strictEqual( inst.activeSlide, 2 );
            inst.roles.prev.trigger( 'click' );
            assert.strictEqual( inst.activeSlide, 1 );
        });

        it('should add attributes to \'nav\' list', function () {
            assert.match( inst.roles.nav.attr('role'), /tablist/ );
            assert.match( inst.roles.nav.attr('tabindex'), /0/ );
            assert.match( inst.roles.nav.attr('aria-labelledby'), /carousel-indicator-1/ );
            assert.match( inst.roles.nav.attr('aria-activedescendant'), /carousel-indicator-1/ );
        });

        it('should go the next slide on press of up or right arrow keys on nav', function () {
            assert.strictEqual( inst.activeSlide, 1 );
            inst.roles.nav.trigger($.Event("keydown", { keyCode: 39 }));
            assert.strictEqual( inst.activeSlide, 2 );
            inst.roles.nav.trigger($.Event("keydown", { keyCode: 38 }));
            assert.strictEqual( inst.activeSlide, 0 );
        });

        it('should go the previous slide on press of down or left arrow keys on nav', function () {
            assert.strictEqual( inst.activeSlide, 0 );
            inst.roles.nav.trigger($.Event("keydown", { keyCode: 37 }));
            assert.strictEqual( inst.activeSlide, 2 );
            inst.roles.nav.trigger($.Event("keydown", { keyCode: 40 }));
            assert.strictEqual( inst.activeSlide, 1 );
        });

        it('should add attributes to each item in nav', function () {
            var exist = true, items = inst.roles.nav.children();
            for( var i=0; i<items.length; i++ ) {
                var item = $(items[i]);
                if( item.attr('tabindex') !== '-1'
                 || item.attr('role') !== 'tab'
                 || !item.attr('aria-selected')
                 || item.attr('id') !== 'carousel-indicator-'+i
                 || item.attr('aria-labelledby') !== 'carousel-slide-'+i
                 || item.attr('aria-controls') !== 'carousel-slide-'+i ) {
                    exists = false;
                    break;
                }
            }
            assert.isTrue( exist );
        });

        it('should update active attributes to slide and indicators', function () {
            var active = inst.slides[ inst.activeSlide ];
            assert.isTrue( active.first().hasClass( 'is-active' ) );
            assert.match( active.last().attr( 'aria-selected' ), /true/ );
        });

        it('should add active classes to next and previous slides as well', function () {
            assert.isTrue( inst.slides[ inst.nextSlide() ].first().hasClass( 'is-next' ) );
            assert.isTrue( inst.slides[ inst.prevSlide() ].first().hasClass( 'is-prev' ) );
        });

        it('should add \'activeClass\' to first slide and nav if no class present', function () {
            document.body.innerHTML = template.noActive;
            inst = $('#carousel').carousel();
            assert.match( document.querySelectorAll('li')[0].className, /is-active/ );
            assert.match( document.querySelectorAll('li')[3].className, /is-active/ );
        });

        it('should add \'nextClass\' to the next slide, relative to active', function () {
            document.body.innerHTML = template.noActive;
            inst = $('#carousel').carousel();
            assert.match( document.querySelectorAll('li')[1].className, /is-next/ );
            assert.match( document.querySelectorAll('li')[4].className, /is-next/ );
        });

        it('should add \'prevClass\' to the previous slide, relative to active', function () {
            document.body.innerHTML = template.noActive;
            inst = $('#carousel').carousel();
            assert.match( document.querySelectorAll('li')[2].className, /is-prev/ );
            assert.match( document.querySelectorAll('li')[5].className, /is-prev/ );
        });

        it('should generate a unique id for carousel if one doesn\'t exist', function () {
            document.body.innerHTML = template.noID;
            inst = $('ol').carousel();
            assert.match( inst.id, /carousel-[\w\d]{4}/ );
        });

        it('should use id of slide if it exists', function () {
            document.body.innerHTML = template.slideID;
            inst = $('#carousel').carousel();
            assert.match( inst.slides[0][0].id, /slide1/ );
            assert.match( inst.slides[1][0].id, /carousel-slide-1/ );
        });

    });

    describe('settings', function () {

        it('should be able to update \'activeClass\' setting from instantiation', function () {
            document.body.innerHTML = template.noActive;
            $('#carousel').carousel({activeClass:'foo-bar'});
            assert.match( document.querySelectorAll('li')[0].className, /foo-bar/ );
            assert.match( document.querySelectorAll('li')[3].className, /foo-bar/ );
        });

        it('should be able to update \'activeClass\' setting from html', function () {
            document.body.innerHTML = template.activeClass;
            $('#carousel').carousel();
            assert.match( document.querySelectorAll('li')[0].className, /foo-bar/ );
            assert.match( document.querySelectorAll('li')[3].className, /foo-bar/ );
        });

        it('should be able to update \'nextClass\' setting from instantiation', function () {
            document.body.innerHTML = template.noActive;
            $('#carousel').carousel({nextClass:'foo-bar'});
            assert.match( document.querySelectorAll('li')[1].className, /foo-bar/ );
            assert.match( document.querySelectorAll('li')[4].className, /foo-bar/ );
        });

        it('should be able to update \'nextClass\' setting from html', function () {
            document.body.innerHTML = template.nextClass;
            $('#carousel').carousel();
            assert.match( document.querySelectorAll('li')[1].className, /foo-bar/ );
            assert.match( document.querySelectorAll('li')[4].className, /foo-bar/ );
        });

        it('should be able to update \'prevClass\' setting from instantiation', function () {
            document.body.innerHTML = template.noActive;
            $('#carousel').carousel({prevClass:'foo-bar'});
            assert.match( document.querySelectorAll('li')[2].className, /foo-bar/ );
            assert.match( document.querySelectorAll('li')[5].className, /foo-bar/ );
        });

        it('should be able to update \'prevClass\' setting from html', function () {
            document.body.innerHTML = template.prevClass;
            $('#carousel').carousel();
            assert.match( document.querySelectorAll('li')[2].className, /foo-bar/ );
            assert.match( document.querySelectorAll('li')[5].className, /foo-bar/ );
        });

        it('should be able to update \'intervalSpeed\' setting from instantiation', function () {
            document.body.innerHTML = template.noActive;
            var inst = $('#carousel').carousel({intervalSpeed:100});
            assert.strictEqual( inst.settings.intervalSpeed, 100 );
        });

        it('should be able to update \'intervalSpeed\' setting from html', function () {
            document.body.innerHTML = template.intervalSpeed;
            var inst = $('#carousel').carousel();
            assert.strictEqual( inst.settings.intervalSpeed, 100 );
        });

        it('should be able to update \'startAfter\' setting from instantiation', function () {
            document.body.innerHTML = template.noActive;
            var inst = $('#carousel').carousel({startAfter:100});
            assert.strictEqual( inst.settings.startAfter, 100 );
        });

        it('should be able to update \'startAfter\' setting from html', function () {
            document.body.innerHTML = template.startAfter;
            var inst = $('#carousel').carousel();
            assert.strictEqual( inst.settings.startAfter, 100 );
        });

        it('should be able to update \'startOnSlide\' setting from instantiation', function () {
            document.body.innerHTML = template.noActive;
            var inst = $('#carousel').carousel({startOnSlide:1});
            assert.strictEqual( inst.settings.startOnSlide, 1 );
        });

        it('should be able to update \'startOnSlide\' setting from html', function () {
            document.body.innerHTML = template.startOnSlide;
            var inst = $('#carousel').carousel();
            assert.strictEqual( inst.settings.startOnSlide, 1 );
        });

        it('should be able to update \'pauseOnHover\' setting from instantiation', function () {
            document.body.innerHTML = template.noActive;
            var inst = $('#carousel').carousel({pauseOnHover:false});
            assert.isFalse( inst.settings.pauseOnHover );
        });

        it('should be able to update \'pauseOnHover\' setting from html', function () {
            document.body.innerHTML = template.pauseOnHover;
            var inst = $('#carousel').carousel();
            assert.isFalse( inst.settings.pauseOnHover );
        });

        it('should be able to update \'resetInterval\' setting from instantiation', function () {
            document.body.innerHTML = template.noActive;
            var inst = $('#carousel').carousel({resetInterval:false});
            assert.isFalse( inst.settings.resetInterval );
        });

        it('should be able to update \'resetInterval\' setting from html', function () {
            document.body.innerHTML = template.resetInterval;
            var inst = $('#carousel').carousel();
            assert.isFalse( inst.settings.resetInterval );
        });

        it('should be able to add function to \'onInit\' setting', function () {
            document.body.innerHTML = template.default;
            var inst = $('#carousel').carousel({
                onInit: function() {
                    this.test = "foo";
                }
            });
            assert.match( inst.test, /foo/ );
        });

        it('should be able to add function to \'onChange\' setting', function () {
            document.body.innerHTML = template.default;
            var inst = $('#carousel').carousel({
                onChange: function() {
                    this.test = "bar";
                }
            });
            inst.changeTo(2);
            assert.match( inst.test, /bar/ );
        });

    });

    describe('changeTo()', function () {

        it('should NOT run method if slide number is less than 0', function () {
            document.body.innerHTML = template.default;
            var inst = $('#carousel').carousel({
                startAfter: -1,
                onChange: function() {
                    this.test = "foo";
                }
            });
            inst.changeTo(-1);
            assert.isUndefined( inst.test );
        });

        it('should NOT run method if slide number is greater than length of slides', function () {
            document.body.innerHTML = template.default;
            var inst = $('#carousel').carousel({
                startAfter: -1,
                onChange: function() {
                    this.test = "foo";
                }
            });
            inst.changeTo(3);
            assert.isUndefined( inst.test );
        });

        it('should NOT run method if slide number matches currently active slide', function () {
            document.body.innerHTML = template.default;
            var inst = $('#carousel').carousel({
                startAfter: -1,
                onChange: function() {
                    this.test = "foo";
                }
            });
            inst.changeTo(1);
            assert.isUndefined( inst.test );
        });

        it('should remove active attributes from the old and add them to the new', function () {
            document.body.innerHTML = template.default;
            var inst = $('#carousel').carousel({startAfter: -1});
            assert.isTrue( $(inst.slides[1][0]).hasClass('is-active') );
            assert.isTrue( !$(inst.slides[2][0]).hasClass('is-active') );
            assert.isTrue( $(inst.slides[1][1]).attr('aria-selected') === 'true' );
            assert.isTrue( $(inst.slides[2][1]).attr('aria-selected') === 'false' );
            inst.changeTo(2);
            assert.isTrue( $(inst.slides[2][0]).hasClass('is-active') );
            assert.isTrue( !$(inst.slides[1][0]).hasClass('is-active') );
            assert.isTrue( $(inst.slides[2][1]).attr('aria-selected') === 'true' );
            assert.isTrue( $(inst.slides[1][1]).attr('aria-selected') === 'false' );
        });

        it('should update next, active, and previous classes', function () {
            document.body.innerHTML = template.default;
            var inst = $('#carousel').carousel({startAfter: -1});
            assert.match(document.querySelectorAll('li')[0].className, /is-prev/ );
            assert.match(document.querySelectorAll('li')[1].className, /is-active/ );
            assert.match(document.querySelectorAll('li')[2].className, /is-next/ );
            inst.changeTo(2);
            assert.match(document.querySelectorAll('li')[0].className, /is-next/ );
            assert.match(document.querySelectorAll('li')[1].className, /is-prev/ );
            assert.match(document.querySelectorAll('li')[2].className, /is-active/ );
        });

        it('should update aria label on next and prev triggers', function () {
            document.body.innerHTML = template.default;
            var inst = $('#carousel').carousel({startAfter: -1});
            assert.match( inst.roles.next.attr('aria-label'), /Show slide 3 of 3/ );
            assert.match( inst.roles.prev.attr('aria-label'), /Show slide 1 of 3/ );
            inst.changeTo(2);
            assert.match( inst.roles.next.attr('aria-label'), /Show slide 1 of 3/ );
            assert.match( inst.roles.prev.attr('aria-label'), /Show slide 2 of 3/ );
        });

        it('should update attributes on the nav element', function () {
            document.body.innerHTML = template.default;
            var inst = $('#carousel').carousel({startAfter: -1});
            assert.match( inst.roles.nav.attr('aria-labelledby'), /carousel-indicator-1/ );
            assert.match( inst.roles.nav.attr('aria-activedescendant'), /carousel-indicator-1/ );
            inst.changeTo(2);
            assert.match( inst.roles.nav.attr('aria-labelledby'), /carousel-indicator-2/ );
            assert.match( inst.roles.nav.attr('aria-activedescendant'), /carousel-indicator-2/ );
        });

        it('should run callback function from parameter', function () {
            document.body.innerHTML = template.default;
            var inst = $('#carousel').carousel({startAfter: -1});
            inst.changeTo( 2, function(){
                this.test = "foo";
            });
            assert.match( inst.test, /foo/ );
        });

    });

    describe('next()', function () {

        it('should move the next, active, and previous classes forward one', function () {
            document.body.innerHTML = template.default;
            var inst = $('#carousel').carousel({startAfter: -1});
            assert.match(document.querySelectorAll('li')[0].className, /is-prev/ );
            assert.match(document.querySelectorAll('li')[1].className, /is-active/ );
            assert.match(document.querySelectorAll('li')[2].className, /is-next/ );
            inst.next();
            assert.match(document.querySelectorAll('li')[0].className, /is-next/ );
            assert.match(document.querySelectorAll('li')[1].className, /is-prev/ );
            assert.match(document.querySelectorAll('li')[2].className, /is-active/ );
        });

        it('should run callback function from parameter', function () {
            document.body.innerHTML = template.default;
            var inst = $('#carousel').carousel({startAfter: -1});
            inst.next( function(){
                this.test = "foo";
            });
            assert.match( inst.test, /foo/ );
        });

    });

    describe('prev()', function () {

        it('should move the next, active, and previous classes back one', function () {
            document.body.innerHTML = template.default;
            var inst = $('#carousel').carousel({startAfter: -1});
            assert.match(document.querySelectorAll('li')[0].className, /is-prev/ );
            assert.match(document.querySelectorAll('li')[1].className, /is-active/ );
            assert.match(document.querySelectorAll('li')[2].className, /is-next/ );
            inst.prev();
            assert.match(document.querySelectorAll('li')[0].className, /is-active/ );
            assert.match(document.querySelectorAll('li')[1].className, /is-next/ );
            assert.match(document.querySelectorAll('li')[2].className, /is-prev/ );
        });

        it('should run callback function from parameter', function () {
            document.body.innerHTML = template.default;
            var inst = $('#carousel').carousel({startAfter: -1});
            inst.prev( function(){
                this.test = "foo";
            });
            assert.match( inst.test, /foo/ );
        });

    });

    describe('start()', function () {

        it('should save interval timer to attribute', function () {
            document.body.innerHTML = template.default;
            var inst = $('#carousel').carousel({startAfter: -1});
            inst.start();
            assert.isObject( inst.intervalTimer );
        });

        it('should run callback function from parameter', function () {
            document.body.innerHTML = template.default;
            var inst = $('#carousel').carousel({startAfter: -1});
            inst.start( function(){
                this.test = "foo";
            });
            assert.match( inst.test, /foo/ );
        });

    });

    describe('stop()', function () {

        it('should remove interval timer from attribute', function () {
            document.body.innerHTML = template.default;
            var inst = $('#carousel').carousel();
            inst.stop();
            assert.isUndefined( inst.intervalTimer );
        });

        it('should run callback function from parameter', function () {
            document.body.innerHTML = template.default;
            var inst = $('#carousel').carousel();
            inst.stop( function(){
                this.test = "foo";
            });
            assert.match( inst.test, /foo/ );
        });

    });

    describe('reset()', function () {

        it('should run callback function from parameter', function () {
            document.body.innerHTML = template.default;
            var inst = $('#carousel').carousel();
            inst.reset( function(){
                this.test = "foo";
            });
            assert.match( inst.test, /foo/ );
        });

    });

    describe('nextSlide()', function () {

        it('should get the number of the next slide relative to the active slide', function () {
            document.body.innerHTML = template.default;
            var inst = $('#carousel').carousel({startAfter:-1});
            assert.strictEqual( inst.nextSlide(), 2 );
        });

    });

    describe('prevSlide()', function () {

        it('should get the number of the next slide relative to the active slide', function () {
            document.body.innerHTML = template.default;
            var inst = $('#carousel').carousel({startAfter:-1});
            assert.strictEqual( inst.prevSlide(), 0 );
        });

    });

    describe('isRunning()', function () {

        it('should return true if the carousel is running', function () {
            document.body.innerHTML = template.default;
            var inst = $('#carousel').carousel().start();
            assert.isTrue( inst.isRunning() );
        });

        it('should return false if the carousel is NOT running', function () {
            document.body.innerHTML = template.default;
            var inst = $('#carousel').carousel({startAfter:-1});
            assert.isFalse( inst.isRunning() );
        });

    });

});
