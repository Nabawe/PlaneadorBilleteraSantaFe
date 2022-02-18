/* +Variables */
/* +Classes and Objects */
/* +Functions */
/* +Header */


/* +Variables */


/* +Classes and Objects */
    const o_Planner = {
        "DOMNode": _Q.qId( "v-planner--form" ),
        // Va a ser sobre-escrito en f_loadData pero me parece buena costrumbre initializarlo en caso de usarlo de otra forma
        // El uso de Map me garantiza q se mantenga el orden de como fueron
        "categories": new Map(),
        "discounts": []
    };

    const e_Item_new = `
        <div class="item live">
            <button class="item--part live btn yDrag" type="button"></button>
            <input type="number" class="item--part live order" name="order" min="00" max="99" maxlength="2" value="00">
            <select class="item--part live category" name="category" maxlength="20"></select>
            <input type="text" class="item--part live description" name="description" maxlength="30">
            <input type="number" class="item--part live rawPrice" name="rawPrice" maxlength="10">
            <select class="item--part live discount" name="discount" maxlength="4"></select>
            <output class="item--part live finalPrice" name="finalPrice"></output>
            <button class="item--part live btn delItem" type="button"></button>
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
                ${e_Item_new}
            </div>
            <div class="item nextLine">
                <button class="item--part btn addItem" type="button"></button>
                <input type="number" class="item--part order" value="00" disabled>
                <select class="item--part category" disabled>
                <option value="Categoria" selected>Categoría</option></select>
                <input type="text" class="item--part description"value="Descripción" disabled>
                <input type="text" class="item--part rawPrice" value="$" disabled>
                <select class="item--part discount" disabled>
                <option value="30" selected>30%</option></select>
                <input type="text" class="item--part finalPrice" value="Precio Final" disabled>
                <button class="item--part delItem" disabled></button>
            </div>
            </fieldset>
            <div class="subResults">
            <input type="text"  class="subSaldoPlusPagos" name="subSaldoPlusPagos" title="Saldo PlusPagos" value="" readonly>
            <input type="text"  class="subRefund" name="subRefund" title="Reintegro Instancia" value="" readonly>
            <input type="text"  class="subSpent" name="subSpent" title="Subtotal Gastos" value="" readonly>
            </div>
        </div>
    `;
/* +Classes and Objects */


