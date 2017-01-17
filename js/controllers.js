angular.module('starter.controllers', [])

.controller('WelcomeCtrl', function($scope, $state, $timeout, OrderStorage) {
  // window.ga.trackView('Welcome Screen');

  var oStorage  = OrderStorage.get();

  // if (oStorage['book_code'] !== "") $state.go('rate', { book_code: oStorage['book_code'] });

  $scope.book_code = '';

  $scope.checkCode = function(book_code){
    $state.go('home', { book_code: book_code });
  }
})

.controller('HomeCtrl', function($scope, $state, $stateParams, $ionicPopup, $ionicModal, $ionicLoading, $ionicHistory, $timeout, Booking, Taxi, Porter, Order, OrderStorage, ionicToast) {

  $scope.isLoading = true;
  $scope.enableOrder = false;
  $scope.data = {};
  $scope.orders = [];

  function removeFirstArray(data){
    data.shift();
    return data;
  };

  $scope.doRefresh = function() {
    Booking.get($stateParams.book_code, function(data) {
      $scope.data = data;
      $scope.isLoading = false;

      console.log(data.pax_list);

      if($scope.data.err_code === 0){

        $scope.stationOptions = data.relation;
        //$scope.stationOptions = removeFirstArray($scope.data.relation);
        $scope.selectedStation = null;
        $scope.taxiOptions = data.taxi_option;

        if(data.des){
          var selected = $scope.stationOptions.filter(function( obj ) {
            return obj[0] ==  data.des.split(" ")[0]; 
          });

          $scope.selectedStation = selected[0];
        }

        $scope.taxi = {
          'book_code':  $stateParams.book_code,
          'station': $scope.selectedStation,
          'train_name': data.train_name,
          'train_no': data.train_no,
          'taxi': Object.keys($scope.taxiOptions[$scope.selectedStation[0]])[0],
          'taxi_qty': 1,
          'pickup_time': moment(data.arv_date + ' ' + data.arv_time, "DD-MMM-YYYY HHmm").toDate(),
          'name': data.pax_list[0][0],
          'contact': data.caller
        };
        $scope.porter = {
          'book_code': $stateParams.book_code,
          'station': $scope.selectedStation,
          'train_name': data.train_name,
          'train_no': data.train_no,
          'porter_qty': 1,
          'seat': data.pax_list[0][8],
          'wagon': data.pax_list[0][7]
        }

        $scope.orders = data.orders;

        $scope.enableOrder = moment($scope.taxi['pickup_time']).isBefore(moment());

        $scope.$watch('taxi.station', function(NewValue, OldValue) {
          $scope.taxi['pickup_time'] = moment(NewValue[2] + ' ' + NewValue[1], "DD-MMM-YYYY HHmm").toDate(),
          $scope.taxi['taxi'] = Object.keys($scope.taxiOptions[NewValue[0]])[0];
        }, true);
      }

      // Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    }, function(error){
      console.log(error);
    });
  };

  // window.ga.trackView('Home Screen');

  $ionicModal.fromTemplateUrl('templates/modal-taxi.html', {
    id: 'modalTaxi', // We need to use and ID to identify the modal that is firing the event!
    scope: $scope,
    backdropClickToClose: false,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.oModalTaxi = modal;
  });

  // Modal 2
  $ionicModal.fromTemplateUrl('templates/modal-porter.html', {
    id: 'modalPorter', // We need to use and ID to identify the modal that is firing the event!
    scope: $scope,
    backdropClickToClose: false,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.oModalPorter = modal;
  });

  $scope.openModal = function(index) {
    if (index == 1) $scope.oModalTaxi.show();
    else $scope.oModalPorter.show();
  };

  $scope.closeModal = function(index) {
    if (index == 1) $scope.oModalTaxi.hide();
    else $scope.oModalPorter.hide();
  };

  /* Listen for broadcasted messages */

  $scope.$on('modal.shown', function(event, modal) {
    console.log('Modal ' + modal.id + ' is shown!');
  });

  $scope.$on('modal.hidden', function(event, modal) {
    console.log('Modal ' + modal.id + ' is hidden!');
  });

  // Cleanup the modals when we're done with them (i.e: state change)
  // Angular will broadcast a $destroy event just before tearing down a scope 
  // and removing the scope from its parent.
  $scope.$on('$destroy', function() {
    $scope.oModalTaxi.remove();
    $scope.oModalPorter.remove();
  });

  $scope.reloadOrder = function(){
    $ionicLoading.show();
    Order.get($stateParams.book_code, function(data) {
      $scope.orders = data.order;
      $ionicLoading.hide();
    }, function(error){
      console.log(error);
    });
  }

  $scope.orderTaxi = function(){
    $ionicLoading.show();
    Taxi.set($stateParams.book_code, $scope.taxi, function(data) {
      console.log(data);
      if(data.status == 'ok'){
        var oStorage  = OrderStorage.get();
        if (oStorage['book_code'] !== $stateParams.book_code) OrderStorage.set($stateParams.book_code);
        ionicToast.show('Thank You, Your order has been received!', 'top', false, 2000);
        $scope.reloadOrder();
      }else{
        $ionicPopup.alert({
          title: 'Order Failed',
          template: 'Failed to order taxi, please try again'
        });
      }
      $scope.oModalTaxi.hide();
      $ionicLoading.hide();
    }, function(error){
      console.log(error);
    });
  }

  $scope.orderPorter = function(){
    $ionicLoading.show();
    Porter.set($stateParams.book_code, $scope.porter, function(data) {
      console.log(data);
      if(data.status == 'ok'){
        var oStorage  = OrderStorage.get();
        if (oStorage['book_code'] !== $stateParams.book_code) OrderStorage.set($stateParams.book_code);
        ionicToast.show('Thank You, Your order has been received!', 'top', false, 2000);
        $scope.reloadOrder();
      }else{
        $scope.oModalPorter.hide();
        $ionicPopup.alert({
          title: 'Order Failed',
          template: 'Failed to order porter, please try again'
        });
      }
      $scope.oModalPorter.hide();
      $ionicLoading.hide();
    }, function(error){
      console.log(error);
    });
  }

  $scope.doRefresh();
})

