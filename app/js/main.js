'use strict'

function initMap() {
  var mapContainer = document.getElementById('google-map');

  if (mapContainer) {
    var map = new google.maps.Map(mapContainer, {
      center: {lat: 59.938907, lng: 30.323083},
      scrollwheel: false,
      zoom: 17,
      disableDefaultUI: true
    });

    var marker = new google.maps.Marker({
      position: {lat: 59.938907, lng: 30.323083},
      map: map,
      title: 'Mishka Shop'
    });
  }
}
