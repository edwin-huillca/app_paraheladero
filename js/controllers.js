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

.controller('homeCtrl', function($scope, $cordovaGeolocation, $ionicLoading, $cordovaDevice, $ionicPopup) {
	
	var watchOptions = {maximumAge: 0, timeout : 20000, enableHighAccuracy: true};

	var watch = $cordovaGeolocation.watchPosition(watchOptions);

	var socket = io.connect('https://www.chocolatesublime.pe:443');

	//alert('Al activar el botón Usted acepta que la aplicación puede usar las cordenadas de ubicación de su dispositivo móvil para poder ser encontrado por los clientes de Dnofrio.');

	var myPopup = $ionicPopup.show({
         template: '',
         title: 'Uso de la aplicación Heladero Dnofrio',
         subTitle: 'Al activar el botón Usted acepta que la aplicación puede usar las cordenadas de ubicación de su dispositivo móvil para poder ser encontrado por los clientes de Dnofrio.',
         buttons: [
            { 	text: 'Cancelar', 
            	type: 'button-negative', 
            	onTap: function(e) {
					ionic.Platform.exitApp();
                }
            }, {
               	text: '<b>Aceptar</b>',
               	type: 'button-positive'
            }
         ]
    });

	$scope.activate = function(obj){
		if($('#btnActivate').hasClass('active')){
			$('#btnActivate').removeClass('active');
			watch.clearWatch();
			socket.disconnect();
			$ionicLoading.hide();
		}else{
			$('#btnActivate').addClass('active');
			$ionicLoading.show({
	            template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Conectando...'
	        });
			
			socket = io.connect('https://www.chocolatesublime.pe:443', { 'forceNew': true });
			//socket.io.reconnect();

			watch = $cordovaGeolocation.watchPosition(watchOptions);

			watch.then(null, function(err) {
		    	$ionicLoading.hide();
		    	watch.clearWatch();
		    	$('#btnActivate').removeClass('active');
			     console.log(err);
			     alert('Debe activar el GPS de su dispositivo.');
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