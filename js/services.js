angular.module('starter.services', [])

.factory('Booking', function($http) {
  var cachedData;
 
  function getData(book_code, callback) {
    var url='https://preorder.kai.id/api/cekBook/?kobook=',
        book_code = encodeURIComponent(book_code);
 
    $http.jsonp(url + book_code + '&callback=JSON_CALLBACK').success(function(data) {
 
      cachedData = data;
      callback(data);
    });
  }
 
  return {
    get: getData
  };
 
})

.factory('Taxi', function($http) {
  var cachedData;
 
  function setData(book_code, data, callback) {
    var url='https://preorder.kai.id/kapi/api/addTaxi2/?kobook=',
        book_code = encodeURIComponent(book_code),
        // pramia true untuk pramia
        pramia  = '&pramia=false',
        station = '&stasiun=' + data.station[0],
        pickup_time = '&pickup_time=' + moment(data.pickup_time).format('HHmm YYYYMMDD'),
        taxi = '&taxi=' + data.taxi,
        taxi_qty = '&taxi_qty=' + data.taxi_qty,
        name = '&name=' + encodeURIComponent(data.name),
        contact = '&contact=' + data.contact;
 
    $http.jsonp(url + book_code +  pramia + station + pickup_time + taxi + taxi_qty + name + contact + '&callback=JSON_CALLBACK').success(function(data) {
      cachedData = data;
      callback(data);
    });
  }
 
  return {
    set: setData
  };
 
})

.factory('Porter', function($http) {
  var cachedData;
 
  function setData(book_code, data, callback) {
    var url='https://preorder.kai.id/api/addPorter2/?kobook=',
        book_code = encodeURIComponent(book_code),
        // pramia true untuk pramia
        pramia  = '&pramia=false',
        station = '&stasiun=' + data.station[0],
        porter_qty = '&porter_qty=' + data.porter_qty,
        wagon = '&wagon=' + data.wagon,
        seat = '&seat=' + data.seat;
 
    $http.jsonp(url + book_code + pramia + station + porter_qty + wagon + seat + '&callback=JSON_CALLBACK').success(function(data) {
 
      cachedData = data;
      callback(data);
    });
  }
 
  return {
    set: setData
  };
 
})

.factory('Order', function($http) {
  var cachedData;
 
  function getData(book_code, callback) {
    var url='https://preorder.kai.id/kapi/api/listOrder/?kobook=',
        book_code = encodeURIComponent(book_code);
 
    $http.jsonp(url + book_code + '&callback=JSON_CALLBACK').success(function(data) {
      cachedData = data;
      callback(data);
    });
  }

  function getDetail(id_nota, type, callback) {
    var url='https://www.skywise.id/kapi/api/',
        type = (type === 'taxi') ? 'detailTaxi' : 'detailPorter',
        id_nota = '/?nota=' + id_nota;
 
    $http.jsonp(url + type + id_nota + '&callback=JSON_CALLBACK').success(function(data) {
      cachedData = data;
      callback(data);
    });
  }
 
  return {
    get: getData,
    getDetail: getDetail
  };
 
})

// create a new factory
.factory ('OrderStorage', function ($localStorage) {

  $localStorage = $localStorage.$default({
    KAIAccess: {
      "book_code": ""
    }
  });

  var _get = function () {
    return $localStorage.KAIAccess;
  };

  var _set = function (book_code) {
    $localStorage.KAIAccess['book_code'] = book_code;
  }

  var _reset = function () {
    $localStorage.KAIAccess['book_code'] = "";
  }

  return {
    get: _get,
    set: _set,
    reset: _reset
  };
})

.factory('Rate', function($http) {
  var cachedData;
 
  function setData(data, callback) {
    var url='https://preorder.kai.id/kapi/api/addRating/?id_nota=',
        id_nota = data.id_nota,
        rating = '&rating=' + data.rating,
        review = '&review=' + encodeURIComponent(data.review);
 
    $http.jsonp(url + id_nota + rating + review + '&callback=JSON_CALLBACK').success(function(data) {
      cachedData = data;
      callback(data);
    });
  }
 
  return {
    set: setData
  };
 
});
