const errorMessages = {
    "restart": "Por favor vuelva a cargar la pagina.",
    "101": "El valor ingresado no es admisible.",
    "algorithm": "Error en mi algoritmo, disculpe las molestias."
};

const g_maxSafeInt = 1000000000;

const g_input = +prompt( "Ingrese un número mayor a 1 y menor a " + g_maxSafeInt + "." );


const validInput = (n) => ( ( n !== "" ) && ( n !== NaN ) && ( n > 1 ) && ( n <= g_maxSafeInt ) );
     // Gracias a q esto se combierte de str a num no deberia ser suficiente con n !== NaN y no requerir isNaN y otros, no?.

// Prueba 1 a 1 si la división es perfecta y de serlo lo agrega una lista de posibles divisores demostrando q tal número no es primo.
// Tiene un step de 2 ya q la cantidad de veces q se necesite probar para pares o impares es distinta y así ahorrar bastantes pasos.
function missingDivs( testee, ini, end, step = 2 ) {
    let output = "";

    for ( let i = ini; i !== end; i += step )
        ( testee % i == 0 ) && ( output += `${i} ; ` );

    return output
};
    // WIP ? Ughhh.... ( output += `${i} ; ` ) tiene q concordar con addToDivs lo q hace q haya q mantener 2 formas de agregar divisores para respetar el mismo separador, formato, etc y si missingDivs llamase a addToDivs creo q le restaria muchisima velocidad. No tengo idea bien de como mejorar (para solo tener q definirlo en 1 lugar).


// Para unificar como agrego divisores o si a futuro quiero usar arrays o etc, modifico esta f y listo.
// La cree de esta manera pork pensaba usar distintos contenedores con divisores en general, pares, impares, etc. Sino afectaria directamente divs usandola como variable global.
// WIP Podría agregar un trim al final. Y mecanismo para agregar de más de a 1 valor a la lista a la vez. Aunque ya puede tomar varios valores si fueron combinados antes.
const addToDivs = ( str, newVal ) => str += `${newVal} ; `;
    // ? Originalmente queria q modifique el string q le envio y no q tenga q sobre escribir, pero parece ser q las strings en JS son inmutables así q estoy forzado a usar return, o estoy equivocado.
        // O sea buscaba pasar la referencia a una string y q sea modificada dentro de la funcion de la forma q lo definí.
    /*
        Si se fija la funcion deja ; ; vacios cuando la busqueda larga de divisores devuelve nada (missingDivs), o sea addToDivs no revisa si str y newVal no estan vacios y retorna la cadena con newVal como un espacio.
        Pero cuando intento re escribir la funcion de una de las siguientes maneras se me rompe todo ... , no veo mi error :

        const addToDivs = ( str, newVal ) => ( str && newVal ) ? str += `${newVal} ; ` : str ;

        function addToDivs ( str, newVal ) {
            if ( str && newVal ) {
                return ( str += `${newVal} ; ` )
            } else {
                return str
            };
        };

        Se q podria hacer el checkeo antes de llamar a addToDivs pero la gracia es q esta funcion valide estas cosas.
    */


// Para unificar como muestro los resultados, y luego cuando tenga q agregarlos a algun elemento de la web simplemente cambio aquí.
function printOutput( msg ) {
    console.log( msg );
    alert( msg );
};


// Aun no tengo idea como hacer tratamiento de errores, un compañero en la clase hablo de algo de try catch, pero por como es el algoritmo quiero tener algo para poder lidiar con errores.
// También seria necesario una forma de "reiniciar"
// Opts : Options seria un objeto con cosas extra q se le pasaria.
function errorsHandler( isFatal, id ) {
    isFatal ?
        alert( errorMessages[id] + "\n \n" + errorMessages["restart"] )
    :
        console.log( errorMessages[id] );
};


if ( validInput( g_input ) ) {
    let divs = "";
    // let divs = "", divs_even = "", divs_odd = "";
    let divs_minDivisor = 0, divs_maxDivisor = 0;

    // Primero q nada probar si es divisible por 2.
    if ( g_input % 2 == 0 ) {

        divs_minDivisor = 2;

    } else {
        // El minimo divisor de un número debe estar entre 2 y la raiz cuadrada del mismo.
        // Siguen una serie de cálculos para encontrar el divisor más grande y así acotar el ambito de la busqueda.
        let tmp = ( Math.trunc( Math.sqrt( g_input ) ) ) + 2;
            // WIP ? Hay forma de calcular solo la sqrt entera de un número? para q no gaste tiempo con los decimales. Tal vez para garantizar esto y remover trunc podria filtrar mejor g_input.
            // WIP ! En realidad si la raiz cuadrada ya da un número entero podría decir q el número no es primo.
                // Test Math.sqrt( g_input ) % 1
                    // Mejor aun ( Math.sqrt( g_input ) + "" ).includes(".")
                        // Crear variable para separador decimal ya sea . o ,
            // Le sumo 1 para q el for use < en  vez de <=
            // Le sumo 1 de nuevo para dar un margen de seguridad en caso q alguna raiz fuera .9999~ no se si es necesario. Use trunc en vez de round u otras porq me parecía q podia ser más rapido así.
            // WIP Refinar esto, el calculo de la raiz y su utilizacion en el for usando .floor o .ceiling o directamente usando la raiz con coma si fuera necesario ya q estoy agregando pasos extra "por las dudas".

        for ( let i = 3; i < tmp; i += 2 ) {
            if ( g_input % i == 0 ) {
                divs_minDivisor = i;
                break;
            };
        };
    };

    // Para obtener el máximo divisor basta con:
        // Siempre y cuando divs_minDivisor != 0
    if ( divs_minDivisor ) {
        divs = addToDivs( divs, divs_minDivisor );
        divs_maxDivisor = g_input / divs_minDivisor;
            // Como ya se sabe q div_minDivisor no produce resto divs_maxDivisor nunca sera un número con coma.
            // Se lo podría pensar como si ya se conociese el maxDivisor y lo dividiera por el número entonces obtendría el minDivisor, como encontrar el minDivisor probando es una tarea más corta y q opera números más pequeños hago el camino de ese modo.

        // Para este punto en relidad ya se podría tener una muy buena idea si el número es primo o no si div_minDivisor y divs_maxDivisor se mantubieron en 0.

        divs = addToDivs( divs, missingDivs(g_input, ( divs_minDivisor + 1 ), divs_maxDivisor, 1) );
            // el step tiene q ser de a 2 ya q el resto de los numeros primos son siempre impares
                // Me contesto a mi mismo, en este caso no, ya q busco los divisores por eso tengo q ir 1 a 1.
        divs = addToDivs( divs, divs_maxDivisor );
    }

    ( divs === "" ) ?
        printOutput( g_input + " es un número primo." )
    :
        printOutput( "El número " + g_input + " es divisible por: " + divs );

} else {
    errorsHandler( true, "101" );
};
// WIP Este if gigante q contiene todo por la validacion del input debe morir ... aun no me puse a pensar como.

