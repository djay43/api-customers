import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import CustomersAPI from "../services/customersAPI";
import { Link } from "react-router-dom";

const CustomersPage = props => {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  // Get the customers
  const fetchCustomers = async () => {
    try {
      const data = await CustomersAPI.findAll();
      setCustomers(data);
    } catch (error) {
      console.log(error.response);
    }
  };

  // When Component is loaded, get the customers
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Manager for deleting a customer

  const handleDelete = async id => {
    const originalCustomers = [...customers];
    setCustomers(customers.filter(customer => customer.id !== id));

    try {
      await CustomersAPI.delete(id);
    } catch (error) {
      setCustomers(originalCustomers);
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

  const itemsPerPage = 10;

  // Filter customers depending on research
  const filteredCustomers = customers.filter(
    c =>
      c.firstName.toLowerCase().includes(search.toLowerCase()) ||
      c.lastName.toLowerCase().includes(search.toLowerCase()) ||
      c.lastName.toLowerCase().includes(search.toLowerCase()) ||
      (c.company && c.company.toLowerCase().includes(search.toLowerCase()))
  );

  // Paginated data
  const paginatedCustomers = Pagination.getData(
    filteredCustomers,
    currentPage,
    itemsPerPage
  );

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Liste des clients</h1>;
        <Link to="/customers/new" className="btn btn-sm btn-primary">
          Créer un client
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
            <th>Identifiants</th>
            <th>Client</th>
            <th>Email</th>
            <th>Entreprise</th>
            <th className="text-center">Factures</th>
            <th className="text-center">Montant total</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {paginatedCustomers.map(customer => (
            <tr key={customer.id}>
              <td>{customer.id}</td>
              <td>
                <a href="@">{customer.firstName}</a>
              </td>
              <td>{customer.lastName}</td>
              <td>{customer.company}</td>
              <td className="text-center">
                <span className="badge badge-primary">
                  {customer.invoices.length}
                </span>
              </td>
              <td className="text-center">
                {customer.totalAmount.toLocaleString()}€
              </td>
              <td>
                <button
                  onClick={() => handleDelete(customer.id)}
                  disabled={customer.invoices.length > 0}
                  className="btn btn-sm btn-danger"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {itemsPerPage < filteredCustomers.length && (
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          length={filteredCustomers.length}
          onPageChanged={handlePageChange}
        />
      )}
    </>
  );
};

export default CustomersPage;
