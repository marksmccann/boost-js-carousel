/**
 * Boost JS Carousel
 * A style-free carousel plugin for jQuery and Boost JS
 * @author Mark McCann (www.markmccann.me)
 * @license MIT
 * @version 0.0.1
 * @requires jQuery, boost-js
 */

(function(){

    var Carousel = function() {
        var inst = this;
        // attribute to store timer id
        inst.intervalTimer;
        // attribute to store active slide index
        inst.activeSlide = inst.settings.startOnSlide;
        // slides sorted by index and if active class present
        // store the index as the active slide
        inst.slides = [];
        inst.source.children().each(function(i){
            inst.slides.push( $(this) );
            if( $(this).hasClass( inst.settings.activeClass ) ) {
                inst.activeSlide = i;
            }
        });
        // add an nav indicator elements to corresponding slide
        inst.roles.nav.each(function(){
            $(this).children().each(function(i){
                inst.slides[i] = inst.slides[i].add(this);
            });
        });
        // add active class to active slide and nav indicators
        inst.slides[ inst.activeSlide ].addClass( inst.settings.activeClass );
        // bind click event to triggers that go to next slide
        inst.roles.next.on( 'click', function(e){
            e.preventDefault(); inst.next();
        });
        // bind click event to triggers that go to previous slide
        inst.roles.prev.on( 'click', function(e){
            e.preventDefault(); inst.prev();
        });
        // bind click event to triggers that go to specific slide
        inst.roles.nav.children().each(function( i ){
            $(this).on( 'click', function( e ){
                e.preventDefault();
                inst.changeTo( i );
            });

        })
        // stop the carousel when hovering
        if( inst.settings.pauseOnHover ) {
            // stop carousel when mouse hovers over slider
            inst.source.on( "mouseenter", function(){ inst.stop(); });
            // restart carousel when mouse leaves slider
            inst.source.on( "mouseleave", function(){ inst.start(); });
        }
        
        // if slider is set to automatically run, start the slider
        if( inst.settings.startAfter > -1 ) {
            setTimeout( function(){
                inst.start();
            }, inst.settings.startAfter );
        }
    }

    Carousel.prototype = {
        /**
         * changes to a specific slide
         * @param {integer} slideNum slide number
         * @param {function} callback optional function
         * @return {object} instance
         */
        changeTo: function( slideNum, callback ) {
            // local instance
            var inst = this;
            // make sure slide number is 1) not negative 2) not greater than
            // array length 3) not the currently active slide
            if( slideNum >= 0 && slideNum < inst.slides.length && slideNum !== inst.activeSlide ) {
                // remove class from currently active slide to hide it
                inst.slides[ inst.activeSlide ].removeClass(inst.settings.activeClass);
                // add class to newly active slide to show it
                inst.slides[ slideNum ].addClass(inst.settings.activeClass);
                // reset active slide
                inst.activeSlide = slideNum;
                // reset interval
                if( inst.settings.resetInterval ) inst.reset();
                // run callbacks
                if( $.isFunction(callback) ) callback.call(inst);
                if( $.isFunction(inst.settings.onChange) ) inst.settings.onChange.call(inst);
            }
            // return instance
            return inst;
        },
        /**
         * changes to the next slide
         * @param {function} optional callback
         */
        next: function( callback ) {
            // if the last slide...
            var next = this.activeSlide === this.slides.length-1 ? 0 : this.activeSlide+1;
            // go to specified slide
            this.changeTo( next, callback );
            // return instance
            return this;
        },
        /**
         * changes to the previous slide
         * @param {function} optional callback
         */
        prev: function( callback ) {
            // if the first slide...
            var prev = this.activeSlide === 0 ? this.slides.length-1 : this.activeSlide-1;
            // go to specified slide
            this.changeTo( prev, callback );
            // return instance
            return this;
        },
        /**
         * starts the carousel
         * @param {function} optional callback
         */
        start: function( callback ) {
            // local instance
            var inst = this;
            // create interval to advance slide at given rate
            inst.intervalTimer = setInterval( function(){
                inst.next();
            }, inst.settings.intervalSpeed );
            // run callback
            if( $.isFunction(callback) ) callback.call(inst);
            // return instance
            return inst;
        },
        /**
         * stops the carousel
         * @param {function} optional callback
         */
        stop: function( callback ) {
            // end the interval
            clearTimeout( this.intervalTimer );
            // run callback
            if( $.isFunction(callback) ) callback.call(this);
            // return instance
            return this;
        },
        /**
         * resets the timer on the carousel
         * @param {function} optional callback
         */
        reset: function( callback ) {
            // stop and then restart the carousel
            return this.stop().start( callback );
        }
    }

    /*

    To Add:

    prevClass: 'was-active',
    nextClass: 'is-next',

    slideOrder = {
        '-1':
         '0':
        '+1':
    }

    */

    var plugin = {
        plugin: Carousel,
        defaults: {
            activeClass: 'is-active',
            intervalSpeed: 5000,
            startAfter: 0,
            startOnSlide: 0,
            pauseOnHover: true,
            resetInterval: true,
            onChange: null,
            onInit: null
        }
    }

    // if node, return via module.exports
    if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
        module.exports = plugin;
    // otherwise, save object to jquery globally
    } else if( typeof window !== 'undefined' && typeof window.$ !== 'undefined' && typeof window.$.fn.boost !== 'undefined' ) {
        window.$.fn.boost.carousel = plugin;
    }

})();
