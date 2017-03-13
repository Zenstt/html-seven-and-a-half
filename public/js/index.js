"use strict";
// Array con la baraja una vez se cree
var baraja = [];
// Puntos internos del Jugador y la banca
var puntosJugador = 0;
var puntosBanca = 0;
// Racha de victorias seguidas
var racha = 0;
// Variable con el dinero de la apuesta
var apuesta = 0;
// Variable con el dinero del jugador al empezar
var dinero = 1000;
// Variable para mostrar cuanto ha ganado/perdido el jugador
var diferencia = 0;
// Variable donde se guardará el intervalo
var interval;

$(document).ready(function() {
	// Al cargar la página creará una nueva bajara
	crearBaraja();
	$("#pedir").click(function() {
		pedirCarta(true);
	});
	$("#plantarse").click(function() {
		plantarse();
	});
	$("#apostar").click(function() {
		apuesta = parseInt($("#select").val());
		dinero-=apuesta;
		if (dinero<0){
			dinero+=apuesta;
			alert('No tienes dinero para apostar');
		} else {
			diferencia-=apuesta;
			reiniciar();
			$("#apostar").attr('disabled', true);
			$("#money").html('Dinero: '+dinero+'€');
			pedirCarta(true)
		}
	});
});
/**
 * Funcion donde creará todas las cartas y las meterá en un array
 * A continuación usará la función barajar para que el orden de estas sea aleatorio
 */
function crearBaraja() {
	var palos = ['bastos', 'oros', 'copas', 'espadas'];
	baraja = [];
	for (let palo of palos) {
		for (let i = 1; i < 11; i++) {
			let carta = {
				palo: palo,
				valor: i,
				numero: i
			}
			// Si el numero de la carta es mayor que 7 (sota, caballo, rey), el valor será 0.5
			if (i > 7) {
				carta.valor = 0.5;
			}
			baraja.push(carta);
		}
	}
	barajar(baraja);
}
/**
 * Función que devuelve un array pasado como parámetro con orden aleatorio de sus elementos
 * @param  {Array} array Array de cartas ordenado para desordenar
 * @return {Array}       Array de cartas desordenado
 */
function barajar(array) {
	for (let i = 0; i < array.length; i++) {
		let j = Math.floor(Math.random() * i);
		let temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
	return array;
}
/**
 * Función que se encarga de darle una carta al jugador a la banca
 * @param  {Boleean} jugador Boleean que indica si la carta va dirigida al jugador o a la banca
 * @return {Function}         Función para comprobar si has perdido o has ganado (true o false)
 */
function pedirCarta(jugador) {
	if (baraja.length) {
		let number = Math.floor(Math.random() * baraja.length);
		let card = baraja[number];
		baraja.splice(number, 1);
		if (jugador) {
			puntosJugador += card.valor;
			$("#cartasJugador").append('<img src="img/'+card.numero+card.palo+'.jpg" >');
			$("#puntosJugador").html(puntosJugador);
			return comprobante(true);
		} else {
			puntosBanca += card.valor;
			$("#cartasBanca").append('<img src="img/'+card.numero+card.palo+'.jpg" >');
			$("#puntosBanca").html(puntosBanca);
			return comprobante(false);
		}
	} else {
		alert("No quedan mas cartas en la baraja, esto debería ser un error del código")
	}
}
/**
 * Función que se encarga de comprobar si puedes seguir sacando cartas o has perdido/ganado
 * @param  {Boolean} jugador Boolean para indicar si es el jugador o es la banca
 * @return {Boolean}         Boolean para indicar si el jugador/banca ha perdido
 */
function comprobante(jugador) {
	if (jugador) {
		if (puntosJugador > 7.5) {
			$("#resultado").html("<h1>Has perdido</h1><h3>Racha: "+racha+"</h3><h3>Llevas: "+diferencia+"€</h3>");
			$("#apostar").attr('disabled', false);
			racha = 0;
			$("#pedir").attr('disabled', true);
			$("#plantarse").attr('disabled', true);
			return true;
		}
	} else {
		if (puntosBanca > 7.5) {
			racha++;
			dinero+=apuesta*2;
			diferencia+=apuesta*2;
			$("#resultado").html("<h1>Has ganado</h1><h3>Racha: "+racha+"</h3><h3>Llevas: "+diferencia+"€</h3>");
			$("#apostar").attr('disabled', false);
			$("#money").html('Dinero: '+dinero+'€');
			return true;
		}
	}
	// En caso de que no se cumpla nada, devolverá false para poder continuar la partida
	return false;
}
/**
 * Función para indicar que el turno del jugador ha acabado y le toca a la máquina
 * Usa un intervalo donde la máquina sacará cartas hasta que iguale o supere (o pierda) la puntuación del jugador
 */
function plantarse() {
	$("#pedir").attr('disabled', true);
	$("#plantarse").attr('disabled', true);
	interval = setInterval(function() {
		// Si la banca pierde, se quita el intervalo y la función pedirCarta() se encarga de mostrar el resultado
		if (pedirCarta(false)) {
			clearInterval(interval);
			return;
		}
		// Si la banca supera o iguala al jugador, la banca gana y se quita la racha e intervalo
		if (puntosBanca >= puntosJugador) {
			$("#resultado").html("<h1>Has perdido</h1><h3>Racha: "+racha+"</h3><h3>Llevas: "+diferencia+"€</h3>");
			$("#apostar").attr('disabled', false);
			racha=0;
			clearInterval(interval);
		}
	}, 700)
}
/** Función que se encarga de devolver todo a sus valores originales */
function reiniciar() {
		puntosJugador = 0;
		puntosBanca = 0;
		$("#cartasJugador").html('');
		$("#cartasBanca").html('');
		$("#resultado").html('');
		$("#puntosBanca").html('');
		$("#puntosJugador").html('');
		crearBaraja();
		$("#pedir").attr('disabled', false);
		$("#plantarse").attr('disabled', false);
}