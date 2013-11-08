$(document).ready(function() {

	var BlueOx = (function ($) {

		//IE fix for indexOf :(
		if (!('indexOf' in Array.prototype)) {
		    Array.prototype.indexOf= function(find, i /*opt*/) {
		        if (i===undefined) i= 0;
		        if (i<0) i+= this.length;
		        if (i<0) i= 0;
		        for (var n= this.length; i<n; i++)
		            if (i in this && this[i]===find)
		                return i;
		        return -1;
		    };
		}

		var blueOx = {}; //exported global var

		//cache common values
		var windowWidth = $(window).width(),
			$topMotto = $(".topTitle"),
			mottoHeight = $topMotto.css("line-height"),
			mottoHeight = mottoHeight.slice(0, mottoHeight.indexOf('px') - 1),
			mottoSelectedPos = 0,
			headerHeight = (windowWidth > 500) ? 480 : 360,
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
					positions = (windowWidth > 500) ? [0, -70, -140, -210, -280] : [0, -35, -70, -105, -140],
					positionsLastRemoved,
					currentPos = $topMotto.css("margin-top");

				this.interval = setInterval(function() {
					positionsLastRemoved = (windowWidth > 500) ? [0, -70, -140, -210, -280] : [0, -35, -70, -105, -140];
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
			 	servicesPos = 3400,
			 	contactPos = 4195;

			if (windowWidth < 500) {
			 	valuesPos = 360,
			 	servicesPos = 2445,
			 	contactPos = 2900;
			}

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

		blueOx.instateClouds = function() {
			var screenWidth = $(window).width(),
				$cloudContainer = $(".clouds"),
				cloudWidth = 500,
				numOfLayers = 3,
				numOfClouds = Math.ceil((screenWidth / cloudWidth) * 3),
				thisCloud,
				cloudTop = (windowWidth > 500) ? 565 : 380,
				offset = (windowWidth > 500) ? -50 : -10,
				negOrPos;

				for (var i = 0; i <= numOfLayers; i += 1) {
					for (var j = 0; j <= numOfClouds; j += 1) {
						thisOffset = ((500 * j) + offset);
						thisCloud = $("<div class='cloud med drop skrollable' data-0='left:" + thisOffset + "px; display:block;' data-900='left:" + (thisOffset - ((i + 1) * 30) + 20) + "px;' style='top:" + cloudTop + "px; z-index:" + (i * 10) + "; left:" + thisOffset + "px;'></div>");

						// <img src="img/branch.png" class="treeBranch drop skrollable skrollable-after" data-1300="top:100%;display:block;" data-2000="top:-40%;display:none;" style="top: 0%;display:none;" />

						thisCloud.appendTo($cloudContainer);

						//get ranom offset between -300 and 300 for next cloud
						negOrPos = Math.round(Math.random()) * 2 - 1;
						offset = Math.floor((Math.random()*200)+1) * negOrPos;
					}

					//reset for next loop
					j = 0; 
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

			//scrollTo events
			$homeLink.click(function(e) {
				e.preventDefault();
				$.scrollTo( '#home', 800);
			});
			$valuesLink.click(function(e) {
				e.preventDefault();
				$.scrollTo( '#values', 800);
			});
			$servicesLink.click(function(e) {
				e.preventDefault();
				$.scrollTo( '#services', 800);
			});
			$contactLink.click(function(e) {
				e.preventDefault();
				$.scrollTo( '#contact', 800);
			});
		}

		blueOx.bindSubmit = function() {
			var that = this;
			$("#contactForm").find("#submitContactForm").click(function(e) {
				e.preventDefault();

				that.submitContactForm();
			});
		}

		blueOx.submitContactForm = function() {
			var $form = $("#contactForm"),
			$emailAddress = $form.find("#emailAddress").val(),
			$name = $form.find("#name").val(),
			$message = $form.find("#message").val(),
			$telephoneNumber = $form.find("#telephoneNumber").val(),
			settings = {
				type: "POST",
				data: {
					name: $name,
					emailAddress: $emailAddress,
					telephoneNumber: $telephoneNumber,
					message: $message
				},
				url: "inc/send_form_email.php",
				success: function( data ) { 
					var parsedData = JSON.parse(data);

					if (parsedData.success === "yes") {
						$form.html("<h2 class='contactFormSubmitTextHeader'>Thanks!</h2><div class='contactFormSubmitText'>" + parsedData.msg + "</div>");
					} else {
						//throw error
						$form.html("<h2 class='contactFormSubmitTextHeader'>Uh oh!</h2><div class='contactFormSubmitText'>" + parsedData.msg + "</div>");
					}

					console.log(parsedData); 
				},
				error: function( a,b,c ) { 
					console.warn("There was an error submitting the form: ", a,b,c);
					$form.html("<h2 class='contactFormSubmitTextHeader submitError'>Uh oh!</h2><div class='contactFormSubmitText submitError'>There was a problem submitting that form. Sorry about that! <br> You can email us directly at <a href='mailto:jason@blueoxcleaning.com'>Jason@BlueOxCleaning.com</a><span>We saved your message below, for your copy/paste pleasure</span><textarea>" +  $form.find("#message").val() + "</textarea></div>");
				}
			};

			if (this.verifyForm($form)) {
				$.ajax(settings);
			}
		}

		blueOx.verifyForm = function($form) {
			var $thingsToCheck = $form.find(".checkMe"),
				$emailAddress = $form.find("#emailAddress").val(),
				somethingNotDone = false,
				validateEmail = function(email) { 
					var re = /\S+@\S+\.\S+/; //very simply email validation. The server does a more intense validation after submit
					return re.test(email);
				};

			$thingsToCheck.each( function() {
				$this = $(this);
				if ($this.val() === "" || $this.val() === null || $this.val() === undefined) {
					$this.addClass('error');
					somethingNotDone = true;
				} else {
					$this.removeClass('error');
				}
			});

			if (!validateEmail($emailAddress)) {
				somethingNotDone = true;
				$form.find("#emailAddress").addClass('error');
			} else {
				$form.find("#emailAddress").removeClass('error');
			}

			return (!somethingNotDone);
		}

		blueOx.adjustBackgroundForMobile = function() {
			$buildingsFront = $(".buildingsFront"),
			$buildingsBack = $(".buildingsBack");

			$buildingsFront.attr("data-0", "position:fixed; bottom:-800px; left: -100px;display:initial");
			$buildingsFront.removeAttr('data-3000');
			$buildingsFront.attr("data-2140", "position:fixed; bottom:0px; left: -100px;display:initial");
			$buildingsFront.attr("data-2555", "position:fixed; bottom:0px; left: -100px; display:none");

			$buildingsBack.attr("data-0", "position:fixed; bottom:-800px; left: -100px;display:initial");
			$buildingsBack.removeAttr('data-3000');
			$buildingsBack.attr("data-2140", "position:fixed; bottom:0px; left: -100px;display:initial");
			$buildingsBack.attr("data-2555", "position:fixed; bottom:0px; left: -100px; display:none");

		}

		return blueOx; //export the BlueOx object and any function/vars inside it
	}(jQuery));

	window.BlueOx = BlueOx; //assign the BlueOx var to a global var
});

$(document).ready(function() {
	BlueOx.flipper.startFlipping();
	BlueOx.bindNavScrollEvents();
	BlueOx.instateClouds();
	BlueOx.bindSubmit();

	if ($(window).width() < 500) {
		BlueOx.adjustBackgroundForMobile();
	} else {
		var Scroller = skrollr.init();
	}

	
});