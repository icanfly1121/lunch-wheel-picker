import { useMemo, useState } from 'react';
import AddItemForm from '../components/AddItemForm.jsx';
import LunchTable from '../components/LunchTable.jsx';

const categories = ['全部', '飯類', '麵類', '早餐', '小吃', '飲料', '其他'];

export default function ItemsPage({ items, onAddItem, onDeleteItem, onResetItems }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('全部');

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchQuery = `${item.name} ${item.shop} ${item.note}`.toLowerCase().includes(query.toLowerCase());
      const matchCategory = category === '全部' || item.category === category;
      return matchQuery && matchCategory;
    });
  }, [items, query, category]);

  return (
    <section>
      <div className="page-title-row">
        <div>
          <p className="eyebrow">Lunch list</p>
          <h1>全部午餐品項</h1>
          <p className="muted">瀏覽所有午餐</p>
        </div>
        <button className="secondary-btn" onClick={onResetItems}>還原預設清單</button>
      </div>

      <div className="toolbar">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜尋品項、店家或備註" />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>

      <LunchTable items={filteredItems} onDeleteItem={onDeleteItem} />
      <AddItemForm onAddItem={onAddItem} />
    </section>
  );
}
