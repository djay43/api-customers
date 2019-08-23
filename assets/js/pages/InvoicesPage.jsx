import moment from "moment";
import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import invoicesAPI from "../services/invoicesAPI";
import { Link } from "react-router-dom";

const STATUS_CLASSES = {
  PAID: "success",
  SENT: "primary",
  CANCELLED: "danger"
};
const STATUS_LABELS = {
  PAID: "Payée",
  SENT: "Envoyée",
  CANCELLED: "Annulée"
};

const InvoicesPage = props => {
  const [invoices, setInvoices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const itemsPerPage = 10;

  // get invoices from API
  const fetchInvoices = async () => {
    try {
      const data = await invoicesAPI.findAll();
      setInvoices(data);
    } catch (error) {
      console.log(error.response);
    }
  };

  // Load invoices when component is loaded
  useEffect(() => {
    fetchInvoices();
  }, []);

  // Manage delete invoice
  const handleDelete = async id => {
    const originalInvoices = [...invoices];
    setInvoices(invoices.filter(invoice => invoice.id !== id));

    try {
      await invoicesAPI.delete(id);
    } catch (error) {
      setInvoices(originalInvoices);
      console.log(error.response);
    }
  };

  // Manage page change
  const handlePageChange = page => setCurrentPage(page);

  // Manage search input
  const handleSearch = ({ currentTarget }) => {
    setSearch(currentTarget.value);
    setCurrentPage(1);
  };

  //Manage date format
  const formatDate = str => moment(str).format("DD/MM/YYYY");

  // Filter customers depending on research
  const filteredInvoices = invoices.filter(
    i =>
      i.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
      i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
      i.amount.toString().startsWith(search.toLowerCase()) ||
      STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase())
  );

  // Paginated data
  const paginatedInvoices = Pagination.getData(
    filteredInvoices,
    currentPage,
    itemsPerPage
  );

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <h1>Liste des factures</h1>
        <Link className="btn btn-primary" to="/invoices/new">
          Créer une facture
        </Link>
      </div>
      <div className="form-group">
        <input
          type="text"
          className="form-control"
          placeholder="Rechercher"
          onChange={handleSearch}
          value={search}
        />
      </div>

      <table className="table table-hover">
        <thead>
          <tr>
            <th>Numéro</th>
            <th>Client</th>
            <th className="text-center">Date d'envoi</th>
            <th className="text-center">Statut</th>
            <th className="text-center">Montant</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {paginatedInvoices.map(invoice => (
            <tr key={invoice.id}>
              <td>{invoice.chrono}</td>
              <td>
                <a href="#">
                  {invoice.customer.firstName}&nbsp;
                  {invoice.customer.lastName}
                </a>
              </td>
              <td className="text-center">{formatDate(invoice.sendAt)}</td>
              <td className="text-center">
                <span
                  className={"badge badge-" + STATUS_CLASSES[invoice.status]}
                >
                  {STATUS_LABELS[invoice.status]}
                </span>
              </td>
              <td className="text-center">
                {invoice.amount.toLocaleString()}€
              </td>
              <td>
                <Link
                  to={"/invoices/" + invoice.id}
                  className="btn btn-sm btn-primary mr-1"
                >
                  Éditer
                </Link>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(invoice.id)}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChanged={handlePageChange}
        length={filteredInvoices.length}
      />
    </>
  );
};

export default InvoicesPage;
