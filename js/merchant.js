
const addIkPaymentIframe = () => {

    let amountToPay = document.getElementById('amount').value;
    let mid = document.getElementById('mid').value;
    let success = document.getElementById('success').checked;

    const ikPaymentFrame = document.createElement('iframe')
    ikPaymentFrame.id = "ikpayment"
    ikPaymentFrame.src = `/ikpayment.html?amt=${amountToPay}&mid=${mid}&succ=${success}`;

    if(document.querySelector('#ikpayment') !== null) {
        return
    }

    if ( document.readyState === 'complete' || document.readyState === 'interactive' ) {
        document.body.appendChild(ikPaymentFrame);
    } else {
        document.addEventListener('DOMContentLoaded', () => {
          document.body.appendChild(ikPaymentFrame);          
        });
    }

} 


