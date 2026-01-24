// 'use client';

// import { useEffect, useState } from 'react';

// export default function ScrollProgress() {
//     const [scrollPercent, setScrollPercent] = useState(0);

//     useEffect(() => {
//         const handleScroll = () => {
//             const scrollTop = window.scrollY;
//             const docHeight = document.body.scrollHeight - window.innerHeight;
//             const scrolled = (scrollTop / docHeight) * 100;
//             setScrollPercent(scrolled);
//         };

//         // Initial value
//         handleScroll();

//         window.addEventListener('scroll', handleScroll);
//         return () => window.removeEventListener('scroll', handleScroll);
//     }, []);

//     return (
//         <div className="fixed top-0 left-0 w-full h-1 bg-zinc-200 dark:bg-zinc-800 z-50">
//             <div
//                 className="h-1 bg-yellow-400 dark:bg-yellow-500 transition-[width] duration-300 ease-out"
//                 style={{ width: `${scrollPercent}%` }}
//             />
//         </div>
//     );
// }
'use client';

import { useEffect, useState } from 'react';

export default function ScrollProgress() {
    const [scrollPercent, setScrollPercent] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            setScrollPercent(scrolled);
        };

        // Initial value
        handleScroll();

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Only show the bar when scrollPercent > 0
    if (scrollPercent === 0) return null;

    return (
        <div className="fixed top-0 left-0 w-full h-1 bg-zinc-200 dark:bg-zinc-800 z-50">
            <div
                className="h-1 bg-yellow-400 dark:bg-yellow-500 transition-[width] duration-300 ease-out"
                style={{ width: `${scrollPercent}%` }}
            />
        </div>
    );
}
