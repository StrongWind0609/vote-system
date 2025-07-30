"use client";

import { VotingInterface } from '../components/VotingInterface';
import { ErrorBoundary } from '../components/ErrorBoundary';
import './globals.css';

export default function Home() {
    return (
        <ErrorBoundary>
            <main>
                <VotingInterface />
            </main>
        </ErrorBoundary>
    );
} 