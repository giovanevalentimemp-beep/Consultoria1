import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import SiteLayout from '@/layouts/SiteLayout';
import HomePage from '@/pages/home';
import AboutPage from '@/pages/about';
import ServicesPage from '@/pages/services';
import TechnologyPage from '@/pages/technology';
import TeamPage from '@/pages/team';
import BlogPage from '@/pages/blog';
import ArticlePage from '@/pages/article';
import ContactPage from '@/pages/contact';
import LoginPage from '@/pages/login';
import { PrivacyPage, TermsPage } from '@/pages/legal';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

function Router() {
  const [location] = useLocation();
  if (location === '/acesso') {
    return (
      <RoutedErrorBoundary>
        <LoginPage />
      </RoutedErrorBoundary>
    );
  }
  return (
    <SiteLayout>
      <RoutedErrorBoundary>
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/a-empresa" component={AboutPage} />
          <Route path="/servicos" component={ServicesPage} />
          <Route path="/tecnologia" component={TechnologyPage} />
          <Route path="/equipe-tecnica" component={TeamPage} />
          <Route path="/conteudos" component={BlogPage} />
          <Route path="/conteudos/:slug" component={ArticlePage} />
          <Route path="/contato" component={ContactPage} />
          <Route path="/politica-de-privacidade" component={PrivacyPage} />
          <Route path="/termos-de-uso" component={TermsPage} />
          <Route component={NotFound} />
        </Switch>
      </RoutedErrorBoundary>
    </SiteLayout>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
