// SCROLL TO TOP BUTTON
mybutton = document.getElementById("myBtn");

window.onscroll = function () { scrollFunction() };

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

// BUTTON MENU
let navItemContainer = document.querySelector('.navItemContainer')
let navToggle = document.querySelector('.navToggle')

navToggle.addEventListener('click', () => {
  navItemContainer.classList.toggle('navMenuVisible')
})



const api = "https://apipetshop.herokuapp.com/api/articulos";

fetch(api)
  .then((Response) => Response.json())
  .then((data) => mostrarPagina(data));

const mostrarPagina = (data) => {
  const arrayShop = data.response;

  localStorage.removeItem('producto')

  const contenedorCarta = document.querySelector(".cartas"); // DONDE SE IMPRIME LAS CARTAS


  let todosLosJuguetes = arrayShop.filter((producto) => producto.tipo == "Juguete"
  );
  console.log(todosLosJuguetes);


  let preciosBajos = todosLosJuguetes.filter(e => e.precio < 400)
  preciosBajos.map(e => e.categoria = "-$400")
  let preciosMedios = todosLosJuguetes.filter(e => e.precio >= 500 && e.precio < 800)
  preciosMedios.map(e => e.categoria = "$500-$800")
  let preciosAltos = todosLosJuguetes.filter(e => e.precio >= 900)
  preciosAltos.map(e => e.categoria = "+$900")

  let arrayJuguetes = preciosBajos.concat(preciosMedios).concat(preciosAltos) // TODOS LOS MEDICAMENTOS


  const cajaCheckbox = document.querySelector(".checkPrecios")
  const todasLasCategorias = arrayJuguetes.map(medicamento => medicamento.categoria)
  const categoriasSinRepetidos = [...new Set(todasLasCategorias)]



  // checkbox en el html

  function crearCheckbox() {
    div = `
    <div class="SearchBox"> 
    <input autocomplete="off" type="text" class="SearchBox-input" placeholder="Buscar Producto" id="search"/>
    <button class="SearchBox-button" id="searchBoxButton">
                        <img src="../images/Icons/lupa.png" class="SearchBox-icon" alt="search icon" />
    </button>
    </div>
  `
    categoriasSinRepetidos.forEach(checkbox => {
      div += `
    <div class="form-check form-check-inline m-2">
      <input class="form-check-input inputCheck" type="checkbox" id="flexCheckDefault" value="${checkbox}">
      <label class="form-check-label" for="inlineCheckbox1"><b>${checkbox}</b></label>
    </div>`
    })
    cajaCheckbox.innerHTML = div
  }
  crearCheckbox()


  let checkboxArray = []
  let todosLosCheckbox = document.querySelectorAll("input[type='checkbox']")
  function clickCheckbox() {
    todosLosCheckbox.forEach(checkbox => {
      checkbox.addEventListener("click", e => {
        let checked = e.target.checked
        if (checked) {
          checkboxArray.push(e.target.value)
          //  console.log(checkboxArray)
          filtrar()
        } else {
          checkboxArray = checkboxArray.filter(uncheck => uncheck !== e.target.value)
          // console.log(checkboxArray)
          filtrar()
        }
      })
    })
  }
  clickCheckbox()


  let textSearch = ""
  let inputSearch = document.querySelector("#search")
  inputSearch.addEventListener("keyup", (evento) => {
    textSearch = evento.target.value

    filtrar()
  })

  function filtrar() {
    let contenido = []
    if (checkboxArray.length > 0 && textSearch !== "") {
      checkboxArray.map(event => { contenido.push(...arrayJuguetes.filter(evento => evento.nombre.toLowerCase().includes(textSearch.trim().toLowerCase()) && evento.categoria == event)) })
    } else if (checkboxArray.length > 0 && textSearch === "") {
      checkboxArray.map(event => contenido.push(...arrayJuguetes.filter(evento => evento.categoria == event)))
    } else if (checkboxArray.length == 0 && textSearch !== "") {
      contenido.push(...arrayJuguetes.filter(evento => evento.nombre.toLowerCase().includes(textSearch.trim().toLowerCase())))
    } else {
      contenido.push(...arrayJuguetes)
    }
    crearProducto(contenido)

  }

  filtrar()

  ////////////// VARIABLES

  let contenedorCarrito = document.querySelector(".carta-carrito")
  let totalCompra = document.querySelector(".precioTotal")
  let mostrarNumeroCarrito = document.querySelector(".cantidadCarrito")
  // const carritoHTML= document.querySelector(".carrito-html")



  let totalCartas = 0
  let contadorCarrito = 0

  function crearProducto(array) {
    let carta = "";
    array.forEach((item) => {
      carta += ` 
      <div class="card card2 style="width: 18rem;">
        <img src="${item.imagen}" class="card-img-top imagen" alt="${item.nombre}"> 
        <div class="card-body d-flex flex-column justify-content-evenly p-2">
          <h5 class="card-title">${item.nombre}</h5>
          <p class="container card-text">${item.tipo}</p>

            <div class="w3-container">
              <button onclick="document.getElementById('${item.nombre}').style.display='block'" class=" botondes">Descripcion  <i class="fa-solid fa-plus"></i></button>
              <div id="${item.nombre}" class="w3-modal w3-animate-opacity">
                <div class="w3-modal-content">
                  <header class="w3-container w3-teal"> 
                    <span onclick="document.getElementById('${item.nombre}').style.display='none'" 
                      class="w3-button w3-display-topright " >&times;
                    </span>
                    <h2 class="titulomodal">${item.nombre}</h2>
                  </header>
                  <div class="w3-container">
                    <p class="descripcion">${item.descripcion}</p>
                  </div>
                  <footer class="w3-container w3-teal">
                    <p">${item.tipo}</p>
                  </footer>
                </div>
              </div>
            </div>

            <div class="d-flex justify-content-around ">
              <p class="precio">Precio:$<span class="precio card-text2">${item.precio}</span></p>
              ${item.stock > 5 ? `<p class="stock precio">Stock:${item.stock}</p>` : `<p class=" precio text-center ultimas"><b>Ultima(s) <span class="precio stock">${item.stock}</span> unidades!</b></p>`}
            </div>
        </div>
        <button class="boton btn d-flex justify-content-around align-items-center btn-buy" id='agregar${item._id}'>Agregar al carrito <i class="fa-solid fa-cart-shopping"></i></button>
      </div>
                    `;
      contenedorCarta.innerHTML = carta;


    })
  }// final function
  // crearProducto(todosLosJuguetes);

  // carrito

  let productoComprado = []
  function getEventos() {
    contenedorCarta.addEventListener("click", agregarProducto)// eventos de click - agrega al carrito
    contenedorCarrito.addEventListener("click", eliminarProducto)// eventos de click- saca del carrito

  }
  getEventos()



  function eliminarProducto(e) {
    if (e.target.classList.contains("close")) { // true si lo q clickea es la X
      const eliminarId = e.target.getAttribute("id")

      productoComprado.forEach(valor => {
        if (valor.id == eliminarId) { // si lo q compro [] es lo mismo q lo q clickeo
          let precioActualizado = parseFloat(valor.precio) * parseFloat(valor.cantidad);

          totalCartas = totalCartas - precioActualizado
          totalCartas = totalCartas.toFixed(2)
        }
      })

      productoComprado = productoComprado.filter(producto => producto.id !== eliminarId)
      contadorCarrito-- // siel id de lo q compro es igual a lo q clickeo, lo saca
    }
    if (productoComprado.length === 0) { // si no compre nada, actualizar total y nro d carro
      mostrarNumeroCarrito.innerHTML = 0;
      totalCompra.innerHTML = 0
    }
    cargarHtml()
  }
  // Creo el boton al comprar un producto
  let divCarro = document.querySelector('.carrito-html')
  let boton = document.createElement('div')
  boton.className = 'divButon'
  boton.innerHTML =
    `<button id="butonBuy" >Comprar</botton>`
  divCarro.appendChild(boton)


  function agregarProducto(e) {
    if (e.target.classList.contains("boton")) { // si clickie comprar
      const productoSeleccionado = e.target.parentElement // 
      console.log(productoSeleccionado)

      leerInfo(productoSeleccionado) // la etiqueta de la card
      // 

      if (productoComprado.length === 1 && productoComprado[0].cantidad === 1) {
        let buttonLocal = document.getElementById("butonBuy")
        console.log(buttonLocal)
        buttonLocal.addEventListener("click", function () {
          alert("tu pedido ya fue agregado al carrito")
          compra(productoComprado)
        })
      }

    }
  }

  function compra(prod) {
    if (localStorage.key('producto')) {
      localStorage.removeItem('producto')
      localStorage.setItem("producto", JSON.stringify(prod))
    } else {
      localStorage.setItem("producto", JSON.stringify(prod))
    }



  }

  function leerInfo(producto) {
    const infoProducto = {
      nombre: producto.querySelector(".card-title").textContent,
      tipo: producto.querySelector(".card-text").textContent,
      precio: producto.querySelector(".precio").textContent,
      imagen: producto.querySelector(".imagen").src,
      id: producto.querySelector(".boton").getAttribute("id"),
      stock: producto.querySelector(".stock").textContent,
      cantidad: 1
    }

    totalCartas = parseFloat(totalCartas) + parseFloat(infoProducto.precio)
    totalCartas = totalCartas.toFixed(2)  // precio actual + precio producto

    const existe = productoComprado.some(producto => producto.id === infoProducto.id);
    if (existe) { // si existe ya un producto en el carrito, no lo agrega, suma la cantidad
      const prod = productoComprado.map(producto => {


        if (producto.cantidad + 1 <= parseInt(producto.stock) && (producto.id === infoProducto.id)) {
          // alert("NO HAY STOCK DE ESTE PRODUCTO")

          producto.cantidad++;
          return producto
        } else {
          return producto
        }

      })
      productoComprado = [...prod] // [productos comprados]

      let productoId = productoComprado.map(producto => producto.id)
      console.log(productoId)
      // localStorage.setItem("producto",productoComprado)
    } else {
      productoComprado = [...productoComprado, infoProducto] // el producto es nuevo
      contadorCarrito++
      console.log(producto.cantidad)
      // localStorage.clear()
    }

    cargarHtml()
    console.log(productoComprado)
    // localStorage.setItem("producto",productoComprado)
  }



  function cargarHtml() {
    limpiar()
    productoComprado.forEach(producto => { // creacion de cartas en el carrito
      const div = document.createElement("div")
      div.classList.add("carta-carrito-top")
      div.innerHTML = `
          
          <img src="${producto.imagen}" class="imgCarrito" alt="${producto.nombre}">
          <div class="descripcion-carrito"> 
          <p>${producto.nombre}</p>
          <p>${producto.tipo}</p>
          <h5>$${producto.precio}</h5>
          <h5>cantidad ${producto.cantidad}</h5>
          </div>
         
          <button class="close" id="${producto.id}" >x</button>
         
          `
      contenedorCarrito.appendChild(div)
      totalCompra.innerHTML = totalCartas
      mostrarNumeroCarrito.innerHTML = contadorCarrito

    })
  }

  function limpiar() {
    contenedorCarrito.innerHTML = ""
  }



}; // final del fetch
