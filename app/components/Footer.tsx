// app/components/Footer.tsx
'use client';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="fixed bottom-4 left-4 z-20">
            <div className="bg-white/50 dark:bg-black/50 backdrop-blur-sm border border-gray-300/50 dark:border-gray-700/50 text-gray-600 dark:text-gray-400 text-xs px-3 py-2 rounded-lg shadow-md">
                <span>WajehniTN v0.1.4 Beta © {currentYear} | All credits to Zied Kmanter</span>
            </div>
        </footer>
    );
}