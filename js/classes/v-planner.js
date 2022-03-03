/* +Variables */
/* +Classes and Objects */
/* +Functions */
/* +Header */
/* +SOURCES */


/* +Variables */
    // const e_planner = _Q.qId( "v-planner--form" );
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
            <button class="g-WIP item--part live btn yDrag" type="button"></button>
            <input type="number" class="g-WIP item--part live order" name="order" min="00" max="99" maxlength="2" value="00">
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
<<<<<<< HEAD
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
=======
                <div class="box-items">
                    ${e_Item_new}
                </div>
                <div class="item nextLine">
                    <button class="item--part btn addItem" type="button"></button>
                    <input type="number" class="g-WIP item--part order" value="00" disabled>
                    <select class="item--part category" disabled>
                    <option value="Categoria" selected>Categoría</option></select>
                    <input type="text" class="item--part description"value="Descripción" disabled>
                    <input type="text" class="item--part rawPrice" value="$" disabled>
                    <select class="item--part discount" disabled>
                    <option value="30" selected>30%</option></select>
                    <input type="text" class="item--part finalPrice" value="Precio Final" disabled>
                    <button class="item--part delItem" disabled></button>
                </div>
>>>>>>> CoderHouse-JS-Final
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
                    // ! WIP use single line "for" form, used this in case it could break jQuery
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
        // WIP think about this
    function f_initSelects( elem ) {
        // ! WIP Deberia empesar limpiando lo q haya adentro?
        for ( const cat of elem.querySelectorAll( ".item--part:enabled.category" ) ) {
            for ( const k of o_Planner.categories.keys() )
                cat.innerHTML += `<option value="${k}">${k}</option>`;

            cat.addEventListener( "change", ( evt ) => {
                    cat.parentNode.querySelector( ".item--part:enabled.discount" ).value = o_Planner.categories.get( cat.value );
                    f_calcInstance( evt );
                }
            );
        };

        // elem.querySelector( ".item--part:enabled.category" ).children[0].selected = true;
            // Erroneo ya q parese q para cambiarlo se usa .value en el <select>
            // Tambien muy posiblemente inecesaria si es el primer elemento

        let [fVal] = o_Planner.categories.values();
        fVal += "";
        /* ? Se pierde peformance al convertir y los valores a comparar son pocos pero usar == puede implicar más de una conversion y tengo entendido q es peor pasar de string a int q de int a string */
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
        // ? Habra forma de selecionar los items nuevos? hay algun evento o pseudo? ya q insertAdjacentHTML no tiene retorno
            // for ( const btn of parnt.querySelectorAll( "#v-planner .item--part.btn.delItem" ) )
            //  btn.addEventListener( "click", f_delItem );

        // Al ultimo item del .box-items correspondiente busca su boton delItem y le asigna su evento
        let lastItem = parnt.children[ ( parnt.childElementCount - 1 ) ];
        lastItem.querySelector( ".item--part.btn.delItem" ).addEventListener( "click", f_delItem );
        lastItem.querySelector( ".item--part.rawPrice" ).addEventListener( "change", f_calcInstance );
        lastItem.querySelector( ".item--part.discount" ).addEventListener( "change", f_calcInstance );

        f_initSelects( lastItem );
    };

    // ! WIP I belive this f is a bit dangerous since it makes all instances ids "dynamical"
    function f_updateInstances() {
        // WIP the instance is initially hidden by CSS class then when all graphical changes are finished it is shown by removing said class
        // const count =  _Q.qS( "#v-planner .box-instances" ).childElementCount;
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
        // WIP the instance is initially hidden by CSS class then when all graphical changes are finished it is shown by removing said class
        const count =  _Q.qS( "#v-planner .box-instances" ).childElementCount;
        instance.id = `p-instance-${count}`;
        instance.querySelector( "fieldset" ).name = `p-instance-${count}`;
        // Si el valor de count es menor q 10 agregar un 0 al string
        instance.querySelector( ".instance--num" ).textContent = ( count < 10 ) ? `0${count}` : count;
    };

    function f_delInstance( evt, aux ) {
        // btn q dispara ^ .legend--align ^ fieldset ^ .instance
        // _Q.qS( "#v-planner .box-instances" ).removeChild( evt.target.parentNode.parentNode.parentNode );
        const instance = aux ? aux : evt.target.closest( ".instance" );
        const instanceNum = +instance.querySelector( ".instance--num" ).textContent;
        const box = instance.closest( ".box-instances" );
        box.removeChild( instance );
        if ( box.childElementCount === 0 ) {
            f_addInstance();
            $( o_Planner.DOMNode ).trigger("reset");
            return
        };
        f_updateInstances();
    };

    function f_addInstance() {
        const box = _Q.qS( "#v-planner .box-instances" );
        box.insertAdjacentHTML( "beforeend", e_Instance_new );
        // A los botones de la ultima .instance le agrega sus eventos
        const instance = box.children[ ( box.childElementCount - 1 ) ];
        // ! WIP escribir las lineas usando querySelectorAll así si cambia la cantidad de botones que hacen lo mismo no importa
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
        /* ! WIP Hay varios errores aqui se tendiran q agregar las sub secciones .box-instances o div.box-instances, .action y .box-instances para q los selectores no afecten otras partes q puedan tener clases similares pero me tira error o ignora. */
                // for ( const btn of _Q.qSA( "#v-planner .item--part.btn.addItem" ) )
                //     btn.addEventListener( "click", f_addItem );
                    // Es un ejemplo del metodo q usaba antes q por alguna razon fallaba, revisar bien la especificacion de los querySelector.
        for ( const instance of _Q.qSA( "#v-planner .instance") ) {
            const addItem  = instance.querySelector( ".addItem" );
            addItem.addEventListener( "click", f_addItem );

            const delInstance  = instance.querySelector( ".delInstance" );
            delInstance.addEventListener( "click", f_delInstance );

            for ( const item of instance.querySelectorAll( ".item.live" ) ) {
                // for ( const part of item.querySelectorAll( ".item--part" ) ) {
                // };
                const rawPrice = item.querySelector( ".rawPrice" );
                rawPrice.addEventListener( "change", f_calcInstance );

                const discount = item.querySelector( ".discount" );
                discount.addEventListener( "change", f_calcInstance );

                const delItem  = item.querySelector( ".delItem" );
                delItem.addEventListener( "click", f_delItem );

                f_initSelects( item );

                // $(rawPrice).trigger( "change" );
                    // Requeriria un rawPrice inicial

                // Lo siguiente es codigo q fue reemplazado pero me habia quedado muy lindo
                    // const cat = item.querySelector( ".category" );
                    // cat.addEventListener( "change", () => {
                    //         item.querySelector( ".item--part:enabled.discount" ).value = o_Planner.categories.get( item.querySelector( ".item--part:enabled.category" ).value );
                    //     }
                    // );
            };
        };

        for ( const btn of _Q.qSA( "#v-planner .addInstance" ) )
            btn.addEventListener( "click", f_addInstance );

        o_Planner.DOMNode.querySelector( ".actions .calc" ).addEventListener( "click", f_calc );
        o_Planner.DOMNode.querySelector( ".actions .reset" ).addEventListener( "click", f_reset );

        o_Planner.DOMNode.querySelector( ".storage .save" ).addEventListener( "click", f_stoPush );
        o_Planner.DOMNode.querySelector( ".storage .load" ).addEventListener( "click", f_stoPop );
        o_Planner.DOMNode.querySelector( ".storage .clear" ).addEventListener( "click", f_stoClear );

        // onchange buscan el primer item del planner y disparan calc
        o_Planner.DOMNode.querySelector( ".monthlyRefund" ).addEventListener( "change", function(){
            f_calcInstances( false, o_Planner.DOMNode.querySelector( ".item.live" ) );
        } );
        o_Planner.DOMNode.querySelector( ".funds" ).addEventListener( "change", function(){
            f_calcInstances( false, o_Planner.DOMNode.querySelector( ".item.live" ) );
        } );
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

        // PPPLeft = PuntosPlusPagosLeft no puede ser negativo
        let PPPLeft = o_Planner.DOMNode.querySelector( ".monthlyRefund" ).value - sumRefund;
        PPPLeft = ( PPPLeft > 0 ) ? PPPLeft : 0;

        for ( let i = ( trgInstanceNum - 1 ) ; i < box.childElementCount ; i++ ) {
            // const inst = planner.querySelector( `p-instance-${i}` );
            // ? Otra opcion hubiera sido hacer corto circuito con algun tipo de objeto q le devuelva 0 a las queries en d
            const inst = box.children[i];
            const prevInst = box.children[ i - 1 ];
            let sumRawPrice = 0, sumFinalPrice = 0, d = 0, saldoPP = 0;

            for ( const field of inst.querySelectorAll( ".live .rawPrice" ) )
                sumRawPrice += +field.value;
            for ( const field of inst.querySelectorAll( ".live .finalPrice" ) )
                sumFinalPrice += +field.value;

            // refund esta limitado por el Tope Reintegro Mensual ( PPPLeft ) por eso uso ?:
            // la resta simplifica el tener q aplicar los descuentos uno por uno y sumarlos
            let refund = sumRawPrice - sumFinalPrice;
            refund = ( refund > PPPLeft ) ? PPPLeft : refund;
            inst.querySelector( ".subRefund" ).value = refund.toFixed( 2 );

            // prevRefund & prevSaldoPP
            /* WIP posiblemente se podria codificar haciendo q este for inicie en la instancia anterio, pero muy posiblemente agregaria varios checkeos de si existe lo anterior o no, el objetivo seria intentar reducir la cantidad de querySelector necesarios */
            d = prevInst ?
                ( +( prevInst.querySelector( ".subRefund" ).value ) + +( prevInst.querySelector( ".saldoPlusPagos" ).value ) ) - sumRawPrice
            :
                0 - sumRawPrice
            ;

            // saldoPP = ( prevRefund + prevSaldoPP ) - sumRawPrice
            // saldoPP no puede ser menor a 0
            saldoPP = d > 0 ? d : 0;
            inst.querySelector( ".saldoPlusPagos" ).value = saldoPP.toFixed( 2 );

            // subSpent = sumRawPrice - ( prevRefund + prevSaldoPP )
            inst.querySelector( ".subSpent" ).value = ( -d > 0 ? -d : 0 ).toFixed( 2 );

            PPPLeft -= refund;
            PPPLeft = ( PPPLeft > 0 ) ? PPPLeft : 0;
        };
        instance.querySelector( ".subRefund" ).value = ( t - instance.querySelector( ".subSpent" ).value ).toFixed( 2 );

        // instance.querySelector( ".subSaldoPlusPagos" ).value = _Q.qS( "#v-planner .monthlyRefund" ).value - instance.querySelector( ".subRefund" ).value;
    };

    function f_reset( evt, tabulaRasa ) {
        // const box = _Q.qS( "#v-planner .box-instances" );
        // for ( const kid of box.children ) ? Por alguna razon no podia operar en el HTMLCollection
        // for ( const kid of box.querySelectorAll( ".instance" ) )
        //     box.removeChild( kid );
        for ( const kid of o_Planner.DOMNode.querySelector( ".box-instances" ).querySelectorAll( ".instance" ) )
            kid.remove();
        // o_Planner.DOMNode.querySelector( "form" ).reset();
        $( o_Planner.DOMNode ).trigger("reset");
        if ( !tabulaRasa )
            f_addInstance();
        /* !!! WIP Se necesita algo para determinar q realmente se halla borrado todo ya q sino no seria un comienzo de 0 verdadero, sino hacer el proceso de colocar todo en 0 antes. O verificar correctamente si los proximos calculos podrian levantar los valores fantasmas.
        */
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

        // tmp = _Q.qSA( "#v-planner .box-instances .instance" );
        // Operar en todos menos el primer subSaldoPlusPagos
        const box = _Q.qS( "#v-planner .box-instances" );
        for ( let i = 1 ; i < box.childElementCount ; i++ ) {
            console.log( "alert ", i );
            const instancia = box.children[i];
            instancia.querySelector( ".subSaldoPlusPagos" ).value = ( box.children[ ( i - 1 ) ].querySelector( ".subSaldoPlusPagos" ).value - instancia.querySelector( ".subRefund" ).value ).toFixed( 2 );
        };

        _Q.qS( "#v-planner .totals .totalSaldoPlusPagos").value = box.children[ ( box.childElementCount - 1 ) ].querySelector( ".subSaldoPlusPagos" ).value;
    };

    // LLamarla onchange, antes de guardar y en varios otros casos
    // function f_validate( evt ) {
    //     for ( const instance of _Q.qSA( "#v-planner .instance") ) {
    //         const addItem  = instance.querySelector( ".addItem" );
    //         addItem.addEventListener( "click", f_addItem );

    //         const delInstance  = instance.querySelector( ".delInstance" );
    //         delInstance.addEventListener( "click", f_delInstance );

    //         for ( const item of instance.querySelectorAll( ".item.live" ) ) {
    //             // for ( const part of item.querySelectorAll( ".item--part" ) ) {
    //             // };
    //             const delItem  = item.querySelector( ".delItem" );
    //             delItem.addEventListener( "click", f_delItem );

    //             f_initSelects( item );
    //         };
    //     };
    // };

    function f_stoPush () {
        /*
            data = [ instance, instance, ... ]
                instance = [ item, item, ... ]
                    item = { field.name: field.value }

            data = [
                [
                    { order: value, category: value, description: value, rawPrice: value, discount: value, finalPrice: value },
                    { order: value, category: value, description: value, rawPrice: value, discount: value, finalPrice: value },
                    { order: value, category: value, description: value, rawPrice: value, discount: value, finalPrice: value }
                ],
                [
                    { order: value, category: value, description: value, rawPrice: value, discount: value, finalPrice: value }
                ]
            ]
        */
        const data = [];
        const box = o_Planner.DOMNode.querySelector( ".box-instances" );

        // Uso for i para mantener el orden
        for ( let i = 0 ; i < box.childElementCount ; i++ ) {
            const inst = box.children[i];
            data[i] = [];
            // ! ERROR falta selecionar la box-items para agarrar los items en orden
            for ( let t = 0 ; t < inst.childElementCount ; t++ ) { // for ( const item of inst ) {
                const item = box.children[t];
                data[i][t] = {};
                for ( const field of item ) {
                    if ( field.name ) {
                        data[i][t][field.name] = field.value;
                    };
                };
            };
        };

        localStorage.setItem( "monthlyRefund", o_Planner.DOMNode.querySelector( ".monthlyRefund" ).value );
        localStorage.setItem( "funds", o_Planner.DOMNode.querySelector( ".funds" ).value );


        // localStorage.setItem( "box-instances", JSON.stringify( box ) );
        // almacenar selects
        // almasenar totales y subs

        // for ( let element of elements ) {
        //     localStorage.setItem( key, JSON.stringify( object ) )
        // }

        // Flash Button
    };

    function f_stoPop () {
        const box = o_Planner.DOMNode.querySelector( ".box-instances" );
        let data = JSON.parse( localStorage.getItem( "box-instances" ) );
        f_reset( false, true );

        o_Planner.DOMNode.querySelector( ".monthlyRefund" ).value = localStorage.getItem( "monthlyRefund" );
        o_Planner.DOMNode.querySelector( ".funds" ).value = localStorage.getItem( "funds" );

        console.log( data );
        for ( const kid of data.querySelectorAll( ".instance" ) )
            box.insertAdjacentHTML( "beforeend", kid );

        // popular selects desde el storage
        // seleccionar selects correctos
        // call calc or update or load results from storage

        // const data = JSON.parse( localStorage.getItem( key ) )
        // for ( let element of elements ) {
        //     element.vale = data[element].value
        // }
    };

    function f_stoClear () {
        localStorage.clear();
        $( o_Planner.DOMNode ).trigger("reset");
            // revisar docs de clear no sea cosa q borre de otras paginas, pero no deberia
        //localStorage.removeItem( key )
        // decidir si limpia el form tambien, creo q seria mejor q no y modificar de reset a limpiar?
    };
