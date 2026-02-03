/**
 * Table Formula Utilities
 * Handles parsing, evaluation, and validation of table column formulas
 */

/**
 * Parse a formula and extract column references
 * Formula format: =[Column1] + [Column2] * [Column3]
 * @param {string} formula - The formula string
 * @returns {array} Array of column indices referenced in the formula
 */
export const extractColumnReferences = (formula) => {
  if (!formula || typeof formula !== 'string') return [];
  
  const matches = formula.match(/\[(\d+)\]/g);
  if (!matches) return [];
  
  return matches.map(match => parseInt(match.slice(1, -1)));
};

/**
 * Evaluate a formula for a specific row
 * @param {string} formula - The formula string (e.g., "=[1]*[2]" for 1st col × 2nd col)
 * @param {array} rowData - The row data array
 * @returns {number|string} The calculated result or error message
 */
export const evaluateFormula = (formula, rowData) => {
  try {
    if (!formula || typeof formula !== 'string') return '';
    
    // Remove leading '=' if present
    let cleanFormula = formula.trim();
    if (cleanFormula.startsWith('=')) {
      cleanFormula = cleanFormula.substring(1);
    }
    
    // Replace column references [1], [2], etc. with actual values (1-based indexing)
    let expression = cleanFormula.replace(/\[(\d+)\]/g, (match, index) => {
      const colIndex = parseInt(index) - 1;  // Convert 1-based to 0-based for array access
      const value = rowData[colIndex];
      
      // Convert to number, handle empty or non-numeric values
      const numValue = parseFloat(value);
      return isNaN(numValue) ? '0' : numValue.toString();
    });
    
    // Safe evaluation using Function constructor (safer than eval)
    // This only allows mathematical operations
    const result = Function('"use strict"; return (' + expression + ')')();
    
    // Return number or formatted number
    if (typeof result === 'number') {
      // Handle floating point precision
      return Math.round(result * 100) / 100;
    }
    
    return result;
  } catch (error) {
    console.error('Formula evaluation error:', error, 'Formula:', formula);
    return '#ERROR';
  }
};

/**
 * Calculate aggregation for a column across all rows
 * @param {string} aggregationFn - Type of aggregation (SUM, AVG, COUNT, MIN, MAX)
 * @param {array} tableData - The table data
 * @param {number} columnIndex - Which column to aggregate
 * @param {string} columnFormula - If the column has a formula, use it
 * @returns {number|string} The aggregated result
 */
export const calculateAggregation = (aggregationFn, tableData, columnIndex, columnFormula = null) => {
  try {
    if (!tableData || tableData.length === 0) return 0;
    
    // Collect values from the column
    let values = tableData.map(row => {
      if (!Array.isArray(row)) return 0;
      
      // If column has a formula, evaluate it; otherwise use raw value
      if (columnFormula) {
        const result = evaluateFormula(columnFormula, row);
        return typeof result === 'number' ? result : parseFloat(result) || 0;
      } else {
        const value = row[columnIndex];
        return parseFloat(value) || 0;
      }
    }).filter(v => !isNaN(v));
    
    if (values.length === 0) return 0;
    
    switch (aggregationFn?.toUpperCase()) {
      case 'SUM':
        return values.reduce((sum, val) => sum + val, 0);
      
      case 'AVG':
      case 'AVERAGE':
        return values.reduce((sum, val) => sum + val, 0) / values.length;
      
      case 'COUNT':
        return values.length;
      
      case 'MIN':
        return Math.min(...values);
      
      case 'MAX':
        return Math.max(...values);
      
      default:
        return 0;
    }
  } catch (error) {
    console.error('Aggregation calculation error:', error);
    return '#ERROR';
  }
};

/**
 * Validate a formula for syntax errors
 * @param {string} formula - The formula string
 * @returns {object} { isValid: boolean, error: string|null }
 */
export const validateFormula = (formula) => {
  try {
    if (!formula || typeof formula !== 'string') {
      return { isValid: true, error: null };
    }
    
    let cleanFormula = formula.trim();
    if (cleanFormula.startsWith('=')) {
      cleanFormula = cleanFormula.substring(1);
    }
    
    // Replace column references with dummy numbers for validation
    const testExpression = cleanFormula.replace(/\[(\d+)\]/g, '0');
    
    // Try to compile the function to check for syntax errors
    Function('"use strict"; return (' + testExpression + ')');
    
    return { isValid: true, error: null };
  } catch (error) {
    return { isValid: false, error: error.message };
  }
};

/**
 * Format a number for display in a table cell
 * @param {number} value - The value to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted value
 */
export const formatNumber = (value, decimals = 2) => {
  if (value === '#ERROR' || value === '' || value === null || value === undefined) {
    return value;
  }
  
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  
  return num.toFixed(decimals);
};

/**
 * Determine if column accepts user input
 * @param {object} columnConfig - The column configuration object
 * @returns {boolean} Whether the column accepts user input
 */
export const isEditableColumn = (columnConfig) => {
  // Check if inputMode is 'input'
  if (columnConfig && typeof columnConfig === 'object') {
    return columnConfig.inputMode === 'input';
  }
  
  return false;
};

/**
 * Validate if referenced columns in formula contain numeric values
 * @param {string} formula - The formula string (e.g., "=[1]*[2]")
 * @param {array} tableData - The table data
 * @returns {object} { isValid: boolean, nonNumericColumns: array, message: string }
 */
export const validateFormulaColumns = (formula, tableData) => {
  if (!formula || typeof formula !== 'string') {
    return { isValid: true, nonNumericColumns: [], message: '' };
  }

  // Extract column references from formula using 1-based indexing
  const columnMatches = formula.match(/\[(\d+)\]/g);
  if (!columnMatches || columnMatches.length === 0) {
    return { isValid: true, nonNumericColumns: [], message: '' };
  }

  const nonNumericColumns = [];

  // Check each referenced column
  columnMatches.forEach((match) => {
    const colIndex = parseInt(match.slice(1, -1)) - 1; // Convert 1-based to 0-based

    // Skip if column index is invalid
    if (colIndex < 0 || !tableData || tableData.length === 0) {
      return;
    }

    // Check if any cell in this column is non-numeric
    const hasNonNumeric = tableData.some((row) => {
      if (!Array.isArray(row) || row[colIndex] === undefined || row[colIndex] === '') {
        return false; // Empty cells are okay, skip them
      }
      const value = parseFloat(row[colIndex]);
      return isNaN(value); // Non-numeric value found
    });

    if (hasNonNumeric) {
      nonNumericColumns.push(colIndex + 1); // Convert back to 1-based for display
    }
  });

  if (nonNumericColumns.length > 0) {
    const columnList = nonNumericColumns.join(', ');
    return {
      isValid: false,
      nonNumericColumns,
      message: `Column(s) ${columnList} contain non-numeric values. Formula may produce unexpected results.`
    };
  }

  return { isValid: true, nonNumericColumns: [], message: '' };
};
