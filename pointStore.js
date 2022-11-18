let currentGold = parseInt(localStorage.getItem("myGold"))

//IF PARA SETEAR myGold EN EL LOCALSTORAGE
if(currentGold > 0 ){ }
else{localStorage.setItem('myGold',0), document.getElementById("money").innerHTML = `<p id="moneynumber">0</p>`}

//FUNCION PARA MOSTRAR EN EL HTML EL MONTO DE ORO QUE TENEMOS
function currentMoney(){
    document.getElementById("money").innerHTML = `<p id="moneynumber">${currentGold}</p>`
} 
currentMoney()

//FUNCION PARA RENDERIZAR SEIS CARTAS EN EL HTML CON LAS OPCIONES DE COMPRA DE PUNTOS 
function renderizeOptions(){
    document.getElementById("formDiv").innerHTML =``

    const ITEMLISTJSON = "./points.json"
    fetch(ITEMLISTJSON)
        .then(data => data.json())
        .then(optionList => {
            document.getElementById("prePurchaseSubtitle").innerHTML +=
            `
            <h4 id="subtitle">Select the amount of gold you want to purchase:</h4>
            `
            const allOptions = optionList.options
            allOptions.forEach(option => {
            document.getElementById("cards").innerHTML +=
            `
            <div class="card col-sm-2">
            <img src=${option.image} class="card-img-top" alt="...">
            <div class="card-body">
                <p class="card-text">${option.amount+" gold"}</p>
                <p class="card-text">$ ${option.price}</p>
                <button id='btn${option.id}' class="btn btn-primary" onclick="selectPointOption()">buy</button>
            </div>
        </div>   
    ` })
    optionList.options.forEach((option)=>{ document.getElementById(`btn${option.id}`).addEventListener("click",function(){selectPointOption(option)}) })
    })
}
renderizeOptions()

//FUNCION PARA RENDERIZAR EL FORMULARIO NECESARIO PARA COMPLETAR LA COMPRA DE PUNTOS
function selectPointOption(option){ 
setTimeout(()=> {
document.getElementById("prePurchaseSubtitle").innerHTML =``
document.getElementById("cards").innerHTML = ``
document.getElementById("formDiv").innerHTML +=`
<h1 id="purchaseTitle">Complete the purchase:</h1>
<div id="pointForm">
    <div id="cardData">
            <div id="cardinfo">
                <p>Card number:<p> 
                <p id="lightText"> must contain 16 digits<p>
            </div>
            <input id="cardInput" type="tel" inputmode="numeric" maxlength="16" placeholder="0000-0000-0000-0000">
            <p>Expiration date:<p>
            <input type="month" min="2022-11" value="2022-11">
            <div id="cardinfo">
                <p>Security code:<p> 
                <p id="lightText"> must contain 3 digits<p>
            </div>
            <input type="tel" maxlength="3" placeholder="CVC" id="securityCodeInput">
            <br>
            <input type="checkbox" id="terms" > By clicking here, I state that I have read and understood the <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"> terms and conditions.</a>
            <br>
            <button class="btn btn-success" id="buybutton">Buy</button>
            <button class="btn btn-warning" id="cancelbutton">Cancel</button>
    </div>
    <div id="summary">
        <p id="amountSelected"> <strong>Amount selected:</strong> ${option.amount}</p>
        <p id="PriceAndTaxes" > <strong>Price: </strong> $${option.price+" + Taxes"}</p>
        <p>Por regulación de la ley Argentina es posible que los bancos apliquen un cargo de impuesto del 21% (IVA) sobre las compras de servicios digitales.</p>
    </div>
</div>`
document.getElementById(`buybutton`).addEventListener("click",function(){confirmPurchase(option)})
document.getElementById(`cancelbutton`).addEventListener("click",function(){renderizeOptions(option)})}, 1000)
}

//FUNCION QUE DETERMINARA SI LA COMPRA SE PUEDE COMPLETAR DE FORMA EXITOSA O NO
function confirmPurchase(option){
    const cardNum = document.getElementById("cardInput")
    const securityNum = document.getElementById("securityCodeInput")
    const TAC = document.getElementById("terms")

    Swal.fire({
        title: 'Are you sure you want to complete the purchase?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#198553',
        cancelButtonColor: '#FFC107',
        confirmButtonText: 'Buy'
      }).then((result) => {
        if (result.isConfirmed) { 
            
            if(cardNum.value.length == 16 && securityNum.value.length == 3 && TAC.checked == true){
            setTimeout(()=> {
            currentGold += option.amount; localStorage.setItem("myGold",currentGold); currentMoney(); renderizeOptions()
            Swal.fire(
            'Transaction complete!',
            'Gold was successfully added to your account.',
            'success')
        }, 1500)
        }
            else if(cardNum.value.length !== 16 || securityNum.value.length !== 3 || TAC.checked !== true) {
            setTimeout(()=> {     
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'The cardholder\'s bank has declined the transaction because of an incorrectly entered card number or a number that doesn\'t exist. Please check your payment information!',
                    footer: '<a href="">Why do I have this issue?</a>'})
                }, 1500)
                }
        }
    })
}