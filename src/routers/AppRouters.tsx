import Page from "@/pages/Dashboard";
import { Routes, Route } from "react-router-dom";



function AppRoutes() {
  return (
    <>
      <Routes>
        {/* Auth Routes */}

        {/* Protected Dashboard Routes */}
        <Route element={<Page />}>
          <Route path="/dashboard" element={<Page/>} />
        </Route>
      </Routes>
    </>
  );
}

export default AppRoutes;