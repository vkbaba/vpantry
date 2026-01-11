'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import ExportedImage from 'next-image-export-optimizer';

type ImageModalProps = {
    src: string;
    alt?: string;
    className?: string;
    width?: number;
    height?: number;
};

export default function ImageModal({ src, alt, className, width, height }: ImageModalProps) {
    const [isOpen, setIsOpen] = useState(false);

    const imgProps = process.env.NODE_ENV === 'development'
        ? { src, alt: alt || '', className, width: width || 500, height: height || 500 }
        : { src, alt: alt || '', className };

    return (
        <>
            <span className="cursor-pointer" onClick={() => setIsOpen(true)}>
                <ExportedImage {...imgProps} />
            </span>

            {isOpen && typeof document !== 'undefined' && createPortal(
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
                    onClick={() => setIsOpen(false)}
                >
                    <div className="relative max-w-[90vw] max-h-[90vh]">
                        <img
                            src={src}
                            alt={alt || ''}
                            className="max-w-full max-h-[90vh] object-contain"
                        />
                        <button
                            className="absolute top-2 right-2 text-white text-3xl hover:text-gray-300"
                            onClick={() => setIsOpen(false)}
                        >
                            &times;
                        </button>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
