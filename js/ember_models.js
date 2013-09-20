///// Ember Models

// clean up attribute code
var attrStr = DS.attr('string');

App.Map = DS.Model.extend({
	// Contains placeTitle and placeCentre.
  // placeCentre is made up of latitude and longitude.
  placeTitle: attrStr,
  latitude: attrStr,
  longitude: attrStr,
	
	placeCentre: function(position) { 
	    return [this.get('latitude'), this.get('longitude')];
	  }.property('longitude', 'longitude'),

});

App.Photo = DS.Model.extend({
  flickrID: attrStr, // we have a flickrID and a record ID (implied)
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

