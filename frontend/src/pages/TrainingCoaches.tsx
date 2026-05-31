import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

type Training = { id: number; date: string; type: string | null };
type Coach = { id: number; person?: { first_name: string; last_name: string } };
type TC = { training_id: number; coach_id: number; training?: Training; coach?: Coach };

function fmtDate(d: string) { return d ? d.split('T')[0] : ''; }

export default function TrainingCoaches() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<TC[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [form, setForm] = useState({ training_id: '', coach_id: '' });
  const [error, setError] = useState('');

  const load = () => Promise.all([api.get('/training-coaches'), api.get('/trainings'), api.get('/coaches')])
    .then(([tc, t, c]) => { setRows(tc); setTrainings(t); setCoaches(c); });

  useEffect(() => { load(); }, []);

  const add = async () => {
    try {
      await api.post('/training-coaches', { training_id: Number(form.training_id), coach_id: Number(form.coach_id) });
      setForm({ training_id: '', coach_id: '' }); setError(''); load();
    } catch (e: any) { setError(e.message); }
  };

  const del = async (tid: number, cid: number) => {
    if (!confirm('Видалити прив\'язку?')) return;
    try { await api.del(`/training-coaches/${tid}/${cid}`); load(); } catch (e: any) { setError(e.message); }
  };

  return (
    <>
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate('/')}>← Меню</button>
        <h1>Тренери на тренуваннях</h1>
      </div>

      <div className="card">
        <h2>Додати тренера до тренування</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Тренування *</label>
            <select value={form.training_id} onChange={e => setForm({ ...form, training_id: e.target.value })}>
              <option value="">— оберіть тренування —</option>
              {trainings.map(t => <option key={t.id} value={t.id}>#{t.id} {fmtDate(t.date)} {t.type ?? ''}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Тренер *</label>
            <select value={form.coach_id} onChange={e => setForm({ ...form, coach_id: e.target.value })}>
              <option value="">— оберіть тренера —</option>
              {coaches.map(c => <option key={c.id} value={c.id}>#{c.id} {c.person?.first_name} {c.person?.last_name}</option>)}
            </select>
          </div>
        </div>
        {error && <div className="error-msg">{error}</div>}
        <div className="form-actions">
          <button className="btn btn-primary" onClick={add}>Додати</button>
        </div>
      </div>

      <div className="card">
        <h2>Список ({rows.length})</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Тренування</th><th>Дата</th><th>Тип</th><th>Тренер</th><th></th></tr></thead>
            <tbody>
              {rows.length === 0 && <tr><td colSpan={5} className="empty">Немає даних</td></tr>}
              {rows.map(r => (
                <tr key={`${r.training_id}-${r.coach_id}`}>
                  <td>#{r.training_id}</td>
                  <td>{r.training ? fmtDate(r.training.date) : ''}</td>
                  <td>{r.training?.type ?? '—'}</td>
                  <td>{r.coach?.person?.first_name} {r.coach?.person?.last_name}</td>
                  <td><button className="btn btn-danger" onClick={() => del(r.training_id, r.coach_id)}>Видалити</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
