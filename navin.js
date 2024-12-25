// Include jsPDF library
// Make sure to include this script in your HTML file: 
// <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.4.0/jspdf.umd.min.js"></script>

document.getElementById("add-item").addEventListener("click", () => {
    const itemList = document.getElementById("item-list");
    const newItem = document.createElement("div");
    newItem.classList.add("item");
    newItem.innerHTML = `
      <label for="description">Description:</label>
      <input type="text" class="description" required>
      <label for="quantity">Quantity:</label>
      <input type="number" class="quantity" min="1" required>
      <label for="price">Price (per unit):</label>
      <input type="number" class="price" min="0" required>
      <label for="tax">Tax Rate (%):</label>
      <input type="number" class="tax" min="0" required>
    `;
    itemList.appendChild(newItem);
  });
  
  document.getElementById("invoice-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const customerName = document.getElementById("customer-name").value;
    const customerAddress = document.getElementById("customer-address").value;
    const items = document.querySelectorAll(".item");
    
    let invoiceHTML = `
      <p><strong>Customer Name:</strong> ${customerName}</p>
      <p><strong>Customer Address:</strong> ${customerAddress}</p>
      <table border="1" width="100%" cellpadding="10">
        <thead>
          <tr>
            <th>Description</th>
            <th>Quantity</th>
            <th>Price (per unit)</th>
            <th>Tax (%)</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
    `;
  
    let grandTotal = 0;
    let pdfContent = [];
    pdfContent.push(["Description", "Quantity", "Price (per unit)", "Tax (%)", "Total"]);
  
    items.forEach((item) => {
      const description = item.querySelector(".description").value;
      const quantity = +item.querySelector(".quantity").value;
      const price = +item.querySelector(".price").value;
      const tax = +item.querySelector(".tax").value;
  
      const total = quantity * price * (1 + tax / 100);
      grandTotal += total;
  
      invoiceHTML += `
        <tr>
          <td>${description}</td>
          <td>${quantity}</td>
          <td>${price.toFixed(2)}</td>
          <td>${tax.toFixed(2)}</td>
          <td>${total.toFixed(2)}</td>
        </tr>
      `;
  
      pdfContent.push([description, quantity.toString(), price.toFixed(2), tax.toFixed(2), total.toFixed(2)]);
    });
  
    invoiceHTML += `
        </tbody>
      </table>
      <h3>Grand Total: $${grandTotal.toFixed(2)}</h3>
    `;
  
    document.getElementById("invoice-details").innerHTML = invoiceHTML;
    document.getElementById("invoice-preview").classList.remove("hidden");
  
    // Save data for PDF generation
    document.getElementById("download-pdf").dataset.pdfContent = JSON.stringify({
      customerName,
      customerAddress,
      pdfContent,
      grandTotal: grandTotal.toFixed(2),
    });
  });
  
  // Print functionality
  document.getElementById("print-invoice").addEventListener("click", () => {
    window.print();
  });
  
  // PDF Generation
  document.getElementById("download-pdf").addEventListener("click", () => {
    const pdfData = JSON.parse(document.getElementById("download-pdf").dataset.pdfContent);
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
  
    doc.setFont("helvetica", "bold");
    doc.text("Invoice", 105, 10, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.text(`Customer Name: ${pdfData.customerName}`, 10, 20);
    doc.text(`Customer Address: ${pdfData.customerAddress}`, 10, 30);
  
    doc.autoTable({
      startY: 40,
      head: [pdfData.pdfContent[0]],
      body: pdfData.pdfContent.slice(1),
    });
  
    doc.text(`Grand Total: $${pdfData.grandTotal}`, 10, doc.lastAutoTable.finalY + 10);
    doc.save("Invoice.pdf");
  });