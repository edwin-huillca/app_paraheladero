angular.module('app.controllers', [])

.controller('modalCtrl', function($scope, $ionicPopup) {
	$scope.showterm = function(){
		var terms = $ionicPopup.alert({
			title: 'Términos y condiciones',
			templateUrl: 'modterms.html',
			cssClass: 'modalspopup',
			buttons:[
				{
					text : 'Aceptar',
					type: 'button-positive'
				}
			]
		});
	}
})

.controller('homeCtrl', function($scope, $cordovaGeolocation, $ionicLoading, $cordovaDevice) {

	var watchOptions = {timeout : 30000, enableHighAccuracy: true};

	var watch = $cordovaGeolocation.watchPosition(watchOptions);

	var socket = io.connect('http://stag.chocolatesublime.pe:80');

	$scope.activate = function(obj){
		if($('#btnActivate').hasClass('active')){
			$('#btnActivate').removeClass('active');
			watch.clearWatch();
			socket.disconnect();
			$ionicLoading.hide();
		}else{
			$('#btnActivate').addClass('active');
			$ionicLoading.show({
	            template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location!'
	        });
			
			socket = io.connect('http://stag.chocolatesublime.pe:80', { 'forceNew': true });
			//socket.io.reconnect();

			watch = $cordovaGeolocation.watchPosition(watchOptions);

			watch.then(null, function(err) {
		    	$ionicLoading.hide();
		    	watch.clearWatch();
		    	$('#btnActivate').removeClass('active');
			     console.log(err);
			},
			function(position) {
			    var lat  = position.coords.latitude,
			    	long = position.coords.longitude,
			    	udid = $cordovaDevice.getUUID();

				var message = {
				    "lat": lat,
				    "long": long
				};

				//socket.on('connect', function(data) {  
				  socket.emit('new-message', message);
				  console.log(message);
				  $ionicLoading.hide();
				//});
			});

		    /*
			var posOptions = {enableHighAccuracy: true, timeout: 20000, maximumAge: 0};
		    $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
		        var lat  = position.coords.latitude,
		         	long = position.coords.longitude,
		         	udid = $cordovaDevice.getUUID();
		         
		        

				socket.on('allClients', function(data) {  
				  console.log(data);
				});

				var message = {
				    lat: lat,
				    long: long
				};

				socket.emit('new-message', message);

		        $ionicLoading.hide();           
		         
		    }, function(err) {
		        $ionicLoading.hide();
		        console.log(err);
		        alert('Debe activar el GPS del dispositivo');
		    });*/
		}
	}

})