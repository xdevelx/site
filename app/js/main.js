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

    var image = 'img/icon-map-pin.svg';
    var mishkaMarker = new google.maps.Marker({
      position: {lat: 59.938907, lng: 30.323083},
      map: map,
      icon: image
    });
  }
}

(function(){
  var page = document.querySelector('.page');
  var mainNav = page.querySelector('.main-nav');
  var mainNavBtn = page.querySelector('.main-nav__btn');
  var modalOrder = page.querySelector('.modal');
  var modalOverlay = page.querySelector('.modal__overlay');
  var orderBtn = [].slice.call(page.querySelectorAll('[data-order]'));


  mainNav.classList.remove('main-nav--no-js');

  mainNavBtn.addEventListener('click', function(evt) {
    evt.preventDefault();

    if (mainNav.classList.contains('main-nav--opened')) {
      mainNav.classList.remove('main-nav--opened');
    } else {
      mainNav.classList.add('main-nav--opened');
    }
  });

  orderBtn.forEach(function(elem){
    elem.addEventListener('click', function(evt) {
      evt.preventDefault();
      modalOrder.classList.add('modal--opened');
      page.classList.add('page--fixed');
    });
  });

  if (modalOverlay) {
    modalOverlay.addEventListener('click', function(evt) {
      evt.preventDefault();
      modalOrder.classList.remove('modal--opened');
      page.classList.remove('page--fixed');
    });
  }
})()
