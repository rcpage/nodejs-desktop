var paypal = require('paypal-rest-sdk');

function CreatePayPalTransactionJSON(params) {
  return {
    "intent": "sale",
    "payer": {
      "payment_method": "credit_card",
      "funding_instruments": [{
        "credit_card": {
          "type": params.cardType,
          "number": params.cardNumber,
          "expire_month": params.cardExpMonth,
          "expire_year": params.cardExpYear,
          "cvv2": params.cardCode,
          "first_name": params.firstName,
          "last_name": params.lastName,
          "billing_address": {
            "line1": params.billingAddress,
            "city": params.billingCity,
            "state": params.billingState,
            "postal_code": params.billingZip,
            "country_code": params.countryCode
          }
        }
      }]
    },
    "transactions": [{
      "amount": {
        "total": Number(params.dueNow).toFixed(2).toString(),
        "currency": "USD"
      },
      "description": params.description
    }]
  };
}


paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': process.env.CLIENT_ID,
  'client_secret': process.env.CLIENT_SECRET
});

function creditCardPayment(params, callback) {
  var pmt = CreatePayPalTransactionJSON(params);
  paypal.payment.create(pmt, callback);
}

function saveCreditCard(card, callback) {
  var savedCard = {
    "type": card.type,
    "number": card.number,
    "expire_month": card.expMonth,
    "expire_year": card.expYear,
    "cvv2": card.code,
    "first_name": card.firstName,
    "last_name": card.lastName
  };
  paypal.creditCard.create(savedCard, callback);
}
function listCreditCards(callback) {
  paypal.creditCard.list(callback);
}
function getCreditCard(id, callback) {
  paypal.creditCard.get(id, callback);
}

function deleteCreditCard(id, callback) {
  paypal.creditCard.del(id, callback);
}

function getCreditCardSale(saleId, callback) {
  paypal.sale.get(saleId, callback);
};

function refundCreditCard(saleId, amount, callback) {
  var data = {
    "amount": {
      "currency": "USD",
      "total": amount
    }
  };
  paypal.sale.refund(saleId, data, callback);
}

function createInvoice(params, callback) {
  var create_invoice_json = {
    "merchant_info": {
      "business_name": "La Gloria Hacienda & Motel",
      "email": "russell.c.page-facilitator@gmail.com",
      "first_name": "Russell",
      "last_name": "Page",
      "website": "www.lagloriahacienda.com",
      "phone": {
        "country_code": "001",
        "national_number": "5122709768"
      },
      "address": {
        "line1": "PO BOX 12345",
        "city": "Austin",
        "state": "TX",
        "postal_code": "79620",
        "country_code": "US"
      }
    },
    "billing_info": [{
      "email": params.email,
      "first_name": params.firstName,
      "last_name": params.lastName,
      "business_name": params.businessName,
      "phone": {
        "country_code": "001",
        "national_number": params.phone
      },
      "address": {
        "line1": params.address,
        "city": params.city,
        "state": params.state,
        "postal_code": params.zip,
        "country_code": params.countryCode
      }
    }],
    "items": params.items,
    "note": params.note,
    "payment_term": {
      "term_type": "DUE_ON_RECEIPT"
    },

    "tax_inclusive": false,
    "total_amount": {
      "currency": "USD",
      "value": Number(params.dueNow).toFixed(2).toString()
    }
  };
  paypal.invoice.create(create_invoice_json, callback);
}
function getInvoice(id, callback) {
  paypal.invoice.get(id, callback);
}
function deleteInvoice(id, callback) {
  paypal.invoice.del(id, callback);
}
function listInvoice(callback) {
  paypal.invoice.list(callback);
}
function cancelInvoice(id, callback) {
  var options = {
    "subject": "Canceling invoice",
    "note": "Canceling invoice",
    "send_to_merchant": true,
    "send_to_payer": true
  };
  //Cannot be in DRAFT status for cancelling
  paypal.invoice.cancel(id, options, callback);
}

function listPayments(params, callback) {
  var listPayment = {
    'count': params.count ? params.count : '1',
    'start_index': params.startIndex ? params.startIndex : '0'
  };
  paypal.payment.list(listPayment, callback);
}

function formatDate(date, tZoneHour, tZoneMin) {
  //'yyyy-MM-dd HH:mm:ss z'
  var yyyy = date.getFullYear();
  var MM = ('0' + (date.getMonth() + 1)).substr(-2);
  var dd = ('0' + date.getDate()).substr(-2);
  var HH = ('0' + date.getHours()).substr(-2);
  var mm = ('0' + date.getMinutes()).substr(-2);
  var ss = ('0' + date.getSeconds()).substr(-2);
  var zone = tZoneHour ? ('0' + tZoneHour).substr(-2) : '00';
  var offset = tZoneMin ? ('0' + tZoneMin).substr(-2) : '00';
  return yyyy + '-' + MM + '-' + dd + 'T' + HH + ':' + mm + ':' + ss + '-' + zone + ':' + offset;
}

function getDateParts(date) {
  var yyyy = date.getFullYear().toString();
  var MM = ('0' + (date.getMonth() + 1)).substr(-2);
  var dd = ('0' + date.getDate()).substr(-2);
  var HH = ('0' + date.getHours()).substr(-2);
  var mm = ('0' + date.getMinutes()).substr(-2);
  var ss = ('0' + date.getSeconds()).substr(-2);
  return {
    fullYear: yyyy,
    month: MM,
    day: dd,
    hour: HH,
    min: mm,
    sec: ss,
    yyyy: yyyy,
    MM: MM,
    dd: dd,
    HH: HH,
    mm: mm,
    ss: ss
  }
}



function recordPayment(invoiceId, params, callback) {
  var recordPaymentDateFormat = function (date, tZone) {
    var d = getDateParts(date);
    var zone = tZone ? tZone : 'MST';
    return d.yyyy + '-' + d.MM + '-' + d.dd + ' ' + d.HH + ':' + d.mm + ':' + d.ss + ' ' + zone;
  }
  var payment_attr = {
    "method": params.method ? params.method : "CASH",
    "date": params.date ? recordPaymentDateFormat(new Date(params.date)) : recordPaymentDateFormat(new Date()),
    "note": params.note ? params.note : ""
  };
  paypal.invoice.recordPayment(invoiceId, payment_attr, callback);
}

module.exports = {
  invoice: {
    get: getInvoice,
    list: listInvoice,
    delete: deleteInvoice,
    cancel: cancelInvoice,
    create: createInvoice,
    recordPayment: recordPayment,
  },
  creditCard: {
    payment: getCreditCardSale,
    sale: creditCardPayment,
    refund: refundCreditCard,
    save: saveCreditCard,
    get: getCreditCard,
    list: listCreditCards,
    delete: deleteCreditCard
  },
  list: listPayments
}
















