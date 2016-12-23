/**
 * Boost JS Carousel
 * A style-free carousel plugin for jQuery and Boost JS
 * @author Mark McCann (www.markmccann.me)
 * @license MIT
 * @version 0.1.0
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
        if( inst.roles.hasOwnProperty('nav') ) {
            inst.roles.nav.each(function(){
                $(this).children().each(function(i){
                    inst.slides[i] = inst.slides[i].add(this);
                });
            });
        }
        // add active class to active slide and nav indicators
        inst.slides[ inst.activeSlide ].addClass( inst.settings.activeClass );
        // add previous class to previous slide
        inst.slides[ inst.prevSlide() ].addClass( inst.settings.prevClass );
        // add next class to next slide
        inst.slides[ inst.nextSlide() ].addClass( inst.settings.nextClass );
        // bind click event to triggers that go to next slide
        if( inst.roles.hasOwnProperty('next') ) {
            inst.roles.next.on( 'click', function(e){
                e.preventDefault(); inst.next();
            });
        }
        // bind click event to triggers that go to previous slide
        if( inst.roles.hasOwnProperty('prev') ) {
            inst.roles.prev.on( 'click', function(e){
                e.preventDefault(); inst.prev();
            });
        }
        // bind click event to triggers that go to specific slide
        if( inst.roles.hasOwnProperty('nav') ) {
            inst.roles.nav.children().each(function( i ){
                $(this).on( 'click', function( e ){
                    e.preventDefault();
                    inst.changeTo( i );
                });
            });
        }
        // stop the carousel when hovering
        if( inst.settings.pauseOnHover ) {
            // stop carousel when mouse hovers over slider
            inst.source.on( "mouseenter", function(){
                if( inst.isRunning() ) inst.stop();
            });
            // restart carousel when mouse leaves slider
            inst.source.on( "mouseleave", function(){
                if( inst.isRunning() ) inst.start();
            });
        }
        // if slider is set to automatically run, start the slider
        if( inst.settings.startAfter > -1 ) {
            setTimeout( function(){
                inst.start();
            }, inst.settings.startAfter );
        }
        // run onInit callback if exists
        if( $.isFunction(inst.settings.onInit) ) inst.settings.onInit.call(inst);
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
                // remove classes from previous, active, and next;
                inst.slides[ inst.prevSlide() ].removeClass( inst.settings.prevClass );
                inst.slides[ inst.activeSlide ].removeClass( inst.settings.activeClass );
                inst.slides[ inst.nextSlide() ].removeClass( inst.settings.nextClass );
                // update active slide
                inst.activeSlide = slideNum;
                // add classes to new previous, active, and next;
                inst.slides[ inst.prevSlide() ].addClass( inst.settings.prevClass );
                inst.slides[ inst.activeSlide ].addClass( inst.settings.activeClass );
                inst.slides[ inst.nextSlide() ].addClass( inst.settings.nextClass );
                // reset interval if carousel is running
                if( inst.isRunning() && inst.settings.resetInterval ) inst.reset();
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
            // go to specified slide
            this.changeTo( this.nextSlide(), callback );
            // return instance
            return this;
        },
        /**
         * changes to the previous slide
         * @param {function} optional callback
         */
        prev: function( callback ) {
            // go to specified slide
            this.changeTo( this.prevSlide(), callback );
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
            // end the interval and reset attribute
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
        },
        /**
         * get the number of the next slide relative to the active slide
         * @return {integer} instance
         */
        nextSlide: function() {
            return this.activeSlide === this.slides.length-1 ? 0 : this.activeSlide+1;
        },
        /**
         * get the the number of the previous slide relative to the active slide
         * @return {integer} instance
         */
        prevSlide: function() {
            return this.activeSlide === 0 ? this.slides.length-1 : this.activeSlide-1;
        },
        /**
         * determines if the carousel is running or not
         * @return {boolean}
         */
        isRunning: function() {
            return typeof this.intervalTimer !== 'undefined'
        }
    }

    var plugin = {
        plugin: Carousel,
        defaults: {
            activeClass: 'is-active',
            prevClass: 'is-prev',
            nextClass: 'is-next',
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
