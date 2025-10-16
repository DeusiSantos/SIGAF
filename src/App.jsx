import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';

// Importar as rotas dos módulos
import Layout from './Layout/layout';
import AgricolaRoutes from './modules/Agricola/routes';
import FlorestalRoutes from './modules/Florestal/routes';
import IncaRoutes from './modules/Inca/routes';

// Outros imports...

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<LoginPage />}></Route>
        <Route path="/GerenciaRNPA" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />

          {/* Rotas do módulo Agrícola */}
          {AgricolaRoutes()}

          {/* Rotas do módulo Florestal */}
          {FlorestalRoutes()}

          {/* Rotas do módulo Inca */}
          {IncaRoutes()}

          {/* Outras rotas gerais... */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;