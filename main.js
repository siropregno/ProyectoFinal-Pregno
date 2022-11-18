let initialGold = 0
const cart = []
let myGold = JSON.stringify(initialGold)
let currentGold = parseInt( localStorage.getItem("myGold"))

//IF PARA SETEAR myGold EN EL LOCALSTORAGE
if(currentGold > 0 ){ }
else{localStorage.setItem('myGold',0), document.getElementById("money").innerHTML = `<p id="moneynumber">0</p>`}

//FUNCION PARA MOSTRAR EN EL HTML EL MONTO DE ORO QUE TENEMOS
function currentMoney() {
    document.getElementById("money").innerHTML = `<p id="moneynumber">${currentGold}</p>`
} 
currentMoney()

// FUNCION PARA RENDERIZAR UNA LISTA DE ITEMS EN EL HTML CON LOS OBJETOS DEL ARCHIVO JSON 
function renderizeItems(){
    const ITEMLISTJSON = "./items.json"
    fetch(ITEMLISTJSON)
        .then(data => data.json())
        .then(itemList => {
            const allItems = itemList.items
            allItems.forEach(item => {
            document.getElementById("tablabody").innerHTML +=
            `<tr>
                <td>${item.id}</td>
                <td><img id="icon" src=${item.image} alt="..."></td>
                <td id="${item.category}">${item.name}</td>
                <td>${item.price}</td>
                <td><button id='btn${item.id}' class="btn btn-primary">Buy now</button></td>
            </tr>`
        })
        itemList.items.forEach((item)=>{ document.getElementById(`btn${item.id}`).addEventListener("click",function(){buyNow(item)}) })
    })
}
renderizeItems()

//FUNCION PARA COMPRAR LOS ITEMS CON LOS BOTONES DE LA LISTA
function buyNow(item) 
    { setTimeout(()=> {
    if (item.price <= currentGold ){
        setTimeout(()=> {
        Swal.fire({
        title: 'Are you sure you want to buy this item?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Buy'
        }).then((result) => {
        if ((result.isConfirmed)) { setTimeout(()=> { currentGold -= item.price; localStorage.setItem("myGold",currentGold); currentMoney();
            Swal.fire(
            'Item purchased!',
            'Item successfully purchased. You will see your new item in the game!',
            'success' ) }, 1000) }})}, 200)
    }
        else {Swal.fire("You don't have enough gold!")}}, 500)
}