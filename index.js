/* Initial 5 places with it's location and title */
var places = [{
	title: 'Talaat Harb',
	location: {
		lat: 30.080478,
		lng: 31.219939
	}
}, {
	title: 'Bibliotheca Alexandrina',
	location: {
		lat: 31.208874,
		lng: 29.909184
	}
}, {
	title: 'Luxor Temple',
	location: {
		lat: 25.699502,
		lng: 32.639051
	}
}, {
	title: 'Cairo Tower',
	location: {
		lat: 30.045915,
		lng: 31.224290
	}
}, {
	title: 'Baron Empain Palace',
	location: {
		lat: 30.086713,
		lng: 31.330259
	}
}, {
	title: 'Al-Hussein Mosque',
	location: {
		lat: 30.047414,
		lng: 31.262828
	}
}];

var Location = function(data) {
	this.title = data.title;
	this.location = data.location;
};

var ViewModel = function () {
    var self = this;
    this.locationList = ko.observableArray([]);
    this.filter = ko.observable();
    
    places.forEach(function(
		locationItem) {
		self.locationList.push(new Location(
			locationItem));
	});
    var largeInfoWindow = new google.maps
		.InfoWindow();
	var bounds = new google.maps.LatLngBounds();

	self.locationList().forEach(function(
		location) {
            var marker = new google.maps.Marker({
                map: map,
                position: location.location,
                title: location.title,
                animation: google.maps.Animation
                    .DROP
            });
        location.marker = marker;
        location.marker.addListener(
			'click',
			function() {
				populateInfoWindow(this,
					largeInfoWindow);
				toggleBounce(this);
			});

		bounds.extend(location.marker.position);

	});

	map.fitBounds(bounds);
this.filteredLocations = ko.computed(
		function() {
			var filter = self.filter();
			if (!self.filter()) {
				self.locationList().forEach(
					function(location) {
						location.marker.setMap(map);
					});
				return self.locationList();
			} else {
				return ko.utils.arrayFilter(self.locationList(),
					function(loc) {
						if (loc.title.toLowerCase().indexOf(
								filter.toLowerCase()) !== -1) {
							loc.marker.setMap(map);
						} else {
							loc.marker.setMap(null);
						}
						return loc.title.toLowerCase()
							.indexOf(filter.toLowerCase()) !==
							-1;
					});
			}
		}, self);
    function toggleBounce(marker) {
            if (marker.getAnimation() !== null) {
                marker.setAnimation(null);
            } else {
                for (var i = 0; i < self.locationList()
                    .length; i++) {
                    var mark = self.locationList()[i].marker;
                    if (mark.getAnimation() !== null) {
                        mark.setAnimation(null);
                    }
                }
                marker.setAnimation(google.maps.Animation
                    .BOUNCE);
            }
        }
    this.currentLocation = ko.observable(
		this.locationList()[0]);
    this.setLocation = function(
		clickedLocation) {
		toggleBounce(clickedLocation.marker);
		populateInfoWindow(clickedLocation.marker,
			largeInfoWindow);
		self.currentLocation(
			clickedLocation);
	};

};

var map;

function createMap(){
    map = new google.maps.Map(document.getElementById(
		'map'), {
		center: {
			lat: 30.044420,
			lng: 31.235712
		},
		zoom: 13
    });
    function calculateCenter() {
		center = map.getCenter();
	}
	google.maps.event.addDomListener(map,
		'idle',
		function() {
			calculateCenter();
		});
	google.maps.event.addDomListener(
		window, 'resize',
		function() {
			map.setCenter(center);
		});

	ko.applyBindings(new ViewModel());
}

function googleErrorHandler() {
	$('#mapError').html(
		'<h2>Failed To Retrieve Google Maps, Please Try again later</h2>'
	);
}

function populateInfoWindow(marker,
	infowindow) {
	if (infowindow.marker != marker) {
		infowindow.marker = marker;
        var wikiUrl =
			'https://en.wikipedia.org/w/api.php?action=opensearch&search=' +
			marker.title +
			'&format=json&callback=wikiCallback';

		var wikiRequestTimeout = setTimeout(
			function() {
				infowindow.setContent(
					"Failed To Get Wikipedia Resources"
				);
			}, 800);

		$.ajax({
			url: wikiUrl,
			dataType: 'jsonp'
		}).done(function(response) {
			var articleList = response[1];
			for (var i = 0; i < articleList.length; i++) {
				var articleStr = articleList[i];
				var url =
					'https://www.wikipedia.org/wiki/' +
					articleStr;
				infowindow.setContent('<div><h3>' +
					marker.title +
					'</h3><p>Wikipedia Info: <a href="' +
					url + '">' + articleStr +
					'</a></p></div>');
			}

			clearTimeout(wikiRequestTimeout);
		});

		infowindow.open(map, marker);

		infowindow.addListener('closeclick',
			function() {
				infowindow.close();
				marker.setAnimation(null);
			});
	}
}
