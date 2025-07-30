import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'America\'s Got Talent Live Voting',
    description: 'Vote for your favorite contestants in real-time during the live show!',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
} 