import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

type Person = { id: number; first_name: string; last_name: string };
type Coach = { id: number; person_id: number; coach_type: string | null; head_coach_id: number | null; experience: number | null; person?: Person; coach?: Coach };
const empty = () => ({ person_id: '', coach_type: '', head_coach_id: '', experience: '' });

export default function Coaches() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Coach[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);
  const [form, setForm] = useState(empty());
  const [editing, setEditing] = useState<number | null>(null);
  const [error, setError] = useState('');

  const load = () => Promise.all([api.get('/coaches'), api.get('/persons')]).then(([c, p]) => { setRows(c); setPersons(p); });
  useEffect(() => { load(); }, []);

  const save = async () => {
    try {
      const data = {
        person_id: Number(form.person_id),
        coach_type: form.coach_type || null,
        head_coach_id: form.head_coach_id ? Number(form.head_coach_id) : null,
        experience: form.experience ? Number(form.experience) : null,
      };
      if (editing) await api.put(`/coaches/${editing}`, data);
      else await api.post('/coaches', data);
      setForm(empty()); setEditing(null); setError(''); load();
    } catch (e: any) { setError(e.message); }
  };

  const del = async (id: number) => {
    if (!confirm('Видалити тренера?')) return;
    try { await api.del(`/coaches/${id}`); load(); } catch (e: any) { setError(e.message); }
  };

  const set = (k: string, v: string) => setForm({ ...form, [k]: v });

  return (
    <>
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate('/')}>← Меню</button>
        <h1>Тренери</h1>
      </div>

      <div className="card">
        <h2>{editing ? 'Редагувати тренера' : 'Додати тренера'}</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Особа *</label>
            <select value={form.person_id} disabled={!!editing} onChange={e => set('person_id', e.target.value)}>
              <option value="">— оберіть особу —</option>
              {persons.map(p => <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>)}
            </select>
          </div>
          <div className="form-group"><label>Тип тренера</label><input value={form.coach_type} onChange={e => set('coach_type', e.target.value)} placeholder="Головний, асистент..." /></div>
          <div className="form-group">
            <label>Головний тренер</label>
            <select value={form.head_coach_id} onChange={e => set('head_coach_id', e.target.value)}>
              <option value="">— немає —</option>
              {rows.filter(c => c.id !== editing).map(c => <option key={c.id} value={c.id}>{c.person?.first_name} {c.person?.last_name}</option>)}
            </select>
          </div>
          <div className="form-group"><label>Досвід (роки)</label><input type="number" value={form.experience} onChange={e => set('experience', e.target.value)} /></div>
        </div>
        {error && <div className="error-msg">{error}</div>}
        <div className="form-actions">
          <button className="btn btn-primary" onClick={save}>{editing ? 'Зберегти' : 'Додати'}</button>
          {editing && <button className="btn btn-cancel" onClick={() => { setEditing(null); setForm(empty()); }}>Скасувати</button>}
        </div>
      </div>

      <div className="card">
        <h2>Список тренерів ({rows.length})</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>ID</th><th>ПІБ</th><th>Тип</th><th>Гол. тренер ID</th><th>Досвід</th><th></th></tr></thead>
            <tbody>
              {rows.length === 0 && <tr><td colSpan={6} className="empty">Немає даних</td></tr>}
              {rows.map(r => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.person?.first_name} {r.person?.last_name}</td>
                  <td>{r.coach_type ?? '—'}</td>
                  <td>{r.head_coach_id ?? '—'}</td>
                  <td>{r.experience != null ? `${r.experience} р.` : '—'}</td>
                  <td><div className="td-actions">
                    <button className="btn btn-edit" onClick={() => { setEditing(r.id); setForm({ person_id: String(r.person_id), coach_type: r.coach_type ?? '', head_coach_id: r.head_coach_id ? String(r.head_coach_id) : '', experience: r.experience != null ? String(r.experience) : '' }); }}>Редагувати</button>
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
