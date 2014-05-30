angular.module('starter.services', [])
	
.factory('Clients', function() {
	
	//localStorage.setItem('clients', []);
	//localStorage.clear();

	var clients = [];
	var clientsStore = localStorage.getItem('clients');
	if (clientsStore != null && clientsStore != '' && angular.isArray(angular.fromJson(clientsStore))) {
		clients = angular.fromJson(clientsStore);
	}
	var clientsSrv = {
		setClients: function (newList) {
			clients = newList;
			localStorage.setItem('clients', angular.toJson(clients));
			return true;
		},
		getClients: function () {
			if (clients != null) {
				return clients;
			} else {
				return [];
			}
		},
		getClient: function (clientId) {
			var findItem = function (el) {
				return (el.id == clientId);
			};
			var found = clients.filter(findItem);
			return found[0];
		}
	};
	return clientsSrv;

})

.factory('Tracks', function () {
	var tracks = {};
	var tracksSrv = {
		getTracks: function (clientId) {
			
		},
		addTrack: function (clientId, track) {

		},
		getAll: function () {

		},
		pushCoord: function (trackId, coord) {
			travels.trackId.coords.push(coord);
			localstorage.setItem('track_' + trackId, angular.toJson(travels.trackId));
		}

	}

	return travelsSrv;

});

//Track structure
	//{
	//	id: guid,
	//	clientId: guid,
	//	startTime: datatime,
	//	coords: []
	//}