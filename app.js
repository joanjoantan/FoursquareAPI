angular.module('myApp',[]);

angular.module('myApp')
    .controller('locationController', ['$scope', '$http', locationController]);

function locationController($scope, $http) {
	
	$scope.search = function() {
    $scope.obj.state = 'isLoading';

    var clientID = "RD5SB3RECDUAHRHOABY13PFICSQDET203GHVWBFLGO35Q2DT";
    var clientSecret = "PO0TGWJGHT0AOGUF0OBDFDCYAUHAHT41AASKJZZBWYL0WK3R";

    $http.get("https://api.foursquare.com/v2/venues/explore/?near=" + $scope.obj.searchString + "&venuePhotos=1&client_id=" + clientID + "&client_secret=" + clientSecret + "&v=20170327")
      .then(function(result, status) {
        var items = result.data.response.groups[0].items;

        var help = [];
        for (var el in items) {
          var place = $scope.parseVenue(items[el]);
          help.push(place);
        }

        $scope.obj.state = 'loaded';
        $scope.venues = help;
		
      }, function(data, status) {
		  
        $scope.obj.state = 'noResult';
      });
  };
  
    $scope.parseVenue = function(data) {
	  var venue = data.venue;
	  var price = '£';
	
	  if (venue.price) {
		var value = venue.price.tier;
		while (value > 1) {
		  price += '£';
		  value--;
		}
	  } else {
		price = '';
	  }

  var rating = Math.round(venue.rating) / 2.0;
  var plus = [];
  var minus = [];
  for (var i in [0, 1, 2, 3, 4]) {
    if (rating > 0.5) {
      rating--;
      plus.push(i);
    } else {
      minus.push(i);
    }
  }

  return {
    title: venue.name,
    plus: plus,
    minus: minus,
    venueID: venue.id,
    picture_url: venue.photos.groups[0].items[0].prefix + '100x100' + venue.photos.groups[0].items[0].suffix,
    reviews: venue.ratingSignals + ' reviews',
    price: price,
    place: venue.location.formattedAddress[0] + ',' + venue.location.formattedAddress[1],
    category: venue.categories[0].name
  };
};

      

};