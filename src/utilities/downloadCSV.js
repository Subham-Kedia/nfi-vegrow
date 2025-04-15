function convertToCSV(objArray) {
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let str = '';

    for (let i = 0; i < array?.length; i++) {
        let line = '';
        for (let index in array[i]) {
            if (line !== '') line += ',';
            line += array[i][index]?.toString()?.replace(/,/g, ' ');
        }

        str += line + '\r\n';
    }

    return str;
}

/**
 * Helper to download a CSV for given table headers and data
 * @param {object} [headers] - Table column headers to be displayed
 * @param {array} [items] - Table data for given columns
 * @param {string} [fileTitle] - Name for file to be downloaded
 * Helper will create a blob and a link.
 */

export function exportCSVFile(headers, items, fileTitle) {
    if (JSON.stringify(items[0]) !== JSON.stringify(headers)) {
        items.unshift(headers);
    }
    // Convert Object to JSON
    const jsonObject = JSON.stringify(items);

    const csv = convertToCSV(jsonObject);

    const exportedFilename = fileTitle + '.csv' || 'export.csv';

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, exportedFilename);
    } else {
        const link = document.createElement('a');
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', exportedFilename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}