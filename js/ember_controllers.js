///// Ember Controllers

App.MapController = Ember.ObjectController.extend({
  getCentre: function() {
    // get placeCentre computed var from model
    var mapCentre = this.get('placeCentre');
    return new google.maps.LatLng(mapCentre[0], mapCentre[1]);
  },
  getTitle: function() {
    return this.get('placeTitle');  // comes from model
  },
  updateSearch: function(placeTitle){
    this.set('search', placeTitle);
  },
  markerMoved: function(marker, newPos, newTitle) {
    Ember.Logger.log('Called markerMoved, newPos = ' + newPos + '\nnewTitle = ' + newTitle);
    this.set('latitude', newPos.pb)
    this.set('longitude', newPos.qb)
    this.set('placeTitle', newTitle)
    marker.setTitle(newTitle);
    marker.setPosition(newPos);
    //this.get('store').commit();
  }
  
  //
})


App.PhotosController = Ember.ArrayController.extend({ // this is a class, an instance is created on runtime (?)
  needs: ['map'], // we need the map data to find photos in the area
  clearAllPhotos: function() {
/*  // maybe not important if photos can be replaced
    var store = this.get('store');
    store.find('photo').then(function(existingPhotos){
      existingPhotos.forEach(function(photo, index) {
        Ember.Logger.log('todo: delete existingPhotos');
        this.deletePhoto();
      });
    });*/
  },

  deletePhoto: function (){
    this.get('photo').deleteRecord();
    this.get('store').commit();
  },

  // the search could later not be a geo-based search, so use generic success function
  jsonFlickrApi: function (response) {
    if (response.stat != "ok"){
      // Something serious broke!
      Ember.Logger.log("You shouldn't get this far with a !ok response")
      return;
    }

    var store = this.get('store');
    var photos = new Ember.Set(response.photos.photo);    
    //var that = this;

    photos.forEach(function(photo, index) {
      // todo: remove old photos from store
      // and createRecord in their place
      // at the moment photo data doesn't persist

      var newPhoto = store.push('photo', {
        id: index,
        flickrID: photo.id,
        secret: photo.secret,
        server: photo.server,
        farm: photo.farm,
        title: photo.title,
        latitude: photo.latitude,
        longitude: photo.longitude,
      });
      // newPhoto.save(); // the save fails when ID is not unique, only works with createRecord
    });
  },

  searchPhotosGeo: function (location) {
    
    this.clearAllPhotos(); // todo: actually clear them

    var store = this.get('store');
    var that = this;

    // get map location from model before doing ajax call
    store.find('map',0).then(function(mapData){
      var myLatitude = mapData.get('latitude');
      var myLongitude = mapData.get('longitude');

      // todo: put ajax code into another function for clarity
      var flickrSearchAPI = 'http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=7affe0fdd71de61db8101929c5a0a6e9&format=json';

      Ember.Logger.log('starting ajax');
      $.ajax(flickrSearchAPI, {
        context: that,
        dataType: 'jsonp',
        jsonpCallback: 'jsonFlickrApi',
        data: {
          privacy_filter: 1,
          safe_search: 1,
          per_page: 10,
          extras: 'geo',
          radius: 0.5,
          lat: myLatitude,
          lon: myLongitude,
        },
        timeout: 6000,
        success: function (result){
          Ember.Logger.log('ajax success');
          this.jsonFlickrApi(result);
        },
        error: function(a,b,c) {
          Ember.Logger.log('Error: ' + c )
          return;
          // todo: more error handling here
        }
      }); // end ajax call
    }); // end .then()
  }
});