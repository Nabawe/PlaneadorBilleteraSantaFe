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
        "DOMNode": _Q.qId( "v-planner" ), // !!!!!!!! WIP aqui se le tiene q pasar el ID al constructor
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
            <input type="number" class="item--part live rawPrice" name="rawPrice" min="0" max="9999999999">
            <select class="item--part live discount" name="discount" maxlength="4"></select>
            <output class="item--part live finalPrice" name="finalPrice"></output>
            <button class="item--part live btn delItem" type="button"></button>
        </div>
    `;

    // <div class="box-items">
    //     ${e_Item_new}
    // </div>
    const e_Instance_new = `
        <div id="p-instance-2" class="instance">
            <fieldset name="p-instance-2">
                <div class="legend--align">
                    <legend>Movimiento - <span class="instance--num">02</span></legend>
                    <button class="delInstance" type="button"></button>
                </div>
                <div class="box-items">
                </div>
                <div class="item nextLine">
                    <button class="item--part btn addItem" type="button"></button>
                    <input type="number" class="g-WIP item--part order" value="00" disabled>
                    <select class="item--part category" disabled>
                    <option value="Categoria" selected>Categor??a</option></select>
                    <input type="text" class="item--part description"value="Descripci??n" disabled>
                    <input type="text" class="item--part rawPrice" value="$" disabled>
                    <select class="item--part discount" disabled>
                    <option value="30" selected>30%</option></select>
                    <input type="text" class="item--part finalPrice" value="Precio Final" disabled>
                    <button class="item--part delItem" disabled></button>
                </div>
            </fieldset>
            <div class="subResults">
                <input type="text"  class="subRefund" name="subRefund" title="Reintegro del Movimiento" value="" readonly>
                <input type="text"  class="saldoPlusPagos" name="saldoPlusPagos" title="Variaci??n del Saldo PlusPagos" value="" readonly>
                <input type="text"  class="subSpent" name="subSpent" title="Variaci??n de los Fondos Iniciales" value="" readonly>
            </div>
        </div>
    `;
/* +Classes and Objects */


/* +Functions */
    function f_loadData() {
        $.getJSON( '/data/defaults/categories.json',
            ( data, stat ) => {
                if ( stat === "success" ) {
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
                    // Para q los porcentajes m??s altos esten m??s comodos
                    // No aplicado a t ya q t es un array especial con agujeros
                    o_Planner.discounts.reverse();
                };
            }
        );
    };

    // LLamarla onchange, antes de guardar y en varios otros casos
    function f_validate( evt ) {
        for ( const instance of _Q.qSA( "#v-planner .instance") ) {
                form.reportValidity()
                // oninput
                // invalid
            const addItem  = instance.querySelector( ".addItem" );
            addItem.addEventListener( "click", f_addItem );

            const delInstance  = instance.querySelector( ".delInstance" );
            delInstance.addEventListener( "click", f_delInstance );

            for ( const item of instance.querySelectorAll( ".item.live" ) ) {
                // for ( const part of item.querySelectorAll( ".item--part" ) ) {
                // };
                const delItem  = item.querySelector( ".delItem" );
                delItem.addEventListener( "click", f_delItem );

                f_initSelects( item );
            };
        };
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
                    f_calcInstances( evt );
                }
            );
        };

        // elem.querySelector( ".item--part:enabled.category" ).children[0].selected = true;
            // Erroneo ya q parese q para cambiarlo se usa .value en el <select>
            // Tambien muy posiblemente inecesaria si es el primer elemento

        let [fVal] = o_Planner.categories.values();
        fVal += "";
        /* ? Se pierde peformance al convertir y los valores a comparar son pocos pero usar == puede implicar m??s de una conversion y tengo entendido q es peor pasar de string a int q de int a string */
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
        const item = evt.target.closest( ".item" );
        // ! WIP cambiar por animaciones de CSS
        $( item ).animate({
            opacity: '0.5'
        }, 500)
            .slideUp(500, (
                // The callback is not sent any arguments, but this is set to the DOM element being animated. If multiple elements are animated, it is important to note that the callback is executed once per matched element, not once for the animation as a whole.
                    // lo manda como un jQuery element
                    // La Doc dice q no se le manda arg alguno pero estoy pudiendo usar evt bien
                function ( jQItem ) {
                    // $( jQItem ).remove();
                    const trgItem = evt.target.closest( ".item" );
                    // btn q dispara ^ .item ^ .box-items
                    // trgItem.parentNode.removeChild( trgItem );
                    /* Es importante recordar q el item es instantaneamente sacado del DOM pero no es borrado hasta q, se lo deje de referenciar, el garbage colerctor lo colecte. */
                    if ( trgItem.closest( ".box-items" ).childElementCount === 1 ) {
                        f_delInstance( evt );
                        return;
                    };
                    for ( kid of trgItem.children )
                        kid.value = 0

                    f_calcInstances( evt );
                    // Como el item queda flotando en la memoria de una manera insierta primero lo "cero", luego recalculo y finalmente ejecuto el borrar.
                    trgItem.remove();
                }
            ) ( evt )
        );
        // btn q dispara ^ .item ^ .box-items
        // evt.target.parentNode.parentNode.removeChild( evt.target.parentNode );
    };

    // parnt = .box-items
    function f_addItem( evt, aux, q = 1 ) {
        // btn q dispara ^ .nextLine ^ fieldset v .box-items
        // const parnt = evt.target.parentNode.parentNode.querySelector( ".box-items" );
        const parnt = aux ? aux : evt.target.closest( "fieldset" ).querySelector( ".box-items" );
        let lastItem;
        for ( let i = 0 ; i < q ; i++ ) {
            parnt.insertAdjacentHTML( "beforeend", e_Item_new );
            // ? Habra forma de selecionar los items nuevos? hay algun evento o pseudo? ya q insertAdjacentHTML no tiene retorno
                // for ( const btn of parnt.querySelectorAll( "#v-planner .item--part.btn.delItem" ) )
                //  btn.addEventListener( "click", f_delItem );

            // Al ultimo item del .box-items correspondiente busca su boton delItem y le asigna su evento
            lastItem = parnt.children[ ( parnt.childElementCount - 1 ) ];
            lastItem.querySelector( ".item--part.btn.delItem" ).addEventListener( "click", f_delItem );
            lastItem.querySelector( ".item--part.rawPrice" ).addEventListener( "change", f_calcInstances );
            lastItem.querySelector( ".item--part.discount" ).addEventListener( "change", f_calcInstances );

            f_initSelects( lastItem );

            // ! WIP cambiar por animaciones de CSS
            $( lastItem ).hide().fadeIn(500);
        };

        return lastItem;
    };

    // ! WIP I belive this f is a bit dangerous since it makes all instances ids "dynamical"
    function f_updateInstances() {
        // WIP the instance is initially hidden by CSS class then when all graphical changes are finished it is shown by removing said class
        // const count =  _Q.qS( "#v-planner .box-instances" ).childElementCount;
        let y = 1;
        for ( const instance of o_Planner.DOMNode.querySelectorAll( ".instance" ) ) {
            instance.id = `p-instance-${y}`;
            instance.querySelector( "fieldset" ).name = `p-instance-${y}`;
            // Si el valor del contador y es menor q 10 agregar un 0 al string
            instance.querySelector( ".instance--num" ).textContent = ( y < 10 ) ? `0${y}` : y;
            y++;
        };
    };

    function f_updateNewInstance( instance ) {
        // WIP the instance is initially hidden by CSS class then when all graphical changes are finished it is shown by removing said class
        const count =  o_Planner.DOMNode.querySelector( ".box-instances" ).childElementCount;
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
            o_Planner.DOMNode.querySelector( "form" ).reset();
            f_addInstance();
            return;
        };
        f_updateInstances();
        const newTarget = box.children[instanceNum] ?
            box.children[instanceNum].querySelector( ".item.live" )
        :
            box.children[0].querySelector( ".item.live" )
        ;
        // ? WIP deberia poner toda la instancia en blanco antes? creo q no es neceasario ya q se llama a f_updateInstances
        f_calcInstances( false, newTarget );
    };

    function f_addInstance( evt, startingItemsQ = 1 ) {
        const box = o_Planner.DOMNode.querySelector( ".box-instances" );
        box.insertAdjacentHTML( "beforeend", e_Instance_new );
        // A los botones de la ultima .instance le agrega sus eventos
        const instance = box.children[ ( box.childElementCount - 1 ) ];
        // ! WIP escribir las lineas usando querySelectorAll as?? si cambia la cantidad de botones que hacen lo mismo no importa
        // onclick
        instance.querySelector( ".delInstance" ).addEventListener( "click", f_delInstance );
        instance.querySelector( ".item--part.btn.addItem" ).addEventListener( "click", f_addItem );

        f_addItem( false, instance.querySelector( ".box-items" ), startingItemsQ );

        f_updateNewInstance( instance );

        return instance;
    };

    function f_init() {
        // A los botones iniciales les agrega la funcion correspondiente para agregar o borrar
        // El uso de #v-planner es por GPS CSS
        /* ! WIP Hay varios errores aqui se tendiran q agregar las sub secciones .box-instances o div.box-instances, .action y .box-instances para q los selectores no afecten otras partes q puedan tener clases similares pero me tira error o ignora. */
                // for ( const btn of _Q.qSA( "#v-planner .item--part.btn.addItem" ) )
                //     btn.addEventListener( "click", f_addItem );
                    // Es un ejemplo del metodo q usaba antes q por alguna razon fallaba, revisar bien la especificacion de los querySelector.
        o_Planner.DOMNode.querySelector( "form" ).reset();

        for ( const instance of o_Planner.DOMNode.querySelectorAll( ".instance" ) ) {
            const addItem  = instance.querySelector( ".addItem" );
            addItem.addEventListener( "click", f_addItem );

            const delInstance  = instance.querySelector( ".delInstance" );
            delInstance.addEventListener( "click", f_delInstance );

            for ( const item of instance.querySelectorAll( ".item.live" ) ) {
                // for ( const part of item.querySelectorAll( ".item--part" ) ) {
                // };
                const rawPrice = item.querySelector( ".rawPrice" );
                rawPrice.addEventListener( "change", f_calcInstances );

                const discount = item.querySelector( ".discount" );
                discount.addEventListener( "change", f_calcInstances );

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

        for ( const btn of o_Planner.DOMNode.querySelectorAll( ".addInstance" ) )
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

    // On .rawPrice OR .discount change
    // On .instance OR .item delete
    // Or manually specifing aux as an .item
    // Reads prev instance then mods current and post
    // ! WIP DEFINIR ARGUMENTOS ver si se puede armar para q tome un item en vez d evento
    /* Columnas:
        refund   = reintegro SOLO de ese movimiento
        saldoPP  = saldo de Puntos Plus Pagos HASTA el momento
        subSpent = dinero de los Fondos Iniciales usado en ESE movimiento agotando antes el saldoPP
    */
    /* Equaciones
        Orden de Calculo
            1?? PPPLeft
            2?? refund (de la instancia)
            3?? saldoPP (de la instancia)
            4?? subSpent (de la instancia)
            5?? fundsLeft
            6?? purchasePower

        B = Tope de Reintegro Mensual - sum( prevRefund )
        PPPLeft = B > 0 ? B : 0

        A = ( sum( instanceRaw$ ) - sum( instanceFinal$ ) )
        refund = A > PPPLeft ? PPPLeft : A

        C = sum ( instanceRaw$ )
        D = ( prevRefund + prevSaldoPP ) - C
        saldoPP = D > 0 ? D > 0

        E = -( D )
        subSpent = E > 0 ? E : 0
            Si E es negativa significa q no hay q no hay necesidad de usar dinero de los Fondos Iniciales

        fundsLeft = funds - sum( subSpent )

        1) purchasePower = ( funds + sum ( refund ) ) - sum( raw$ )
        2) sum ( raw$ ) = sum( final$ ) + sum ( refund )

        ( funds + sum ( refund ) ) - ( sum( final$ ) + sum ( refund ) )
        funds + sum ( refund ) - sum( final$ ) - sum ( refund )

        purchasePower = funds - sum( final$ )
    */
    function f_calcInstances( evt, aux ) {
        const trgItem = aux ? aux : evt.target.closest( ".item" );
        const trgInstance = trgItem.closest( ".instance" );
        const trgInstanceNum = +trgInstance.querySelector( ".instance--num" ).textContent;

        const planner = o_Planner.DOMNode; // ? Combendria usar trgItem closest planner?
        const box = planner.querySelector( ".box-instances" );
        // const instancesCount = box.childElementCount;
        let tmp = 0, sumRefund = 0;

        // Calcs Item's finalPrice
        // ! Esta linea es la q hace necesario q se pase el .item a la funci??n
        trgItem.querySelector( ".finalPrice" ).value = ( trgItem.querySelector( ".rawPrice" ).value * ( ( 100 - trgItem.querySelector( ".discount" ).value ) / 100 ) ).toFixed( 2 );

        // Ciclo para la data necesaria de las Instancias anteriores
        // Por ahora solo usado para calcular sumRefund y PPPLeft
        for ( let i = 1 ; i < trgInstanceNum ; i++ ) {
            const inst = box.children[i];
            sumRefund += +( inst.querySelector( ".subRefund" ).value );
        };

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

        // .totals
        planner.querySelector( ".PuntosPlusPagosLeft" ).value = PPPLeft.toFixed( 2 );

        let funds = +planner.querySelector( ".funds" ).value || 0;
        // fundsLeft = funds - sumSubSpent
        tmp = 0;
        for ( const field of planner.querySelectorAll( ".subSpent" ) )
            tmp += +field.value;
        planner.querySelector( ".fundsLeft" ).value = ( funds - tmp ).toFixed( 2 );

        // purchasePower = funds - sumFinalPrice
        tmp = 0;
        for ( const field of planner.querySelectorAll( ".live .finalPrice" ) )
            tmp += +field.value;
        planner.querySelector( ".purchasePower" ).value = ( funds - tmp ).toFixed( 2 );
    };

    function f_reset( evt, tabulaRasa ) {
        o_Planner.DOMNode.querySelector( "form" ).reset();
        // $( o_Planner.DOMNode ).trigger("reset");
        for ( const kid of o_Planner.DOMNode.querySelector( ".box-instances" ).querySelectorAll( ".instance" ) )
            kid.remove();
        if ( !tabulaRasa )
            f_addInstance();
        /* !!! WIP Se necesita algo para determinar q realmente se halla borrado todo ya q sino no seria un comienzo de 0 verdadero, sino hacer el proceso de colocar todo en 0 antes. O verificar correctamente si los proximos calculos podrian levantar los valores fantasmas.
        */
    };

    function f_calc() {

    };

    /* Map
        data = [ instance, instance, ... ]
            instance = { box-items: items..., subResults: subResults... }
                box-items = [ item, item, ... ]
                    item = { field.name: field.value, field.name: field.value, ... }
                subResults = { field.name: field.value, field.name: field.value, ... }

        data = [
            { // p-instance-1
                [ // box-items
                    { order: value, category: value, description: value, rawPrice: value, discount: value, finalPrice: value }, // item
                    { order: value, category: value, description: value, rawPrice: value, discount: value, finalPrice: value }, // item
                    { order: value, category: value, description: value, rawPrice: value, discount: value, finalPrice: value }  // item
                ],
                { field.name: field.value, field.name: field.value, ... } // subResults
            },
            { // p-instance-2
                [ // box-items
                    { order: value, category: value, description: value, rawPrice: value, discount: value, finalPrice: value }  // item
                ],
                { field.name: field.value, field.name: field.value, ... } // subResults
            }
        ]
    */
    function f_stoPush () {

        // ! Correr Validacion antes de grabar
        // ! Agregar Confirmacion

        const rootNode = o_Planner.DOMNode;
        const data = [];
        const box = rootNode.querySelector( ".box-instances" );

        // Uso fors i para garantizar q se mantenga el orden
        for ( let i = 0 ; i < box.childElementCount ; i++ ) {
            const inst = box.children[i];
            data[i] = { "box-items": [], subResults: {} };
            const boxItems = inst.querySelector( ".box-items" );
            for ( let t = 0 ; t < boxItems.childElementCount ; t++ ) {
                const item = boxItems.children[t];
                data[i]["box-items"][t] = {};
                for ( const field of item.children ) {
                    let nam3 = field.name;
                    if ( nam3 )
                        data[i]["box-items"][t][nam3] = field.value;
                };
            };
            for ( const field of inst.querySelector( ".subResults" ).children ) {
                let nam3 = field.name;
                if ( nam3 )
                    data[i]["subResults"][nam3] = field.value;
            };
        };

        const payload = {
            data: data,
            funds: rootNode.querySelector( ".funds" ).value,
            monthlyRefund: rootNode.querySelector( ".monthlyRefund" ).value,
            PuntosPlusPagosLeft: rootNode.querySelector( ".PuntosPlusPagosLeft" ).value,
            purchasePower: rootNode.querySelector( ".purchasePower" ).value,
            fundsLeft: rootNode.querySelector( ".fundsLeft" ).value
        };

        // Uso el id del Planner como key
        localStorage.setItem( `${rootNode.id}`, JSON.stringify ( payload ) );

        // Flash Button
    };

    function f_stoPop () {
        // ! Agregar Confirmacion

        f_reset( false, true );

        const rootNode = o_Planner.DOMNode;
        const payload = JSON.parse( localStorage.getItem( rootNode.id ) );
        const data = payload.data;

        rootNode.querySelector( ".monthlyRefund" ).value = payload.monthlyRefund;
        rootNode.querySelector( ".funds" ).value = payload.funds;

        // Uso fors i para garantizar q se mantenga el orden
        for ( let i = 0 ; i < data.length ; i++ ) {
            const dataI = data[i]["box-items"];
            const inst = f_addInstance( false, dataI.length );
            const boxItems = inst.querySelector( ".box-items" );
            for ( let t = 0 ; t < dataI.length ; t++ ) {
                const item = boxItems.children[t];
                for ( const field of item.children )
                    field.value = dataI[t][field.name];
            };
            for ( const field of inst.querySelector( ".subResults" ).children )
                field.value = data[i]["subResults"][field.name];
        };

        rootNode.querySelector( ".PuntosPlusPagosLeft" ).value = payload.PuntosPlusPagosLeft;
        rootNode.querySelector( ".purchasePower" ).value = payload.purchasePower;
        rootNode.querySelector( ".fundsLeft" ).value = payload.fundsLeft;

        // Flash Button
    };

    function f_stoClear () {
        // ! Agregar Confirmacion

        localStorage.clear();
        // o_Planner.DOMNode.querySelector( "form" ).reset();
            // revisar docs de clear no sea cosa q borre de otras paginas, pero no deberia
        //localStorage.removeItem( key )
        // decidir si limpia el form tambien, creo q seria mejor q no y modificar de reset a limpiar?

        // Flash Something to let the user know it worked, may be the button itself
    };
/* +Functions */


/* +Header */
    f_loadData(); // ! WIP Mejor disparar esta funcion con un evento para garantizar q este todo list
    // ! WIP something more reliable or set the jQuery script tag better
        // load?
    // f_init();
    // $( window ).on( "load", function() {
    $( document ).ready( function() {
        f_init();
    });
/* +Header */



// La carga de categories.json y otros archivos definibles por el usuario q tengan una definicion como categories = f_validate(user_provided.json) || default_categories.json
// !!!!!!! Al agregar items y tags crear con JS CSS q use addContent a una clase, entonces el addItem, addIntance, del btns, y la creacion de categorias solo tienen q agregar lo minimo y luego CSS se encarga del resto.
// Hay 3 niles, inicio de la app, nivel instancia, nivel item
// Mas q usar un boton calcular seria m??s interesante q se dispare un evento "nums changed" y calcula


/* +SOURCES */
/*
    Map
        https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
            "Iterating Map with for..of"
            "Relation with Array objects"
            "Iterating Map with forEach()"
                Parece q tiene mucho para mejorar aun este metodo, ademas parese ser bastante m??s lento. Puede generar codigo m??s claro y espero q a futuro lo mejoren pero no conosco demaciado de la trajectoria de JavaScript como para saber q esperar.
                        https://blog.devgenius.io/3-bad-use-cases-of-javascripts-foreach-loop-add3600a8895
                            "In the forEach loop, we are invoking the callback function on every iteration. This additional scope leads to slower speeds compared to the for loop. The for loop uses an initializing statement and a conditional that is evaluated at every iteration. That means lowered cost compared to the forEach."
*/
/* +SOURCES */
