import React from "react";
import { Link } from "react-router-dom";

const HomePage = props => {
  return (
    <div className="jumbotron">
      <h1 className="display-3">Bienvenue!</h1>
      <p className="lead">Bienvenue sur votre outil de gestion de clients.</p>
      <hr className="my-4" />
      <p>
        Pour profiter pleinement des fonctionnalités, il vous faudra créer un
        compte gratuit!
      </p>
      <p className="lead">
        <Link
          to="/login"
          className="btn btn-primary btn-lg"
          href="#"
          role="button"
        >
          Se connecter
        </Link>
        <Link
          to="/register"
          className="btn btn-link btn-lg"
          href="#"
          role="button"
        >
          Je n'ai pas encore de compte
        </Link>
      </p>
    </div>
  );
};

export default HomePage;
