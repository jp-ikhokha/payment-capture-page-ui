let amountToPay = null;
let mid = null;
let succ = null;
let formInvalid = false;

const getParameter = (param) => { 
    var params = window.location.search.substr(1).split('&');
   
    for (var i = 0; i < params.length; i++) {
      var p=params[i].split('=');
      if (p[0] == param) {
        return decodeURIComponent(p[1]);
      }
    }
    return false;
  }


//set things up
window.addEventListener("load", (event) => {

    //add the correct amount to pay
    amountToPay = getParameter('amt');

    //the merchant id
    mid = getParameter('mid');

    //to toggle successful payment - remove in prod
    succ = getParameter('succ');
    if(succ == 'true') {
        succ = true;
    }else{
        succ = false;
    }
    
    //To Do: check if there is an amount to pay else make it manual imputs
    document.querySelector('.paymentContainer__pay-btn span').textContent = amountToPay;
    document.querySelector('.paymentContainer__header .mid').textContent = `(Merchant ID: ${mid})`;

    document.querySelector('.paymentContainer').classList.add('active');

    window.parent.document.body.classList.add('iframeOpen');

}, false);



//init input formatting ref cleave.js
// credit card
let cleaveCreditCard = new Cleave('#card-number', {
    creditCard: true,
    onValueChanged: function() {
        removeInvalid(this.element.id);
    }
});


let cleaveExpMonth = new Cleave('#exp-month', {
    date: true,
    datePattern: ['m'],
    onValueChanged: function() {
        removeInvalid(this.element.id);
    }
});

let cleaveExpYear = new Cleave('#exp-year', {
    date: true,
    datePattern: ['y'],
    onValueChanged: function() {
        removeInvalid(this.element.id);
    }
});

let cleaveCVV = new Cleave('#cvv-code', {
    numeral: true,
    onValueChanged: function() {
        removeInvalid(this.element.id);
    }
});

//Check fields are completed
const checkFieldsStep = () => {

    let nameOnCard = document.querySelector('#name-on-card').value;
    let cardNumber = cleaveCreditCard.getRawValue();
    let expMonth = cleaveExpMonth.getRawValue();
    let expYear = cleaveExpYear.getRawValue();
    let cvv = document.querySelector('#cvv-code').value;

    nameOnCard === '' ? addInvalid('name-on-card') : removeInvalid('name-on-card');
    cardNumber === '' ? addInvalid(cleaveCreditCard.element.id) : removeInvalid(cleaveCreditCard.element.id);
    expMonth === '' ? addInvalid(cleaveExpMonth.element.id) : removeInvalid(cleaveExpMonth.element.id);
    expYear === '' ? addInvalid(cleaveExpYear.element.id) : removeInvalid(cleaveExpYear.element.id);
    cvv === '' ? addInvalid(cleaveCVV.element.id) : removeInvalid(cleaveCVV.element.id);

    formInvalid ? invalidStep() : sendPaymentDetails();

}


//Send the payment details

const sendPaymentDetails = () => {

    document.querySelector('.paymentContainer__pay-btn').disabled = true;
    document.querySelector('#name-on-card').disabled = true;
    document.querySelector('#card-number').disabled = true;
    document.querySelector('#exp-year').disabled = true;
    document.querySelector('#exp-month').disabled = true;
    document.querySelector('#cvv-code').disabled = true;

    processingStep();
    
}


const processingStep = () => {    
    document.querySelector('.paymentIndicator.process').classList.add('active');

    setTimeout(() => {
        let status = {
            success: succ
        }
        successStep(status);
    }
    , 5000);
}


const successStep = (status) => {    

    //indicator ui
    document.querySelector('.paymentIndicator.status').classList.add('active');
    document.querySelector('.paymentContainer__cardDetails').classList.add('hide');
    document.querySelector('.paymentContainer__pay-btn').classList.add('hide');
    document.querySelector('.paymentContainer__clear-btn').classList.add('hide');

    //status ui
    let statusBlock = document.querySelector('.statusContainer');
    statusBlock.classList.remove('hide');
    statusBlock.classList.add('active');

     //success
    if(status.success){
        let indicators = document.querySelectorAll('.paymentIndicator');
        for (i = 0; i < indicators.length; i++){
            indicators[i].classList.add('success');
        }
        statusBlock.classList.add('success');
        statusBlock.querySelector('img').src = "./images/success_face.svg";
        statusBlock.querySelector('label.status').innerText = "Success!";
        statusBlock.querySelector('p.statusMsg').innerText = "Your order has been placed and is being processed.";
        statusBlock.querySelector('button').innerText = "Got it!";
    }

   //failure
    if(!status.success){
        let indicators = document.querySelectorAll('.paymentIndicator');
        for (i = 0; i < indicators.length; i++){
            indicators[i].classList.add('failure');
        }
        statusBlock.classList.add('failure');
        statusBlock.querySelector('img').src = "./images/failure_face.svg";
        statusBlock.querySelector('label.status').innerText = "Oh Snap!";
        statusBlock.querySelector('p.statusMsg').innerText = "Looks like something went wrong while processing your request.";
        statusBlock.querySelector('button').innerText = "Try again";
    }
}

const closePayment = () => {
    window.parent.document.body.classList.remove('iframeOpen');
    document.querySelector('.paymentContainer').classList.remove('active');
    let ikPaymentFrame =  window.parent.document.getElementById('ikpayment');
     setTimeout(()=>{
        window.parent.document.body.removeChild(ikPaymentFrame);
     }, 1000);
}

//light input validation
const addInvalid = (elementid) => {
    document.getElementById(elementid).classList.add('invalid');
    formInvalid = true;
}

const removeInvalid = (elementid) => {
    document.getElementById(elementid).classList.remove('invalid');
    formInvalid = false;
}

const invalidStep = () => {
    console.log('invalid')
}
