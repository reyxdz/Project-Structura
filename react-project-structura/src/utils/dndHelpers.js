/**
 * Determine if a drop is valid
 * @param {string} overId - ID of the element being dragged over
 * @param {string} activeId - ID of the dragged element
 * @returns {boolean}
 */

export const isValidDrop = (overId, activeId) => {
    return overId !== null && overId !== activeId;
};



/**
 * Get insert index from drag position
 * @param {Array} items - Array of items
 * @param {string} overId - Item ID being dragged over
 * @returns {number} Insert index
 */

export const getInsertIndex = (items, overId) => {
    const index = items.findIndex((item) => item.id === overId);
    return index >= 0 ? index : items.length;
};



/**
 * Animate item movement on screen
 * @param {string} element - Element selector
 */

export const animateFieldMove = (element) => {
    const el = document.querySelector(element);
    if (el) {
        el.style.opacity = '0.5';
        setTimeout(() => {
            el.style.opacity = '1';
        }, 150);
    }
};



/**
 * Get field drop indicator position
 * @param {Array} items - Array of items
 * @param {string} overId - ID of item over
 * @param {number} fieldHeight - Height of the field item
 * @returns {Object} Position data for indicator
 */

export const getDropIndicatorPosition = (items, overId, fieldHeight = 60) => {
    const index = items.findIndex((item) => item.id === overId);
    return {
        index: index >= 0 ? index : items.length,
        position: index >= 0 ? (index * fieldHeight) : (items.length * fieldHeight),
    };
};