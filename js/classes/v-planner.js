/* +Header */
const o_Planner = {
    HTML: _Q.qID( "v-planner--form" ),

    categories: {},

    m_validate: function() {
        let items = _Q.qSA("item--part")

        /*  return htmlValidators[validationType](element) ?
            true
        :
            false */
    }
};

const o_Item_new = `
    <div class="item">
        <button class="item--part btn yDrag" type="button"></button>
        <input type="number" class="item--part order" name="order" min="00" max="99" value="00">
        <select class="item--part category" name="category">
            <option value="normal">Populate by Code</option>
            <option value="normal">12345678901234567890</option>
        </select>
        <input type="text" class="item--part description" name="description">
        <input type="number" class="item--part rawPrice" name="rawPrice">
        <select class="item--part discount" name="discount">
            <option value="30" selected>30%</option>
        </select>
        <output class="item--part finalPrice" name="finalPrice"></output>
        <button class="item--part btn delItem" type="button"></button>
    </div>
`;

function f_addItem() {
    _Q.qS( "fieldset:nth-child( -1 )" ).innerHTML = o_Item_new;
};

/* +Header */
    const e_planner = _Q.qID( "v-planner--form" );
    _Q.qS( ".item--part.btn.addItem" ).addEventListener( "click", f_addItem );
/* +Header */



// La carga de categories.json y otros archivos definibles por el usuario q tengan una definicion como categories = f_validate(user_provided.json) || default_categories.json
// !!!!!!! Al agregar items y tags crear con JS CSS q use addContent a una clase, entonces el addItem, addIntance, del btns, y la creacion de categorias solo tienen q agregar lo minimo y luego CSS se encarga del resto.
















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

        console.log( fault );

        return false
    }
}



o_Planner.m_validate()

let asd = new c_Item();
// asd.rawPrice = 1000;
console.log( asd.m_validate() );


// let e_planner = _Q.qID( "v-planner--form" );
