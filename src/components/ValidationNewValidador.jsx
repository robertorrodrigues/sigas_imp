
// src/components/ValidationNewValidador.jsx
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/customSupabaseClient';

const ValidationNewValidador = ({ validation, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const [validators, setValidators] = useState([]);      // validador = true
  const [nonValidators, setNonValidators] = useState([]); // validador != true

  const [selectedExisting, setSelectedExisting] = useState(null);
  const [selectedNew, setSelectedNew] = useState(null);

  // Carrega listas
  useEffect(() => {
    const load = async () => {
      try {
        setErr(null);

        // 1) Quem já é validador
        const { data: valids, error: err1 } = await supabase
          .from('profiles')
          .select('id, name, email')
          .eq('validador', true)
          .order('name', { ascending: true });

        if (err1) throw err1;

        // 2) Quem NÃO é validador
        const { data: nonValids, error: err2 } = await supabase
          .from('profiles')
          .select('id, name, email')
          .neq('validador', true)
          .order('name', { ascending: true });

        if (err2) throw err2;

        setValidators(valids ?? []);
        setNonValidators(nonValids ?? []);
      } catch (e) {
        setErr(e.message ?? 'Erro ao carregar usuários');
      }
    };

    load();
  }, []);

  // VINCULAR EXISTENTE 
  const handleAttachExisting = async () => {
    if (!selectedExisting) return;
    try {
      setLoading(true);
      setErr(null);

      const { error } = await supabase
        .from('validacoes')
        .update({ validador_id: selectedExisting })
        .eq('id', validation.id);

      if (error) throw error;

      onClose?.();
    } catch (e) {
      setErr(e.message ?? 'Erro ao vincular validador existente');
    } finally {
      setLoading(false);
    }
  };

  // PROMOVER + VINCULAR
  const handlePromoteAndAttach = async () => {
    if (!selectedNew) return;
    try {
      setLoading(true);
      setErr(null);

      // 1) Promove a validador
      const { error: e1 } = await supabase
        .from('profiles')
        .update({ validador: true })
        .eq('id', selectedNew);

      if (e1) throw e1;

      // 2) Vincula à validação
      const { error: e2 } = await supabase
        .from('validacoes')
        .update({ validador_id: selectedNew })
        .eq('id', validation.id);

      if (e2) throw e2;

      onClose?.();
    } catch (e) {
      setErr(e.message ?? 'Erro ao promover e vincular');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      {/* overlay */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* modal */}
      <div className="relative z-[1000] w-full max-w-xl rounded-2xl border border-white/20 bg-slate-900 p-6 shadow-2xl">
        
        <div className="flex items-start justify-between">
          <h2 className="text-xl font-semibold text-white">
            Definir Validador
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Dados da OS */}
        <p className="mt-1 text-sm text-gray-300">
          OS: <span className="text-blue-300">{validation?.ordem_servico?.numero ?? '—'}</span>
        </p>
        <p className="text-sm text-gray-300">
          Cliente: <span className="text-blue-300">{validation?.ordem_servico?.pedido?.cliente_nome ?? '—'}</span>
        </p>

        {/* Selecionar EXISTENTE */}
        <div className="mt-6">
          <label className="mb-2 block text-sm text-gray-300">
            Selecionar validador existente
          </label>

          <select
            className="w-full rounded-md border border-slate-700 bg-slate-800 p-3 text-white"
            value={selectedExisting ?? ''}
            onChange={(e) => setSelectedExisting(e.target.value || null)}
          >
            <option value="">Selecione...</option>
            {validators.map(v => (
              <option key={v.id} value={v.id}>
                {v.name} {v.email ? `(${v.email})` : ''}
              </option>
            ))}
          </select>

          <Button
            disabled={!selectedExisting || loading}
            onClick={handleAttachExisting}
            className="mt-3 bg-blue-600 hover:bg-blue-700"
          >
            {loading ? 'Salvando...' : 'Vincular'}
          </Button>
        </div>

        {/* PROMOVER NOVO */}
        <div className="mt-8">
          <p className="mb-2 text-sm text-gray-300">
            Ou promover novo validador
          </p>

          <select
            className="w-full rounded-md border border-slate-700 bg-slate-800 p-3 text-white"
            value={selectedNew ?? ''}
            onChange={(e) => setSelectedNew(e.target.value || null)}
          >
            <option value="">Selecione...</option>
            {nonValidators.map(u => (
              <option key={u.id} value={u.id}>
                {u.name} {u.email ? `(${u.email})` : ''}
              </option>
            ))}
          </select>

          <Button
            disabled={!selectedNew || loading}
            onClick={handlePromoteAndAttach}
            className="mt-3 bg-emerald-600 hover:bg-emerald-700"
          >
            {loading ? 'Cadastrando...' : 'Cadastrar e Vincular'}
          </Button>
        </div>

        {err && <p className="mt-4 text-sm text-red-300">{err}</p>}
      </div>
    </div>
  );
};

export default ValidationNewValidador;
