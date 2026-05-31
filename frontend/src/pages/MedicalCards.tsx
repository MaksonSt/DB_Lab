import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

type Player = { id: number; person?: { first_name: string; last_name: string } };
type Card = { id: number; player_id: number; blood_type: string | null; allergies: string | null; player?: Player };
const empty = () => ({ player_id: '', blood_type: '', allergies: '' });
const BLOOD = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function MedicalCards() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Card[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [form, setForm] = useState(empty());
  const [editing, setEditing] = useState<number | null>(null);
  const [error, setError] = useState('');

  const load = () => Promise.all([api.get('/medical-cards'), api.get('/players')]).then(([c, p]) => { setRows(c); setPlayers(p); });
  useEffect(() => { load(); }, []);

  const save = async () => {
    try {
      const data = { player_id: Number(form.player_id), blood_type: form.blood_type || null, allergies: form.allergies || null };
      if (editing) await api.put(`/medical-cards/${editing}`, data);
      else await api.post('/medical-cards', data);
      setForm(empty()); setEditing(null); setError(''); load();
    } catch (e: any) { setError(e.message); }
  };

  const del = async (id: number) => {
    if (!confirm('Видалити медкарту?')) return;
    try { await api.del(`/medical-cards/${id}`); load(); } catch (e: any) { setError(e.message); }
  };

  const set = (k: string, v: string) => setForm({ ...form, [k]: v });

  return (
    <>
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate('/')}>← Меню</button>
        <h1>Медичні картки</h1>
      </div>

      <div className="card">
        <h2>{editing ? 'Редагувати медкарту' : 'Додати медкарту'}</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Гравець *</label>
            <select value={form.player_id} disabled={!!editing} onChange={e => set('player_id', e.target.value)}>
              <option value="">— оберіть гравця —</option>
              {players.map(p => <option key={p.id} value={p.id}>#{p.id} {p.person?.first_name} {p.person?.last_name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Група крові</label>
            <select value={form.blood_type} onChange={e => set('blood_type', e.target.value)}>
              <option value="">— не вказано —</option>
              {BLOOD.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label>Алергії</label>
            <textarea value={form.allergies} onChange={e => set('allergies', e.target.value)} />
          </div>
        </div>
        {error && <div className="error-msg">{error}</div>}
        <div className="form-actions">
          <button className="btn btn-primary" onClick={save}>{editing ? 'Зберегти' : 'Додати'}</button>
          {editing && <button className="btn btn-cancel" onClick={() => { setEditing(null); setForm(empty()); }}>Скасувати</button>}
        </div>
      </div>

      <div className="card">
        <h2>Список медкарт ({rows.length})</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>ID</th><th>Гравець</th><th>Група крові</th><th>Алергії</th><th></th></tr></thead>
            <tbody>
              {rows.length === 0 && <tr><td colSpan={5} className="empty">Немає даних</td></tr>}
              {rows.map(r => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.player?.person?.first_name} {r.player?.person?.last_name}</td>
                  <td>{r.blood_type ?? '—'}</td>
                  <td style={{ maxWidth: 200 }}>{r.allergies ?? '—'}</td>
                  <td><div className="td-actions">
                    <button className="btn btn-edit" onClick={() => { setEditing(r.id); setForm({ player_id: String(r.player_id), blood_type: r.blood_type ?? '', allergies: r.allergies ?? '' }); }}>Редагувати</button>
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
