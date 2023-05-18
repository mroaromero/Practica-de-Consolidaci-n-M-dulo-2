$(document).ready(function() {
    const cuerpoTabla = $("#cuerpoTabla");
    let datosOriginales = [];
  
    // Cargar datos desde la API
    function cargarTabla() {
      $.ajax({
        type: "get",
        url: "https://digimon-api.vercel.app/api/digimon",
        dataType: "json",
        success: function(response) {
          datosOriginales = response;
          tabla(response);
        }
      });
    }
  
    // Mostrar imagen en el modal
    $("#cuerpoTabla").on("click", "img", function() {
      const imgSrc = $(this).attr("src");
      const modal = $("#miModal");
      const modalImg = $("#img01");
      modalImg.attr("src", imgSrc);
      const captionText = $("#caption");
      captionText.html($(this).closest("tr").find("td:eq(0)").text());
      modal.show();
    });
  
    // Cerrar modal
    $(".close").click(function() {
      $("#miModal").hide();
    });
  
    // Ordenar tabla alfabéticamente
    function ordenAlfabetico() {
      const filas = $("#cuerpoTabla tr").get();
      filas.sort(function(a, b) {
        const aText = $(a).find("td:eq(0)").text().toUpperCase();
        const bText = $(b).find("td:eq(0)").text().toUpperCase();
        return aText.localeCompare(bText);
      });
      $.each(filas, function(index, fila) {
        cuerpoTabla.append(fila);
      });
    }
  
    // Ordenar tabla por nivel
    function ordenarPorNivel() {
      const niveles = ["Mega", "Ultimate", "Armor", "Champion", "Rookie", "Training", "In Training", "Fresh"];
      const filas = cuerpoTabla.find("tr").get();
      filas.sort(function(a, b) {
        const aNivel = $(a).find("td:eq(2)").text();
        const bNivel = $(b).find("td:eq(2)").text();
        return niveles.indexOf(aNivel) - niveles.indexOf(bNivel);
      });
      $.each(filas, function(index, fila) {
        cuerpoTabla.append(fila);
      });
    }
  
    // Generar tabla con los datos
    function tabla(datos) {
      cuerpoTabla.html("");
  
      if (!Array.isArray(datos)) {
        datos = [datos];
      }
  
      datos.forEach(function(dato) {
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
  
    // Ordenar alfabéticamente al hacer clic en el botón
    $("#BtnNombre").click(function() {
      ordenAlfabetico();
    });
  
    // Ordenar por nivel al hacer clic en el botón
    $("#BtnNivel").click(() => {
      ordenarPorNivel();
    });
    
    // Filtrar tabla en tiempo real
    $("#inputBuscar").on("input", function() {
      filtrarTabla();
    });
    
    // Filtrar tabla por nombre
    function filtrarTabla() {
      const inputValor = $("#inputBuscar").val().toLowerCase();
      const datosFiltrados = datosOriginales.filter(function(dato) {
        return dato.name.toLowerCase().includes(inputValor);
      });
      tabla(datosFiltrados);
    }
})