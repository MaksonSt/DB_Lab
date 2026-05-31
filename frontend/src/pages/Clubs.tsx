import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

type Club = { name: string; city: string; stadium: string | null; sponsor: string | null };
const empty = (): Omit<Club, 'team'> => ({ name: '', city: '', stadium: '', sponsor: '' });

export default function Clubs() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Club[]>([]);
  const [form, setForm] = useState(empty());
  const [editing, setEditing] = useState<string | null>(null);
  const [error, setError] = useState('');

  const load = () => api.get('/clubs').then(setRows).catch(() => {});

  useEffect(() => { load(); }, []);

  const save = async () => {
    try {
      if (editing) {
        await api.put(`/clubs/${editing}`, { city: form.city, stadium: form.stadium, sponsor: form.sponsor });
      } else {
        await api.post('/clubs', form);
      }
      setForm(empty()); setEditing(null); setError(''); load();
    } catch (e: any) { setError(e.message); }
  };

  const del = async (name: string) => {
    if (!confirm(`Видалити клуб "${name}"?`)) return;
    try { await api.del(`/clubs/${name}`); load(); } catch (e: any) { setError(e.message); }
  };

  const startEdit = (r: Club) => {
    setEditing(r.name);
    setForm({ name: r.name, city: r.city, stadium: r.stadium ?? '', sponsor: r.sponsor ?? '' });
  };

  return (
    <>
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate('/')}>← Меню</button>
        <h1>Клуби</h1>
      </div>

      <div className="card">
        <h2>{editing ? 'Редагувати клуб' : 'Додати клуб'}</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Назва *</label>
            <input value={form.name} disabled={!!editing} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Місто *</label>
            <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Стадіон</label>
            <input value={form.stadium ?? ''} onChange={e => setForm({ ...form, stadium: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Спонсор</label>
            <input value={form.sponsor ?? ''} onChange={e => setForm({ ...form, sponsor: e.target.value })} />
          </div>
        </div>
        {error && <div className="error-msg">{error}</div>}
        <div className="form-actions">
          <button className="btn btn-primary" onClick={save}>{editing ? 'Зберегти' : 'Додати'}</button>
          {editing && <button className="btn btn-cancel" onClick={() => { setEditing(null); setForm(empty()); }}>Скасувати</button>}
        </div>
      </div>

      <div className="card">
        <h2>Список клубів ({rows.length})</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Назва</th><th>Місто</th><th>Стадіон</th><th>Спонсор</th><th></th></tr></thead>
            <tbody>
              {rows.length === 0 && <tr><td colSpan={5} className="empty">Немає даних</td></tr>}
              {rows.map(r => (
                <tr key={r.name}>
                  <td>{r.name}</td><td>{r.city}</td><td>{r.stadium ?? '—'}</td><td>{r.sponsor ?? '—'}</td>
                  <td><div className="td-actions">
                    <button className="btn btn-edit" onClick={() => startEdit(r)}>Редагувати</button>
                    <button className="btn btn-danger" onClick={() => del(r.name)}>Видалити</button>
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
