let htmlObj, btn, value, attr, tElement, tmp;
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
        if (element.addEventListener) {
            element.addEventListener("submit", function(evt) {
                evt.preventDefault();
                window.history.back();
            }, true);
        }
        else {
            element.attachEvent('onsubmit', function(evt){
                evt.preventDefault();
                window.history.back();
            });
        }

    // <form onsubmit="return false;"> // It didn't seam reliable, or it might not work on all browsers




// Grabal al localStorage onchange luego de la validacion y el boton reiniciar no solo limpia el form sino q borraria el localStorage

// Una animacion podria ser q titile el outline al haber error, otra algun tipo de festejo al apretar Calc, al estilo maquinas tragamonedas

// [Tutor]Carlos Jesús : cuando haces el console.log(id) te muestra todo los eventos

// ! Tab Index and change focus on enter or tab, keyup 13 send tab?

// ! Cuando no sea una info puesta por el usuario es mejor q el html a agregar se saque de una variable asi no es modificable por el usuario si usa inspect

// ! Fix Buttons animations, they broke once I customized them

// ! Test parent.removeChild(child)
// ! Test doing a for of localStorage, AfterClass de Javier creo q es el 10 lidia con cosas de Storage
// ! Test JSON to save a function
    // Probar desde VSC y en el validador https://jsonformatter.curiousconcept.com/
