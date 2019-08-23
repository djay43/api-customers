import React from "react";
import Field from "../components/forms/Field";
import { Link } from "react-router-dom";
const CustomerPage = props => {
  return (
    <>
      <h1>Création d'un client</h1>
      <form>
        <Field
          name="lastName"
          label="Nom de famille"
          placeholder="Nom de famille du client"
        />
        <Field name="firstName" label="Prénom" placeholder="Prénom du client" />

        <Field
          name="email"
          label="email"
          placeholder="Adresse Email du client"
          type="email"
        />
        <Field
          name="company"
          label="Entreprise"
          placeholder="entreprise du client"
          type="email"
        />
        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Enregistrer
          </button>
          <Link to="/customers">Retour à la liste</Link>
        </div>
      </form>
    </>
  );
};

export default CustomerPage;
