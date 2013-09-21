App.PhotosView = Ember.View.extend({
	// initiate a new search every time the view is loaded
	didInsertElement: function() {
		var controller = this.get('controller');
		controller.set('statusText','Looking for photos within 0.125km of your location...');
		controller.searchPhotosGeo(0.125); // takes searchRadius parameter
  }
});