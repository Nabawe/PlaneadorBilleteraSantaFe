/* +Variables */
/* +Classes and Objects */
/* +Functions */
/* +Header */


/* +Variables */
    // const e_planner = _Q.qID( "v-planner--form" );
/* +Variables */


/* +Classes and Objects */
    const o_Planner = {
        "DOM": _Q.qID( "v-planner--form" ),
        "categories": {},
        "discounts": []
    };

    const e_Item_new = `
        <div class="item">
            <button class="item--part btn yDrag" type="button"></button>
            <input type="number" class="item--part order" name="order" min="00" max="99" value="00">
            <select class="item--part category" name="category">
            </select>
            <input type="text" class="item--part description" name="description">
            <input type="number" class="item--part rawPrice" name="rawPrice">
            <select class="item--part discount" name="discount">
            </select>
            <output class="item--part finalPrice" name="finalPrice"></output>
            <button class="item--part btn delItem" type="button"></button>
        </div>
    `;

    const e_Instance_new = `
        <div id="p-instance-1" class="instance">
            <fieldset name="p-instance-1">
                <div class="legend--align">
                    <legend>Movimiento - <span class="instance--num">01</span></legend>
                    <button class="delInstance" type="button"></button>
                </div>
            <div class="box-items">
                <div class="item">
                <button class="item--part btn yDrag" type="button"></button>
                <input type="number" class="item--part order" name="order" min="00" max="99" value="00">
                <select class="item--part category" name="category">
                </select>
                <input type="text" class="item--part description" name="description">
                <input type="number" class="item--part rawPrice" name="rawPrice">
                <select class="item--part discount" name="discount">
                </select>
                <output class="item--part finalPrice" name="finalPrice"></output>
                <button class="item--part btn delItem" type="button"></button>
                </div>
            </div>
            <div class="item nextLine">
                <button class="item--part btn addItem" type="button"></button>
                <input type="number" class="item--part order" value="00" disabled>
                <select class="item--part category" disabled>
                <option value="Categoria" selected>Categoría</option>
                </select>
                <input type="text" class="item--part description"value="Descripción" disabled>
                <input type="text" class="item--part rawPrice" value="$" disabled>
                <select class="item--part discount" disabled>
                <option value="30" selected>30%</option>
                </select>
                <input type="text" class="item--part finalPrice" value="Precio Final" disabled>
                <button class="item--part delItem" disabled></button>
            </div>
            </fieldset>
            <div class="subResults">
            <input type="text"  class="subSaldoPlusPagos" name="subSaldoPlusPagos" title="Saldo PlusPagos" value="00000000" readonly>
            <input type="text"  class="subRefund" name="subRefund" title="Reintegro Instancia" value="00000000" readonly>
            <input type="text"  class="subSpent" name="subSpent" title="Subtotal Gastos" value="00000000" readonly>
            </div>
        </div>
    `;
/* +Classes and Objects */


