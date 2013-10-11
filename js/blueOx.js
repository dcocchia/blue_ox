$(document).ready(function() {

	var BlueOx = (function ($) {
		var blueOx = {}; //exported global var

		var Scroller = skrollr.init();

		//cache common values
		var $topMotto = $(".topTitle"),
			mottoHeight = $topMotto.css("line-height"),
			mottoHeight = mottoHeight.slice(0, mottoHeight.indexOf('px') - 1),
			mottoSelectedPos = 0,
			headerHeight = 480,
			windowWidth = $(window).width(),
			$nav = $("nav"),
			$selectedNav = $nav.find(".selected"),
			selectedNav = $selectedNav.attr("id"),
			$homeLink = $nav.find("#homeLink"),
			$valuesLink = $nav.find("#valuesLink"),
			$servicesLink = $nav.find("#servicesLink"),
			$contactLink = $nav.find("#contactLink");


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
					positions = [0, -70, -140, -210, -280],
					positionsLastRemoved,
					currentPos = $topMotto.css("margin-top");

				this.interval = setInterval(function() {
					positionsLastRemoved = [0, -70, -140, -210, -280];
					positionsLastRemoved.splice(positionsLastRemoved.indexOf(mottoSelectedPos), 1);
					randomPos = positionsLastRemoved[Math.floor(Math.random() * positionsLastRemoved.length)];
					$topMotto.css("margin-top", randomPos + "px");
					mottoSelectedPos = randomPos;
				},3000);
			},

			stopFlipping: function() {
				clearInterval(this.interval);
			}
		};

		blueOx.checkForNavChange = function($nav){
			var positionLimit = headerHeight,
			 	y = $(document).scrollTop(),
			 	headerPos = 0,
			 	valuesPos = 600,
			 	servicesPos = 3775,
			 	contactPos = 4775;

			 var clearNavSelected = function() {
			 	$selectedNav.removeClass("selected");
			 }

			if ( y >= positionLimit ) {
			    $nav.addClass("docked");
			} else {
			    $nav.removeClass("docked");
			}

			//update nav classes
			if (y < valuesPos && selectedNav !== 'homeLink') {
				selectedNav = 'homeLink';
				clearNavSelected();
				$selectedNav = $homeLink;
				$homeLink.addClass("selected");
			} else {
				if (y >= valuesPos && y < servicesPos && selectedNav !== "valuesLink") {
					selectedNav = 'valuesLink';
					clearNavSelected();
					$selectedNav = $valuesLink;
					$valuesLink.addClass("selected");
				} else {
					if (y >= servicesPos && y < contactPos && selectedNav !== "servicesLink") {
						selectedNav = 'servicesLink';
						clearNavSelected();
						$selectedNav = $servicesLink;
						$servicesLink.addClass("selected");
					} else {
						if (y >= contactPos && selectedNav !== "contactLink") { 
							selectedNav = 'contactLink';
							clearNavSelected();
							$selectedNav = $contactLink;
							$contactLink.addClass("selected");
						}
					}
				}
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