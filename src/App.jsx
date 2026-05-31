import { Link, NavLink, Route, Routes } from 'react-router';
import { useLocalStorage } from './hooks/useLocalStorage.js';
import { defaultLunchItems } from './data/lunchItems.js';
import ItemsPage from './pages/ItemsPage.jsx';
import WheelPage from './pages/WheelPage.jsx';

function Header() {
  return (
    <header className="site-header">
      <Link to="/" className="brand">
        <span className="brand-mark">午</span>
        <span>
          <strong>午餐轉盤</strong>
        </span>
      </Link>
      <nav>
        <NavLink to="/" end>轉盤</NavLink>
        <NavLink to="/items">全部品項</NavLink>
      </nav>
    </header>
  );
}

function sanitizeItem(item) {
  const price = Number(item.price);

  return {
    name: item.name.trim().slice(0, 30),
    shop: item.shop.trim().slice(0, 30),
    category: item.category,
    price: Number.isFinite(price) ? Math.min(Math.max(Math.round(price), 1), 9999) : 1,
    note: (item.note || '沒有備註').trim().slice(0, 60) || '沒有備註',
  };
}

export default function App() {
  const [items, setItems] = useLocalStorage('lunch-wheel-items', defaultLunchItems);

  function addItem(newItem) {
    setItems((prev) => [
      { id: Date.now(), ...sanitizeItem(newItem) },
      ...prev,
    ]);
  }

  function deleteItem(id) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function resetItems() {
    setItems(defaultLunchItems);
  }

  return (
    <>
      <Header />
      <main className="page-shell">
        <Routes>
          <Route path="/" element={<WheelPage items={items} />} />
          <Route path="/items" element={<ItemsPage items={items} onAddItem={addItem} onDeleteItem={deleteItem} onResetItems={resetItems} />} />
          <Route path="*" element={<WheelPage items={items} />} />
        </Routes>
      </main>
    </>
  );
}
