var lastUsedInvoice = document.getElementById('last_used_invoice_id');
var invoiceNumber = document.getElementById('invoice_number');

// Unset values while waiting for response
lastUsedInvoice.innerHTML = '';
invoiceNumber.value = '';
invoiceNumber.disabled = true;

// Fetch values from QuickBooks
window.chrome.runtime.sendMessage({type: "getLastInvoiceNumber"}, function(response) {

  if (window.chrome.runtime.lastError) {
    lastUsedInvoice.innerHTML = '(' + window.chrome.runtime.lastError + ')';
  }
  else {
    lastUsedInvoice.innerHTML = '(Last used from QuickBooks: ' + response.invoiceNumber + ')';
    invoiceNumber.value = (parseInt(response.invoiceNumber) + 1);
  }
  invoiceNumber.disabled = false;
});
