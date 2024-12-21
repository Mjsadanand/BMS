import  { useState, useEffect } from 'react';
import { 
  FaFileInvoiceDollar, 
  FaMoneyBillWave, 
  FaCalendarAlt, 
  FaDownload, 
  FaSave, 
} from 'react-icons/fa';

const InvoiceForm = () => {
  const [contractIds, setContractIds] = useState([]);
  const [selectedContractId, setSelectedContractId] = useState('');
  const [invoiceDetails, setInvoiceDetails] = useState({
    total_amount: '',
    due_amount: '',
    balance_amount: '',
    due_date: '',
    payment: {
      transaction_id: '',
      amount: '',
      date: ''
    }
  });
  const [invoice, setInvoice] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch all available contract IDs
    const fetchContractIds = async () => {
      try {
        const response = await fetch('https://bms-ef6q.onrender.com/api/ad-contracts');
        if (!response.ok) throw new Error('Failed to fetch contract IDs');

        const data = await response.json();
        setContractIds(data); // Assuming data is an array of contract objects
        if (data.length > 0) setSelectedContractId(data[0]._id); // Set the first ID as default
      } catch (err) {
        setError(err.message);
      }
    };

    fetchContractIds();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('payment.')) {
      setInvoiceDetails((prev) => ({
        ...prev,
        payment: {
          ...prev.payment,
          [name.split('.')[1]]: value,
        },
      }));
    } else {
      setInvoiceDetails((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submissionData = {
        ...invoiceDetails,
        contract_id: selectedContractId,
        total_amount: parseFloat(invoiceDetails.total_amount),
        due_amount: parseFloat(invoiceDetails.due_amount),
        balance_amount: parseFloat(invoiceDetails.balance_amount),
        due_date: new Date(invoiceDetails.due_date),
        payment: {
          ...invoiceDetails.payment,
          amount: parseFloat(invoiceDetails.payment.amount),
          date: new Date(invoiceDetails.payment.date),
        },
      };

      const response = await fetch('https://bms-ef6q.onrender.com/api/invoices/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error('Failed to create invoice');
      }

      const data = await response.json();
      setInvoice(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDownloadInvoice = async () => {
    try {
      const response = await fetch(`https://bms-ef6q.onrender.com/api/invoices/${invoice._id}/download`, {
        method: 'GET',
      });
      if (!response.ok) throw new Error('Failed to download invoice');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${invoice._id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-50 shadow-md rounded-lg">
      <div className="flex items-center mb-6">
        <FaFileInvoiceDollar className="mr-3 text-3xl text-blue-600" />
        <h2 className="text-2xl font-bold">Invoice Form</h2>
      </div>

      {!invoice ? (
        <>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Contract ID</label>
            <select
              value={selectedContractId}
              onChange={(e) => setSelectedContractId(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm"
            >
              {contractIds.map((contract) => (
                <option key={contract._id} value={contract._id}>
                  {contract._id}
                </option>
              ))}
            </select>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name: 'total_amount', label: 'Total Amount', icon: FaMoneyBillWave },
              { name: 'due_amount', label: 'Due Amount', icon: FaMoneyBillWave },
              { name: 'balance_amount', label: 'Balance Amount', icon: FaMoneyBillWave },
              { name: 'due_date', label: 'Due Date', icon: FaCalendarAlt, type: 'date' },
            ].map(({ name, label, icon: Icon, type = 'number' }) => (
              <div key={name} className="flex items-center">
                <Icon className="mr-3 text-blue-600" />
                <div className="flex-grow">
                  <label className="block text-sm font-medium text-gray-700">{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={invoiceDetails[name] || ''}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
                  />
                </div>
              </div>
            ))}

            <h3 className="text-lg font-semibold text-gray-700">Payment Details</h3>
            {[
              { name: 'payment.transaction_id', label: 'Transaction ID', icon: FaFileInvoiceDollar },
              { name: 'payment.amount', label: 'Payment Amount', icon: FaMoneyBillWave },
              { name: 'payment.date', label: 'Payment Date', icon: FaCalendarAlt, type: 'date' },
            ].map(({ name, label, icon: Icon, type = 'text' }) => (
              <div key={name} className="flex items-center">
                <Icon className="mr-3 text-blue-600" />
                <div className="flex-grow">
                  <label className="block text-sm font-medium text-gray-700">{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={invoiceDetails.payment[name.split('.')[1]] || ''}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
                  />
                </div>
              </div>
            ))}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 flex items-center justify-center"
            >
              <FaSave className="mr-2" /> Create Invoice
            </button>
          </form>
        </>
      ) : (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-green-600">Invoice Created Successfully</h3>
          <p>Total Amount: ${invoice.total_amount}</p>
          <p>Due Amount: ${invoice.due_amount}</p>
          <p>Balance Amount: ${invoice.balance_amount}</p>
          <p>Due Date: {new Date(invoice.due_date).toLocaleDateString()}</p>
          <p>Transaction ID: {invoice.payment.transaction_id}</p>
          <button
            onClick={handleDownloadInvoice}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 flex items-center justify-center"
          >
            <FaDownload className="mr-2" /> Download Invoice
          </button>
        </div>
      )}
    </div>
  );
};

export default InvoiceForm;
