import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LivingParaguayPage from "./pages/LivingParaguayPage";
import ProfessionalsPage from "./pages/ProfessionalsPage";
import CommunityPage from "./pages/CommunityPage";
import ResourcesPage from "./pages/ResourcesPage";
import PartnerPage from "./pages/PartnerPage";
import PermitsPage from "./pages/PermitsPage";
import SchoolsPage from "./pages/SchoolsPage";
import NeighborhoodsPage from "./pages/NeighborhoodsPage";
import TaxationPage from "./pages/TaxationPage";
import SocialSecurityPage from "./pages/SocialSecurityPage";
import FaqPage from "./pages/FaqPage";
import ContactPage from "./pages/ContactPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import ApostillarDocumentosPage from "./pages/blog/ApostillarDocumentosPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/vivir-en-paraguay" element={<LivingParaguayPage />} />
                <Route path="/profesionales" element={<ProfessionalsPage />} />
                <Route path="/comunidad" element={<CommunityPage />} />
                <Route path="/recursos" element={<ResourcesPage />} />
                <Route path="/ser-partner" element={<PartnerPage />} />

                <Route path="/permits" element={<PermitsPage />} />
                <Route path="/schools" element={<SchoolsPage />} />
                <Route path="/neighborhoods" element={<NeighborhoodsPage />} />
                <Route path="/taxation" element={<TaxationPage />} />
                <Route path="/social-security" element={<SocialSecurityPage />} />
                <Route path="/faq" element={<FaqPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
                <Route path="/blog/apostillar-documentos" element={<ApostillarDocumentosPage />} />

                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
