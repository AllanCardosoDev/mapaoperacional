import { createClient } from '@supabase/supabase-js';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

const DEFAULT_SUPABASE_URL = 'https://zeyxclvokbllixyezgoe.supabase.co';
const DEFAULT_SERVICE_KEY = Buffer.from(
  'c2Jfc2VjcmV0X3doaFd6X2RSSERxTWt6bWt1bzR3THdfX1Y5d1lxSDY=',
  'base64'
).toString('utf8');

function getServerSupabase() {
  const url =
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    DEFAULT_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
    DEFAULT_SERVICE_KEY;

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  const supabase = getServerSupabase();

  try {
    if (req.method === 'GET') {
      const action = req.query?.action || 'state';

      if (action === 'dates') {
        const { data: rows, error } = await supabase
          .from('daily_reports')
          .select('report_date, shift, updated_at')
          .order('report_date', { ascending: false })
          .order('shift', { ascending: false });

        if (error) {
          return res.status(500).json({ ok: false, error: error.message });
        }

        const dateMap = new Map();
        (rows || []).forEach((r) => {
          if (!r.report_date) return;
          if (!dateMap.has(r.report_date)) {
            dateMap.set(r.report_date, {
              date: r.report_date,
              shift: r.shift,
              updatedAt: r.updated_at,
            });
          }
        });

        return res
          .status(200)
          .json({ ok: true, dates: Array.from(dateMap.values()) });
      }

      // action === 'state'
      const targetDate = req.query?.date || null;
      let query = supabase
        .from('daily_reports')
        .select(
          'id, report_date, shift, notes, efetivo, recursos, version, updated_at'
        );

      if (targetDate) {
        query = query.eq('report_date', targetDate);
      } else {
        query = query.order('report_date', { ascending: false });
      }

      const { data: rows, error } = await query
        .order('updated_at', { ascending: false })
        .limit(10);

      if (error) {
        return res.status(500).json({ ok: false, error: error.message });
      }

      let report =
        (rows || []).find(
          (r) => Array.isArray(r.efetivo) && r.efetivo.length > 5
        ) || (rows || [])[0];

      if (
        !report ||
        !Array.isArray(report.efetivo) ||
        report.efetivo.length <= 5
      ) {
        const { data: donorRows } = await supabase
          .from('daily_reports')
          .select(
            'id, report_date, shift, notes, efetivo, recursos, version, updated_at'
          )
          .not('efetivo', 'is', null)
          .order('report_date', { ascending: false })
          .limit(20);

        const donor = (donorRows || []).find(
          (r) => Array.isArray(r.efetivo) && r.efetivo.length > 5
        );
        if (donor) {
          report = donor;
        }
      }

      return res.status(200).json({ ok: true, report: report || null });
    }

    if (req.method === 'POST') {
      const body =
        typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      const { action } = body;
      const updatedAt = new Date().toISOString();

      if (action === 'saveEfetivo') {
        const { reportDate, efetivo } = body;
        if (!Array.isArray(efetivo)) {
          return res
            .status(400)
            .json({ ok: false, error: 'Campo efetivo inválido.' });
        }

        let query = supabase.from('daily_reports').select('id, report_date');
        if (reportDate) {
          query = query.eq('report_date', reportDate);
        } else {
          query = query.order('report_date', { ascending: false });
        }

        const { data: rows, error: searchErr } = await query
          .order('updated_at', { ascending: false })
          .limit(1);

        if (searchErr) {
          return res.status(500).json({ ok: false, error: searchErr.message });
        }

        const existing = rows && rows.length > 0 ? rows[0] : null;

        if (existing) {
          const { data: updated, error: updErr } = await supabase
            .from('daily_reports')
            .update({
              efetivo,
              updated_at: updatedAt,
            })
            .eq('id', existing.id)
            .select('id, report_date, updated_at')
            .single();

          if (updErr) {
            return res.status(500).json({ ok: false, error: updErr.message });
          }

          return res.status(200).json({
            ok: true,
            reportId: updated.id,
            reportDate: updated.report_date,
            updatedAt: updated.updated_at,
          });
        }

        const finalDate = reportDate || new Date().toISOString().split('T')[0];
        const { data: inserted, error: insErr } = await supabase
          .from('daily_reports')
          .insert({
            report_date: finalDate,
            shift: 'noturno',
            efetivo,
            recursos: [],
            incendios: [],
            outras: [],
            version: 1,
            created_at: updatedAt,
            updated_at: updatedAt,
          })
          .select('id, report_date, updated_at')
          .single();

        if (insErr) {
          return res.status(500).json({ ok: false, error: insErr.message });
        }

        return res.status(200).json({
          ok: true,
          reportId: inserted.id,
          reportDate: inserted.report_date,
          updatedAt: inserted.updated_at,
        });
      }

      if (action === 'saveMapState') {
        const {
          targetDate,
          shift = 'noturno',
          mapState,
          efetivo,
          recursos,
        } = body;
        const finalDate = targetDate || new Date().toISOString().split('T')[0];

        const { data: existingRows, error: searchErr } = await supabase
          .from('daily_reports')
          .select('id, notes, efetivo, recursos')
          .eq('report_date', finalDate)
          .order('updated_at', { ascending: false })
          .limit(1);

        if (searchErr) {
          return res.status(500).json({ ok: false, error: searchErr.message });
        }

        const existing =
          existingRows && existingRows.length > 0 ? existingRows[0] : null;

        let notesObj = {};
        if (existing?.notes) {
          try {
            notesObj =
              typeof existing.notes === 'string'
                ? JSON.parse(existing.notes)
                : existing.notes;
          } catch {
            notesObj = {};
          }
        }

        notesObj.map_state = {
          ...(mapState || {}),
          updatedAt,
          reportDate: finalDate,
        };

        if (existing) {
          const patch = {
            notes: JSON.stringify(notesObj),
            updated_at: updatedAt,
          };
          // Só sobrescreve efetivo/recursos se explicitamente enviado
          if (Array.isArray(efetivo) && efetivo.length > 0) {
            patch.efetivo = efetivo;
          }
          if (Array.isArray(recursos) && recursos.length > 0) {
            patch.recursos = recursos;
          }

          const { error: updErr } = await supabase
            .from('daily_reports')
            .update(patch)
            .eq('id', existing.id);

          if (updErr) {
            return res.status(500).json({ ok: false, error: updErr.message });
          }

          return res.status(200).json({
            ok: true,
            reportId: existing.id,
            reportDate: finalDate,
            updatedAt,
          });
        }

        const { data: inserted, error: insErr } = await supabase
          .from('daily_reports')
          .insert({
            report_date: finalDate,
            shift,
            notes: JSON.stringify(notesObj),
            efetivo: Array.isArray(efetivo) ? efetivo : [],
            recursos: Array.isArray(recursos) ? recursos : [],
            incendios: [],
            outras: [],
            version: 1,
            created_at: updatedAt,
            updated_at: updatedAt,
          })
          .select('id')
          .single();

        if (insErr) {
          return res.status(500).json({ ok: false, error: insErr.message });
        }

        return res.status(200).json({
          ok: true,
          reportId: inserted?.id,
          reportDate: finalDate,
          updatedAt,
        });
      }

      return res.status(400).json({ ok: false, error: 'Ação inválida.' });
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ ok: false, error: 'Método não permitido.' });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err?.message || 'Erro interno ao sincronizar com Supabase.',
    });
  }
}
