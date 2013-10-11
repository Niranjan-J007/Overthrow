(function(w, overthrow) {
	var rewind, disabledClassStr = " disabled", lib = overthrow.sidescroller;

	// NOTE not a general purpose add class, whitespace accounting done externally
	function addClass( element, classStr ) {
		element.setAttribute( "class", element.getAttribute( "class" ).replace( classStr, "" ));
		element.setAttribute( "class", element.getAttribute( "class" ) + classStr );
	}

	// NOTE not a general purpose remove class, whitespace accounting done externally
	function removeClass( element, classStr ) {
		element.setAttribute( "class", element.getAttribute( "class" ).replace( classStr, "" ));
	}

	function toggleNavigation( event ) {
		if( rewind ) {
			return;
		}

		var disablePrev = false, disableNext = false,
				active, slides, slidesWidth, currScroll, scrollWidth,
				target, nextAnchor, prevAnchor, thisScroll, rwdAnchor, ffAnchor;

		event = event || w.event;
		target = event.target || event.srcElement;

		nextAnchor = target.querySelector( "a.sidescroll-next" );
		prevAnchor = target.querySelector( "a.sidescroll-prev" );
		rwdAnchor = target.querySelector( "a.sidescroll-rwd" );
		ffAnchor = target.querySelector( "a.sidescroll-ff" );

		thisScroll = target.querySelector( ".overthrow" );

		// if this comes from a click or a snap use the active pages
		// calculation provided as an event property, otherwise use
		// the scroll calculation
		// NOTE the assignment is deliberate
		if( active = (event && event.overthrow && event.overthrow.active) ) {
			slides = thisScroll.querySelectorAll( "li" );

			disablePrev = (active[0] == 0);
			disableNext = (active[active.length - 1] >= slides.length - 1);
		} else {
			slidesWidth = thisScroll.offsetWidth,
			currScroll = thisScroll.scrollLeft,
			scrollWidth = thisScroll.scrollWidth - slidesWidth;

			disablePrev = currScroll < 5;
			disableNext = currScroll > scrollWidth - 5;
		}

		removeClass( nextAnchor, disabledClassStr );
		removeClass( prevAnchor, disabledClassStr );

		if( ffAnchor ) {
			removeClass( ffAnchor, disabledClassStr );
		}

		if( rwdAnchor ) {
			removeClass( rwdAnchor, disabledClassStr );
		}

		if( disablePrev ) {
			addClass( prevAnchor, disabledClassStr );

			if( rwdAnchor ) {
				addClass( rwdAnchor, disabledClassStr );
			}
		}

		if( disableNext ) {
			addClass( nextAnchor, disabledClassStr );

			if( ffAnchor ) {
				addClass( ffAnchor, disabledClassStr );
			}
		}
	}

	lib.onEvent( "overthrow-init", w.document.documentElement, function( event ) {
		var thisSideScroll = event.overthrow.sideScroll,
			options = event.overthrow.options || {}, rewind;

		// alert the toggle nav function that it should be disabled on rewind
		rewind = options.rewind;

		lib.onEvent( "overthrow-scroll", thisSideScroll, toggleNavigation);
		lib.onEvent( "overthrow-next", thisSideScroll, toggleNavigation);
		lib.onEvent( "overthrow-prev", thisSideScroll, toggleNavigation);
		lib.onEvent( "overthrow-refresh", thisSideScroll, toggleNavigation);
		lib.onEvent( "overthrow-resize", thisSideScroll, toggleNavigation);

		// toggle on init to account for a small number of initial elements
		// in fixed width scrollers
		toggleNavigation({ target: thisSideScroll });

		addClass(thisSideScroll.querySelector( "a.sidescroll-prev"), disabledClassStr );

		if( rewind = thisSideScroll.querySelector("a.sidescroll-rwd") ) {
			addClass( rewind, disabledClassStr );
		}
	});
})( this, this.overthrow );
