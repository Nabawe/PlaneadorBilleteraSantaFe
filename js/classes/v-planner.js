/* +Variables */
/* +Classes and Objects */
/* +Functions */
/* +Header */
/* +SOURCES */


/* +Classes and Objects */
const o_Planner = {
    "DOMNode": _Q.qId( "v-planner" ),
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
            <input type="text"  class="subRefund" name="subRefund" title="Reintegro del Movimiento" value="" readonly>
            <input type="text"  class="saldoPlusPagos" name="saldoPlusPagos" title="Variación del Saldo PlusPagos" value="" readonly>
            <input type="text"  class="subSpent" name="subSpent" title="Variación de los Fondos Iniciales" value="" readonly>
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
                f_calcInstances( evt );
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
    const item = evt.target.closest( ".item" );
    $( item ).animate({
        opacity: '0.5'
    }, 500)
        .slideUp(500, (
            // The callback is not sent any arguments, but this is set to the DOM element being animated. If multiple elements are animated, it is important to note that the callback is executed once per matched element, not once for the animation as a whole.
                // lo manda como un jQuery element
                // La Doc dice q no se le manda arg alguno pero estoy pudiendo usar evt bien
            function ( jQItem ) {
                const trgItem = evt.target.closest( ".item" );
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
};

// parnt = .box-items
function f_addItem( evt, aux, q = 1 ) {
    // btn q dispara ^ .nextLine ^ fieldset v .box-items
    // const parnt = evt.target.parentNode.parentNode.querySelector( ".box-items" );
    const parnt = aux ? aux : evt.target.closest( "fieldset" ).querySelector( ".box-items" );
    let lastItem;
    for ( let i = 0 ; i < q ; i++ ) {
        parnt.insertAdjacentHTML( "beforeend", e_Item_new );

        // Al ultimo item del .box-items correspondiente busca su boton delItem y le asigna su evento
        lastItem = parnt.children[ ( parnt.childElementCount - 1 ) ];
        lastItem.querySelector( ".item--part.btn.delItem" ).addEventListener( "click", f_delItem );
        lastItem.querySelector( ".item--part.rawPrice" ).addEventListener( "change", f_calcInstances );
        lastItem.querySelector( ".item--part.discount" ).addEventListener( "change", f_calcInstances );

        f_initSelects( lastItem );

        $( lastItem ).hide().fadeIn(500);
    };

    return lastItem;
};

function f_updateInstances() {
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
    f_calcInstances( false, newTarget );
};

function f_addInstance( evt, startingItemsQ = 1 ) {
    const box = o_Planner.DOMNode.querySelector( ".box-instances" );
    box.insertAdjacentHTML( "beforeend", e_Instance_new );
    // A los botones de la ultima .instance le agrega sus eventos
    const instance = box.children[ ( box.childElementCount - 1 ) ];
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
    o_Planner.DOMNode.querySelector( "form" ).reset();

    for ( const instance of o_Planner.DOMNode.querySelectorAll( ".instance" ) ) {
        const addItem  = instance.querySelector( ".addItem" );
        addItem.addEventListener( "click", f_addItem );

        const delInstance  = instance.querySelector( ".delInstance" );
        delInstance.addEventListener( "click", f_delInstance );

        for ( const item of instance.querySelectorAll( ".item.live" ) ) {
            const rawPrice = item.querySelector( ".rawPrice" );
            rawPrice.addEventListener( "change", f_calcInstances );

            const discount = item.querySelector( ".discount" );
            discount.addEventListener( "change", f_calcInstances );

            const delItem  = item.querySelector( ".delItem" );
            delItem.addEventListener( "click", f_delItem );

            f_initSelects( item );
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
function f_calcInstances( evt, aux ) {
    const trgItem = aux ? aux : evt.target.closest( ".item" );
    const trgInstance = trgItem.closest( ".instance" );
    const trgInstanceNum = +trgInstance.querySelector( ".instance--num" ).textContent;

    const planner = o_Planner.DOMNode;
    const box = planner.querySelector( ".box-instances" );
    let tmp = 0, sumRefund = 0;

    // Calcs Item's finalPrice
    // ! Esta linea es la q hace necesario q se pase el .item a la función
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
    for ( const kid of o_Planner.DOMNode.querySelector( ".box-instances" ).querySelectorAll( ".instance" ) )
        kid.remove();
    if ( !tabulaRasa )
        f_addInstance();
};

/* Map
    data = [ instance, instance, ... ]
        instance = [ item, item, ... ]
            item = { field.name: field.value, field.name: field.value, ... }

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
function f_stoPush () {
    const rootNode = o_Planner.DOMNode;
    const data = [];
    const box = rootNode.querySelector( ".box-instances" );

    // Uso fors i para garantizar q se mantenga el orden
    for ( let i = 0 ; i < box.childElementCount ; i++ ) {
        const inst = box.children[i];
        data[i] = [];
        const boxItems = inst.querySelector( ".box-items" );
        for ( let t = 0 ; t < boxItems.childElementCount ; t++ ) {
            const item = boxItems.children[t];
            data[i][t] = {};
            for ( const field of item.children ) {
                let nam3 = field.name;
                if ( nam3 )
                    data[i][t][nam3] = field.value;
            };
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
};

function f_stoPop () {
    f_reset( false, true );

    const rootNode = o_Planner.DOMNode;
    const payload = JSON.parse( localStorage.getItem( rootNode.id ) );
    const data = payload.data;

    rootNode.querySelector( ".monthlyRefund" ).value = payload.monthlyRefund;
    rootNode.querySelector( ".funds" ).value = payload.funds;

    // Uso fors i para garantizar q se mantenga el orden
    for ( let i = 0 ; i < data.length ; i++ ) {
        const inst = f_addInstance( false, data[i].length );
        const boxItems = inst.querySelector( ".box-items" );
        for ( let t = 0 ; t < data[i].length ; t++ ) {
            const item = boxItems.children[t];
            for ( const field of item.children )
                field.value = data[i][t][field.name];
        };
    };

    rootNode.querySelector( ".PuntosPlusPagosLeft" ).value = payload.PuntosPlusPagosLeft;
    rootNode.querySelector( ".purchasePower" ).value = payload.purchasePower;
    rootNode.querySelector( ".fundsLeft" ).value = payload.fundsLeft;
};

function f_stoClear () {
    localStorage.clear();
};
/* +Functions */
