import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

type Row = Record<string, unknown>;

function ResultTable({ rows }: { rows: Row[] }) {
  if (rows.length === 0) return <p className="empty">Немає результатів</p>;
  const keys = Object.keys(rows[0]);
  return (
    <div className="table-wrap" style={{ marginTop: 12 }}>
      <p className="results-count">Знайдено: {rows.length}</p>
      <table>
        <thead><tr>{keys.map(k => <th key={k}>{k}</th>)}</tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>{keys.map(k => <td key={k}>{String(r[k] ?? '—')}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function QueryBlock({ num, title, desc, fields, endpoint }: {
  num: number;
  title: string;
  desc: string;
  fields: { key: string; label: string; type?: string }[];
  endpoint: (params: Record<string, string>) => string;
}) {
  const [params, setParams] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Row[] | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true); setError('');
    try {
      const data = await api.get(endpoint(params));
      setResults(Array.isArray(data) ? data : []);
    } catch (e: any) { setError(e.message); setResults(null); }
    setLoading(false);
  };

  return (
    <div className="card query-block">
      <h2>Запит {num}. {title}</h2>
      <p className="query-desc">{desc}</p>
      <div className="form-grid">
        {fields.map(f => (
          <div className="form-group" key={f.key}>
            <label>{f.label}</label>
            <input
              type={f.type ?? 'text'}
              value={params[f.key] ?? ''}
              onChange={e => setParams({ ...params, [f.key]: e.target.value })}
            />
          </div>
        ))}
      </div>
      <div className="form-actions">
        <button className="btn btn-primary" onClick={run} disabled={loading}>
          {loading ? 'Виконую...' : 'Виконати'}
        </button>
      </div>
      {error && <p className="error-msg">{error}</p>}
      {results !== null && <ResultTable rows={results} />}
    </div>
  );
}

export default function Queries() {
  const navigate = useNavigate();

  return (
    <>
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate('/')}>← Меню</button>
        <h1>SQL-запити</h1>
      </div>

      <QueryBlock
        num={1}
        title="Гравці команди з голами більше N"
        desc="Показує гравців вказаної команди, які забили більше N голів у матчах. Параметри: назва команди та мінімальна кількість голів."
        fields={[
          { key: 'team', label: 'Назва команди' },
          { key: 'goals', label: 'Мін. кількість голів', type: 'number' },
        ]}
        endpoint={p => `/queries/1?team=${encodeURIComponent(p.team ?? '')}&goals=${p.goals ?? 0}`}
      />

      <QueryBlock
        num={2}
        title="Матчі на стадіоні після дати"
        desc="Показує матчі, що відбулися на вказаному стадіоні після заданої дати. Параметри: назва стадіону та дата (рр-мм-дд)."
        fields={[
          { key: 'stadium', label: 'Назва стадіону' },
          { key: 'date', label: 'Після дати', type: 'date' },
        ]}
        endpoint={p => `/queries/2?stadium=${encodeURIComponent(p.stadium ?? '')}&date=${p.date ?? ''}`}
      />

      <QueryBlock
        num={3}
        title="Гравці з вказаною групою крові"
        desc="Показує всіх гравців з заданою групою крові разом з командою та відомостями про алергії. Параметр: група крові (A+, B-, O+, тощо)."
        fields={[
          { key: 'bloodType', label: 'Група крові (напр. A+)' },
        ]}
        endpoint={p => `/queries/3?bloodType=${encodeURIComponent(p.bloodType ?? '')}`}
      />

      <QueryBlock
        num={4}
        title="Тренери з досвідом більше N років"
        desc="Показує тренерів, чий досвід перевищує задану кількість років, відсортованих за досвідом за спаданням. Параметр: мінімальний досвід у роках."
        fields={[
          { key: 'experience', label: 'Мін. досвід (роки)', type: 'number' },
        ]}
        endpoint={p => `/queries/4?experience=${p.experience ?? 0}`}
      />

      <QueryBlock
        num={5}
        title="Гравці з картками після дати"
        desc="Показує гравців, які отримали картки у матчах після вказаної дати. Параметр: дата початку відліку."
        fields={[
          { key: 'date', label: 'Від дати', type: 'date' },
        ]}
        endpoint={p => `/queries/5?date=${p.date ?? ''}`}
      />

      <QueryBlock
        num={6}
        title="Гравці, що зіграли у всіх матчах своєї команди (NOT EXISTS)"
        desc="Показує гравців вказаної команди, які були присутні у статистиці кожного матчу своєї команди. Використовує подвійний NOT EXISTS."
        fields={[
          { key: 'team', label: 'Назва команди' },
        ]}
        endpoint={p => `/queries/6?team=${encodeURIComponent(p.team ?? '')}`}
      />

      <QueryBlock
        num={7}
        title="Гравці, що зіграли в усіх матчах гравця X (EXCEPT)"
        desc="Показує гравців, множина матчів яких включає всі матчі вказаного гравця. Використовує оператор EXCEPT та NOT EXISTS."
        fields={[
          { key: 'firstName', label: "Ім'я гравця" },
          { key: 'lastName', label: 'Прізвище гравця' },
        ]}
        endpoint={p => `/queries/7?firstName=${encodeURIComponent(p.firstName ?? '')}&lastName=${encodeURIComponent(p.lastName ?? '')}`}
      />
    </>
  );
}
