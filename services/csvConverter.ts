const flattenObject = (obj: any, prefix = '', maxDepth: number, currentDepth = 1): Record<string, any> => {
    if (typeof obj !== 'object' || obj === null) {
        return { [prefix || 'value']: obj };
    }

    return Object.keys(obj).reduce((acc, k) => {
        const pre = prefix.length ? prefix + '.' : '';
        const key = pre + k;
        const value = obj[k];

        if (typeof value === 'object' && value !== null && !Array.isArray(value) && currentDepth < maxDepth) {
            Object.assign(acc, flattenObject(value, key, maxDepth, currentDepth + 1));
        } else {
            acc[key] = value;
        }
        return acc;
    }, {} as Record<string, any>);
};

const escapeCsvCell = (cellData: any): string => {
  if (cellData === undefined || cellData === null) {
    return '';
  }

  // If the cell data is an object (e.g., from reaching max depth), stringify it.
  if (typeof cellData === 'object') {
    cellData = JSON.stringify(cellData);
  }
  
  const stringValue = String(cellData);
  
  if (/[",\n\r]/.test(stringValue)) {
    const escapedString = stringValue.replace(/"/g, '""');
    return `"${escapedString}"`;
  }
  
  return stringValue;
};

export const convertJsonToCsv = (jsonString: string, depth: number = 1): string => {
  let data;
  try {
    data = JSON.parse(jsonString);
  } catch (error) {
    throw new Error('Invalid JSON format. Please check your input.');
  }

  if (!Array.isArray(data)) {
    data = [data];
  }

  if (data.length === 0) {
    return '';
  }

  const processedData = data.map((row: any) => {
      if (typeof row === 'object' && row !== null) {
          return flattenObject(row, '', depth);
      }
      // Handle arrays of primitives like [1, "a", true]
      return { value: row };
  });

  // Use a Set to gather all unique keys from all flattened objects
  const headersSet = new Set<string>();
  processedData.forEach(obj => {
    if (typeof obj === 'object' && obj !== null) {
      Object.keys(obj).forEach(key => headersSet.add(key));
    }
  });
  
  const headers = Array.from(headersSet);
  if (headers.length === 0) {
      return ''; // Handle array of non-objects or empty objects
  }

  const headerRow = headers.map(escapeCsvCell).join(',');

  const dataRows = processedData.map((row: any) => {
    return headers.map(header => {
      const cellValue = row[header];
      return escapeCsvCell(cellValue);
    }).join(',');
  });

  return [headerRow, ...dataRows].join('\n');
};