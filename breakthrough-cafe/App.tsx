import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'jotai';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Process } from './components/Process';
import { CTA } from './components/CTA';
import { Footer } from './components/Footer';
import { Programming } from './pages/Programming';
import { Cases } from './pages/Cases';
import { CaseDetail } from './pages/CaseDetail';
import { Articles } from './pages/Articles';
import { ArticleDetail } from './pages/ArticleDetail';
import { ManagementLogin } from './pages/Management/Login';
import { ManagementDashboard } from './pages/Management/Dashboard';
import { ArticleEditor } from './pages/Management/ArticleEditor';
import { ArticleListManagement } from './pages/Management/ArticleList';
import { CategoryManagement } from './pages/Management/CategoryManagement';
import { DebugTool } from './pages/Management/DebugTool';
import PutDebugTool from './pages/Management/PutDebugTool';
import DatabaseDebugTool from './pages/Management/DatabaseDebugTool';
import { MongoDebugTool } from './pages/Management/MongoDebugTool';
import { StatusDebugTool } from './pages/Management/StatusDebugTool';
import DirectMongoTest from './pages/Management/DirectMongoTest';
import { SelectionDebugTool } from './pages/Management/SelectionDebugTool';
import { DataConsistencyTool } from './pages/Management/DataConsistencyTool';
import PutAnalysisTool from './pages/Management/PutAnalysisTool';
import { CacheDebugTool } from './pages/Management/CacheDebugTool';
import ErrorBoundary from './components/ErrorBoundary';
import { ManagementLayout } from './components/ManagementLayout';
import { useSimpleAuth } from './hooks/useSimpleAuth';

// 公共页面布局组件
const PublicPageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Navigation />
      {children}
      <Footer />
    </>
  );
};

// 主页组件
const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <Services />
      <Process />
      <CTA />
    </>
  );
};

// 保护的管理后台路由组件
const ProtectedManagementRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isInitialized } = useSimpleAuth();
  
  // 输出路由保护检查的调试信息
  React.useEffect(() => {
    console.log('🛡️ 路由保护检查:', {
      isAuthenticated,
      isInitialized,
      timestamp: new Date().toISOString()
    });
  }, [isAuthenticated, isInitialized]);

  if (!isInitialized) {
    console.log('⏳ 认证状态初始化中...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">正在验证身份...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    console.log('❌ 用户未认证，重定向到登录页面');
    return <Navigate to="/management/login" replace />;
  }

  console.log('✅ 用户已认证，渲染管理页面');
  return (
    <ManagementLayout>
      {children}
    </ManagementLayout>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Provider>
        <Router>
          <div className="min-h-screen bg-white">
            <Routes>
              {/* 管理后台登录页面 - 独立路由 */}
              <Route path="/management/login" element={
                <ErrorBoundary>
                  <ManagementLogin />
                </ErrorBoundary>
              } />
              
              {/* 管理后台页面组 */}
              <Route path="/management" element={
                <ProtectedManagementRoute>
                  <ManagementDashboard />
                </ProtectedManagementRoute>
              } />
              <Route path="/management/articles" element={
                <ProtectedManagementRoute>
                  <ArticleListManagement />
                </ProtectedManagementRoute>
              } />
              <Route path="/management/articles/:id" element={
                <ProtectedManagementRoute>
                  <ArticleEditor />
                </ProtectedManagementRoute>
              } />
              <Route path="/management/categories" element={
                <ProtectedManagementRoute>
                  <CategoryManagement />
                </ProtectedManagementRoute>
              } />
              <Route path="/management/debug" element={
                <ProtectedManagementRoute>
                  <DebugTool />
                </ProtectedManagementRoute>
              } />
              <Route path="/management/put-debug" element={
                <ProtectedManagementRoute>
                  <PutDebugTool />
                </ProtectedManagementRoute>
              } />
              <Route path="/management/db-debug" element={
                <ProtectedManagementRoute>
                  <DatabaseDebugTool />
                </ProtectedManagementRoute>
              } />
              <Route path="/management/mongo-debug" element={
                <ProtectedManagementRoute>
                  <MongoDebugTool />
                </ProtectedManagementRoute>
              } />
              <Route path="/management/status-debug" element={
                <ProtectedManagementRoute>
                  <StatusDebugTool />
                </ProtectedManagementRoute>
              } />
              <Route path="/management/direct-mongo" element={
                <ProtectedManagementRoute>
                  <DirectMongoTest />
                </ProtectedManagementRoute>
              } />
              <Route path="/management/selection-debug" element={
                <ProtectedManagementRoute>
                  <SelectionDebugTool />
                </ProtectedManagementRoute>
              } />
              <Route path="/management/data-consistency" element={
                <ProtectedManagementRoute>
                  <DataConsistencyTool />
                </ProtectedManagementRoute>
              } />
              <Route path="/management/put-analysis" element={
                <ProtectedManagementRoute>
                  <PutAnalysisTool />
                </ProtectedManagementRoute>
              } />
              <Route path="/management/cache-debug" element={
                <ProtectedManagementRoute>
                  <CacheDebugTool />
                </ProtectedManagementRoute>
              } />
              
              {/* 普通页面组 */}
              <Route path="/" element={
                <PublicPageLayout>
                  <HomePage />
                </PublicPageLayout>
              } />
              <Route path="/programming" element={
                <PublicPageLayout>
                  <Programming />
                </PublicPageLayout>
              } />
              <Route path="/cases" element={
                <PublicPageLayout>
                  <Cases />
                </PublicPageLayout>
              } />
              <Route path="/cases/:id" element={
                <PublicPageLayout>
                  <CaseDetail />
                </PublicPageLayout>
              } />
              <Route path="/articles" element={
                <PublicPageLayout>
                  <Articles />
                </PublicPageLayout>
              } />
              <Route path="/articles/:id" element={
                <PublicPageLayout>
                  <ArticleDetail />
                </PublicPageLayout>
              } />
              
              {/* 404 重定向 */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;