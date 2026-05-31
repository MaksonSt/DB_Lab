import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const NAV = [
  {
    title: 'Таблиці',
    links: [
      { to: '/clubs', label: 'Клуби' },
      { to: '/teams', label: 'Команди' },
      { to: '/persons', label: 'Особи' },
      { to: '/positions', label: 'Позиції' },
      { to: '/players', label: 'Гравці' },
      { to: '/coaches', label: 'Тренери' },
      { to: '/medical-cards', label: 'Медкарти' },
      { to: '/trainings', label: 'Тренування' },
      { to: '/matches', label: 'Матчі' },
      { to: '/match-stats', label: 'Статистика матчів' },
      { to: '/training-coaches', label: 'Тренери на тренуваннях' },
    ],
  },
  {
    title: 'Запити',
    links: [{ to: '/queries', label: 'SQL-запити' }],
  },
];

export default function Layout() {
  const navigate = useNavigate();
  return (
    <div className="layout">
      <nav className="sidebar">
        <div className="sidebar-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          Футбольний клуб
        </div>
        {NAV.map((section) => (
          <div className="sidebar-section" key={section.title}>
            <div className="sidebar-section-title">{section.title}</div>
            {section.links.map((l) => (
              <NavLink key={l.to} to={l.to} className={({ isActive }) => isActive ? 'active' : ''}>
                {l.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
