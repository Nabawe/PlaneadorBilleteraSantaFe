let htmlObj, btn, value, attr;

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

htmlObj.innerHTML = `<p> This is being set inside htmlObj </p>`
htmlObj.setAttribute("value", `<p> This is being set inside htmlObj </p>`)

btn = document.getElementsByClassName("item--part btn addItem")

// NewItem podria ser una clase
function f_validateNewItem(element, validationType) {

}

const f_addItem = =>

btn.addEventListener("click", f_addItem)
htmlObj.addEventListener("onchange", f_validateNewItem(this, "description"))
    // Ver q evento seria correcto usar, y q pase luego de la validacion hecha por el form HTML
    // El tipo de validacion (no confundir con el input type) podria deducirse de la clase asignada y por ende extraida algoritmicamente

