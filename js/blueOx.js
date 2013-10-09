$(document).ready(function() {

	var BlueOx = (function ($) {
		var blueOx = {}; //exported global var

		var Scroller = skrollr.init();

		var $topMotto = $(".topTitle"),
			mottoHeight = $topMotto.css("line-height"),
			mottoHeight = mottoHeight.slice(0, mottoHeight.indexOf('px') - 1),
			headerHeight = 480,
			windowWidth = $(window).width(),
			$nav = $("nav");

		var typewatch = function(){ //use this function to delay a function that gets called many times but doesn't need to (like onWindowResize events)
			    var timer = 0;
			    return function(callback, ms){
			        clearTimeout (timer);
			        timer = setTimeout(callback, ms);
			    }  
			}();

		blueOx.flipper = {
			interval: "",
			startFlipping: function() {
				var randomPos,
					positions = [0, -70, -140, -210, -280];

				this.interval = setInterval(function() {
					randomPos = positions[Math.floor(Math.random() * positions.length)];
					$topMotto.css("margin-top", randomPos + "px");
				},3000);
			},

			stopFlipping: function() {
				clearInterval(this.interval);
			}
		};

		blueOx.checkForNavChange = function($nav){
			var positionLimit = headerHeight,
			 	y = $(document).scrollTop();

			if ( y >= positionLimit ) {
			    $nav.addClass("docked");
			} else {
			    $nav.removeClass("docked");
			}
		}

		blueOx.bindNavScrollEvents = function() {
			var that = this;
			if (window.addEventListener) {
				 window.addEventListener("orientationchange", function() { //if using a ios device, reset widths on orientation change 
					windowWidth = $(window).width();
					that.checkForNavChange($nav);
				}, false);
			}

			$(window).resize(function() {
				windowWidth = $(window).width();
				that.checkForNavChange($nav);
			});

			$(window).scroll(function() {
			    typewatch(function(){
					that.checkForNavChange($nav);
				}, 10 ); // wait 1/100 of a second to fire again (this actually saves a lot)
			});
		}

		return blueOx; //export the BlueOx object and any function/vars inside it
	}(jQuery));

	window.BlueOx = BlueOx; //assign the BlueOx var to a global var
});

$(document).ready(function() {
	BlueOx.flipper.startFlipping();
	BlueOx.bindNavScrollEvents();
});