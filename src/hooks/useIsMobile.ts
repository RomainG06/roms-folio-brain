import { useState, useEffect } from 'react'

export function useIsMobile(): boolean {
    const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)

    useEffect(() => {
        const update = () => setIsMobile(window.innerWidth < 768)
        window.addEventListener('resize', update)
        return () => window.removeEventListener('resize', update)
    }, [])

    return isMobile
}
