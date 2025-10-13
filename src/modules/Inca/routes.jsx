import { Route } from "react-router-dom";
import Index from "./pages/produtores/pessoal";

const IncaRoutes = () => {
  return (
    <>
      <Route path="gestao-de-cafe">
        <Route index element={<Index />} />
        <Route path="produtores" element={<Index />}>
          <Route path="pessoal" element={<Index />} />
        </Route>
      </Route>
    </>
  );
};

export default IncaRoutes;
