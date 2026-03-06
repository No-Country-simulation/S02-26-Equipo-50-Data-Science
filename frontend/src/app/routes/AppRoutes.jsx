// AppRoutes.jsx
// Main routes configuration

import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AnimatedPage from '../../shared/components/AnimatedPage';
import ROUTES from './route.config';
import MainLayout from '../../shared/layouts/MainLayout';


import Landing from '../../features/landing/components/Landing';
import Login from '../../features/auth/components/Login';
import Register from '../../features/auth/components/Register';
import Onboarding from '../../features/onboarding/components/Onboarding';
import Dashboard from '../../features/dashboard/components/Dashboard';
import Inventory from '../../features/inventory/components/Inventory';
import Sales from '../../features/sales/components/Sales';
import ProductList from '../../features/products/components/ProductList';
import CustomerList from '../../features/customers/components/CustomerList';

const AppRoutes = () => {
  return (
    <Routes>
      {/* ===== RUTAS PÚBLICAS ===== */}
      <Route path={ROUTES.LANDING} element={<AnimatedPage><Landing /></AnimatedPage>} />
      <Route path={ROUTES.LOGIN} element={<AnimatedPage><Login /></AnimatedPage>} />
      <Route path={ROUTES.REGISTER} element={<AnimatedPage><Register /></AnimatedPage>} />
      <Route path={ROUTES.ONBOARDING} element={<AnimatedPage><Onboarding /></AnimatedPage>} />

      {/* ===== RUTAS PROTEGIDAS ===== */}
      <Route element={<MainLayout />}>
        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
        <Route path={ROUTES.SALES} element={<Sales />} />
        <Route path={ROUTES.PRODUCTS} element={<ProductList />} />
        <Route path={ROUTES.CUSTOMERS} element={<CustomerList />} />
        <Route path={ROUTES.INVENTORY} element={<Inventory />} />
      </Route>

      {/* Redirect to home for unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
