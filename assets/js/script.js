$(document).ready(function() {  // La función se ejecutará una vez que el documento HTML haya sido completamente cargado
    const cuerpoTabla = $("#cuerpoTabla");  // Declaración de Variables
    let datosOriginales = []; // Array
  
    function cargarTabla() {  // Cargar datos desde la API con ajax
      $.ajax({
        type: "get",
        url: "https://digimon-api.vercel.app/api/digimon",
        dataType: "json",
        success: function(response) { // Cuando la respuesta del servidor se recibe correctamente se ejecuta la función
          datosOriginales = response; // "response" contiene los datos obtenidos de una solicitud AJAX
          tabla(response);  // Generar y muestrauna una tabla en el documento HTML, utilizando los datos de respuesta recibidos
        }
      });
    }
  
    $("#cuerpoTabla").on("click", "img", function() { // Evento click para mostrar la imagen del modal
      const imgSrc = $(this).attr("src"); // Obtiene la ruta de la imagen del elemento actual, utilizando "this" para referirse al elemento
      const modal = $("#miModal");
      const modalImg = $("#img01");
      modalImg.attr("src", imgSrc);       // Utiliza el metodo .attr() de jQuery para obtener el valor del atributo "src" del elemento seleccionado
      const captionText = $("#caption");
      captionText.html($(this).closest("tr").find("td:eq(0)").text());  // Encuentra la fila padre más cercana del elemento actual, busca el primer elemento de la celda en esa fila y establece el contenido HTML de "captionText" con el texto obtenido de ese elemento
      modal.show(); // Muestra un elemento oculto en la interfaz gráfica con el método .show() de jQuery
    }); 
  
    $(".close").click(function() {  // Evento click en los elementos con clase "close" para ocultar el elemento modal con el ID "miModal"
      $("#miModal").hide();
    });
  
    function ordenAlfabetico() {  // Función para ordenar tabla alfabéticamente
      const filas = $("#cuerpoTabla tr").get(); // Selecciona y obtiene todas las filas de la tabla, generando un arreglo con los elementos seleccionados con el método .get() de jQuery
      filas.sort(function(a, b) { // Ordena el array de las filas por medio de la función
        const aText = $(a).find("td:eq(0)").text().toUpperCase(); // Extrae y almacena el texto en mayúsculas del primer elemento de la columna de una tabla
        const bText = $(b).find("td:eq(0)").text().toUpperCase(); // para el elemento (a) como para el elemento (b)
        return aText.localeCompare(bText);  // Comparación alfabética entre las cadenas de texto y devuelve un valor numérico que representa su orden
      });
      $.each(filas, function(index, fila) {
        cuerpoTabla.append(fila);
      }); // itera sobre cada elemento del arreglo filas con el método .each() de jQuery y agrega cada elemento al final del contenido de la tabla para reordenarla
    }
  
    function ordenarPorNivel() {  //Función para ordenar la tabla por nivel de cada Digimon
      const niveles = ["Mega", "Ultimate", "Armor", "Champion", "Rookie", "Training", "In Training", "Fresh"];
      const filas = cuerpoTabla.find("tr").get();
      filas.sort(function(a, b) {
        const aNivel = $(a).find("td:eq(2)").text();
        const bNivel = $(b).find("td:eq(2)").text();
        return niveles.indexOf(aNivel) - niveles.indexOf(bNivel);
      }); // Calcula la diferencia de índices entre dos elementos en el arreglo niveles, permitiendo ordenar los elementos de acuerdo a su posición en el arreglo
      $.each(filas, function(index, fila) {
        cuerpoTabla.append(fila);
      });
    }

    function tabla(datos) { // Función para generar la tabla con los datos
      cuerpoTabla.html("");
  
      if (!Array.isArray(datos)) {  // Verifica y convierte (datos) en arreglo para asegurar que sea válido en la función
        datos = [datos];
      }
  
      datos.forEach(function(dato) {  // Itera sobre cada elemento del arreglo y crea una fila en la tabla con los valores de cada elemento
        const fila = $("<tr></tr>");
        const columna1 = $("<td></td>");
        const columna2 = $("<td></td>");
        const columna3 = $("<td></td>");
        const img = $("<img>");
        cuerpoTabla.append(fila);
        fila.append(columna1, columna2, columna3);
        columna1.html(dato.name);
        columna2.append(img);
        columna3.html(dato.level);
        img.attr("src", dato.img);
      });
    }
  
    cargarTabla();
  
    $("#BtnNombre").click(function() {  // Ordena alfabéticamente al hacer click en el botón
      ordenAlfabetico();
    });
  
    $("#BtnNivel").click(() => {  // Ordena por nivel al hacer click en el botón
      ordenarPorNivel();
    });
    
    $("#inputBuscar").on("input", function() {  // Filtra la tabla en tiempo real
      filtrarTabla();
    });
    
    function filtrarTabla() { // Función para filtrar tabla por nombre
      const inputValor = $("#inputBuscar").val().toLowerCase(); // Obtiene el valor del campo de entrada con el método .val() de jQuery y lo convierte a minúsculas.
      const datosFiltrados = datosOriginales.filter(function(dato) {
        return dato.name.toLowerCase().includes(inputValor);
      }); // Filtra los datos según el nombre que coincida con el método .filter(), ignorando mayúsculas y minúsculas con el valor de búsqueda
      tabla(datosFiltrados);
    }
})