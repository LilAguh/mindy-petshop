const api = "https://apipetshop.herokuapp.com/api/articulos";

fetch(api)
  .then((Response) => Response.json())
  .then((data) => mostrarPagina(data));

const mostrarPagina = (data) => {
  const arrayShop = data.response;
  
  localStorage.removeItem('farmacia')

  const contenedorCarta = document.querySelector(".cartas"); // DONDE SE IMPRIME LAS CARTAS


  let todosLosJuguetes = arrayShop.filter((producto) => producto.tipo == "Juguete"
  );
  console.log(todosLosJuguetes);
  let todosLosMedicamentos = arrayShop.filter((producto) => producto.tipo == "Medicamento"
  );
  console.log(todosLosMedicamentos);


  let preciosBajos = todosLosMedicamentos.filter(e =>e.precio < 500)
  preciosBajos.map(e=> e.categoria="-$500")
  let preciosMedios = todosLosMedicamentos.filter(e =>e.precio >= 500 && e.precio < 1000)
  preciosMedios.map(e=>e.categoria="$500-$1000")
  let preciosAltos = todosLosMedicamentos.filter(e=> e.precio >= 1000)
  preciosAltos.map(e=>e.categoria="+$1000")

  let arrayMedicamentos= preciosBajos.concat(preciosMedios).concat(preciosAltos) // TODOS LOS MEDICAMENTOS


  const cajaCheckbox = document.querySelector(".checkPrecios")
  const todasLasCategorias = arrayMedicamentos.map(medicamento => medicamento.categoria)
  const categoriasSinRepetidos = [...new Set(todasLasCategorias)]

  

// checkbox en el html

 function crearCheckbox(){
  div = `
    <div> 
      <input type="search" name="search" id="search" placeholder="Search" aria-label="Search" />
    </div>
  `
  categoriasSinRepetidos.forEach(checkbox =>{
    div +=`
    <div class="form-check form-check-inline">
      <input class="form-check-input" type="checkbox" id="checkBox" value="${checkbox}">
      <label class="form-check-label" for="inlineCheckbox1"><b>${checkbox}</b></label>
    </div>`
  })
  cajaCheckbox.innerHTML = div
 }
 crearCheckbox()


 let checkboxArray =[]
 let todosLosCheckbox = document.querySelectorAll("input[type='checkbox']")
 function clickCheckbox(){
   todosLosCheckbox.forEach(checkbox =>{
     checkbox.addEventListener("click", e =>{
       let checked = e.target.checked
       if(checked){
         checkboxArray.push(e.target.value)
        //  console.log(checkboxArray)
         filtrar()
        }else{
          checkboxArray = checkboxArray.filter(uncheck => uncheck !== e.target.value)
          // console.log(checkboxArray)
          filtrar()
        }
      })
    })
  }
  clickCheckbox()


  let textSearch =""
  let inputSearch = document.querySelector("#search")
  inputSearch.addEventListener("keyup", (evento)=>{
    textSearch= evento.target.value
  
    filtrar()
  })

  function filtrar(){
    let contenido =[]
    if(checkboxArray.length > 0 && textSearch !== ""){
      checkboxArray.map(event => {contenido.push(...arrayMedicamentos.filter(evento => evento.nombre.toLowerCase().includes(textSearch.trim().toLowerCase()) && evento.categoria == event))})
    }else if(checkboxArray.length > 0 && textSearch === ""){
      checkboxArray.map(event => contenido.push(...arrayMedicamentos.filter(evento => evento.categoria == event)))
    }else if(checkboxArray.length == 0 && textSearch !== ""){
      contenido.push(...arrayMedicamentos.filter(evento => evento.nombre.toLowerCase().includes(textSearch.trim().toLowerCase())))
    }else{
      contenido.push(...arrayMedicamentos)
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
      carta += ` <div class="card gap-2 d-flex flex-wrap m-4 justify-content-between" style="width: 18rem;">
                     <img src="${item.imagen}" class="card-img-top imagen" alt="${item.nombre}"> 
                    <h5 class="card-title">${item.nombre}</h5>
                    <p class="container card-text">${item.tipo}</p>
                    <p class="container card-text">${item.descripcion}</p>
                    <div class="d-flex justify-content-around ">
                    <p>Price: $<span class="precio">${item.precio}</span></p>
                    ${item.stock > 5 ? `Stock: <p class="stock">${item.stock}</p>` : `<p class="alert-danger text-center"><b>Ultima(s) <span class="stock">${item.stock}</span> unidad(es)!</b></p>`}
                    </div>
                    <button class="boton " id='agregar${item._id}' >comprar</button>
                    </div>
                    `;
      contenedorCarta.innerHTML = carta;
      
      
    })}// final function
    // crearProducto(todosLosJuguetes);
    
