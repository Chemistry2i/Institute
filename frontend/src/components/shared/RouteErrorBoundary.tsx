import { Component, type ReactNode } from 'react'
import { Button } from '../ui/button'

interface RouteErrorBoundaryProps {
  children: ReactNode
}

interface RouteErrorBoundaryState {
  hasError: boolean
}

export class RouteErrorBoundary extends Component<RouteErrorBoundaryProps, RouteErrorBoundaryState> {
  state: RouteErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): RouteErrorBoundaryState {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="route-error-screen" role="alert">
          <h1>We couldn’t load this view</h1>
          <p>The connection may have changed while loading. Reload the application to try again.</p>
          <Button onClick={() => window.location.reload()}>Reload application</Button>
        </div>
      )
    }

    return this.props.children
  }
}