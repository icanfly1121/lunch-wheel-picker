export default function LunchTable({ items, onDeleteItem }) {
  if (items.length === 0) {
    return <div className="empty-box">目前沒有品項，可以先新增幾個常吃的午餐。</div>;
  }

  return (
    <div className="table-wrap">
      <table className="lunch-table">
        <thead>
          <tr>
            <th>#</th>
            <th>品項</th>
            <th>店家</th>
            <th>分類</th>
            <th>價格</th>
            <th>備註</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td className="name-cell">{item.name}</td>
              <td>{item.shop}</td>
              <td><span className="tag">{item.category}</span></td>
              <td>${item.price}</td>
              <td className="note-cell">{item.note}</td>
              <td>
                <button className="text-btn danger" onClick={() => onDeleteItem(item.id)}>刪除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
