"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorState } from '../types';
import './ErrorBoundary.css';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.props.onError?.(error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="error-boundary">
                    <div className="error-content">
                        <h2>Something went wrong</h2>
                        <p>We're sorry, but something unexpected happened. Please try again.</p>
                        {this.state.error && (
                            <details className="error-details">
                                <summary>Error Details</summary>
                                <pre>{this.state.error.message}</pre>
                            </details>
                        )}
                        <button onClick={this.handleRetry} className="retry-button">
                            Try Again
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
} 