/**
 * 错误边界组件
 * 捕获组件错误，防止整个应用崩溃
 */

import React from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 错误边界捕获到错误:', error);
    console.error('📋 错误详细信息:', errorInfo);
    
    this.setState({
      hasError: true,
      error,
      errorInfo
    });
  }

  handleRetry = () => {
    console.log('🔄 重置错误状态，重新渲染组件');
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback } = this.props;
      
      if (Fallback && this.state.error) {
        return <Fallback error={this.state.error} retry={this.handleRetry} />;
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              页面加载出错
            </h1>
            
            <p className="text-gray-600 mb-6">
              页面遇到了一个错误，请尝试刷新页面或联系技术支持。
            </p>

            {this.state.error && (
              <div className="bg-gray-100 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-medium text-gray-800 mb-2">错误详情：</h3>
                <p className="text-sm text-gray-600 font-mono">
                  {this.state.error.message}
                </p>
              </div>
            )}
            
            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
              >
                <RefreshCw className="w-4 h-4" />
                <span>重试</span>
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                刷新页面
              </button>

              <button
                onClick={() => window.location.href = '/management/login'}
                className="w-full px-6 py-3 text-gray-500 hover:text-gray-700 transition-colors"
              >
                返回登录页
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;