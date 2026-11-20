import { type ReactNode, useEffect, useRef } from "react";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { ClerkProvider, Show, SignIn, SignUp, useClerk } from "@clerk/react";
import { publishableKeyFromHost } from "@clerk/react/internal";
import { ptBR } from "@clerk/localizations";
import { shadcn } from "@clerk/themes";
import { Redirect, Route, Switch, useLocation, Router as WouterRouter } from "wouter";
import { ErrorBoundary } from "@/components/error-boundary";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import SiteLayout from "@/layouts/SiteLayout";
import HomePage from "@/pages/home";
import AboutPage from "@/pages/about";
import ServicesPage from "@/pages/services";
import TechnologyPage from "@/pages/technology";
import TeamPage from "@/pages/team";
import BlogPage from "@/pages/blog";
import ArticlePage from "@/pages/article";
import ContactPage from "@/pages/contact";
import { PrivacyPage, TermsPage } from "@/pages/legal";
import NotFound from "@/pages/not-found";
import DocumentsPage from "@/pages/platform/documents";
import {
  AuditoriasPage,
  CondicionantesPage,
  IbamaPage,
  LicencasPage,
  MonitoramentosPage,
  ObrigacoesPage,
  PlanosPage,
  ResiduosPage,
} from "@/pages/platform/modules";
import { PlatformProvider } from "@/platform/context";
import PlatformShell from "@/platform/PlatformShell";

const queryClient = new QueryClient();
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

if (!clerkPubKey) {
  throw new Error("VITE_CLERK_PUBLISHABLE_KEY não foi configurada.");
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: "#194D36",
    colorForeground: "#194D36",
    colorMutedForeground: "#58645D",
    colorDanger: "#A2332A",
    colorBackground: "#FFFFFF",
    colorInput: "#FFFFFF",
    colorInputForeground: "#194D36",
    colorNeutral: "#194D36",
    fontFamily: "Manrope, sans-serif",
    borderRadius: "0.875rem",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "bg-white rounded-2xl w-[440px] max-w-full overflow-hidden",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "text-[#194D36] font-bold",
    headerSubtitle: "text-[#58645D]",
    socialButtonsBlockButtonText: "text-[#194D36] font-semibold",
    formFieldLabel: "text-[#194D36] font-semibold",
    footerActionLink: "text-[#194D36] font-semibold",
    footerActionText: "text-[#58645D]",
    dividerText: "text-[#58645D]",
    formFieldSuccessText: "text-[#1F6A43]",
    alertText: "text-[#7E2A22]",
    socialButtonsBlockButton: "border-[#194D36]/15",
    formButtonPrimary: "bg-[#194D36] text-white font-semibold hover:bg-[#123a29]",
    formFieldInput: "border-[#194D36]/15 text-[#194D36]",
    dividerLine: "bg-[#194D36]/10",
    alert: "border-red-200 bg-red-50",
    main: "text-[#194D36]",
  },
};

function stripBase(path: string) {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function SignInPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[#F5F9F6] px-4 py-10">
      <SignIn
        routing="path"
        path={`${basePath}/sign-in`}
        signUpUrl={`${basePath}/sign-up`}
      />
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[#F5F9F6] px-4 py-10">
      <SignUp
        routing="path"
        path={`${basePath}/sign-up`}
        signInUrl={`${basePath}/sign-in`}
      />
    </div>
  );
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const client = useQueryClient();
  const previousUserId = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const currentUserId = user?.id ?? null;
      if (
        previousUserId.current !== undefined &&
        previousUserId.current !== currentUserId
      ) {
        client.clear();
      }
      previousUserId.current = currentUserId;
    });
    return unsubscribe;
  }, [addListener, client]);

  return null;
}

function HomeRoute() {
  return (
    <>
      <Show when="signed-in">
        <Redirect to="/controle" />
      </Show>
      <Show when="signed-out">
        <SiteLayout>
          <RoutedErrorBoundary>
            <HomePage />
          </RoutedErrorBoundary>
        </SiteLayout>
      </Show>
    </>
  );
}

function PublicRoutes() {
  return (
    <SiteLayout>
      <RoutedErrorBoundary>
        <Switch>
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

function ControlRoutes() {
  return (
    <>
      <Show when="signed-in">
        <PlatformProvider>
          <PlatformShell>
            <RoutedErrorBoundary>
              <Switch>
                <Route path="/controle">
                  <Redirect to="/controle/documentos" />
                </Route>
                <Route path="/controle/documentos" component={DocumentsPage} />
                <Route path="/controle/licencas" component={LicencasPage} />
                <Route path="/controle/condicionantes" component={CondicionantesPage} />
                <Route path="/controle/obrigacoes" component={ObrigacoesPage} />
                <Route path="/controle/residuos" component={ResiduosPage} />
                <Route path="/controle/ibama" component={IbamaPage} />
                <Route path="/controle/auditorias" component={AuditoriasPage} />
                <Route path="/controle/planos" component={PlanosPage} />
                <Route path="/controle/monitoramentos" component={MonitoramentosPage} />
                <Route>
                  <Redirect to="/controle/documentos" />
                </Route>
              </Switch>
            </RoutedErrorBoundary>
          </PlatformShell>
        </PlatformProvider>
      </Show>
      <Show when="signed-out">
        <Redirect to="/" />
      </Show>
    </>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/sign-in/*?" component={SignInPage} />
      <Route path="/sign-up/*?" component={SignUpPage} />
      <Route path="/acesso">
        <Redirect to="/sign-in" />
      </Route>
      <Route path="/controle/*?" component={ControlRoutes} />
      <Route path="/" component={HomeRoute} />
      <Route component={PublicRoutes} />
    </Switch>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        ...ptBR,
        signIn: {
          ...ptBR.signIn,
          start: {
            ...(ptBR.signIn?.start ?? {}),
            title: "Acesse o VERDANT CONTROL",
            subtitle: "Entre para continuar na sua área ambiental.",
          },
        },
        signUp: {
          ...ptBR.signUp,
          start: {
            ...(ptBR.signUp?.start ?? {}),
            title: "Crie seu acesso",
            subtitle: "Cadastre-se para entrar no VERDANT CONTROL.",
          },
        },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;
