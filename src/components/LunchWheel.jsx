import { useMemo, useState } from 'react';

const wheelColors = ['#f2b84b', '#242933', '#78c6a3', '#303746', '#d98c5f', '#20242d'];
const spinDuration = 3200;

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
  const [rotation, setRotation] = useState(0);

  const wheelLabels = useMemo(() => items.map((item) => item.name), [items]);
  const wheelGradient = useMemo(() => buildWheelGradient(wheelLabels.length), [wheelLabels.length]);

  function spinWheel() {
    if (items.length === 0 || isSpinning) return;

    const selectedIndex = Math.floor(Math.random() * items.length);
    const finalItem = items[selectedIndex];

    const segmentAngle = 360 / items.length;
    const selectedCenterAngle = selectedIndex * segmentAngle + segmentAngle / 2;

    const targetRotation = 360 - selectedCenterAngle;
    const extraRounds = 6 * 360;

    const currentRotation = ((rotation % 360) + 360) % 360;
    const delta = (targetRotation - currentRotation + 360) % 360;
    const nextRotation = rotation + extraRounds + delta;

    setIsSpinning(true);
    setSelected(null);
    setDisplayText('轉盤轉動中...');
    setRotation(nextRotation);

    setTimeout(() => {
      setDisplayText(finalItem.name);
      setSelected(finalItem);
      setHistory((prev) => [finalItem, ...prev.filter((item) => item.id !== finalItem.id)].slice(0, 5));
      setIsSpinning(false);
    }, spinDuration);
  }

  return (
    <section className="wheel-layout">
      <div className="wheel-card">
        <p className="eyebrow">Lunch roulette</p>
        <h1>午餐轉盤</h1>

        <div className="wheel-stage">
          <div className="wheel-pointer" aria-hidden="true" />

          <div
            className="wheel-disk"
            style={{
              background: wheelGradient,
              transform: `rotate(${rotation}deg)`,
              '--spin-duration': `${spinDuration}ms`,
              '--wheel-rotation': `${rotation}deg`,
            }}
          >
            {wheelLabels.length === 0 ? (
              <span className="empty-wheel-label">沒有品項</span>
            ) : (
              wheelLabels.map((label, index) => {
                const segmentAngle = 360 / wheelLabels.length;
                const labelAngle = index * segmentAngle + segmentAngle / 2;

                return (
                  <span
                    className="wheel-label"
                    key={`${label}-${index}`}
                    style={{
                      '--label-angle': `${labelAngle}deg`,
                    }}
                    title={label}
                  >
                    {label}
                  </span>
                );
              })
            )}
          </div>

          <div className="wheel-center">
            <strong>{displayText}</strong>
          </div>
        </div>

        <button className="spin-btn" onClick={spinWheel} disabled={isSpinning || items.length === 0}>
          {isSpinning ? '轉盤轉動中...' : '開始選午餐'}
        </button>
      </div>

      <aside className="result-card">
        <h2>今天的結果</h2>

        {selected ? (
          <div className="result-detail">
            <p className="result-name">{selected.name}</p>
            <p>
              {selected.shop} · {selected.category}
            </p>
            <p>約 ${selected.price}</p>
            <p className="result-note">{selected.note}</p>
          </div>
        ) : (
          <p className="muted">今天的午餐。</p>
        )}

        <div className="history-box">
          <h3>最近抽到</h3>

          {history.length === 0 ? (
            <p className="muted small">目前沒有紀錄</p>
          ) : (
            <ul>
              {history.map((item) => (
                <li key={item.id}>
                  {item.name}
                  <span>{item.shop}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </section>
  );
}