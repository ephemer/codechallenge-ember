App.PhotosView = Ember.View.extend({
	didInsertElement: function() {
		this.get('controller').searchPhotosGeo();
		// todo: indicate that search is running
  }
});