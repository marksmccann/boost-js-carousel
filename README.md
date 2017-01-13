Boost JS Carousel [![Build Status](https://travis-ci.org/marksmccann/boost-js-carousel.svg?branch=master)](https://travis-ci.org/marksmccann/boost-js-carousel)
==================================================
A style-free carousel plugin for jQuery and [Boost JS](https://github.com/marksmccann/boost-js). While other plugins style and arrange your carousel for you, this plugin only handles the functionality, leaving the layout and styling up to you.


Installation
--------------------------------------
Install with npm:
```bash
npm install boost-js-carousel
```
Install in browser:
```html
<script src="https://cdn.rawgit.com/marksmccann/boost-js-carousel/v0.2.0/dist/carousel.min.js"></script>
```

Usage
--------------------------------------

### Create Plugin
```javascript
var boost = require('boost-js');
// var boost = $.fn.boost; (browser install)

var carousel = require('boost-js-carousel');
// var carousel = $.fn.boost.carousel; (browser install)

$.fn.carousel = boost( carousel.plugin, carousel.defaults );
```

### Markup Structure
```html
<ol id="carousel">
    <li class="is-active">Slide 1</li>
    <li>Slide 2</li>
    <li>Slide 3</li>
</ol>
<a href="#carousel" data-role="next">Next</a>
<a href="#carousel" data-role="prev">Previous</a>
<ol data-bind="#carousel" data-role="nav">
    <li class="is-active"></li>
    <li></li>
    <li></li>
</ol>
```
*Note: `data-bind` and `href` are used to link the element to the instance, `data-role` is used to define the element's role in that instance. See [Boost JS](https://github.com/marksmccann/boost-js) for more details.*

### Instantiate Plugin
```javascript
$('#carousel').carousel();
```

Options
--------------------------------------
Name | Default | Description
--- | --- | ---
activeClass | `"is-active"` | the class added to slide and nav when active
nextClass | `"is-next"` | the class added to slide and nav when on deck
prevClass | `"is-prev"` | the class added to slide and nav when just active
intervalSpeed | `5000` | time between slides in milliseconds
startAfter | `0` | interval before starting show, set to -1 to prevent start
startOnSlide | `0` | starts the slide show on this slide
pauseOnHover | `true` | stops the show while cursor hovers over source element
resetInterval | `true` | resets time between slides after a change
onChange | `null` | a callback function called when slides change
onInit | `null` | a callback function called when plugin is initialized
### Usage
```javascript
$('#carousel').carousel({
	onInit: function() {
    	console.log( this.id ); // 'carousel'
    }
});
```
\- or -
```html
<div id="carousel" data-start-after="100">...</div>
```

API
--------------------------------------
### changeTo( slideNumber, callback )
Changes the carousel to the specified slide. Slide number starts with '0'. Optional `callback` function called after opening.
```javascript
instance.changeTo( 1, function(){
    console.log("The second slide is now active.");
});
```
### next( callback )
Moves the slider to the next slide. In the case it is the last slide, the show starts over.
```javascript
instance.next();
```
### prev( callback )
Moves the slider to the previous slide. In the case it is the first slide, it returns to the last slide.
```javascript
instance.prev();
```
### start( callback )
Starts the carousel; changing slides at the interval specified in the settings.
```javascript
instance.start();
```
### stop( callback )
Stops the carousel. It will no longer change slides automatically.
```javascript
instance.start();
```
### reset( callback )
Resets the timer for the interval to 0.
```javascript
instance.reset();
```
### isRunning( callback )
Returns boolean if carousel is running or not.
```javascript
instance.isRunning();
```
### nextSlide()
The number of the next slide relative to the active slide.
```javascript
instance.nextSlide();
```
### prevSlide()
The number of the previous slide relative to the active slide.
```javascript
instance.prevSlide();
```
### intervalTimer
The id of the interval timer being used for the slide show.
```javascript
instance.intervalTimer;
```
### activeSlide
The index/number of the slide active at any given point.
```javascript
instance.activeSlide;
```
### slides
An array of jquery objects organized by slide number. Navigation items are grouped with their respective slide.
```javascript
instance.slides; // [ $([0]:slide1,[1]:nav1), ... ]
```

Running Tests
--------------------------------------

```bash
$ npm install && npm test
```


License
--------------------------------------

Copyright © 2016, [Mark McCann](https://github.com/marksmccann).
Released under the [MIT license](LICENSE).
