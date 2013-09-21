// this lives within the #map-canvas id

App.MapView = Ember.View.extend({
	// create a map once the view is loaded
	// centres on marker that is stored/persists in the model
	didInsertElement: function() {
		var controller = this.get("controller");
		var placeCentre = controller.getCentre();
		var placeTitle = controller.getTitle();

		var mapCanvas = document.getElementById("map-canvas");
			// view therefore relies on this element
			// ideally this would be independent of DOM, but google maps is finicky
		var mapOptions = {
	    center: placeCentre,
	    zoom: 16,
	    mapTypeId: google.maps.MapTypeId.ROADMAP,
		};

	  var map = new google.maps.Map(mapCanvas, mapOptions);

		// create a draggable marker (yay, interaction!)
	  var marker = new google.maps.Marker({
	  	position: placeCentre,
	  	map: map,
	  	draggable: true,
	  	title: placeTitle,
	  	animation: google.maps.Animation.DROP
	  });
	  
	  // Set up search box
		var input = /** @type {HTMLInputElement} */(document.getElementById('target'));
	  var searchBox = new google.maps.places.SearchBox(input);

		var that = this; // fix scope for google event listeners

	  google.maps.event.addListener(searchBox, 'places_changed', function() {
	  	// Get places array from searchBox, use first result
	    var places = searchBox.getPlaces();
	    var firstResult = places[0];
	    var newTitle = firstResult.name;
	    var newPos = firstResult.geometry.location;

	    // Recentre map
	    map.setCenter(newPos);

	    // Update controller and marker
	    controller.markerMoved(marker, newPos, newTitle);
	  });

		// Update controller when marker reaches new position
	  google.maps.event.addListener(marker, "dragend", function() {
	  	var newTitle = "User defined point";

	  	controller.markerMoved(this, this.position, newTitle);
			controller.updateSearch(''); // empty search box
		});

		google.maps.event.addListener(map, 'zoom_changed', function(){
			var zoomLevel = map.getZoom();
			// todo: set searchRadius based on zoom level
		});

	  google.maps.event.addListener(marker, 'click', function(event){
	  	controller.markerMoved(this, this.position, this.title);
	  	controller.transitionToRoute('photos');
		});

	  google.maps.event.addListener(map, 'bounds_changed', function() {
	  	// When the view changes, tell the searchBox -where- it should be searching
	    var bounds = map.getBounds(); //map = this
	    searchBox.setBounds(bounds);
	  });
	}

});