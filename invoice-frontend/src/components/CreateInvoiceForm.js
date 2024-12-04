// src/components/CreateInvoiceForm.js
import React, { useState } from 'react';
import { createInvoice } from '../services/api';
// import { createInvoiceDetail } from '../services/api';

const CreateInvoiceForm = () => {
  const [invoiceData, setInvoiceData] = useState({
    invoice_number: '',
    customer_name: '',
    date: '',
    details: [
      { description: "", quantity: 1, unit_price: "" }, // Initialize with one detail
    ],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle invoice detail change
  const handleDetailChange = (index, e) => {
    const { name, value } = e.target;
    const updatedDetails = invoiceData.details.map((detail, i) =>
      i === index ? { ...detail, [name]: value } : detail
    );
    setInvoiceData((prevState) => ({
      ...prevState,
      details: updatedDetails,
    }));
  };

  // Add a new detail row
  const addDetail = () => {
    setInvoiceData((prevState) => ({
      ...prevState,
      details: [...prevState.details, { description: "", quantity: 1, unit_price: "" },],
    }));
  };

  // Remove a detail row
  const removeDetail = (index) => {
    setInvoiceData((prevState) => ({
      ...prevState,
      details: prevState.details.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send all data (including details) in one payload
      const response = await createInvoice(invoiceData);
      if (response) {
        alert("Invoice created successfully!");
        setInvoiceData({
          invoice_number: "",
          customer_name: "",
          date: "",
          details: [{ description: "", quantity: 1, unit_price: "" }],
        });
      }
    } catch (error) {
      console.error(error);
      alert("Failed to create invoice.");
    }
  };

  return (
    <div className='form-container'>
      <h2>Create Invoice</h2>
      <form onSubmit={handleSubmit} className='invoice-form'>
        <div className='form-group'>
        <label htmlFor='invoice_number'>Invoice Number</label>
        <input
          type="text"
          id='invoice_number'
          name="invoice_number"
          value={invoiceData.invoice_number}
          onChange={handleChange}
          required
        />
      </div>
      <div className='form-group'>
        <label htmlFor='customer_name'>Customer Name</label>
        <input
          type="text"
          id='customer_name'
          name="customer_name"
          value={invoiceData.customer_name}
          onChange={handleChange}
          required
        />
      </div>
      <div className='form-group'>
        <label htmlFor='date'>Date</label>
        <input
          type="date"
          id='date'
          name="date"
          value={invoiceData.date}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <h3>Invoice Details</h3>
        {invoiceData.details.map((detail, index) => (
          <div key={index} className="detail-row">
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={detail.description}
              onChange={(e) => handleDetailChange(index, e)}
            />
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={detail.quantity}
              onChange={(e) => handleDetailChange(index, e)}
              min='0'
            />
            <input
              type="number"
              name="unit_price"
              placeholder="Unit Price"
              step="0.01"
              value={detail.unit_price}
              onChange={(e) => handleDetailChange(index, e)}
            />
            <button type="button" onClick={() => removeDetail(index)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addDetail}>
          Add Detail
        </button>
      </div>

      <button type="submit" className='btn-submit'>Create Invoice</button>
    </form>
  </div>
  );
};

export default CreateInvoiceForm;