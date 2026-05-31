import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

type Position = { id: number; name: string };

export default function Positions() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Position[]>([]);
  const [form, setForm] = useState({ name: '' });
  const [editing, setEditing] = useState<number | null>(null);
  const [error, setError] = useState('');

  const load = () => api.get('/positions').then(setRows).catch(() => {});
  useEffect(() => { load(); }, []);

  const save = async () => {
    try {
      if (editing) await api.put(`/positions/${editing}`, form);
      else await api.post('/positions', form);
      setForm({ name: '' }); setEditing(null); setError(''); load();
    } catch (e: any) { setError(e.message); }
  };

  const del = async (id: number) => {
    if (!confirm('Видалити позицію?')) return;
    try { await api.del(`/positions/${id}`); load(); } catch (e: any) { setError(e.message); }
  };

  return (
    <>
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate('/')}>← Меню</button>
        <h1>Позиції</h1>
      </div>

      <div className="card">
        <h2>{editing ? 'Редагувати позицію' : 'Додати позицію'}</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Назва *</label>
            <input value={form.name} onChange={e => setForm({ name: e.target.value })} />
          </div>
        </div>
        {error && <div className="error-msg">{error}</div>}
        <div className="form-actions">
          <button className="btn btn-primary" onClick={save}>{editing ? 'Зберегти' : 'Додати'}</button>
          {editing && <button className="btn btn-cancel" onClick={() => { setEditing(null); setForm({ name: '' }); }}>Скасувати</button>}
        </div>
      </div>

      <div className="card">
        <h2>Список позицій ({rows.length})</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>ID</th><th>Назва</th><th></th></tr></thead>
            <tbody>
              {rows.length === 0 && <tr><td colSpan={3} className="empty">Немає даних</td></tr>}
              {rows.map(r => (
                <tr key={r.id}>
                  <td>{r.id}</td><td>{r.name}</td>
                  <td><div className="td-actions">
                    <button className="btn btn-edit" onClick={() => { setEditing(r.id); setForm({ name: r.name }); }}>Редагувати</button>
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
