export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i}>
                <div className="skeleton-bar" style={{ width: 60 }} />
              </th>
            ))}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r}>
              {Array.from({ length: cols }).map((_, c) => (
                <td key={c}>
                  <div className="skeleton-bar" style={{ width: `${60 + ((r + c) % 3) * 20}%` }} />
                </td>
              ))}
              <td>
                <div className="skeleton-bar" style={{ width: 70 }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CardSkeleton({ height = 90 }) {
  return (
    <div className="card">
      <div className="skeleton-bar" style={{ width: "40%", marginBottom: 10 }} />
      <div className="skeleton-bar" style={{ width: "70%", height: height - 30 }} />
    </div>
  );
}
