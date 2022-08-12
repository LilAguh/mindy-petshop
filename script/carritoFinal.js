let juguetes = document.querySelector('.juguetes')
let farma = document.querySelector('.farma')
let totalDiv = document.getElementById('totalDiv')


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



function getData(){

    let prod =  JSON.parse(localStorage.getItem("producto"))
    let farm =  JSON.parse(localStorage.getItem("farmacia"))
    showProducts(prod,farm)
    let limpiar = document.querySelector('#limpiar')
    limpiarCarrito(limpiar)
  }
  getData()
  
let totalSum=document.querySelector("#totalSum")
      
function limpiarCarrito(elem,eleCheck){

  elem.addEventListener('click',()=>{
        farma.innerHTML=''
          juguetes.innerHTML=''
          totalSum.innerHTML=''

          eleCheck.style.display='none'
  })
}



function showProducts(e,y){
  
  let totalArr = []
    if(e!=null){
      e.map((e)=>{
          if(e.tipo=== "Juguete"){
              totalArr.push(e.precio)
           const farm =   document.createElement('tr')
           farm.innerHTML=`
           <td class="td1">${e.nombre}</td>
           <td class="td">${e.cantidad}</td>
           <td class="td">${e.precio}</td>
           
           `
           farma.appendChild(farm)
          }
      })

    }
  if(y!=null){
   y.map((y)=>{
       if(y.tipo==="Medicamento"){
           totalArr.push(y.precio)
           const jugue =   document.createElement('tr')
           jugue.innerHTML=`
           <td class="td1">${y.nombre}</td>
           <td class="td">${y.cantidad}</td>
           <td class="td">${y.precio}</td>
           
           `
           juguetes.appendChild(jugue)
   
       }

   })
  } 
  
if(totalArr.length>=1){
const sum = totalArr.reduce(
(previousValue, currentValue) => parseInt(previousValue)  + parseInt(currentValue),

);
console.log(sum)

let total = document.createElement('div')
total.class="total"
total.innerHTML=`
<h3 id='totalSum'>El total es : ${sum}</h3>
<button id="limpiar">Limpiar Carrito</button>
<button id="comprar">Finalizar Compra</button>

`
totalDiv.appendChild(total)
let comprar = document.querySelector('#comprar')
comprar.addEventListener('click',()=>{
  let tds = document.querySelector('.td')
  console.log(tds)
  if(!tds){
    alert("No Hay Productos En El Carrito")
  }else{

    total.innerHTML=`<div class="check"></div>
    <button id="limpiar">Limpiar Carrito</button>
    `
    
    let limpiar = document.querySelector('#limpiar')
    let checker = document.querySelector('.check')
    console.log(checker)
    limpiarCarrito(limpiar,checker)
     alert("tu pedido llegara en los proximos 3 dias habiles")
  }
})
}else{
  let total = document.createElement('div')
total.class="total"
total.innerHTML=`
<h3 id='totalSum'>El total es : ${totalArr}</h3>
<button id="limpiar">Limpiar Carrito</button>
<button id="comprar">Finalizar Compra</button>

`
totalDiv.appendChild(total)
let comprar = document.querySelector('#comprar')
comprar.addEventListener('click',()=>{
  let tds = document.querySelector('.td')
  console.log(tds)
  if(!tds){
    alert("No Hay Productos En El Carrito")
  }else{

    total.innerHTML=`<div class="check"></div>
    <button id="limpiar">Limpiar Carrito</button>
    `
  
    let limpiar = document.querySelector('#limpiar')
    let checker = document.querySelector('.check')
    console.log(checker)
    limpiarCarrito(limpiar,checker)
     alert("tu pedido llegara en los proximos 3 dias habiles")
  }
})
}

}