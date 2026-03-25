/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    const { hasError, error } = this.state;
    if (hasError) {
      let errorMessage = "알 수 없는 오류가 발생했습니다.";
      try {
        if (error?.message) {
          const parsed = JSON.parse(error.message);
          if (parsed.error && parsed.error.includes("insufficient permissions")) {
            errorMessage = "권한이 없습니다. 관리자 로그인이 필요합니다.";
          }
        }
      } catch {
        errorMessage = error?.message || errorMessage;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-white p-6 text-center">
          <div>
            <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter">Error.</h2>
            <p className="text-gray-500 mb-8">{errorMessage}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-black text-white uppercase text-xs font-bold tracking-widest"
            >
              다시 시도
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
