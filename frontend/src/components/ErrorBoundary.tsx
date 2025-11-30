import { type ErrorInfo, Component } from "react";

export default class ErrorBoundary extends Component<{ fallback: React.ReactNode, children: React.ReactNode }, { hasError: boolean }> {

    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.log('ErrorBoundary', error, errorInfo);
    }

    // if an error happened, set the state to true
    static getDerivedStateFromError(error: any) {
        console.log('ErrorBoundary', error);
        return { hasError: true };
    }

    render() {
        // if error happened, return a fallback component
        if (this.state.hasError) {
            return this.props.fallback;
        }

        return this.props.children;
    }
}