/* +Functions */
    function f_loadData() {
        $.getJSON( '/data/defaults/categories.json',
            ( data, status ) => {
                if ( status === "success" ) {
                    o_Planner.categories = new Map( data );
                    // Mecanismo para filtrar descuentos repetidos
                    let t = [];
                    for ( const v of o_Planner.categories.values() ) {
                        t[v] = true;
                    };
                    for ( const v in t ) {
                        o_Planner.discounts.push(v);
                    };
                    // Para q los porcentajes más altos esten más comodos
                    // No aplicado a t ya q t es un array especial con agujeros
                    o_Planner.discounts.reverse();
                };
            }
        );
    };

    // Recive un elem q contiene <select>s de .category o .discount y los popula y bindea eventos
    // Si bien lo admite evitar pasar elementos q esten fuera de #v-planner
    function f_initSelects( elem ) {
        for ( const cat of elem.querySelectorAll( ".item--part:enabled.category" ) ) {
            for ( const k of o_Planner.categories.keys() )
                cat.innerHTML += `<option value="${k}">${k}</option>`;

            cat.addEventListener( "change", ( evt ) => {
                    cat.parentNode.querySelector( ".item--part:enabled.discount" ).value = o_Planner.categories.get( cat.value );
                    f_calcInstance( evt );
                }
            );
        };

        let [fVal] = o_Planner.categories.values();
        fVal += "";
        for ( const sel of elem.querySelectorAll( ".item--part:enabled.discount" ) ) {
            for ( const v of o_Planner.discounts )
                sel.innerHTML += `<option value="${v}">${v}%</option>`;
            // Seleccionar el Descuento correspondiente a la primera linea en o_Planner.categories
            for ( const opt of sel.children ) {
                if ( fVal === opt.value ) {
                    sel.value = opt.value;
                    break;
                };
            };
        };
    };

    // Para un determinado .item seleccionar el descuento asociado a la categoria
    function f_updateDiscount( item ) {
        item.querySelector( ".item--part:enabled.discount" ).value = o_Planner.categories.get( item.querySelector( ".item--part:enabled.category" ).value );
    };

    function f_delItem( evt ) {
        // btn q dispara ^ .item ^ .box-items
        evt.target.parentNode.parentNode.removeChild(evt.target.parentNode);
    };

    function f_addItem( evt ) {
        // btn q dispara ^ .nextLine ^ fieldset v .box-items
        const parnt = evt.target.parentNode.parentNode.querySelector( ".box-items" );
        parnt.insertAdjacentHTML( "beforeend", e_Item_new );

        // Al ultimo item del .box-items correspondiente busca su boton delItem y le asigna su evento
        let lastItem = parnt.children[ ( parnt.childElementCount - 1 ) ];
        lastItem.querySelector( ".item--part.btn.delItem" ).addEventListener( "click", f_delItem );
        lastItem.querySelector( ".item--part.rawPrice" ).addEventListener( "change", f_calcInstance );
        lastItem.querySelector( ".item--part.discount" ).addEventListener( "change", f_calcInstance );

        f_initSelects( lastItem );
    };

    function f_updateInstances() {
        let y = 1;
        for ( const instance of _Q.qSA( "#v-planner .instance" ) ) {
            instance.id = `p-instance-${y}`;
            instance.querySelector( "fieldset" ).name = `p-instance-${y}`;
            // Si el valor del contador y es menor q 10 agregar un 0 al string
            instance.querySelector( ".instance--num" ).textContent = ( y < 10 ) ? `0${y}` : y;
            y++;
        };
    };

    function f_updateNewInstance( instance ) {
        const count =  _Q.qS( "#v-planner .box-instances" ).childElementCount;
        instance.id = `p-instance-${count}`;
        instance.querySelector( "fieldset" ).name = `p-instance-${count}`;
        // Si el valor de count es menor q 10 agregar un 0 al string
        instance.querySelector( ".instance--num" ).textContent = ( count < 10 ) ? `0${count}` : count;
    };

    function f_delInstance( evt ) {
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
        instance.querySelector( ".item--part.live.btn.delItem" ).addEventListener( "click", f_delItem );
        instance.querySelector( ".item--part.btn.addItem" ).addEventListener( "click", f_addItem );

        instance.querySelector( ".item--part.live.rawPrice" ).addEventListener( "change", f_calcInstance );
        instance.querySelector( ".item--part.live.discount" ).addEventListener( "change", f_calcInstance );

        f_initSelects( instance );
        f_updateNewInstance( instance );
    };

    function f_initialSetup() {
        // A los botones iniciales les agrega la funcion correspondiente para agregar o borrar
        // El uso de #v-planner es por GPS CSS
        for ( const instance of _Q.qSA( "#v-planner .instance") ) {
            const addItem  = instance.querySelector( ".addItem" );
            addItem.addEventListener( "click", f_addItem );

            const delInstance  = instance.querySelector( ".delInstance" );
            delInstance.addEventListener( "click", f_delInstance );

            for ( const item of instance.querySelectorAll( ".item.live" ) ) {
                const rawPrice = item.querySelector( ".rawPrice" );
                rawPrice.addEventListener( "change", f_calcInstance );

                const discount = item.querySelector( ".discount" );
                discount.addEventListener( "change", f_calcInstance );

                const delItem  = item.querySelector( ".delItem" );
                delItem.addEventListener( "click", f_delItem );

                f_initSelects( item );
            };
        };

        for ( const btn of _Q.qSA( "#v-planner .addInstance" ) )
            btn.addEventListener( "click", f_addInstance );

        _Q.qS( "#v-planner .actions .calc").addEventListener( "click", f_calc );
        _Q.qS( "#v-planner .actions .reset").addEventListener( "click", f_reset );
    };

    // onchange
    function f_calcInstance( evt ) {
        const trgItem = evt.target.parentNode;
        trgItem.querySelector( ".finalPrice" ).value = ( trgItem.querySelector( ".rawPrice" ).value * ( ( 100 - trgItem.querySelector( ".discount" ).value ) / 100 ) ).toFixed( 2 );

        // item ^ box-items ^ fieldset ^ instance
        const instance = trgItem.parentNode.parentNode.parentNode;
        let t = 0;
        for ( const item of instance.querySelectorAll( ".live.finalPrice" ) ) {
            t += +item.value;
        };
        instance.querySelector( ".subSpent" ).value = t.toFixed( 2 );

        t = 0;
        for ( const item of instance.querySelectorAll( ".live.rawPrice" ) ) {
            t += +item.value;
        };
        instance.querySelector( ".subRefund" ).value = ( t - instance.querySelector( ".subSpent" ).value ).toFixed( 2 );
    };

    function f_reset() {
        const box = _Q.qS( "#v-planner .box-instances" );
        console.log( box.children );
        for ( const kid of box.querySelectorAll( ".instance" ) )
            box.removeChild( kid );
        f_addInstance();
    };

    function f_calc() {
        let t = 0;
        for ( const sub of _Q.qSA( "#v-planner .subSpent" ) )
            t += +sub.value;
        // _Q.qS( "#v-planner .totals .totalSpent").value = t;
        $( "#v-planner .totals .totalSpent" ).val( t );

        t = 0;
        for ( const sub of _Q.qSA( "#v-planner .subRefund" ) )
            t += +sub.value;
        // _Q.qS( "#v-planner .totals .totalRefund").value = t;
        $( "#v-planner .totals .totalRefund" ).val( t );

        $( "#v-planner #p-instance-1 .subSaldoPlusPagos" ).val(
            ( $( "#v-planner .monthlyRefund" ).val() - $( "#v-planner #p-instance-1 .subRefund" ).val() ).toFixed( 2 )
        );

        // Operar en todos menos el primer subSaldoPlusPagos
        const box = _Q.qS( "#v-planner .box-instances" );
        for ( let i = 1 ; i < box.childElementCount ; i++ ) {
            console.log( "alert ", i );
            const instancia = box.children[i];
            instancia.querySelector( ".subSaldoPlusPagos" ).value = ( box.children[ ( i - 1 ) ].querySelector( ".subSaldoPlusPagos" ).value - instancia.querySelector( ".subRefund" ).value ).toFixed( 2 );
        };

        _Q.qS( "#v-planner .totals .totalSaldoPlusPagos").value = box.children[ ( box.childElementCount - 1 ) ].querySelector( ".subSaldoPlusPagos" ).value;
    };
/* +Functions */


/* +Header */
    f_loadData();
    $( document ).ready( function() {
        f_initialSetup();
    });
/* +Header */
