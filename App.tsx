/**
 * 主应用组件
 * 整合所有页面组件，提供统一的应用入口和路由管理
 */

import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'jotai';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Process } from './components/Process';
import { CTA } from './components/CTA';
import { Footer } from './components/Footer';
import { Programming } from './pages/Programming';
import { About } from './pages/About';
import { Cases } from './pages/Cases';

// 首页组件
const HomePage: React.FC = () => (
  <main>
    <Hero />
    <Services />
    <Process />
    <CTA />
  </main>
);

const App: React.FC = () => {
  return (
    <Provider>
      <Router>
        <div className="min-h-screen bg-white">
          <Navigation />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/programming" element={<Programming />} />
            <Route path="/cases" element={<Cases />} />
            <Route path="/about" element={<About />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
};

export default App;