/* +Functions */
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

    function f_updateDiscount() {

    }

    function f_populateSelects(elem) {
        for ( const cat in o_Planner.categories ) {
            elem.querySelector( ".item--part:enabled.category" ).innerHTML += `<option value="${cat}">${cat}</option>`;
        };
        for ( const val of o_Planner.discounts ) {
            elem.querySelector( ".item--part:enabled.discount" ).innerHTML += `<option value="${val}">${val}%</option>`;
        };
    }

    function f_delItem(evt) {
        // btn q dispara ^ .item ^ .box-items
        evt.target.parentNode.parentNode.removeChild(evt.target.parentNode);
    };

    function f_addItem(evt) {
        // btn q dispara ^ .nextLine ^ fieldset v .box-items
        const parnt = evt.target.parentNode.parentNode.querySelector( ".box-items" );
        parnt.insertAdjacentHTML( "beforeend", e_Item_new );
        // ? Habra forma de selecionar los items nuevos? hay algun evento o pseudo? ya q insertAdjacentHTML no tiene retorno
            // for ( const btn of parnt.querySelectorAll( "#v-planner .item--part.btn.delItem" ) )
            //  btn.addEventListener( "click", f_delItem );

        // Al ultimo item del .box-items correspondiente busca su boton delItem y le asigna su evento
        let lastItem = parnt.children[ ( parnt.childElementCount - 1 ) ];
        lastItem.querySelector( ".item--part.btn.delItem" ).addEventListener( "click", f_delItem );
        f_populateSelects(lastItem);
    };

    // ! WIP I belive this f is a bit dangerous since it makes all instances ids "dynamical"
    function f_updateInstances() {
        // WIP the instance is initially hidden by CSS class then when all graphical changes are finished it is shown by removing said class
        // const count =  _Q.qS( "#v-planner .box-instances" ).childElementCount;
        let y = 0;
        for ( const instance of _Q.qSA( "#v-planner .instance" ) ) {
            instance.id = `p-instance-${++y}`;
            instance.querySelector( "fieldset" ).name = `p-instance-${y}`;
            // Si el valor del contador y es menor q 10 agregar un 0 al string
            instance.querySelector( ".instance--num" ).textContent = ( y < 10 ) ? `0${y}` : y;
        };
    };

    function f_updateNewInstance(instance) {
        // WIP the instance is initially hidden by CSS class then when all graphical changes are finished it is shown by removing said class
        const count =  _Q.qS( "#v-planner .box-instances" ).childElementCount;
        instance.id = `p-instance-${count}`;
        instance.querySelector( "fieldset" ).name = `p-instance-${count}`;
        // Si el valor de count es menor q 10 agregar un 0 al string
        instance.querySelector( ".instance--num" ).textContent = ( count < 10 ) ? `0${count}` : count;
    };

    function f_delInstance(evt) {
        // btn q dispara ^ .legend--align ^ fieldset ^ .instance
        _Q.qS( "#v-planner .box-instances" ).removeChild(evt.target.parentNode.parentNode.parentNode);
        f_updateInstances();
    };

    function f_addInstance() {
        const box = _Q.qS( "#v-planner .box-instances" );
        box.insertAdjacentHTML( "beforeend", e_Instance_new );
        // A los botones de la ultima .instance le agrega sus eventos
        const instance = box.children[ ( box.childElementCount - 1 ) ];
        instance.querySelector( ".delInstance" ).addEventListener( "click", f_delInstance );
        instance.querySelector( ".item--part.btn.delItem" ).addEventListener( "click", f_delItem );
        instance.querySelector( ".item--part.btn.addItem" ).addEventListener( "click", f_addItem );
        f_populateSelects(instance);
        f_updateNewInstance(instance);
    };

    function f_initialSetup() {
        // A los botones iniciales les agrega la funcion correspondiente para agregar o borrar
        // El uso de #v-planner es por GPS CSS
        for ( const btn of _Q.qSA( "#v-planner .item--part.btn.delItem" ) )
            btn.addEventListener( "click", f_delItem );

        for ( const btn of _Q.qSA( "#v-planner .item--part.btn.addItem" ) )
            btn.addEventListener( "click", f_addItem );

        for ( const btn of _Q.qSA( "#v-planner .delInstance" ) )
            btn.addEventListener( "click", f_delInstance );

        for ( const btn of _Q.qSA( "#v-planner .addInstance" ) )
            btn.addEventListener( "click", f_addInstance );

        // Popular Selects
        for ( const select of _Q.qSA( "#v-planner .item--part:enabled.category" ) ) {
            for ( const cat in o_Planner.categories ) {
                select.innerHTML += `<option value="${cat}">${cat}</option>`;
            };
        };

        for ( const select of _Q.qSA( "#v-planner .item--part:enabled.discount" ) ) {
            for ( const val of o_Planner.discounts ) {
                select.innerHTML += `<option value="${val}">${val}%</option>`;
            };
        };
    };
/* +Functions */


/* +Header */
    f_loadData();
    // f_initialSetup();
    $( document ).ready( f_initialSetup );
    // $( document ).ready( function() {
    //     f_loadData(); // no deberia necesitar doc ready
    //     f_initialSetup();
    // });
/* +Header */



// La carga de categories.json y otros archivos definibles por el usuario q tengan una definicion como categories = f_validate(user_provided.json) || default_categories.json
// !!!!!!! Al agregar items y tags crear con JS CSS q use addContent a una clase, entonces el addItem, addIntance, del btns, y la creacion de categorias solo tienen q agregar lo minimo y luego CSS se encarga del resto.
