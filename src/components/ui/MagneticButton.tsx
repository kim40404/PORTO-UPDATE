import { useRef, useState } from "react";
import { motion } from "framer-motion";

interface MagneticButtonProps {
    children: React.ReactNode;
    href?: string;
    download?: boolean;
    className?: string;
    onClick?: () => void;
}

export function MagneticButton({ children, href, download, className = "", onClick }: MagneticButtonProps) {
    const ref = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouse = (e: React.MouseEvent<HTMLElement>) => {
        if (!ref.current) return;

        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current.getBoundingClientRect();

        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);

        setPosition({ x: middleX * 0.4, y: middleY * 0.4 });
    };

    const reset = () => {
        setPosition({ x: 0, y: 0 });
    };

    const commonProps = {
        onMouseMove: handleMouse,
        onMouseLeave: reset,
        animate: { x: position.x, y: position.y },
        transition: { type: "spring" as const, stiffness: 150, damping: 15, mass: 0.1 },
        className: `inline-block ${className}`
    };

    if (href) {
        return (
            <motion.a
                ref={ref as any}
                href={href}
                download={download}
                target={download || href?.startsWith("mailto:") || href?.startsWith("tel:") ? undefined : "_blank"}
                rel={download || href?.startsWith("mailto:") || href?.startsWith("tel:") ? undefined : "noreferrer"}
                {...commonProps}
            >
                {children}
            </motion.a>
        );
    }

    return (
        <motion.button
            ref={ref as any}
            onClick={onClick}
            {...commonProps}
        >
            {children}
        </motion.button>
    );
}
