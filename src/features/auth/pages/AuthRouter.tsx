import React from 'react';
import { Route, Switch, useLocation } from 'wouter';
import { LoginPage } from './LoginPage';
import { SignupPage } from './SignupPage';

export const AuthRouter: React.FC = () => {
  const [location] = useLocation();

  return (
    <Switch>
      <Route path="/auth/login" component={LoginPage} />
      <Route path="/auth/signup" component={SignupPage} />
      <Route path="/auth">
        {/* Redirection par défaut vers login */}
        <LoginPage />
      </Route>
    </Switch>
  );
};