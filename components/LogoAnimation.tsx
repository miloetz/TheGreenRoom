"use client";

import { useState, useEffect } from "react";

const EMOJIS = ['🎸', '🎹', '🎤', '🥁', '🎷', '🎺', '🎻', '🎵'];

export function LogoAnimation() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="emoji-grid">
                {[...Array(12)].map((_, rowIndex) => (
                    <div key={rowIndex} className="emoji-row" style={{ animationDelay: `${rowIndex * -2}s` }}>
                        {[...Array(20)].map((_, colIndex) => (
                            <span key={colIndex} className="emoji-item">
                                {EMOJIS[(rowIndex + colIndex) % EMOJIS.length]}
                            </span>
                        ))}
                    </div>
                ))}
            </div>

            <style jsx>{`
                .emoji-grid {
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    transform: rotate(-30deg);
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    gap: 80px;
                }
                .emoji-row {
                    display: flex;
                    gap: 100px;
                    animation: slide 30s linear infinite;
                    white-space: nowrap;
                }
                .emoji-row:nth-child(even) {
                    animation-direction: reverse;
                }
                .emoji-item {
                    font-size: 90px;
                    opacity: 0.12;
                }
                @keyframes slide {
                    from {
                        transform: translateX(-50%);
                    }
                    to {
                        transform: translateX(0%);
                    }
                }
            `}</style>
        </div>
    );
}
