angular.module('starter.controllers', ['ngStorage'])

.controller('TravelsCtrl', ['$scope',
	function ($scope) {
}])

.controller('ClientsCtrl', ['Clients', '$state', '$scope', '$ionicModal',
function (Clients, $state, $scope, $ionicModal) {

	$scope.data = { showDelete: false };

	// Load the add / change dialog from the given template URL
	$ionicModal.fromTemplateUrl('templates/new-edit-dialog.html', function (modal) {
		$scope.addDialog = modal;
	}, {
		scope: $scope,
		animation: 'slide-in-up'
	});

	$scope.showNewEditDialog = function (action) {
		$scope.action = action;
		$scope.addDialog.show();
	};

	$scope.leaveNewEditDialog = function () {
		// Remove dialog 
		$scope.addDialog.remove();
		// Reload modal template to have cleared form
		$ionicModal.fromTemplateUrl('templates/new-edit-dialog.html', function (modal) {
			$scope.addDialog = modal;
		}, {
			scope: $scope,
			animation: 'slide-in-up'
		});
	};

	// Get list from storage
	$scope.clients = Clients.getClients();

	// Used to cache the empty form for Edit Dialog
	$scope.saveEmpty = function (form) {
		$scope.form = angular.copy(form);
	}

	$scope.addItem = function (form) {
		var newItem = {};
		// Add values from form to object
		newItem.name = form.description.$modelValue;
		newItem.id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) { var r = Math.random() * 16 | 0, v = c == 'x' ? r : r & 0x3 | 0x8; return v.toString(16); });;
		newItem.travels = [];
		// Save new list in scope and factory
		$scope.clients.push(newItem);
		Clients.setClients($scope.clients);
		// Close dialog
		$scope.leaveNewEditDialog();
	};

	$scope.removeItem = function (item) {
		// Search & Destroy item from list
		$scope.clients.splice($scope.clients.indexOf(item), 1);
		// Save list in factory
		Clients.setClients($scope.clients);
	}

	$scope.showEditItem = function (item) {
		// Remember edit item to change it later
		$scope.tmpEditItem = item;
		// Preset form values
		$scope.form.description.$setViewValue(item.name);
		// Open dialog
		$scope.showNewEditDialog('change');
	};

	$scope.editItem = function (form) {
		var item = $scope.tmpEditItem;
		item.name = form.description.$modelValue;

		var editIndex = Clients.getClients().indexOf($scope.tmpEditItem);
		$scope.clients[editIndex] = item;

		Clients.setClients($scope.clients);
		$scope.leaveNewEditDialog();
	};

	$scope.toggleEdit = function () {
		$scope.data.showDelete = !$scope.data.showDelete;
	};

	$scope.showDetails = function (id) {
		$state.transitionTo('tab.client', { clientId: id });
	};

	$scope.formNotValid = function (form) {
		return (form.description === undefined || form.description.$modelValue === undefined || form.description.$modelValue.length <= 0);
	}

	$scope.loadFromContacts = function (form) {
		window.plugins.ContactPicker.chooseContact(function (contactInfo) {
			var inputField = document.getElementById('inputClientName');
			inputField.value = contactInfo.displayName;
			inputField.triggerHandler('change');
		});
	};

}
])

.controller('ClientDetailCtrl',  function ($scope, $stateParams, Clients, $ionicModal) {

	$scope.client = Clients.getClient($stateParams.clientId);
	$scope.tracking = false;
	$scope.track = {};

		$scope.initMap = function initialize() {
			map = new google.maps.Map(document.getElementById('trackingMap'), { zoom: 15 });
			poly = new google.maps.Polyline({ strokeColor: '#FF0000', strokeOpacity: 1.0, strokeWeight: 2 });
			poly.setMap(map);
			// Try HTML5 geolocation
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function (position) {
					var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
					$scope.track.start = new Date();
					$scope.track.path = [];
					$scope.track.path.push(position);
					var bounds = new google.maps.LatLngBounds();
					map.setCenter(pos);
					$scope.watching = navigator.geolocation.watchPosition(function (position) {
						$scope.track.path.push(position);
						var path = poly.getPath();
						path.push(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
						for (var i = 0; i < path.length; i++) {
							bounds.extend(path[i]);
						}
						map.fitBounds(bounds);
					}, function (error) { console.log(error); });
				}, function () {
					alert('Error: The Geolocation service failed.')
				});
			}
		};

	// Load the tracking dialog
	$ionicModal.fromTemplateUrl('templates/trackingMap.html', function (modal) {
		$scope.mapDialog = modal;
	}, {
		scope: $scope,
		animation: 'slide-in-up'
	});

	$scope.showMapDialog = function () {
		$scope.mapDialog.show();
		$scope.initMap();
	};

	$scope.closeMapDialog = function () {
		if ($scope.watching != null) {
			navigator.geolocation.clearWatch($scope.watching);
			$scope.watching = null;
		}
		// Remove dialog 
		$scope.mapDialog.remove();
		console.log($scope.track);
		// Reload modal template to have cleared form
		$ionicModal.fromTemplateUrl('templates/trackingMap.html', function (modal) {
			$scope.mapDialog = modal;
		}, {
			scope: $scope,
			animation: 'slide-in-up'
		});
	};


	$scope.startTracking = function () {
		$scope.tracking = true;
	}

	$scope.stopTracking = function () {
		$scope.tracking = false;
		$scope.closeMapDialog();
	}
	//$scope.travels = Travels.getTravels($stateParams.clientId);
})

.controller('AboutCtrl', function($scope) {
})

.controller('SettingsCtrl', function ($scope, $localStorage) {
	$scope.settings = $localStorage.$default({units:'Km', useBadge:true});
});
