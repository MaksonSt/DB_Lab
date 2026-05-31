import { useNavigate } from 'react-router-dom';

const CARDS = [
  { to: '/clubs', icon: '🏟', title: 'Клуби', desc: 'Управління клубами' },
  { to: '/teams', icon: '👕', title: 'Команди', desc: 'Управління командами' },
  { to: '/persons', icon: '👤', title: 'Особи', desc: 'Перелік людей' },
  { to: '/positions', icon: '📋', title: 'Позиції', desc: 'Ігрові позиції' },
  { to: '/players', icon: '⚽', title: 'Гравці', desc: 'Склад гравців' },
  { to: '/coaches', icon: '🧑‍💼', title: 'Тренери', desc: 'Тренерський штаб' },
  { to: '/medical-cards', icon: '🏥', title: 'Медкарти', desc: 'Медичні картки' },
  { to: '/trainings', icon: '🏃', title: 'Тренування', desc: 'Розклад тренувань' },
  { to: '/matches', icon: '🥅', title: 'Матчі', desc: 'Ігровий календар' },
  { to: '/match-stats', icon: '📊', title: 'Статистика', desc: 'Статистика матчів' },
  { to: '/training-coaches', icon: '📌', title: 'Тренери↔Тренування', desc: 'Прив\'язка тренерів' },
  { to: '/queries', icon: '🔍', title: 'SQL-запити', desc: '7 аналітичних запитів' },
];

export default function Home() {
  const navigate = useNavigate();
  return (
    <>
      <div className="page-header">
        <h1>Головне меню</h1>
      </div>
      <div className="home-grid">
        {CARDS.map((c) => (
          <div className="home-card" key={c.to} onClick={() => navigate(c.to)}>
            <div className="home-card-icon">{c.icon}</div>
            <div className="home-card-title">{c.title}</div>
            <div className="home-card-desc">{c.desc}</div>
          </div>
        ))}
      </div>
    </>
  );
}
