/**
 * Easy plugin for creating imagebubbles with jQuery and Raphael
 * @author Erwin Goossen <info at navelpluisje dot nl>
 *
 */

//also check http://jsfiddle.net/Navelpluisje/DtagY/2/ for an example

(function($) {
	$.fn.npBubble = function( options ) {

		// extend the defaults with the options
		options = $.extend({}, $.fn.npBubble.defaults, options);
		var settings = {};


		// And now our actual logic
		this.each( function() {
			var $self = $( this );

			// Set and calculate some variables
			settings.radius     = ( options.width - options.borderWidth ) / 2;
			settings.xPos       = settings.radius + ( options.borderWidth / 2 );
			settings.yPosShadow = settings.radius * 1.06;
			settings.image      = $self.children('img').attr('src');
			settings.url        = $self.data('url');

			// First remove the image to avoid problems
			$self.children('img').remove();

			// Now we're going to create our paper
			var paper = Raphael($self.attr('id'), options.width, options.width + options.borderWidth);

			// Create our circles which will contain our image, The shadow first
			var shadow_circle = paper.circle(
				settings.xPos,
				settings.yPosShadow,
				settings.radius * 0.95
			);
			var shadow = shadow_circle.glow({ 'width': 35, 'fill': true });
			// Now that we have our blurry shadow we can remove the  shadow_circle
			shadow_circle.remove();

			// Create the image bubble
			var circle = paper.ellipse(
				settings.xPos,
				settings.xPos,
				settings.radius,
				settings.radius
			).attr({
				'fill': 'url(' + settings.image + ')',
				'stroke': '#ffffff',
				'stroke-width' : options.borderWidth
			});

			// Now all the painting is done we need to create some movement
			// Creat a nice hover effect
			circle.hover(
				function() {
					$self.move_shadow(true);
				}, function() {
					$self.move_shadow(false);
				}
			);

			// add the move_shadow function to the object
			$self.move_shadow = function( out ) {
				if ( out ) {
					shadow.forEach( function( obj ) {
						obj.animate(
							{'stroke-width': obj.attr('stroke-width') + 1},
							450,
							'ease');
					});
					circle.animate(
						{
							ry: circle.attr('ry') - 1,
							cy: circle.attr('cy') - 1
						},
						450,
						'bounce'
					);
				} else {
					shadow.forEach( function( obj ) {
						obj.animate(
							{'stroke-width': obj.attr('stroke-width') - 1},
							450,
							'ease');
					});
					circle.animate(
						{
							ry: circle.attr('ry') + 1,
							cy: circle.attr('cy') + 1
						},
						450,
						'bounce'
					);
				}
			};
		});
		// returns the jQuery object to allow for chainability.
		return this;
	};

		// private functions

	$.fn.npBubble.defaults = {
		'height'	: 300,
		'width'		: 300,
		'xPos'		: 3,
		'yPos'		: false,
		'radius'	: 155,
		'borderWidth' : 10
	};

})(jQuery);