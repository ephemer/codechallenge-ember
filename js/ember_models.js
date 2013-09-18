///// Ember Models

// clean up attribute code
var attrStr = DS.attr('string');

///// Map (title and coordinates) Model:

App.Map = DS.Model.extend({
	// contains placeTitle and placeCentre. placeCentre is made up of lat and long.
  placeTitle: attrStr,
  latitude: attrStr,
  longitude: attrStr,
	
	placeCentre: function(position) { 
	    return [this.get('latitude'), this.get('longitude')];
	  }.property('longitude', 'longitude'),

});


///// Photo Model:

App.Photo = DS.Model.extend({
  flickrID: attrStr, // we have a flickrID and a record ID
  secret: attrStr,
  server: attrStr,
  farm: attrStr,
  title: attrStr,
	latitude: attrStr,
	longitude: attrStr,

	// make computed photo URL from selected model
	// from FlickR API:
	// http://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg
	url: function() {
    return (
    "http://farm" + this.get('farm') + "." +
    "staticflickr.com/" +
     this.get('server') + "/" +
     this.get('flickrID') + "_" + this.get('secret') + ".jpg"
     );
  }.property('farm', 'server', 'secret', 'flickrID') // if any of these change, update URL

});

