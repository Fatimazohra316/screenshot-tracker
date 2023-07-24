import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';

import "./App.css";
import SignIn from './login';
import Timer from './popup';






const routingConfig = {
  routes: [
    {
      path: 'timer',
      component: Timer,
    },
    {
      path: "/",
      component: SignIn,
    }

  ],
};

function App() {
  const [login, setLogin] = useState(false);
  const items = JSON.parse(localStorage.getItem('items'));
  useEffect(() => {
    if (items) {
      setLogin(true)
    }
  }, [items])


  return (

    <Router routes={routingConfig.routes}>
      {login ? <Timer setLogin={setLogin} /> : <SignIn setLogin={setLogin} />}

    </Router>

  );
}

export default App;

