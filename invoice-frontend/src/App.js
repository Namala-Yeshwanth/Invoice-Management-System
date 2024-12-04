// src/App.js
import React from 'react';
import InvoiceList from './components/InvoiceList';
import CreateInvoiceForm from './components/CreateInvoiceForm';
import "./App.css";

function App() {
  return (
    <div className="App">
      <h1>Invoice Management System</h1>
      <div className="components-container">
        <div className="component-box">
          <CreateInvoiceForm />
        </div>
        <div className="component-box">
          <InvoiceList />
        </div>
      </div>
    </div>
  );
}

export default App;