.controller('OrderTaxiCtrl', function($scope, $stateParams, $ionicHistory, Order, ionicToast) {

  $scope.order = {};

  $scope.doRefresh = function(){
    $scope.isLoading = true;
    Order.getDetail($stateParams.id_nota,'taxi', function(data) {
      $scope.isLoading = false;
      if(data.status == 'ok'){
        $scope.order = data;
      }else{
        ionicToast.show('Failed to get data, please try again', 'top', false, 2000);
        $scope.backHome();
      };
    }, function(error){
      console.log(error);
    });
  }

  $scope.backHome = function(){
    $ionicHistory.goBack();
  };

  $scope.doRefresh();
})

.controller('OrderPorterCtrl', function($scope, $stateParams, $ionicHistory, Order, ionicToast) {

  $scope.order = {};

  $scope.doRefresh = function(){
    $scope.isLoading = true;
    Order.getDetail($stateParams.id_nota,'porter', function(data) {
      $scope.isLoading = false;
      if(data.status == 'ok'){
        $scope.order = data;
      }else{
        ionicToast.show('Failed to get data, please try again', 'top', false, 2000);
        $scope.backHome();
      };
    }, function(error){
      console.log(error);
    });
  }

  $scope.backHome = function(){
    $ionicHistory.goBack();
  };

  $scope.doRefresh();
})

.controller('RateCtrl', function($scope, $state, $filter, $stateParams, $ionicPlatform, $ionicHistory, $ionicLoading, $timeout, Booking, Order, OrderStorage, Rate, ionicToast) {

  $scope.isLoading = true;
  $scope.data = {};
  $scope.orders = [];

  $ionicHistory.nextViewOptions({
      disableBack: true
  });

  Booking.get($stateParams.book_code, function(data) {
    $scope.data = data;
    $scope.orders = $filter('filter')(data.orders, { pramia: false, print: true, rating: 0 });
    console.log($scope.orders);
    if($scope.orders.length == 0) $scope.doneAll();
    $scope.isLoading = false;
  }, function(error){
    console.log(error);
  });

  $scope.doRate = function(order) {
    $ionicLoading.show();
    console.log(order);
    Rate.set(order, function(data) {
      $ionicLoading.hide();
      console.log(data);
      if(data.status == 'ok'){
        $scope.orders.splice( $scope.orders.indexOf(order), 1 );
        console.log($scope.orders.length);
        if($scope.orders.length == 0) $scope.doneAll();
        ionicToast.show('Rating successfully submitted!', 'top', false, 2000);
      }else{
        $ionicPopup.alert({
          title: 'Failed',
          template: 'Failed to rate/review, please try again'
        });
      }
    }, function(error){
      console.log(error);
    });
  };

  $scope.doneAll = function(){
    $scope.doneRate = true;
    $timeout(function() {
      OrderStorage.reset();
      $ionicLoading.hide();
      $state.go('welcome');
    }, 600);
  }

  var deregisterRate = $ionicPlatform.registerBackButtonAction(function() {
  }, 101 );

  $scope.$on('$destroy', deregisterRate);
});