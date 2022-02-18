let htmlObj, btn, value, attr, tElement, tmp;
    // element, event are reserved words
const htmlValidators = {
    description: (element) => !!(element.value)
};

htmlObj = document.getElementById("asd")
    // Asignar ids al item inicial, el resto hacerlo por JS.
htmlObj = document.getElementsByClassName("item--part description")
htmlObj = htmlObj[0]
value = document.getElementById("instance-1").value
value = htmlObj.value
attr = htmlObj.setAttribute("disabled", false)
    // Sets the value of an attribute on the specified element. If the attribute already exists, the value is updated; otherwise a new attribute is added with the specified name and value.
    // To get the current value of an attribute, use getAttribute(); to remove an attribute, call removeAttribute().
    // Using setAttribute() to modify certain attributes, most notably value in XUL, works inconsistently, as the attribute specifies the default value. To access or modify the current values, you should use the properties. For example, use Element.value instead of Element.setAttribute().
attr = htmlObj.getAttribute("disabled")
    /* Non-existing attributes
        Essentially all web browsers (Firefox, Internet Explorer, recent versions of Opera, Safari, Konqueror, and iCab, as a non-exhaustive list) return null when the specified attribute does not exist on the specified element; this is what the current DOM specification draft specifies. The old DOM 3 Core specification, on the other hand, says that the correct return value in this case is actually the empty string, and some DOM implementations implement this behavior. The implementation of getAttribute() in XUL (Gecko) actually follows the DOM 3 Core specification and returns an empty string. Consequently, you should use element.hasAttribute() to check for an attribute's existence prior to calling getAttribute() if it is possible that the requested attribute does not exist on the specified element.

        The Element.hasAttribute() method returns a Boolean value indicating whether the specified element has the specified attribute or not.
    */

htmlObj.innerHTML = `<p> This is being set inside htmlObj </p>` // Esta primera linea crea un p dentro del input pero no parece ser renderizado
htmlObj.setAttribute("value", `I'm blue da dida duda duda duda du diii da`)

t = document.getElementById("v-catsEditor")
t.innerHTML = htmlObj.textContent
t.innerHTML += `\n` // Didn't work +,(
t.innerHTML += '\n' // Didn't work +,(
t.innerHTML += htmlObj.value



// NewItem podria ser una clase
// esto es parte del Controller
function f_validateNewItem(element, validationType) {
    return htmlValidators[validationType](element) ?
        true
    :
        false
        // if this fails trigger custom event else return true
            // el custom event cambia el outline del elemento (eso lo hace View) pero no element.innerHTML = "" asi el usuario puede ver su error
            // el View tambien va a tener q controlar q si luego fue bien ingresado remover el outline de error
            // se va a tener q modificar la clase del objeto q pone el outline en blanco

    // if ( element.value == criteria ) {

    // }
}





tElement = document.createElement( "div" )
    // tagName, options
tElement.className = "clases a_setearle"
    // tElement.property like src or etc
element.parentNode.removeChild(element);
    // Es importante notar q element esta al principio y al final, se podra usar this? o haria referencia al padre?


parent.appendChild(element) // or prependChild

Element.insertAdjacentHTML()
    /*
        position
            A string representing the position relative to the element. Must be one of the following strings:

            "beforebegin"
                Before the element. Only valid if the element is in the DOM tree and has a parent element.

            "afterbegin"
                Just inside the element, before its first child.

            "beforeend":
                Just inside the element, after its last child.

            "afterend"
                After the element. Only valid if the element is in the DOM tree and has a parent element.

        text
            The string to be parsed as HTML or XML and inserted into the tree.
     */


// estas 3 f como mucho de esta cheatsheet estan hechas asinomas para conceptualizar
// Se pueden almacenar en archivos separados .json pero no vimos como importarlos.
function f_stoPush ( key, object ) {
    for ( let element of elements ) {
        localStorage.setItem( key, JSON.stringify( object ) )
    }
    f_printResult() // faltaria verificar si el save funcino correctamente, creo q el profesor dijo q no podia haber error en este proceso?
}

// sessionStorage.key()
    // q los busca por posición grabada y como si fuera parte de una array o un objeto\
    // ej sessionStorage.key(1) devuelve la 2° key guardada
// Tambien esta Object.keys(Objeto) q creo q es una funcion del prototipo o class de JS Object

console.log(localStorage.length) // prints the ammount of keys


function f_stoPop ( key ) {
    const data = JSON.parse( localStorage.getItem( key ) )
    for ( let element of elements ) {
        element.vale = data[element].value
    }
    f_printResult()
}


