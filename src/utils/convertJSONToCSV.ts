export const convertJSONToCSV = (jsonArray: any[]): string => {
  if (!Array.isArray(jsonArray) || jsonArray.length === 0) {
    return "";
  }

  const headers: string[] = Object.keys(jsonArray[0]);
  const csvRows: string[] = [];

  csvRows.push(headers.join(","));

  jsonArray.forEach(item => {
    const values: string[] = headers.map(header => {
      const value: string =
        item[header] !== undefined ? String(item[header]) : "";
      const escaped: string = value.replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(","));
  });

  return csvRows.join("\n");
};
