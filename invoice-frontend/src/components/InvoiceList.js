// src/components/InvoiceList.js
import React, { useEffect, useState } from 'react';
import { getInvoices } from '../services/api';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const rowsPerPage = 5; // Number of rows per page

  // const totalPages = Math.ceil(invoices.length / rowsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // useEffect(() => {
  //   const fetchInvoices = async () => {
  //     try {
  //       const data = await getInvoices();
  //       setInvoices(data); // Update state with fetched data
  //     } catch (error) {
  //       console.error('Error loading invoices:', error);
  //       setError('Failed to load invoices.'); // Set an error message for display
  //     }
  //   };

  //   fetchInvoices();
  // }, []);

  const fetchInvoices = async (page) => {
    try {
      const data = await getInvoices(page);
      setInvoices(data.results); // Update invoices with the current page's data
      setTotalPages(Math.ceil(data.count / rowsPerPage)); // Update total pages based on count
    } catch (err) {
      console.error('Error loading invoices:', err);
      setError('Failed to load invoices.');
    }
  };

  useEffect(() => {
    fetchInvoices(currentPage); // Fetch data for the current page
  }, [currentPage]);

  if (error) {
    return <div className='error-message'>{error}</div>; // Display error message
  }

  if (invoices.length === 0) {
    return <div className='no-data'>No invoices available.</div>; // Graceful fallback for no data
  }

  return (
    <div className='invoice-container'>
      <h2>Invoices</h2>
      <table className='responsive-table'>
        <thead>
          <tr>
            <th>Invoice Number</th>
            <th>Customer Name</th>
            <th>Date</th>
            <th>Total Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id}>
              <td>{invoice.invoice_number}</td>
              <td>{invoice.customer_name}</td>
              <td>{invoice.date}</td>
              <td>{invoice.total_amount.toFixed(2)}</td>
              <td>
                <button className='btn-view'>View</button>
                <button className='btn-edit'>Edit</button>
              </td>
            </tr>  
          ))}
        </tbody>
      </table>
      {/* Pagination Controls */}
      <div id='pagination' className='pagination'>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? 'active' : ''}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default InvoiceList;