// carrito
let productoComprado = []
function getEventos(){
  contenedorCarta.addEventListener("click", agregarProducto)// eventos de click - agrega al carrito
  contenedorCarrito.addEventListener("click",eliminarProducto)// eventos de click- saca del carrito
  
}
getEventos()



function eliminarProducto(e){
  if(e.target.classList.contains("close")){ // true si lo q clickea es la X
    const eliminarId = e.target.getAttribute("id") 

    productoComprado.forEach(valor => {
      if(valor.id == eliminarId){ // si lo q compro [] es lo mismo q lo q clickeo
        let precioActualizado = parseFloat(valor.precio) * parseFloat(valor.cantidad);
        
        totalCartas = totalCartas - precioActualizado
        totalCartas = totalCartas.toFixed(2)
      }
    })

    productoComprado = productoComprado.filter(producto => producto.id !== eliminarId)
    contadorCarrito-- // siel id de lo q compro es igual a lo q clickeo, lo saca
  }
  if(productoComprado.length === 0){ // si no compre nada, actualizar total y nro d carro
    mostrarNumeroCarrito.innerHTML = 0;
    totalCompra.innerHTML = 0
  }
  cargarHtml()
}
// Creo el boton al comprar un producto
let divCarro = document.querySelector('.carrito-html')
let boton = document.createElement('div')
boton.className = 'divButon'
boton.innerHTML=
`<button id="butonBuy" >Comprar</botton>`
divCarro.appendChild(boton)


function agregarProducto(e){
  if(e.target.classList.contains("boton")){ // si clickie comprar
    const productoSeleccionado = e.target.parentElement // 
   
    leerInfo(productoSeleccionado) // la etiqueta de la card
// 

    if(productoComprado.length===1 && productoComprado[0].cantidad===1){
      let buttonLocal =  document.getElementById("butonBuy")
      console.log(buttonLocal)
      buttonLocal.addEventListener("click",function(){
        alert("tu pedido ya fue agregado al carrito")
        compra(productoComprado)
      })
    }

  }
}

function compra (prod){
  if(localStorage.key('farmacia')){
    localStorage.removeItem('farmacia')
    localStorage.setItem("farmacia",JSON.stringify(prod))
  }else{
    localStorage.setItem("farmacia",JSON.stringify(prod))
  }

  

}

function leerInfo(producto){
  const infoProducto = {
    nombre: producto.querySelector(".card-title").textContent,
    tipo: producto.querySelector(".card-text").textContent,
    precio: producto.querySelector(".precio").textContent,
    imagen: producto.querySelector(".imagen").src,
    id: producto.querySelector(".boton").getAttribute("id"),
    stock: producto.querySelector(".stock").textContent,
    cantidad: 1
  }

  totalCartas =parseFloat(totalCartas) + parseFloat(infoProducto.precio) 
  totalCartas = totalCartas.toFixed(2)  // precio actual + precio producto

  const existe = productoComprado.some(producto => producto.id === infoProducto.id);
    if(existe){ // si existe ya un producto en el carrito, no lo agrega, suma la cantidad
      const prod = productoComprado.map(producto =>{
 
        
        if(producto.cantidad +1 <=parseInt(producto.stock) && (producto.id ===infoProducto.id)){
          // alert("NO HAY STOCK DE ESTE PRODUCTO")
          
            producto.cantidad++;
            return producto
          }else{
              return producto
            }
        
      })
      productoComprado = [...prod] // [productos comprados]

      let productoId = productoComprado.map(producto => producto.id)
      console.log(productoId)
      // localStorage.setItem("producto",productoComprado)
    }else{
      productoComprado = [...productoComprado,infoProducto] // el producto es nuevo
      contadorCarrito++
      console.log(producto.cantidad)
      // localStorage.clear()
    }

  cargarHtml()
  console.log(productoComprado)
  // localStorage.setItem("producto",productoComprado)
}



  function cargarHtml(){
    limpiar()
    productoComprado.forEach(producto =>{ // creacion de cartas en el carrito
      const div =document.createElement("div")
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

  function limpiar(){
    contenedorCarrito.innerHTML = ""
  }
  
      
}; // final del fetch
