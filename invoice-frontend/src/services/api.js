// src/services/api.js
import axios from 'axios';

const API_URL = 'https://invoice-management-system-qbm4.onrender.com/api';  // Adjust this URL based on your Django server

// // Get all invoices
// export const getInvoices = async (page=1, rowsPerPage=5) => {
//   try {
//     const response = await axios.get(`${API_URL}/invoices/`);
//     console.log('Full Response:', response.data);
//     return response.data.results;
//   } catch (error) {
//     console.error('Error fetching invoices', error);
//     // alert('Error fetching invoices');
//   }
// };
// Updated getInvoices function in api.js
export const getInvoices = async (page = 1, rowsPerPage = 5) => {
  try {
    const response = await axios.get(`${API_URL}/invoices/`, {
      params: { page, page_size: rowsPerPage },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching invoices', error);
  }
};

// Create a new invoice
export const createInvoice = async (invoiceData) => {
  try {
    const response = await axios.post(`${API_URL}/invoices/`, invoiceData);
    return response.data;
  } catch (error) {
    console.error('Error creating invoice', error);
  }
};

export const createInvoiceDetail = async (data) => {
  await axios.post('/api/invoice-details/', data); // Adjust endpoint as necessary
};


// Get a specific invoice by ID
export const getInvoiceById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/invoices/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching invoice by ID', error);
  }
};