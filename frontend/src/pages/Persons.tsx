import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

type Person = { id: number; first_name: string; last_name: string; nationality: string | null };
const empty = () => ({ first_name: '', last_name: '', nationality: '' });

export default function Persons() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Person[]>([]);
  const [form, setForm] = useState(empty());
  const [editing, setEditing] = useState<number | null>(null);
  const [error, setError] = useState('');

  const load = () => api.get('/persons').then(setRows).catch(() => {});
  useEffect(() => { load(); }, []);

  const save = async () => {
    try {
      if (editing) await api.put(`/persons/${editing}`, form);
      else await api.post('/persons', form);
      setForm(empty()); setEditing(null); setError(''); load();
    } catch (e: any) { setError(e.message); }
  };

  const del = async (id: number) => {
    if (!confirm('Видалити особу?')) return;
    try { await api.del(`/persons/${id}`); load(); } catch (e: any) { setError(e.message); }
  };

  const f = form;
  const set = (k: string, v: string) => setForm({ ...form, [k]: v });

  return (
    <>
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate('/')}>← Меню</button>
        <h1>Особи</h1>
      </div>

      <div className="card">
        <h2>{editing ? 'Редагувати особу' : 'Додати особу'}</h2>
        <div className="form-grid">
          <div className="form-group"><label>Ім'я *</label><input value={f.first_name} onChange={e => set('first_name', e.target.value)} /></div>
          <div className="form-group"><label>Прізвище *</label><input value={f.last_name} onChange={e => set('last_name', e.target.value)} /></div>
          <div className="form-group"><label>Національність</label><input value={f.nationality} onChange={e => set('nationality', e.target.value)} /></div>
        </div>
        {error && <div className="error-msg">{error}</div>}
        <div className="form-actions">
          <button className="btn btn-primary" onClick={save}>{editing ? 'Зберегти' : 'Додати'}</button>
          {editing && <button className="btn btn-cancel" onClick={() => { setEditing(null); setForm(empty()); }}>Скасувати</button>}
        </div>
      </div>

      <div className="card">
        <h2>Список осіб ({rows.length})</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>ID</th><th>Ім'я</th><th>Прізвище</th><th>Національність</th><th></th></tr></thead>
            <tbody>
              {rows.length === 0 && <tr><td colSpan={5} className="empty">Немає даних</td></tr>}
              {rows.map(r => (
                <tr key={r.id}>
                  <td>{r.id}</td><td>{r.first_name}</td><td>{r.last_name}</td><td>{r.nationality ?? '—'}</td>
                  <td><div className="td-actions">
                    <button className="btn btn-edit" onClick={() => { setEditing(r.id); setForm({ first_name: r.first_name, last_name: r.last_name, nationality: r.nationality ?? '' }); }}>Редагувати</button>
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
