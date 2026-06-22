import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './auth';
import MainLayout from './layouts/MainLayout';
import AiToolLayout from './layouts/AiToolLayout';
import ServiceLayout from './layouts/ServiceLayout';
import ConsoleLayout from './layouts/ConsoleLayout';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import EContract from './pages/EContract';
import ContractCreate from './pages/econtract/ContractCreate';
import Packages from './pages/Packages';
import PackageDetail from './pages/PackageDetail';

import Platform from './pages/platform/Platform';

import ArbConsult from './pages/arbitration/ArbConsult';
import ArbFiling from './pages/arbitration/ArbFiling';
import ArbCases from './pages/arbitration/ArbCases';
import ArbCaseDetail from './pages/arbitration/ArbCaseDetail';

import AiHub from './pages/ai/AiHub';
import Chat from './pages/ai/Chat';
import ContractReview from './pages/ai/ContractReview';
import CaseAnalysis from './pages/ai/CaseAnalysis';
import ContractDraft from './pages/ai/ContractDraft';
import StructuredDoc from './pages/ai/StructuredDoc';
import BigDataQuery from './pages/ai/BigDataQuery';
import LawyerService from './pages/ai/LawyerService';
import MediationService from './pages/ai/MediationService';

import Overview from './pages/console/Overview';
import Orders from './pages/console/Orders';
import ProductsA from './pages/console/ProductsA';
import ProductsB from './pages/console/ProductsB';
import MyArbitration from './pages/console/MyArbitration';
import Promotion from './pages/console/Promotion';
import Profile from './pages/console/Profile';
import Billing from './pages/console/Billing';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { loggedIn } = useAuth();
  if (!loggedIn) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="e-contract" element={<EContract />} />
          <Route path="e-contract/create" element={<ContractCreate />} />
          <Route path="packages" element={<Packages />} />
          <Route path="packages/:id" element={<PackageDetail />} />
          <Route path="platform/:tab" element={<Platform />} />
          <Route path="platform" element={<Navigate to="/platform/company" replace />} />

          <Route element={<ServiceLayout />}>
            <Route path="services/lawyer" element={<LawyerService />} />
            <Route path="services/mediation" element={<MediationService />} />
          </Route>

          <Route path="arbitration/consult" element={<ArbConsult />} />
          <Route path="arbitration/filing" element={<ArbFiling />} />
          <Route path="arbitration/cases" element={<ArbCases />} />
          <Route path="arbitration/cases/:id" element={<ArbCaseDetail />} />
          <Route path="arbitration" element={<Navigate to="/arbitration/consult" replace />} />

          <Route path="ai-law">
            <Route index element={<AiHub />} />
            <Route path="big-data-query" element={<BigDataQuery />} />
            <Route element={<AiToolLayout />}>
              <Route path="chat" element={<Chat />} />
              <Route path="contract-review" element={<ContractReview />} />
              <Route path="case-analysis" element={<CaseAnalysis />} />
              <Route path="contract-draft" element={<ContractDraft />} />
              <Route path="structured-doc" element={<StructuredDoc />} />
            </Route>
          </Route>

          <Route
            path="console"
            element={
              <RequireAuth>
                <ConsoleLayout />
              </RequireAuth>
            }
          >
            <Route index element={<Overview />} />
            <Route path="orders" element={<Orders />} />
            <Route path="products-a" element={<ProductsA />} />
            <Route path="products-b" element={<ProductsB />} />
            <Route path="arbitration" element={<MyArbitration />} />
            <Route path="promotion" element={<Promotion />} />
            <Route path="profile" element={<Profile />} />
            <Route path="billing" element={<Billing />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
