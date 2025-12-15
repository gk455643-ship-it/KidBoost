import React, { ErrorInfo, ReactNode } from "react";
import { RefreshCw, AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReload = () => {
      window.location.reload();
  }

  private handleClearData = () => {
      if (confirm("This will clear local data and re-login. Are you sure?")) {
          localStorage.clear();
          window.location.reload();
      }
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 p-8 text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-4">Something went wrong</h1>
          <p className="text-slate-500 mb-8 max-w-sm">
            We're sorry, but the app encountered an unexpected error.
          </p>
          
          <div className="flex flex-col gap-4 w-full max-w-xs">
              <button 
                onClick={this.handleReload}
                className="w-full bg-brand-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                  <RefreshCw className="w-5 h-5" /> Reload App
              </button>
              
              <button 
                onClick={this.handleClearData}
                className="w-full bg-white text-slate-400 py-3 rounded-xl font-bold border-2 border-slate-200 hover:text-red-500 hover:border-red-200 transition-colors"
              >
                  Reset Data
              </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}