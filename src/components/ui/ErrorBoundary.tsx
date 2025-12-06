import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

const FallbackUI = (
  <div style={{ padding: '20px', textAlign: 'center', color: 'red', border: '1px solid red', borderRadius: '8px', margin: '20px' }}>
    <h1>Something went wrong.</h1>
    <p>We're sorry for the inconvenience. Please try refreshing the page.</p>
  </div>
);

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return FallbackUI;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;