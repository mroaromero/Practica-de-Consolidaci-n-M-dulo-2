$(document).ready(function() {
  var cuerpoTabla = $("#cuerpoTabla");
  var datosOriginales = [];

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

  $("#cuerpoTabla").on("click", "img", function() {
    var imgSrc = $(this).attr("src");
    var modal = $("#miModal");
    var modalImg = $("#img01");
    modalImg.attr("src", imgSrc);
    var captionText = $("#caption");
    captionText.html($(this).closest("tr").find("td:eq(0)").text());
    modal.show();
  });

  $(".close").click(function() {
    $("#miModal").hide();
  });

  function ordenAlfabetico() {
    var filas = $("#cuerpoTabla tr").get();
    filas.sort(function(a, b) {
      var aText = $(a).find("td:eq(0)").text().toUpperCase();
      var bText = $(b).find("td:eq(0)").text().toUpperCase();
      return aText.localeCompare(bText);
    });
    $.each(filas, function(index, fila) {
      cuerpoTabla.append(fila);
    });
  }

  function ordenarPorNivel() {
    var niveles = ["Mega", "Ultimate", "Armor", "Champion", "Rookie", "Training", "In Training", "Fresh"];
    var filas = cuerpoTabla.find("tr").get();
    filas.sort(function(a, b) {
      var aNivel = $(a).find("td:eq(2)").text();
      var bNivel = $(b).find("td:eq(2)").text();
      return niveles.indexOf(aNivel) - niveles.indexOf(bNivel);
    });
    $.each(filas, function(index, fila) {
      cuerpoTabla.append(fila);
    });
  }

  function tabla(datos) {
    cuerpoTabla.html("");

    if (!Array.isArray(datos)) {
      datos = [datos];
    }

    for (var i = 0; i < datos.length; i = i + 1) {
      var fila = $("<tr></tr>");
      var columna1 = $("<td></td>");
      var columna2 = $("<td></td>");
      var columna3 = $("<td></td>");
      var img = $("<img>");
      cuerpoTabla.append(fila);
      fila.append(columna1, columna2, columna3);
      columna1.html(datos[i].name);
      columna2.append(img);
      columna3.html(datos[i].level);
      img.attr("src", datos[i].img);
    }
  }

  cargarTabla();

  $("#BtnNombre").click(function() {
    ordenAlfabetico();
  });

  $("#BtnNivel").click(function() {
    ordenarPorNivel();
  });
  
  $("#inputBuscar").on("input", function() {
    filtrarTabla();
  });
  
  function filtrarTabla() {
    var busqueda = $("#inputBuscar").val().toLowerCase();
    var resultados;
    if (busqueda === "") {
      resultados = datosOriginales;
    } else {
      resultados = datosOriginales.filter(function(digimon) {
        return digimon.name.toLowerCase().indexOf(busqueda) > -1;
      });
    }
    tabla(resultados);
  }
});



