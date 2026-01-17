import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AdsProvider } from './contexts/AdsContext';
import { LoadingProvider, useLoading } from './contexts/LoadingContext';
import { SiteProvider, useSiteSettings } from './contexts/SiteContext';
import LoadingScreen from './components/LoadingScreen';
import RouteLoadingBar from './components/RouteLoadingBar';
import RouteChangeHandler from './components/RouteChangeHandler';
import Navbar from './components/Navbar';
import AdSlot from './components/AdSlot';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Watch from './pages/Watch';
import Search from './pages/Search';
import Explore from './pages/Explore';
import MyList from './pages/MyList';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import NotFound from './pages/NotFound';
import FAQ from './pages/FAQ';
import DMCA from './pages/DMCA';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import './App.css';

import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ArticleManager from './pages/admin/ArticleManager';
import ArticleEditor from './pages/admin/ArticleEditor';
import SiteSettings from './pages/admin/SiteSettings';
import Setup from './pages/admin/Setup';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const { isLoading, isRouteChanging } = useLoading();
  const { settings } = useSiteSettings();

  return (
    <>
      {/* Full loading screen for initial page load */}
      <LoadingScreen isVisible={isLoading} />

      {/* Simple loading bar for route transitions */}
      <RouteLoadingBar isVisible={isRouteChanging} />
      <AdsProvider>
        <div className="app">
          {!isAdminRoute && <Navbar />}
          <RouteChangeHandler>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/latest" element={<Explore />} />
              <Route path="/popular" element={<Explore />} />
              <Route path="/trending" element={<Explore />} />
              <Route path="/sulih-suara" element={<Explore />} />
              <Route path="/my-list" element={<MyList />} />
              <Route path="/drama/:id/:slug?" element={<Detail />} />
              <Route path="/watch/:id/:slug/:episode" element={<Watch />} />
              <Route path="/watch/:id/:episode" element={<Watch />} />
              <Route path="/search" element={<Search />} />

              {/* Article Pages */}
              <Route path="/artikel" element={<Articles />} />
              <Route path="/artikel/:slug" element={<ArticleDetail />} />

              {/* Footer Pages */}
              <Route path="/faq" element={<FAQ />} />
              <Route path="/dmca" element={<DMCA />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<Login />} />
              <Route path="/admin/login" element={<Login />} />
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/articles" element={<ArticleManager />} />
              <Route path="/admin/articles/new" element={<ArticleEditor />} />
              <Route path="/admin/articles/edit/:id" element={<ArticleEditor />} />
              <Route path="/admin/settings" element={<SiteSettings />} />
              <Route path="/admin/setup" element={<Setup />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </RouteChangeHandler>
          {!isAdminRoute && (
            <footer className="footer">
              <div className="container footer-content">
                <div className="footer-col brand-col">
                  <h3 className="footer-brand">{settings?.site_name || 'DramaBox'}<span className="text-gold">Web</span></h3>
                  <p className="footer-desc">
                    {settings?.site_tagline || 'Your premium destination for the best Chinese dramas. Experience high-quality streaming and unlimited entertainment.'}
                  </p>
                </div>

                <div className="footer-col">
                  <h4>Discover</h4>
                  <ul className="footer-links">
                    <li><a href="/">Home</a></li>
                    <li><a href="/search">Search</a></li>
                    <li><a href="/trending">Trending</a></li>
                    <li><a href="/latest">New Releases</a></li>
                  </ul>
                </div>

                <div className="footer-col">
                  <h4>Support</h4>
                  <ul className="footer-links">
                    <li><a href="/faq">FAQ</a></li>
                    <li><a href="/dmca">DMCA</a></li>
                    <li><a href="/privacy">Privacy Policy</a></li>
                    <li><a href="/terms">Terms of Service</a></li>
                  </ul>
                </div>

                <div className="footer-col">
                  <h4>Connect</h4>
                  <div className="social-links">
                    <a href="#" className="social-icon">Twitter</a>
                    <a href="#" className="social-icon">Instagram</a>
                    <a href="#" className="social-icon">Discord</a>
                  </div>
                </div>
              </div>
            </footer>
          )}
        </div>
      </AdsProvider>
    </>
  );
}

function App() {
  return (
    <SiteProvider>
      <LoadingProvider>
        <AppContent />
      </LoadingProvider>
    </SiteProvider>
  );
}

export default App;
