const clickButton = document.querySelectorAll(".agregarAcarrito");

const tbody = document.querySelector(`.tbody`);

let carrito = []

clickButton.forEach(btn => {
    btn.addEventListener(`click`, addToCarritoItem)
});

function addToCarritoItem(e){
    const button = e.target
    const item = button.closest(`.card`)
    const itemTitle = item.querySelector(`.card-title`).textContent
    const itemPrice = item.querySelector(`.precio`).textContent
    const newItem = {
        title:itemTitle,
        precio: itemPrice,
        cantidad: 1
    }
    
    addItemCarrito(newItem)
    Toastify({
        text: `${itemTitle} agregado al Carrito`,
        duration: 4000
    }).showToast();
}

function addItemCarrito(newItem){
    
    const InputElemento = tbody.getElementsByClassName(`input__elemento`)

    for(let i = 0 ; i < carrito.length ; i++){
        if(carrito[i].title.trim() === newItem.title.trim()){
            carrito[i].cantidad ++;
            const inputValue = InputElemento[i]
            inputValue.value++;
            CarritoTotal()
            return null;
        }
    }
    
    carrito.push(newItem)
    
    renderCarrito()
    console.log(carrito)
}

function renderCarrito(){
    tbody.innerHTML = ``
    carrito.map(item => {
        const tr = document.createElement(`tr`)
        tr.classList.add(`ItemCarrito`)
        const Content = `
        
        <th scope="row">1</th>
        <td class="title table__productos text-white"><h6>${item.title}</h6></td>
                        <td class="table__precio text-white "><p>${item.precio}</p></td>
                        <td class="table__cantidad text-white">
                            <input type="number" min="1" value="${item.cantidad}" class="input__elemento">
                            <button class="delete btn btn-danger">X</button>
                        </td>

        `
        tr.innerHTML = Content;
        tbody.appendChild(tr);
        
        tr.querySelector(`.delete`).addEventListener(`click`, removeItemCarrito)
        tr.querySelector(".input__elemento").addEventListener(`change`, sumaLaCantidad);
    })
    CarritoTotal()
}

function CarritoTotal(){
    let Total = 0;
    const itemCartTotal = document.querySelector(`.itemCartTotal`)
    carrito.forEach((item) => {
        const precio = Number(item.precio.replace("$", ``))
        Total = Total + precio*item.cantidad
    })
    
    itemCartTotal.innerHTML = `Total: $${Total}`
    addLocalStorage()
}

function removeItemCarrito(e){
    const buttonDelete = e.target
    const tr = buttonDelete.closest(".ItemCarrito")
    const title = tr.querySelector(`.title`).textContent;
    for(let i = 0 ; i < carrito.length ; i++){
        if(carrito[i].title.trim() === title.trim()){
            carrito.splice(i, 1)
        }
    }
    tr.remove()
    CarritoTotal()
    Toastify({
        text: `${title} eliminado del Carrito`,
        duration: 5000
    }).showToast();
}

function sumaLaCantidad(e) {
    const sumaInput = e.target
    const tr = sumaInput.closest(".ItemCarrito")
    const title = tr.querySelector(`.title`).textContent;
    carrito.forEach(item => {
        if(item.title.trim() === title){
            sumaInput.value < 1 ? (sumaInput.value = 1) : sumaInput.value
            item.cantidad = sumaInput.value;
            CarritoTotal()
        }
    })
}

function addLocalStorage(){
    localStorage.setItem(`carrito`, JSON.stringify(carrito))
}

window.onload = function(){
    const storage = JSON.parse(localStorage.getItem('carrito'));
    if(storage){
      carrito = storage;
      renderCarrito()
    }
}