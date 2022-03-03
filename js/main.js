/* +Classes and Objects */
/* +Header */
/* +Functions */
/* <3 */
/* +DELETE */
/* +SOURCES */


f_loadData();
/* No se si es un problema de como cargo la data o q , lo hable con la tutora pero no encontramos el porque a veces falla y a veces no. Se peude compensar refrescando varias veces y usando el boton Reiniciar. En Chrome falla mucho menos q en FireFox.
    Tendra q ver con como carga jQuery? usar Fetch en la carga de datos en vez d jQuery?
*/
// $( window ).on( "load", function() {
$( document ).ready( function() {
    f_initialSetup();
});
