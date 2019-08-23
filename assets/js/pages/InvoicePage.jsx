import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Field from "../components/forms/Field";
import Select from "../components/forms/Select";
import CustomersAPI from "../services/customersAPI";
import invoicesAPI from "../services/invoicesAPI";

const InvoicePage = ({ history, match }) => {
  const { id = "new" } = match.params;

  const [invoice, setInvoice] = useState({
    amount: "",
    customer: "",
    status: "SENT"
  });

  const [customers, setCustomers] = useState([]);
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState({
    amount: "",
    customer: "",
    status: ""
  });

  // Get Customers
  const fetchCustomers = async () => {
    try {
      const data = await CustomersAPI.findAll();
      setCustomers(data);
      if (!invoice.customer) setInvoice({ ...invoice, customer: data[0].id });
    } catch (error) {
      // TODO: Flash notification erreur
      history.replace("/invoices");
    }
  };

  // Get an invoice
  const fetchInvoice = async id => {
    try {
      const { amount, status, customer } = await invoicesAPI.find(id);
      setInvoice({ amount, status, customer: customer.id });
    } catch (error) {
      // TODO: Flash notification erreur
      history.replace("/invoices");
    }
  };

  // Get customers when the component is loaded
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Get invoice when id changes
  useEffect(() => {
    if (id !== "new") {
      setEditing(true);
      fetchInvoice(id);
    }
  }, [id]);

  //Manage Form Submit
  const handleSubmit = async event => {
    event.preventDefault();
    try {
      if (editing) {
        await invoicesAPI.update(id, invoice);
        // TODO : Flash Notification succès
      } else {
        await invoicesAPI.create(invoice);
        // TODO : Flash Notification succès
        history.replace("/invoices");
      }
    } catch ({ response }) {
      const { violations } = response.data;

      if (violations) {
        const apiErrors = {};
        violations.forEach(({ propertyPath, message }) => {
          apiErrors[propertyPath] = message;
        });
        setErrors(apiErrors);
        // TODO: Flash Notification d'erreurs
      }
    }
  };

  // Manage input changes in form
  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setInvoice({ ...invoice, [name]: value });
  };

  return (
    <>
      {(editing && <h1>Modification d'une facture</h1>) || (
        <h1>Création d'une facture</h1>
      )}
      <form onSubmit={handleSubmit}>
        <Field
          name="amount"
          type="number"
          placeholder="Montant de la facture"
          label="Montant"
          onChange={handleChange}
          value={invoice.amount}
          error={errors.amount}
        />
        <Select
          name="customer"
          label="Client"
          value={invoice.customer}
          error={errors.customer}
          onChange={handleChange}
        >
          {customers.map(customer => (
            <option key={customer.id} value={customer.id}>
              {customer.firstName} {customer.lastName}
            </option>
          ))}
        </Select>
        <Select
          name="status"
          label="Statut"
          value={invoice.status}
          error={errors.status}
          onChange={handleChange}
        >
          <option value="SENT">Envoyé</option>
          <option value="PAID">Payée</option>
          <option value="CANCELLED">Annulée</option>
        </Select>

        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Enregistrer
          </button>
          <Link to="/invoices" className="btn btn-link">
            Retour aux factures
          </Link>
        </div>
      </form>
    </>
  );
};

export default InvoicePage;
