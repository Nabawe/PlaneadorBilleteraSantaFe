// +Tests w/ Undefined
// +Raw Algorithm
// +Test : if !num === false
// +Test : Var Initializated by Function
// +Test : Shortcircuit Returns
// +Test : Linked Optional Arguments Assignation
// +Test : Discard Unwanted Return Values
// +Test : One-ine While
// +Test : One-line if inside one-line for
// Test : NaN, False, Undefined Optional Arguments Behaviour
// +Test : +true
// +Test : if empty obj or array are falsy
// +Test : Hash, Multy Dimmensional Array Handling


/*
// +Tests w/ Undefined
    let test;
    console.log(test+"5"); // Undefined5
    console.log(test+1); // NaN
*/


/*
// +Raw Algorithm
    let i = 1, num = 21; // end = num - 1
    let divs = "";


    while ( i != num ) {
        while ( num % ++i !== 0 ) { };
        divs += `${i} ; `;
    };


    while ( i < num ) {
        while ( num % ++i !== 0 ) { };
        divs += `${i} ; `;
    };


    for ( let j = 1 ; j < num ; j) {
        for ( j ; num % ++j !== 0 ; j ) { console.log(j); };
        divs += `${j} ; `;
    };

    console.log(`i = ${i}\ndivs = ${divs}`);


    let i = 1, num = 21; // end = num - 1
    let divs = "";


    while ( i != num ) {
        while ( num % ++i !== 0 ) { };
        divs += `${i} ; `;
    };


    while ( i < num ) {
        while ( num % ++i !== 0 ) { };
        divs += `${i} ; `;
    };


    for ( let j = 1 ; j < num ; j) {
        for ( j ; num % ++j !== 0 ; j ) { console.log(j); };
        divs += `${j} ; `;
    };

    console.log(`i = ${i}\ndivs = ${divs}`);
*/


/*
// +Test : if !num === false
    let asd = !2;
    console.log(asd);
*/


/*
// +Test : Var Initializated by Function
    function returner () {
        return 123
    };
    let asdr = returner();
    console.log(asdr);
*/


/*
// +Test : Shortcircuit Returns
    let g_divs_minDivisor = false;
    // let g_divs = g_divs_minDivisor || "";
    // let g_divs = ( g_divs_minDivisor || "" );
    // let g_divs = g_divs_minDivisor && "";
    // let g_divs = `${g_divs_minDivisor} ; ` || ""; // Wrong
    // let g_divs = g_divs_minDivisor ? `${g_divs_minDivisor} ; ` : "";
    // let g_divs = ( g_divs_minDivisor && `${g_divs_minDivisor} ; ` ) || "";
    let g_divs = g_divs_minDivisor && `${g_divs_minDivisor} ; ` || "";
    console.log(g_divs);
*/


/*
// +Test : Linked Optional Arguments Assignation
    function f_missingDivs (num, ini = 1, end = num) {
        console.log(num);
        console.log(ini);
        console.log(end);
    }
    f_missingDivs ( 1, 2);
*/


/*
// +Test : Discard Unwanted Return Values
    // https://www.javascripttutorial.net/javascript-return-multiple-values/#:~:text=JavaScript%20doesn't%20support%20functions,array%2C%20or%20properties%20from%20objects.
    // Parece ser q JavaScript solo puede retornar multiples valores si se los coloca en un objeto o array.
    const fgh = (divs, i, j) => { return divs, i, j };
    const hgf = (divs, i, j) => { return [divs, i, j] };
    const zxc = (divs, i, j) => [divs, i, j];

    let a = fgh( 5, 2, 7 );
    console.log( a );
    console.log( fgh( 5, 2, 7 ) ); // output = 7 Raro q devuelve el ultimo arg

    let b = hgf("Cheesus", "Casius", "Biggus");
    console.log( b[2] );

    let c = hgf("Adodas", "Salamon", "Mikies",);
    console.log( c[2] );
*/


/*
// +Test : One-ine While
    let i = 0;
    while ( i < 10)
        console.log( i++ );
    console.log( i );
*/


/*
// +Test : One-line if inside one-line for
    let ini = 1, end = 10;

    for ( ini ; ini < end ; ini += 2 )
        if ( ini === 5 )
            break

    console.log( ini );
*/


/*
// Test : NaN, False, Undefined Optional Arguments Behaviour
    // Para refinar como se checkea ini y end asi la f devuelve valor falso, vacio o algo si hay un problema al llamarla

    function f_missingDivs (num, ini = 1, end, step = 1) {
        console.log( num , ini, end, step );
        return [num , ini, end, step]
    }
    console.log( f_missingDivs ( "num", "ini", "end", "step") );
    console.log( `\n` );
    console.log( f_missingDivs ( NaN, NaN, NaN, NaN ) );
    console.log( `\n` );
    console.log( f_missingDivs ( false, false, false, false ) );
    console.log( `\n` );
    console.log( f_missingDivs ( true, true, true, true ) );
    console.log( `\n` );
    console.log( f_missingDivs ( undefined, undefined, undefined, undefined ) );
    let a = true, b, c, d;
    console.log( `\n` );
    console.log( f_missingDivs ( a, b, c, d ) );
*/


