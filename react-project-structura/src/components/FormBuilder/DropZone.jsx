// Drop zone for inserting fields at specific positions

import React, { useState } from 'react';
import './DropZone.css';

export default function DropZone({ position, onDrop, isVisible }) {
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'copy';
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        const fieldType = e.dataTransfer.getData('fieldType');
        if (fieldType) {
            onDrop(fieldType, position);
        }
    };

    if (!isVisible) {
        return <div className="drop-zone drop-zone-hidden"></div>;
    }

    return (
        <div 
            className={`drop-zone ${isDragOver ? 'drop-zone-active' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className="drop-zone-content">
                <div className="drop-zone-line"></div>
                <div className="drop-zone-placeholder">Drop here</div>
            </div>
        </div>
    );
}
