import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import SignupForm from './components/SignupForm';
import SignIn from './components/SignIn';

function App() {
  return (
    <div className="container mt-5">
      <h1>Firebase Authentication Demo</h1>
      <SignupForm />
      <SignIn />
    </div>
  );
}

export default App;
