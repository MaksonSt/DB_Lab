import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

type Club = { name: string };
type Team = { id: number; name: string; age_category: string | null; club_name: string | null; club?: Club };
const empty = () => ({ name: '', age_category: '', club_name: '' });

export default function Teams() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Team[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [form, setForm] = useState(empty());
  const [editing, setEditing] = useState<number | null>(null);
  const [error, setError] = useState('');

  const load = () => Promise.all([api.get('/teams'), api.get('/clubs')]).then(([t, c]) => { setRows(t); setClubs(c); });
  useEffect(() => { load(); }, []);

  const save = async () => {
    try {
      const data = { ...form, club_name: form.club_name || null };
      if (editing) await api.put(`/teams/${editing}`, data);
      else await api.post('/teams', data);
      setForm(empty()); setEditing(null); setError(''); load();
    } catch (e: any) { setError(e.message); }
  };

  const del = async (id: number) => {
    if (!confirm('Видалити команду?')) return;
    try { await api.del(`/teams/${id}`); load(); } catch (e: any) { setError(e.message); }
  };

  const set = (k: string, v: string) => setForm({ ...form, [k]: v });

  return (
    <>
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate('/')}>← Меню</button>
        <h1>Команди</h1>
      </div>

      <div className="card">
        <h2>{editing ? 'Редагувати команду' : 'Додати команду'}</h2>
        <div className="form-grid">
          <div className="form-group"><label>Назва *</label><input value={form.name} onChange={e => set('name', e.target.value)} /></div>
          <div className="form-group"><label>Вікова категорія</label><input value={form.age_category} onChange={e => set('age_category', e.target.value)} /></div>
          <div className="form-group">
            <label>Клуб</label>
            <select value={form.club_name} onChange={e => set('club_name', e.target.value)}>
              <option value="">— без клубу —</option>
              {clubs.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
          </div>
        </div>
        {error && <div className="error-msg">{error}</div>}
        <div className="form-actions">
          <button className="btn btn-primary" onClick={save}>{editing ? 'Зберегти' : 'Додати'}</button>
          {editing && <button className="btn btn-cancel" onClick={() => { setEditing(null); setForm(empty()); }}>Скасувати</button>}
        </div>
      </div>

      <div className="card">
        <h2>Список команд ({rows.length})</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>ID</th><th>Назва</th><th>Вік. категорія</th><th>Клуб</th><th></th></tr></thead>
            <tbody>
              {rows.length === 0 && <tr><td colSpan={5} className="empty">Немає даних</td></tr>}
              {rows.map(r => (
                <tr key={r.id}>
                  <td>{r.id}</td><td>{r.name}</td><td>{r.age_category ?? '—'}</td><td>{r.club_name ?? '—'}</td>
                  <td><div className="td-actions">
                    <button className="btn btn-edit" onClick={() => { setEditing(r.id); setForm({ name: r.name, age_category: r.age_category ?? '', club_name: r.club_name ?? '' }); }}>Редагувати</button>
                    <button className="btn btn-danger" onClick={() => del(r.id)}>Видалити</button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
