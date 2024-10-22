import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import CarrosList from './components/CarrosList';
import CarroDetalhes from './components/CarroDetalhes';



const App = () => {
  return (
    <Router>
      <Routes>  
        <Route path="/" element={<CarrosList />} />
        <Route path="/carro/:id" element={<CarroDetalhes />} />
      </Routes>
    </Router>
  );
};

export default App;
