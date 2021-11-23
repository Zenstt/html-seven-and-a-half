"use strict";
// Array con la baraja una vez se cree
var deck = [];
// Puntos internos del Jugador y la banca
var playerPoints = 0;
var enemyPoints = 0;
// Racha de victorias seguidas
var streak = 0;
// Variable con el dinero de la apuesta
var bet = 0;
// Variable con el dinero del jugador al empezar
var money = 1000;
// Variable para mostrar cuanto ha ganado/perdido el jugador
var diff = 0;
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
		bet = parseInt($("#select").val());
		money-=bet;
		if (money<0){
			money+=bet;
			alert('You have no money to bet');
		} else {
			diff-=bet;
			reiniciar();
			$("#apostar").attr('disabled', true);
			$("#money").html('Money: '+money+'€');
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
	deck = [];
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
			deck.push(carta);
		}
	}
	barajar(deck);
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
	if (deck.length) {
		let number = Math.floor(Math.random() * deck.length);
		let card = deck[number];
		deck.splice(number, 1);
		if (jugador) {
			playerPoints += card.valor;
			$("#cartasJugador").append('<img src="img/'+card.numero+card.palo+'.jpg" >');
			$("#puntosJugador").html(playerPoints);
			return comprobante(true);
		} else {
			enemyPoints += card.valor;
			$("#cartasBanca").append('<img src="img/'+card.numero+card.palo+'.jpg" >');
			$("#puntosBanca").html(enemyPoints);
			return comprobante(false);
		}
	} else {
		alert("No more cards in the deck, this should be an error");
	}
}
/**
 * Función que se encarga de comprobar si puedes seguir sacando cartas o has perdido/ganado
 * @param  {Boolean} jugador Boolean para indicar si es el jugador o es la banca
 * @return {Boolean}         Boolean para indicar si el jugador/banca ha perdido
 */
function comprobante(jugador) {
	if (jugador) {
		if (playerPoints > 7.5) {
			$("#resultado").html("<h1>You lost</h1><h3>Streak: "+streak+"</h3><h3>You got: "+diff+"€</h3>");
			$("#apostar").attr('disabled', false);
			streak = 0;
			$("#pedir").attr('disabled', true);
			$("#plantarse").attr('disabled', true);
			return true;
		}
	} else {
		if (enemyPoints > 7.5) {
			streak++;
			money+=bet*2;
			diff+=bet*2;
			$("#resultado").html("<h1>You win</h1><h3>Streak: "+streak+"</h3><h3>You got: "+diff+"€</h3>");
			$("#apostar").attr('disabled', false);
			$("#money").html('Money: '+money+'€');
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
		if (enemyPoints >= playerPoints) {
			$("#resultado").html("<h1>You lost</h1><h3>Streak: "+streak+"</h3><h3>You got: "+diff+"€</h3>");
			$("#apostar").attr('disabled', false);
			streak=0;
			clearInterval(interval);
		}
	}, 700)
}
/** Función que se encarga de devolver todo a sus valores originales */
function reiniciar() {
		playerPoints = 0;
		enemyPoints = 0;
		$("#cartasJugador").html('');
		$("#cartasBanca").html('');
		$("#resultado").html('');
		$("#puntosBanca").html('');
		$("#puntosJugador").html('');
		crearBaraja();
		$("#pedir").attr('disabled', false);
		$("#plantarse").attr('disabled', false);
}