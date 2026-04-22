import { Component } from 'react';
import { Button } from './Button';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="section-wrap grid min-h-screen place-items-center py-20">
          <div className="clay-panel max-w-lg p-8 text-center">
            <h1 className="text-2xl font-bold">Something went wrong</h1>
            <p className="mt-2 text-sm text-muted">Please refresh the page and try again.</p>
            <Button className="mt-5" variant="gradient" onClick={() => window.location.reload()}>
              Reload
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
