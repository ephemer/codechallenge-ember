///// Ember Initialise
window.App = Ember.Application.create();

// TODO: -- Use localstorage to persist data --
App.LSAdapter = DS.LSAdapter.extend({
  namespace: 'codechallenge-emberjs'  // sets localstorage namespace
});
App.ApplicationAdapter = DS.LSAdapter;

// For now: use Fixtures instead of localstorage/JSON server to retrieve and store data
// App.ApplicationAdapter = DS.FixtureAdapter.extend();


///// Ember Routers
App.Router.map(function() {
    this.resource('map', { path: '/' });
		this.resource('photos');
    this.route('favourites');
});

///// Ember Routes

// todo: make map resource respond
/*App.IndexRoute = Ember.Route.extend({
  redirect: function() {
  	var currentPlace = this.get('place_name');
    this.transitionTo('map' currentPlace); // route map with argument currentPlace
  }
});*/

App.ApplicationRoute = Ember.Route.extend({
  init: function() {
    var store = this.get('store');
    store.push('map', { // todo: only push this when no saved data exists
      id: 0,
      placeTitle: "WayMate HQ",
      latitude: "52.529967",
      longitude: "13.40312199999994"
    });
  }
});

App.MapRoute = Ember.Route.extend({
	model: function() {
	// Return saved / default location.
    var store = this.get('store');
    return store.find('map', 0); // returns first value in map data store
    // need to specify a record id here
    // because MapController is an ObjectController
    // not an ArrayController (it deals with just one Object)
	}
});

App.PhotosRoute = Ember.Route.extend({
	model: function() {
    var store = this.get('store');
    return store.find('photo'); // Return photos in the store.
	}
});
