import { Route } from "react-router-dom";
import Test from "./pages/test";

const IncaRoutes = () => {
  return (
    <>
      <Route path="test">
        <Route index element={<Test />} />
      </Route>
    </>
  );
};

export default IncaRoutes;
