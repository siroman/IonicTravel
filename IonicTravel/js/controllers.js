angular.module('starter.controllers', [])

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
			console.log(contactInfo.displayName);
			console.log(form.description.$modelValue);
			form.description.$setViewValue(contactInfo.displayName);
		});
	};

}
])

.controller('ClientDetailCtrl', function($scope, $stateParams, Clients) {
	$scope.client = Clients.getClient($stateParams.clientId);
})

.controller('AboutCtrl', function($scope) {
});