/* +Functions */


/* +Header */
    f_loadData(); // ! WIP Mejor disparar esta funcion con un evento para garantizar q este todo list
    // ! WIP something more reliable or set the jQuery script tag better
        // load?
    // f_initialSetup();
    $( document ).ready( function() {
        f_initialSetup();
    });
/* +Header */



// La carga de categories.json y otros archivos definibles por el usuario q tengan una definicion como categories = f_validate(user_provided.json) || default_categories.json
// !!!!!!! Al agregar items y tags crear con JS CSS q use addContent a una clase, entonces el addItem, addIntance, del btns, y la creacion de categorias solo tienen q agregar lo minimo y luego CSS se encarga del resto.
// Hay 3 niles, inicio de la app, nivel instancia, nivel item
// Mas q usar un boton calcular seria más interesante q se dispare un evento "nums changed" y calcula


/* +SOURCES */
/*
    Map
        https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
            "Iterating Map with for..of"
            "Relation with Array objects"
            "Iterating Map with forEach()"
                Parece q tiene mucho para mejorar aun este metodo, ademas parese ser bastante más lento. Puede generar codigo más claro y espero q a futuro lo mejoren pero no conosco demaciado de la trajectoria de JavaScript como para saber q esperar.
                        https://blog.devgenius.io/3-bad-use-cases-of-javascripts-foreach-loop-add3600a8895
                            "In the forEach loop, we are invoking the callback function on every iteration. This additional scope leads to slower speeds compared to the for loop. The for loop uses an initializing statement and a conditional that is evaluated at every iteration. That means lowered cost compared to the forEach."
*/
/* +SOURCES */
