'use strict'
svg4everybody({
  polyfill: true
});

function initMap() {
  var mapContainer = document.getElementById('google-map');

  if (mapContainer) {
    var map = new google.maps.Map(mapContainer, {
      center: {lat: 59.938907, lng: 30.323083},
      scrollwheel: false,
      zoom: 17,
      disableDefaultUI: true
    });

    var image = 'img/icon-map-pin.svg';
    var mishkaMarker = new google.maps.Marker({
      position: {lat: 59.938907, lng: 30.323083},
      map: map,
      icon: image
    });
  }
}

(function(){
  var mainNav = document.querySelector('.main-nav');
  var mainNavBtn = document.querySelector('.main-nav__btn');

  mainNav.classList.remove('main-nav--no-js');

  mainNavBtn.addEventListener('click', function(evt) {
    evt.preventDefault();

    if (mainNav.classList.contains('main-nav--opened')) {
      mainNav.classList.remove('main-nav--opened');
    } else {
      mainNav.classList.add('main-nav--opened');
    }
  });
})()
