import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import RiderDashboard from "pages/rider-dashboard";
import DriverDashboard from "pages/driver-dashboard";
import PaymentWalletManagement from "pages/payment-wallet-management";
import ActiveRideTracking from "pages/active-ride-tracking";
import UserProfileSettings from "pages/user-profile-settings";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<RiderDashboard />} />
        <Route path="/rider-dashboard" element={<RiderDashboard />} />
        <Route path="/driver-dashboard" element={<DriverDashboard />} />
        <Route path="/payment-wallet-management" element={<PaymentWalletManagement />} />
        <Route path="/active-ride-tracking" element={<ActiveRideTracking />} />
        <Route path="/user-profile-settings" element={<UserProfileSettings />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;