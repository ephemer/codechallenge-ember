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
    this.set('latitude', newPos.lat())
    this.set('longitude', newPos.lng())
    this.set('placeTitle', newTitle)
    marker.setTitle(newTitle);
    marker.setPosition(newPos);
    //this.get('store').commit();
  }
  
  //
})


App.PhotosController = Ember.ArrayController.extend({ // this is a class, an instance is created on runtime (?)
  needs: ['map'], // we need the map data to find photos in the area
  statusText: '',
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

  deletePhoto: function (store, id) {
    // store.deleteRecord('photo', id);
    // store.commit();
  },

  // the search could later not be a geo-based search, so use generic success function
  processPhotos: function (response, searchRadius, errorMsg) {
    if (response.stat == "timeout"){
      this.set('statusText', "Timeout - trying again");
      // run the same search as before
      this.searchPhotosGeo(searchRadius);
      return;
    } else if (response.stat != "ok") {
      this.set('statusText', errorMsg + ". Choose a different location and try again.")
      // give up
      return;
    }

    var store = this.get('store');
    var photos = new Ember.Set(response.photos.photo);    
    var that = this;

    if (photos.length < 10) {
      // there are not enough photos for this location
      this.set('statusText', "Not enough photos within " + searchRadius + "km, expanding search radius to " + (searchRadius * 4) + "km...");
      this.searchPhotosGeo(searchRadius * 4);
      // with the next line commented, partial results will be shown (with old photos below)
      // return;
    } else { // enough photos found in this location, show them
      this.set('statusText', '')
    }

    photos.forEach(function(photo, id) {
      // todo: remove old photos from store
      // and createRecord in their place
      // at the moment photo data doesn't persist

      // that.deletePhoto(store, id);

      var newPhoto = store.push('photo', {
        id: id,
        flickrID: photo.id,
        secret: photo.secret,
        server: photo.server,
        farm: photo.farm,
        title: photo.title,
        latitude: photo.latitude,
        longitude: photo.longitude,
      });
    }); // end forEach

  },

  searchPhotosGeo: function (searchRadius) {
    // this.clearAllPhotos(); // todo: actually clear them

    var store = this.get('store');
    var that = this;

    // get map location from model before doing ajax call
    store.find('map', 0).then(function(mapData){
      var myLatitude = mapData.get('latitude');
      var myLongitude = mapData.get('longitude');

      // todo: put ajax code into another function for clarity
      var flickrSearchAPI = 'http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=7affe0fdd71de61db8101929c5a0a6e9&format=json';

      $.ajax(flickrSearchAPI, {
        context: that,
        dataType: 'jsonp',
        jsonpCallback: 'jsonFlickrApi',
        data: {
          privacy_filter: 1,
          safe_search: 1,
          per_page: 10,
          extras: 'geo',
          radius: searchRadius,
          lat: myLatitude,
          lon: myLongitude,
        },
        timeout: 10000,
        success: function (result){
          that.set('statusText', 'Got result');
          that.processPhotos(result, searchRadius);
        },
        error: function(result,b,errorMsg) {
          that.set('statusText', 'Error:' + errorMsg);
          that.processPhotos(result, searchRadius, errorMsg);
          return;
        }
      }); // end ajax call
    }); // end .then()
  }
});