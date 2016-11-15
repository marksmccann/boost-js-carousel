Boost JS Carousel
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
<script src="https://cdn.rawgit.com/marksmccann/boost-js-carousel/master/dist/carousel.min.js"></script>
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
<button data-bind="#carousel" data-role="next">Next</button>
<button data-bind="#carousel" data-role="prev">Previous</button>
<ol data-bind="#carousel" data-role="nav">
    <li class="is-active"></li>
    <li></li>
    <li></li>
</ol>
```
*Note: `data-bind` is used to link the element to the instance, `data-role` is used to define the element's role in that instance. See [Boost JS](https://github.com/marksmccann/boost-js) for more details.*

### Instantiate Plugin
```javascript
$('#carousel').carousel();
```

Options
--------------------------------------
Name | Default | Description
--- | --- | ---
activeClass | `"is-open"` | the class added to handle and drawer when active
intervalSpeed | `5000` | time between slides in milliseconds
startAfter | `0` | interval before starting show, set to -1 to prevent start
startOnSlide | `0` | starts the slide show on this slide
pauseOnHover | `true` | stops the show while cursor hovers over source element
resetInterval | `true` | resets time between slides after a change
onChange | `null` | a callback function called when slides change
onInit | `null` | a callback function called when plugin is intialized
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
instance.slide; // [ $([0]:slide1,[1]:nav1), ... ]
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
