

const DataTable = ({ data = [] }) => {
  if (!data.length) {
    return (
      <div className="p-6 text-center text-sm text-gray-500">
        No records available.
      </div>
    );
  }

  const columns = Object.keys(data[0]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 bg-white text-left text-sm">
        <thead className="bg-gray-50 text-gray-700">
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                className="px-4 py-3 font-semibold uppercase tracking-wide"
              >
                {column
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {columns.map((column) => (
                <td key={column} className="px-4 py-3 align-top text-gray-800">
                  {row[column]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