/*
// +Test : +true
    // Para saber como influiria si no quiciera q un if se ejecute en true y ese true fuera pasado al if usando +, por ejemplo en f_isValidInput
    let a = +true
    console.log(a); // output = 1
*/


/*
// +Test : if empty obj or array are falsy
    let a = [], b = {};
    if ( a )
        console.log( `A CLI.log of an empty Array looks like ${a}` ); // outputs = "A CLI.log of an empty Array looks like " there is a notable space at the end, i.e. it's truthy
    if ( b )
        console.log( `A CLI.log of an empty Object looks like ${b}` ); // outputs = "A CLI.log of an empty Object looks like [object Object]" again truthy
*/


// +Test : Hash, Multy Dimmensional Array Handling
// let arry = {};
// arry["red"] = {};
// arry["blue"] = {};
// arry["yellow"] = {};
let arry = { red: {}, blue: {}, yellow: {} };
arry["red"]         ["tomato"]        = "ugly";
arry["red"]         ["apple"]         = "cool";
arry["blue"]        ["blue berries"]  = "bitter"; // Testing Key with space
arry["yellow"]      ["banana"]        = "sweet";
arry["yellow"]      ["corn"]          = "out of this world";
console.log( arry );
console.log( arry["yellow"]["corn"] );
console.log( arry.yellow.banana );
console.log( '=======================' );

let sup = [
    {red: 123,  blue: "is the sky",   apple: "cool",       "blue berries": "bitter"},
    {red: 5678, blue: "is the ocean", apple: "vermillion", "blue berries": "acid"}
];
console.log( "Sup", sup.red ); // undefined
console.log( "Sup", sup[1].red ); // 5678
// console.log( "Sup", sup[0]."blue berries" ); // Uncaught SyntaxError: missing name after . operator
// console.log( "Sup", sup[0].("blue berries") ); // Uncaught SyntaxError: missing name after . operator
console.log( "Sup", sup[0]["blue berries"] ); // bitter
console.log( '=======================' );

let support = [
    {red: "are the roses",    tomato: "ugly",           apple: "cool" },
    {blue: "is the sky",      blue_berries: "bitter"}
];
// console.log( "Support ", support.red.tomato ); // Uncaught TypeError: can't access property "tomato"
console.log( "Support ", support.red ); // undefined
console.log( "Support ", support[1].red );  // undefined
console.log( "Support ", support[1]["red"] );  // undefined
console.log( "Support ", support["1"]["red"] );  // undefined
console.log( "Support ", (support)["1"]["red"] );  // undefined
console.log( "Support ", (support)[1].red );  // undefined
console.log( '========== 0 ==========' );
console.log( "Support ", support[0].red );  // are the roses
console.log( "Support ", support[0]["red"] );  // are the roses
console.log( "Support ", support["0"]["red"] );  // are the roses
console.log( "Support ", (support)["0"]["red"] );  // are the roses
console.log( "Support ", (support)[0].red );  // are the roses
for ( let fruit of support )
    console.log( fruit.red ); // are the roses (fruit = 0) then undefined (fruit = 1)

console.log( '=======================' );


let carry = [
    {"red": {
        "tomato": "ugly",
        "apple": "cool"
        }
    },
    {"blue": {
        "blue berries": "bitter"
        }
    }
];
console.log( "Carry ", carry ); // Uncaught TypeError can't access property "tomato" carry[1].red
// console.log( "Carry ", carry.red.tomato ); // Uncaught TypeError can't access property "tomato" carry.red
// console.log( "Carry ", carry[1].red.tomato ); // Uncaught TypeError can't access property "tomato" carry[1].red
// console.log( "Carry ", carry["1"].red.tomato ); // Uncaught TypeError can't access property "tomato" carry[1].red
console.log( '=======================' );

let Eventos = {
    "cruzo la calle": { time:"09:00", duration: "456883", entities: ["granny", "dog", "cat"]},
    "star gazing": { time:"23:00", duration: "6200", entities: ["boy", "girl", "pet"]},
    "barracuda": { time:"12:12", duration: "56", entities: ["snake", "mouse"]}
};
for ( const ent of ( Eventos["star gazing"].entities ) )
    console.log( ent ); // boy then girl then pet
console.log( Eventos.barracuda.time); // 12:12
for ( let i in Eventos )
    console.log( i ); // cruzo la calle then star gazing then  barracuda

    // ESCRIBIR LO Q MUESTRA VS CODE EN MOUSE OVER


// test Obj Constructor (arg1) arg1 = arg1 shorthand into arg1
// let valor = auto["motor"]["potencia"]
// + revisar como se testea si un array esta vacio
// JSON.stringify() comparing arrays
    // doesn't take into account object types.
    // However, there is one edge case. Since undefined is not a valid JSON value, JSON.stringify() converts undefined to null. So the JSON.stringify() outputs of the arrays shown below will be the same even though they aren’t the same in reality
            // const a = [undefined];
            // const b = [null];
