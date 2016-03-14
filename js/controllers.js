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
	var watchOptions = {maximumAge: 0, timeout : 20000, enableHighAccuracy: true}, watch, socket, first = true,
		myPopup = $ionicPopup.show({
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
			$ionicLoading.show({
	            template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Conectando...'
	        });
			
			if(first)
				socket = io.connect('https://www.chocolatesublime.pe:443');
			else
				socket = io.connect('https://www.chocolatesublime.pe:443', { 'forceNew': true });

			watch = $cordovaGeolocation.watchPosition(watchOptions);

			watch.then(null, function(err) {
		    	watch.clearWatch();
		    	socket.disconnect();
			    console.log(err);
			    $ionicLoading.hide();
		    	$('#btnActivate').removeClass('active');
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

				first = false;

			  	socket.emit('new-message', message);

			  	$('#btnActivate').addClass('active');

			  	$ionicLoading.hide();
			});
		}
	}

})