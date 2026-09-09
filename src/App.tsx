import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { BrandThemeSync } from "./components/brand/BrandThemeSync";
import { ACTIVE_MARKET } from "./config/network";
import HomePage from "./pages/HomePage";

const ServiceCategoryPage = lazy(() => import("./pages/ServiceCategoryPage"));
const LivingParaguayPage = lazy(() => import("./pages/LivingParaguayPage"));
const ProfessionalsPage = lazy(() => import("./pages/ProfessionalsPage"));
const CommunityPage = lazy(() => import("./pages/CommunityPage"));
const ResourcesPage = lazy(() => import("./pages/ResourcesPage"));
const PartnerPage = lazy(() => import("./pages/PartnerPage"));
const PartnerTierPage = lazy(() => import("./pages/PartnerTierPage"));
const NetworkPage = lazy(() => import("./pages/NetworkPage"));
const MarketComingSoonPage = lazy(() => import("./pages/MarketComingSoonPage"));
const PermitsPage = lazy(() => import("./pages/PermitsPage"));
const SchoolsPage = lazy(() => import("./pages/SchoolsPage"));
const NeighborhoodsPage = lazy(() => import("./pages/NeighborhoodsPage"));
const TaxationPage = lazy(() => import("./pages/TaxationPage"));
const SocialSecurityPage = lazy(() => import("./pages/SocialSecurityPage"));
const FaqPage = lazy(() => import("./pages/FaqPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));
const ApostillarDocumentosPage = lazy(() => import("./pages/blog/ApostillarDocumentosPage"));
const AdminLoginPage = lazy(() => import("./pages/admin/AdminLoginPage"));
const AdminDashboardPage = lazy(() => import("./pages/admin/AdminDashboardPage"));
const CrmLoginPage = lazy(() => import("./pages/crm/CrmLoginPage"));
const CrmDashboardPage = lazy(() => import("./pages/crm/CrmDashboardPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const RouteFallback = () => (
  <div className="flex min-h-[40vh] items-center justify-center bg-background px-4 pt-24" role="status" aria-live="polite">
    <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary/25 border-t-primary" aria-hidden />
      Cargando…
    </div>
  </div>
);

const ActiveMarketRoutes = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/vivir-en-paraguay" element={<LivingParaguayPage />} />
    <Route path="/servicios" element={<HomePage />} />
    <Route path="/servicios/:slug" element={<ServiceCategoryPage />} />
    <Route path="/profesionales" element={<ProfessionalsPage />} />
    <Route path="/comunidad" element={<CommunityPage />} />
    <Route path="/recursos" element={<ResourcesPage />} />
    <Route path="/ser-partner" element={<PartnerPage />} />
    <Route path="/ser-partner/:tierSlug" element={<PartnerTierPage />} />
    <Route path="/lbc" element={<NetworkPage />} />

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

    <Route path="/crm/login" element={<CrmLoginPage />} />
    <Route path="/crm" element={<ProtectedRoute loginPath="/crm/login"><CrmDashboardPage /></ProtectedRoute>} />

    <Route path="/admin/login" element={<AdminLoginPage />} />
    <Route path="/admin/dashboard" element={<ProtectedRoute requireAdmin><AdminDashboardPage /></ProtectedRoute>} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <BrandThemeSync />
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Suspense fallback={<RouteFallback />}>
                {ACTIVE_MARKET.status === 'active' ? <ActiveMarketRoutes /> : <MarketComingSoonPage />}
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
