export function generateUniqueFileName(fileName) {
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
    const date = timestamp.slice(0, 8); 
    const time = timestamp.slice(9, 15); 
    return `${fileName}_${date}_${time}.jpg`;
}