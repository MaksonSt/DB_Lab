import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

type Row = Record<string, unknown>;

function SearchInput({
  value, onChange, options, placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { setQuery(value); }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = query
    ? options.filter(o => o.toLowerCase().includes(query.toLowerCase()))
    : options;

  const select = (o: string) => { onChange(o); setQuery(o); setOpen(false); };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <input
        value={query}
        placeholder={placeholder}
        onChange={e => { setQuery(e.target.value); onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        autoComplete="off"
      />
      {open && filtered.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
          background: '#fff', border: '1px solid #d1d5db', borderRadius: 6,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)', maxHeight: 200, overflowY: 'auto',
        }}>
          {filtered.map(o => (
            <div
              key={o}
              onMouseDown={() => select(o)}
              style={{
                padding: '7px 12px', cursor: 'pointer', fontSize: 13,
                background: o === value ? '#eff6ff' : undefined,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#f1f5f9')}
              onMouseLeave={e => (e.currentTarget.style.background = o === value ? '#eff6ff' : '')}
            >
              {o}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

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

type FieldDef =
  | { key: string; label: string; kind?: 'text' | 'number' | 'date' }
  | { key: string; label: string; kind: 'search'; options: string[] }
  | { key: string; label: string; kind: 'select'; options: string[] };

function QueryBlock({ num, title, desc, fields, endpoint, validate }: {
  num: number;
  title: string;
  desc: string;
  fields: FieldDef[];
  endpoint: (params: Record<string, string>) => string;
  validate?: (params: Record<string, string>) => string | null;
}) {
  const [params, setParams] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Row[] | null>(null);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k: string, v: string) => {
    const next = { ...params, [k]: v };
    setParams(next);
    setWarning(validate?.(next) ?? '');
  };

  const run = async () => {
    const w = validate?.(params) ?? '';
    setWarning(w);
    if (error) setError('');
    setLoading(true);
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
            {f.kind === 'search' ? (
              <SearchInput
                value={params[f.key] ?? ''}
                onChange={v => set(f.key, v)}
                options={f.options}
                placeholder="Почніть вводити..."
              />
            ) : f.kind === 'select' ? (
              <select value={params[f.key] ?? ''} onChange={e => set(f.key, e.target.value)}>
                <option value="">— оберіть —</option>
                {f.options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : (
              <input
                type={f.kind ?? 'text'}
                value={params[f.key] ?? ''}
                onChange={e => set(f.key, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
      {warning && (
        <p style={{ fontSize: 13, color: '#b45309', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 6, padding: '7px 12px', marginTop: 12 }}>
          ⚠ {warning}
        </p>
      )}
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

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function Queries() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<string[]>([]);
  const [stadiums, setStadiums] = useState<string[]>([]);
  const [players, setPlayers] = useState<string[]>([]);

  useEffect(() => {
    api.get('/teams').then((data: any[]) => setTeams(data.map(t => t.name))).catch(() => {});
    api.get('/matches').then((data: any[]) => {
      const unique = [...new Set(data.map((m: any) => m.stadium))].sort();
      setStadiums(unique);
    }).catch(() => {});
    api.get('/players').then((data: any[]) => {
      const names = data
        .filter((p: any) => p.person)
        .map((p: any) => `${p.person.first_name} ${p.person.last_name}`);
      setPlayers([...new Set(names)].sort());
    }).catch(() => {});
  }, []);

  return (
    <>
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate('/')}>← Меню</button>
        <h1>SQL-запити</h1>
      </div>

      <QueryBlock
        num={1}
        title="Гравці команди з голами більше N"
        desc="Показує гравців вказаної команди, які забили більше N голів у матчах."
        fields={[
          { key: 'team', label: 'Команда', kind: 'search', options: teams },
          { key: 'goals', label: 'Мін. кількість голів', kind: 'number' },
        ]}
        endpoint={p => `/queries/1?team=${encodeURIComponent(p.team ?? '')}&goals=${p.goals ?? 0}`}
        validate={p => {
          if (!p.team) return 'Оберіть команду зі списку.';
          const g = Number(p.goals ?? 0);
          if (g < 0) return 'Кількість голів не може бути від\'ємною.';
          if (g === 0) return 'При N=0 буде показано всіх гравців команди, що забили хоча б 1 гол.';
          return null;
        }}
      />

      <QueryBlock
        num={2}
        title="Матчі на стадіоні після дати"
        desc="Показує матчі, що відбулися на вказаному стадіоні після заданої дати."
        fields={[
          { key: 'stadium', label: 'Стадіон', kind: 'search', options: stadiums },
          { key: 'date', label: 'Після дати', kind: 'date' },
        ]}
        endpoint={p => `/queries/2?stadium=${encodeURIComponent(p.stadium ?? '')}&date=${p.date ?? ''}`}
        validate={p => {
          if (!p.stadium) return 'Оберіть стадіон зі списку.';
          if (!p.date) return 'Вкажіть дату — без неї повернуться всі матчі на цьому стадіоні.';
          if (new Date(p.date) > new Date()) return 'Вказана дата в майбутньому — результатів не буде.';
          return null;
        }}
      />

      <QueryBlock
        num={3}
        title="Гравці з вказаною групою крові"
        desc="Показує всіх гравців з заданою групою крові разом з командою та відомостями про алергії."
        fields={[
          { key: 'bloodType', label: 'Група крові', kind: 'select', options: BLOOD_TYPES },
        ]}
        endpoint={p => `/queries/3?bloodType=${encodeURIComponent(p.bloodType ?? '')}`}
        validate={p => (!p.bloodType ? 'Оберіть групу крові.' : null)}
      />

      <QueryBlock
        num={4}
        title="Тренери з досвідом більше N років"
        desc="Показує тренерів, чий досвід перевищує задану кількість років, відсортованих за спаданням."
        fields={[
          { key: 'experience', label: 'Мін. досвід (роки)', kind: 'number' },
        ]}
        endpoint={p => `/queries/4?experience=${p.experience ?? 0}`}
        validate={p => {
          if (Number(p.experience ?? 0) < 0) return 'Досвід не може бути від\'ємним.';
          if (!p.experience || p.experience === '0') return 'При N=0 буде показано всіх тренерів з будь-яким досвідом.';
          return null;
        }}
      />

      <QueryBlock
        num={5}
        title="Гравці з картками після дати"
        desc="Показує гравців, які отримали картки у матчах після вказаної дати."
        fields={[
          { key: 'date', label: 'Від дати', kind: 'date' },
        ]}
        endpoint={p => `/queries/5?date=${p.date ?? ''}`}
        validate={p => {
          if (!p.date) return 'Вкажіть дату.';
          if (new Date(p.date) > new Date()) return 'Вказана дата в майбутньому — матчів після неї ще не було.';
          return null;
        }}
      />

      <QueryBlock
        num={6}
        title="Гравці, що зіграли у всіх матчах своєї команди (NOT EXISTS)"
        desc="Показує гравців вказаної команди, які були присутні у статистиці кожного матчу своєї команди."
        fields={[
          { key: 'team', label: 'Команда', kind: 'search', options: teams },
        ]}
        endpoint={p => `/queries/6?team=${encodeURIComponent(p.team ?? '')}`}
        validate={p => (!p.team ? 'Оберіть команду зі списку.' : null)}
      />

      <QueryBlock
        num={7}
        title="Гравці, що зіграли в усіх матчах гравця X (EXCEPT)"
        desc="Показує гравців, множина матчів яких включає всі матчі вказаного гравця."
        fields={[
          { key: 'player', label: 'Гравець', kind: 'search', options: players },
        ]}
        endpoint={p => {
          const parts = (p.player ?? '').trim().split(' ');
          const firstName = parts[0] ?? '';
          const lastName = parts.slice(1).join(' ');
          return `/queries/7?firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}`;
        }}
        validate={p => {
          if (!p.player) return 'Оберіть гравця зі списку.';
          const parts = p.player.trim().split(' ');
          if (parts.length < 2) return 'Оберіть гравця зі списку (ім\'я та прізвище).';
          return null;
        }}
      />
    </>
  );
}
