import { useState } from 'react';

const categories = ['飯類', '麵類', '早餐', '小吃', '飲料', '其他'];
const MIN_PRICE = 1;
const MAX_PRICE = 9999;
const MAX_NAME_LENGTH = 30;
const MAX_SHOP_LENGTH = 30;
const MAX_NOTE_LENGTH = 60;

export default function AddItemForm({ onAddItem }) {
  const [name, setName] = useState('');
  const [shop, setShop] = useState('');
  const [category, setCategory] = useState('飯類');
  const [price, setPrice] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  function getValidationError() {
    const trimmedName = name.trim();
    const trimmedShop = shop.trim();
    const trimmedNote = note.trim();
    const parsedPrice = Number(price);

    if (!trimmedName || !trimmedShop || price === '') {
      return '品項、店家和價格都要填。';
    }

    if (trimmedName.length > MAX_NAME_LENGTH) {
      return `品項名稱最多 ${MAX_NAME_LENGTH} 個字。`;
    }

    if (trimmedShop.length > MAX_SHOP_LENGTH) {
      return `店家名稱最多 ${MAX_SHOP_LENGTH} 個字。`;
    }

    if (trimmedNote.length > MAX_NOTE_LENGTH) {
      return `備註最多 ${MAX_NOTE_LENGTH} 個字。`;
    }

    if (!Number.isFinite(parsedPrice)) {
      return '價格格式不正確。';
    }

    if (!Number.isInteger(parsedPrice)) {
      return '價格請輸入整數。';
    }

    if (parsedPrice < MIN_PRICE || parsedPrice > MAX_PRICE) {
      return `價格請輸入 ${MIN_PRICE} 到 ${MAX_PRICE} 之間的數字。`;
    }

    return '';
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationError = getValidationError();
    if (validationError) {
      setError(validationError);
      return;
    }

    onAddItem({
      name: name.trim(),
      shop: shop.trim(),
      category,
      price: Number(price),
      note: note.trim() || '沒有備註',
    });

    setName('');
    setShop('');
    setCategory('飯類');
    setPrice('');
    setNote('');
    setError('');
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h2>新增午餐品項</h2>
      <div className="form-grid">
        <label>
          品項
          <input
            value={name}
            maxLength={MAX_NAME_LENGTH}
            onChange={(e) => setName(e.target.value)}
            placeholder="例如：雞腿便當"
          />
        </label>
        <label>
          店家
          <input
            value={shop}
            maxLength={MAX_SHOP_LENGTH}
            onChange={(e) => setShop(e.target.value)}
            placeholder="例如：阿嬤的飯桶"
          />
        </label>
        <label>
          分類
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label>
          價格
          <input
            type="number"
            min={MIN_PRICE}
            max={MAX_PRICE}
            step="1"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="95"
          />
        </label>
      </div>
      <label>
        備註
        <input
          value={note}
          maxLength={MAX_NOTE_LENGTH}
          onChange={(e) => setNote(e.target.value)}
          placeholder="例如：有蟲、衛生很好"
        />
      </label>
      {error && <p className="error-text">{error}</p>}
      <button className="primary-btn" type="submit">加入清單</button>
    </form>
  );
}
