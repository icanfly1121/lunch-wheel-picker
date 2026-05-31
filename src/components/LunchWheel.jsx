import { useMemo, useState } from 'react';

const wheelColors = ['#f2b84b', '#242933', '#78c6a3', '#303746', '#d98c5f', '#20242d'];

function buildWheelGradient(count) {
  if (count <= 0) {
    return 'conic-gradient(#242933 0deg 360deg)';
  }

  const angle = 360 / count;
  const segments = Array.from({ length: count }, (_, index) => {
    const start = index * angle;
    const end = (index + 1) * angle;
    const color = wheelColors[index % wheelColors.length];
    return `${color} ${start}deg ${end}deg`;
  });

  return `conic-gradient(${segments.join(', ')})`;
}

export default function LunchWheel({ items }) {
  const [selected, setSelected] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayText, setDisplayText] = useState('按下按鈕決定午餐');
  const [history, setHistory] = useState([]);

  const wheelLabels = useMemo(() => items.map((item) => item.name), [items]);
  const wheelGradient = useMemo(() => buildWheelGradient(wheelLabels.length), [wheelLabels.length]);

  function spinWheel() {
    if (items.length === 0 || isSpinning) return;
    setIsSpinning(true);
    setSelected(null);

    let count = 0;
    const maxCount = 24 + Math.floor(Math.random() * 10);
    const timer = setInterval(() => {
      const randomItem = items[Math.floor(Math.random() * items.length)];
      setDisplayText(randomItem.name);
      count += 1;

      if (count >= maxCount) {
        clearInterval(timer);
        const finalItem = items[Math.floor(Math.random() * items.length)];
        setDisplayText(finalItem.name);
        setSelected(finalItem);
        setHistory((prev) => [finalItem, ...prev.filter((item) => item.id !== finalItem.id)].slice(0, 5));
        setIsSpinning(false);
      }
    }, 90);
  }

  return (
    <section className="wheel-layout">
      <div className="wheel-card">
        <p className="eyebrow">Lunch roulette</p>
        <h1>午餐轉盤</h1>
        <p className="muted">不用再問「今天吃什麼」，轉盤會直接從你目前的全部品項裡抽出一個。</p>

        <div className="wheel-stage">
          <div className="wheel-pointer" aria-hidden="true" />
          <div
            className={`wheel-disk ${isSpinning ? 'spinning' : ''}`}
            style={{
              '--slot-count': Math.max(wheelLabels.length, 1),
              background: wheelGradient,
            }}
          >
            {wheelLabels.length === 0 ? (
              <span className="empty-wheel-label">沒有品項</span>
            ) : (
              wheelLabels.map((label, index) => (
                <span
                  key={`${label}-${index}`}
                  style={{
                    '--i': index,
                    '--label-angle': `${(360 / wheelLabels.length) * index}deg`,
                    '--half-angle': `${180 / wheelLabels.length}deg`,
                  }}
                  title={label}
                >
                  {label}
                </span>
              ))
            )}
          </div>
          <div className="wheel-center">
            <strong>{displayText}</strong>
          </div>
        </div>

        <button className="spin-btn" onClick={spinWheel} disabled={isSpinning || items.length === 0}>
          {isSpinning ? '轉盤轉動中...' : '開始選午餐'}
        </button>
        <p className="muted small wheel-help">目前轉盤共有 {items.length} 個品項。新增或刪除品項後，轉盤會自動更新。</p>
      </div>

      <aside className="result-card">
        <h2>今天的結果</h2>
        {selected ? (
          <div className="result-detail">
            <p className="result-name">{selected.name}</p>
            <p>{selected.shop} · {selected.category}</p>
            <p>約 ${selected.price}</p>
            <p className="result-note">{selected.note}</p>
          </div>
        ) : (
          <p className="muted">還沒抽。按下轉盤後，這裡會顯示今天要吃的午餐。</p>
        )}

        <div className="history-box">
          <h3>最近抽到</h3>
          {history.length === 0 ? <p className="muted small">目前沒有紀錄</p> : (
            <ul>
              {history.map((item) => (
                <li key={item.id}>{item.name}<span>{item.shop}</span></li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </section>
  );
}
