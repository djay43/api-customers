import React, { useState } from "react";
import { Link } from "react-router-dom";
import Field from "../components/forms/Field";
import usersApi from "../services/usersApi";

const RegisterPage = ({ history }) => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: ""
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: ""
  });

  // Manage input changes in form
  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setUser({ ...user, [name]: value });
  };

  // Manage form submit
  const handleSubmit = async event => {
    event.preventDefault();

    const apiErrors = {};
    if (user.password !== user.passwordConfirm) {
      apiErrors.passwordConfirm = "Les mots de passe doivent être identiques";
      setErrors(apiErrors);
      return;
    }

    try {
      await usersApi.register(user);
      setErrors({});

      // TODO: flash succès
      history.replace("/login");
    } catch (error) {
      const { violations } = error.response.data;

      if (violations) {
        violations.forEach(violation => {
          apiErrors[violation.propertyPath] = violation.message;
        });
        // TODO : Flash erreur
        setErrors(apiErrors);
      }
    }
  };

  return (
    <>
      <h1>Inscription</h1>;
      <form onSubmit={handleSubmit}>
        <Field
          name="firstName"
          label="Prénom"
          placeholder="Votre prénom"
          error={errors.firstName}
          value={user.firstName}
          onChange={handleChange}
        />
        <Field
          name="lastName"
          label="Nom"
          placeholder="Votre nom de famille"
          error={errors.lastName}
          value={user.lastName}
          onChange={handleChange}
        />
        <Field
          name="email"
          label="email"
          type="email"
          placeholder="Votre Email"
          error={errors.email}
          value={user.email}
          onChange={handleChange}
        />
        <Field
          name="password"
          label="Mot de passe"
          placeholder="Mot de passe"
          type="password"
          error={errors.password}
          value={user.password}
          onChange={handleChange}
        />
        <Field
          name="passwordConfirm"
          label="Mot de passe"
          placeholder="Répétez le  mot de passe"
          type="password"
          error={errors.passwordConfirm}
          value={user.passwordConfirm}
          onChange={handleChange}
        />
        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Confirmation
          </button>
          <Link to="/login" className="btn btn-link">
            J'ai déjà un compte
          </Link>
        </div>
      </form>
    </>
  );
};

export default RegisterPage;