function f_stoClear ( key ) {
    // localStorage.clear()
        // revisar docs de clear no sea cosa q borre de otras paginas, pero no deberia
    localStorage.removeItem( key )
    // decidir si limpia el form tambien, creo q seria mejor q no y modificar de reset a limpiar?
    // button type="reset"
    f_printResult()
}


// HTML form validation : revisar pero por lo q dice el Profesor Javier parece ser muy basica y devuelve error generico, parece haber un evento q marca la validacion de un form y tambien parece q depende del boton submit

// View custom event onValidationFail : y como afecta visualmente al elemento q falló su validación


/*
    document    : root
    element     : tags with attributes and subnodes
    attr        : HTML attributes, attr=value
    text        : HTML text
    comment     : HTML comments
*/
/*
    DOM element.children[numericKey].value
        permite acceder a los childs de element directamente, en el caso de arriba obtendria el valor del child q corresponde a la key numericKey
 */

document.querySelector()
document.querySelectorAll()


const f_addItem = =>
btn = document.getElementsByClassName("item--part btn addItem")
btn.addEventListener( "click", f_addItem )
htmlObj.addEventListener( "onchange", f_validateNewItem( this, "description" ) )
    // Ver q evento seria correcto usar, y q pase luego de la validacion hecha por el form HTML
    // El tipo de validacion (no confundir con el input type) podria deducirse de la clase asignada y por ende extraida algoritmicamente
    // event.target recordar esta propiedad q da quien fue el objetivo del evento o del "listener"
        // SOLO en jQuery se puede reemplazar por this
    /*
        Usando propiedades del elemento
        boton.onclick = () => {
            // ...
        }
     */

htmlObj.onchange = () => {}

Event.preventDefault()


let selectElement = document.getElementById("selectElementID");
let selectedOptionTitle = selectElement[selectElement.selectedIndex].title
    // No deberia necesitar esto ya q lo q busco es el valor del select luego de haber elegido una opcion


// The HTMLSelectElement.selectedIndex is a long that reflects the index of the first or last selected <option> element, depending on the value of multiple. The value -1 indicates that no element is selected.


// https://stackoverflow.com/questions/8664486/javascript-code-to-stop-form-submission
    // jQuery

        $('#form').submit(function (evt) {
            evt.preventDefault();
            window.history.back();
        });

    // Vanilla JavaScript
        // Didn't seam to work
        if ( element.addEventListener ) {
            element.addEventListener(
                "submit",
                function( evt ) {
                    evt.preventDefault();
                    window.history.back();
                },
                true
            );
        } else {
            element.attachEvent(
                'onsubmit',
                function( evt ) {
                    evt.preventDefault();
                    window.history.back();
                }
            );
        };

    // <form onsubmit="return false;"> // It didn't seam reliable, or it might not work on all browsers


// AJAX
$( document ).ready( function() {
    $.get('/data/defaults/categories.json', (response, status) => {

        if (status === "success") {

        }

    });
} );
/*
    t []
    for let cat of categories
        t[cat] = true

    for let cat of t
        addToDom(cat)  <--ver si es necesario probar existencia, creo q el for of ya se encarga

 */





        const o_Validators = {
            description     : (me) => !!( me.value.lenght )
        };

        class c_Item__part {
            constructor( type ) {
                this.type           = type;
                this.m_validator    = o_Validators[type];
            };
        };

        class c_Item {
            constructor() {
                // this.HTML           = "";
                // this.parts          = [yDrag, order, category, description, rawPrice, discount, finalPrice, delItem];
                this.yDrag          = true;
                this.order          = "00";
                this.category       = "Default"; // set default
                this.description    = "";
                this.rawPrice       = "";
                this.discount       = "Default"; // set default
                this.finalPrice     = "";
                this.delItem        = true;
            };

            m_validate() {
                let fault = [];
                if ( !(this.description) )
                    fault.push( "description" );
                if ( !(this.rawPrice) )
                    fault.push( "rawPrice" );

                // console.log( fault );

                return false
            }
        }



        o_Planner.m_validate()

        let asd = new c_Item();
        // asd.rawPrice = 1000;
        // console.log( asd.m_validate() );


        // let e_planner = _Q.qID( "v-planner--form" );


// Forma Original de f_loadData
    function f_loadData() {
        $.getJSON( '/data/defaults/categories.json',
            ( data, status ) => {
                if ( status === "success" ) {
                    o_Planner.categories = data;
                    // Mecanismo para filtrar descuentos repetidos
                    let t = [];
                    // ! WIP No me dejaba usar for of decia q no era iterable, creo q no es un problema de o_Planner o data en si sino de el operador of
                    for ( const key in data ) {
                        t[ data[key] ] = true;
                    };
                    for ( const val in t ) {
                        o_Planner.discounts.push(val);
                    };
                };
            }
        );
    };

