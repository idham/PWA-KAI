// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.directives', 'ngAnimate', 'ngStorage', 'angularMoment', 'angular-input-stars', 'ion-datetime-picker', 'ionic-toast'])

.run(function($ionicPlatform, $ionicLoading) {
  $ionicPlatform.ready(function() {
    //window.ga.startTrackerWithId('UA-88649527-1', 30);

    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
 
  $stateProvider
  .state('welcome', {
    url: '/welcome',
    templateUrl: 'templates/welcome.html',
    controller: 'WelcomeCtrl'
  })
  .state('home', {
    url: '/home/:book_code',
    templateUrl: 'templates/home.html',
    controller: 'HomeCtrl'
  })
  .state('order-taxi', {
    url: '/order-taxi/:id_nota',
    templateUrl: 'templates/order-taxi.html',
    controller: 'OrderTaxiCtrl'
  })
  .state('order-porter', {
    url: '/order-porter/:id_nota',
    templateUrl: 'templates/order-porter.html',
    controller: 'OrderPorterCtrl'
  })
  .state('rate', {
    url: '/rate/:book_code',
    templateUrl: 'templates/rate.html',
    controller: 'RateCtrl',
    params: {
        data: null
    }
  });
 
  $urlRouterProvider.otherwise('/welcome');
 
});

