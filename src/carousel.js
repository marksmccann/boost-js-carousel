/**
 * Boost JS Carousel
 * A style-free carousel plugin for jQuery and Boost JS
 * @author Mark McCann (www.markmccann.me)
 * @license MIT
 * @version 0.2.0
 * @requires jQuery, boost-js
 */

(function(){

    /**
     * generates a random 4 character string
     * @return {string} random
     */
    function uniqueId() {
        return ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4);
    }

    var Carousel = function() {
        var inst = this;
        // attribute to store timer id
        inst.intervalTimer;
        // attribute to store active slide index
        inst.activeSlide = inst.settings.startOnSlide;
        // generate new id for carousel if one doesn't exist
        if( !inst.id ) inst.id = 'carousel-'+ uniqueId();
        // slides sorted by index and if active class present
        // store the index as the active slide
        inst.slides = [];
        inst.source.children().each(function(i){
            // add attributes to each slide and add to array
            inst.slides.push( $(this)
                .attr('role','tabpanel')
                .attr('id', (this.id===''?inst.id+'-slide-'+i:this.id))
            );
            // update active slide index if class exists
            if( $(this).hasClass( inst.settings.activeClass ) ) {
                inst.activeSlide = i;
            }
        });
        // add attributes and events to 'next' trigger(s)
        if( inst.roles.hasOwnProperty('next') ) {
            inst.roles.next
                .attr('role', 'button')
                .attr('aria-label', 'Show slide '+(this.nextSlide()+1)+' of '+this.slides.length)
                .on( 'click', function(e){
                    e.preventDefault(); inst.next();
                });
        }
        // add attributes and events to 'previous' trigger(s)
        if( inst.roles.hasOwnProperty('prev') ) {
            inst.roles.prev
                .attr('role', 'button')
                .attr('aria-label', 'Show slide '+(this.prevSlide()+1)+' of '+this.slides.length)
                .on( 'click', function(e){
                    e.preventDefault(); inst.prev();
                });
        }
        // add attributes and events to the 'nav' list
        if( inst.roles.hasOwnProperty('nav') ) {
            inst.roles.nav
                .attr('role','tablist')
                .attr('tabindex', '0')
                .on('keydown', function(e){
                    // up arrow or right arrow
                    if(e.keyCode === 38 || e.keyCode === 39) inst.next();
                    // down arrow or left arrow
                    if(e.keyCode === 40 || e.keyCode === 37) inst.prev();
                })
                .children().each(function(i){
                    $(this)
                        .attr('tabindex', '-1')
                        .attr('role', 'tab')
                        .attr('aria-selected', 'false')
                        .attr('id', (this.id===''?inst.id+'-indicator-'+i:this.id))
                        .attr('aria-labelledby', inst.slides[i][0].id)
                        .attr('aria-controls', inst.slides[i][0].id)
                        .on( 'click', function( e ){
                            e.preventDefault();
                            inst.changeTo( i );
                        });
                    inst.slides[i] = inst.slides[i].add(this);
                });
            inst.roles.nav
                .attr('aria-labelledby', inst.slides[ inst.activeSlide ][1].id )
                .attr('aria-activedescendant', inst.slides[ inst.activeSlide ][1].id );
        }
        // update active classes and attributes for load state
        inst.slides[ inst.activeSlide ]
            .addClass( inst.settings.activeClass )
            .each(function(i){ if(i>0) $(this).attr('aria-selected', 'true'); });
        inst.slides[ inst.prevSlide() ].addClass( inst.settings.prevClass );
        inst.slides[ inst.nextSlide() ].addClass( inst.settings.nextClass );
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
                inst.slides[ inst.activeSlide ]
                    .removeClass( inst.settings.activeClass )
                    .each(function(i){ if(i>0) $(this).attr('aria-selected', 'false'); });
                inst.slides[ inst.nextSlide() ].removeClass( inst.settings.nextClass );
                // update active slide
                inst.activeSlide = slideNum;
                // add classes to new previous, active, and next;
                inst.slides[ inst.prevSlide() ].addClass( inst.settings.prevClass );
                inst.slides[ inst.activeSlide ]
                    .addClass( inst.settings.activeClass )
                    .each(function(i){ if(i>0) $(this).attr('aria-selected', 'true'); });
                inst.slides[ inst.nextSlide() ].addClass( inst.settings.nextClass );
                // update attributes
                if( inst.roles.hasOwnProperty('next') ) {
                    inst.roles.next.attr('aria-label', 'Show slide '+(this.nextSlide()+1)+' of '+this.slides.length)
                }
                if( inst.roles.hasOwnProperty('prev') ) {
                    inst.roles.prev.attr('aria-label', 'Show slide '+(this.prevSlide()+1)+' of '+this.slides.length)
                }
                if( inst.roles.hasOwnProperty('nav') ) {
                    inst.roles.nav
                        .attr('aria-labelledby', inst.slides[ inst.activeSlide ][1].id )
                        .attr('aria-activedescendant', inst.slides[ inst.activeSlide ][1].id );
                }
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