// SOURCES
/*
    https://stackoverflow.com/questions/3545259/i-need-an-optimal-algorithm-to-find-the-largest-divisor-of-a-number-n-preferabl

    https://en.wikipedia.org/wiki/Generation_of_primes#Prime_sieves

    https://www.geeksforgeeks.org/sieve-of-eratosthenes/

    3Blue1Brown
        Why do prime numbers make these spirals? | Dirichlet’s theorem, pi approximations, and more
            https://www.youtube.com/watch?v=EK32jo7i5LQ

    Write Your Own Javascript Contracts and Docstrings
        https://dev.to/stephencweiss/write-your-own-javascript-contracts-and-docstrings-42ho

    How do I convert a float number to a whole number in JavaScript?
        https://stackoverflow.com/questions/596467/how-do-i-convert-a-float-number-to-a-whole-number-in-javascript

    ¿Como saber si un número es primo?
        https://www.wikiprimes.com/como-saber-si-un-numero-es-primo/
            "
                Tampoco, si nos fijamos cuando probamos en orden los números primos, los estamos descartando por orden, por lo tanto el siguiente primo a probar multiplicado por los anteriores no podrá obtener el número como resultado, por lo que como mínimo obtendremos el número con el siguiente primo a probar por el mismo, esto significa que la búsqueda termina con el primo que tenga el cuadrado más cercano al número sin superarlo, o lo que es lo mismo:
                    Para saber si un número es primo basta con probar si el número no es divisible por los primos hasta su raiz cuadrada.
            "

        JavaScript indexOf vs includes performance
            https://ryanpeden.com/javascript-indexof-vs-includes-performance/
            https://www.measurethat.net/Benchmarks/Show/4064/0/indexof-vs-includes-vs-lodash-includes

        5 ways to convert a number to string in JavaScript
            https://dev.to/sanchithasr/5-ways-to-convert-number-to-string-3fhd
                ? Las pruebas q hacen aquí creo q no concideran el largo de la string q contiene al número, si lo fuera no me sorprenderia q usar el metodo de concatenacion con "" sea más rapido.

*/

/*
    + check that g_input number is an positive integer (no con coma, etc, revisar si necesita ser positivo)
    + Hay WIPs por todos lados
    + Mejorar el prompt, ya q si se pone cancelar el codigo se corre igual.
    + revisar como se testea si un array esta vacio
    + output es string
    + divs_even es array
    + divs_odd es array
    + no combertir divs en mapa con todo para iterar más facilmente
    + dar la posibilidad de solo determinar si es primo, de devolver divisores, de devolver primos intermedios.
        Con los primos intermedios podria acelerar los traverse antes de usar los sieves de la misma forma q cuando use step = 2.
    + replantearse addToDivs

    Este intento de pseudo algoritmo esta incompleto, y le sobran cosas

    1 -- num % 2                                                     >>> divs_even

    2 -- 3 throu sqr(num) step=2                                     >>> divs_minDivisor counter divs_odd

    3 -- num / divs_minDivisor                                       >>> divs_maxDivisor
        (output += divs_maxDivisor num to str
        conversion y luego agregar todos los
        numeros antes q este)

    4 -- (divs_minDivisor + step) to divs_maxDivisor step=2          >>> divs_odd

    5 -- if !output then num is prime

    fail -- if it is not prime then check algorithm step then cal remaining divs
        calc divs_even
            calc divs_maxDivisor_even
            4 throu divs_maxDivisor_even step=2

    faltan agregar los primos intermedios

    ! Determinar q funcion usar si Math.trunc, parseInt, etc, comparar performance y q tan correcta es.
        How do I convert a float number to a whole number in JavaScript?
            https://stackoverflow.com/questions/596467/how-do-i-convert-a-float-number-to-a-whole-number-in-javascript

    !!!!!!!!!! Es mejor pensar esto como algo q busca divisores y primos intermedios más q determinar si un número es primo o no.

    ? Agregar un witness q si se torna true el número se sabe ser primo y así saltar algun paso
        Por ahora no parece ser aplicable.
*/


// Nota Personal Ejemplo de Docstring para usar
/**
 * Foo takes any argument.
 * The return value is 'baz' in all cases.
 * @param {*} bar - Any argument
 * @param {string} [optionalArg] - An optional argument that is a string
 */
/*
function foo(bar, optionalArg) {
    return 'baz';
}
*/
