import React, { useContext } from 'react';
import './App.css';
import Loader from './Components/loader/loader';
import { GlobalContext } from './Context/globalContext';
import Default from './Pages/default';

function App() {
  const globalcontext = useContext(GlobalContext);
  return (
    <div className="App">
      {globalcontext?.data.loading && <Loader />}
      <Default />
    </div>
  );
}

export default App;
