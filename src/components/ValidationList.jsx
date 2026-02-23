
// src/components/ValidationList.jsx

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, User, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/customSupabaseClient';

// Tooltip via Radix (sem depender do shadcn)
import * as RTooltip from '@radix-ui/react-tooltip';

const safeLabel = (v) => {
  if (v == null) return '—';
  if (typeof v === 'string' || typeof v === 'number') return String(v);
  if (typeof v === 'object') {
    if (v.nome) return v.nome;
    if (v.name) return v.name;
    try {
      return JSON.stringify(v);
    } catch {
      return '—';
    }
  }
  return '—';
};

const getStatusColor = (status) => {
  const colors = {
    pendente: 'bg-orange-500/20 text-orange-300',
    aprovada: 'bg-green-500/20 text-green-300',
    rejeitada: 'bg-red-500/20 text-red-300',
    contestacao: 'bg-yellow-500/20 text-yellow-300',
  };
  return colors[status] || 'bg-gray-500/20 text-gray-300';
};

const getResultColor = (resultado) => {
  const colors = {
    'Apto': 'bg-green-500/20 text-green-300',
    'Apto com restrições': 'bg-yellow-500/20 text-yellow-300',
    'Não apto': 'bg-red-500/20 text-red-300',
  };
  return colors[resultado] || 'bg-gray-500/20 text-gray-300';
};

const buildQuery = (searchTerm, filterStatus) => {
  return (q) => {
    let query = q;
    if (filterStatus && filterStatus !== 'todos') {
      query = query.eq('status', filterStatus);
    }
    if (searchTerm?.trim() !== '') {
      const term = searchTerm.trim();
      query = query.or(
        `cliente.ilike.%${term}%,os_id.ilike.%${term}%,tecnico.ilike.%${term}%`
      );
    }
    return query.order('data_validacao', { ascending: false });
  };
};

const ValidationList = ({ searchTerm, filterStatus, onSelectValidation, onSelectNewValidador }) => {
  const [validations, setValidations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const applyQuery = useMemo(
    () => buildQuery(searchTerm, filterStatus),
    [searchTerm, filterStatus]
  );

  const fetchValidations = async () => {
    try {
      setLoading(true);
      setErr(null);

      let query = supabase
        .from('validacoes')
        .select(`
          id,
          os_id,
          ordem_servico:os_id (
            id,
            numero,
            data_conclusao,
            pedido:cliente_id ( id, cliente_nome ),
            tecnico:tecnico_id ( nome )
          ),
          validador_id,
          profiles:validador_id ( name ),
          data_validacao,
          resultado,
          status,
          parecer
        `);

      query = applyQuery(query);
      const { data, error } = await query;
      if (error) throw error;

      setValidations(data);
    } catch (e) {
      setErr(e.message ?? 'Erro ao buscar validações');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchValidations();
    const channel = supabase
      .channel('validacoes-list')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'validacoes' }, () => {
        fetchValidations();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [searchTerm, filterStatus]);

  const filteredValidations = validations;

  return (
    <RTooltip.Provider delayDuration={250}>
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
        <div className="p-6 border-b border-white/20">
          <h3 className="text-xl font-semibold text-white">
            Fila de Validação ({loading ? '...' : filteredValidations.length})
          </h3>
          {err && <p className="text-sm text-red-300 mt-1">{err}</p>}
        </div>

        <div className="divide-y divide-white/10">
          {!loading &&
            filteredValidations.map((validation, index) => {
              const needsValidador = !validation?.profiles?.name;

              return (
                <motion.div
                  key={validation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 hover:bg-white/5 transition-colors duration-200"
                >
                  <div className="flex flex-col items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-blue-400 font-medium">
                          {validation?.ordem_servico?.numero ?? '--'}
                        </span>

                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(validation.status)}`}>
                          {String(validation.status).toUpperCase()}
                        </span>

                        <span className={`px-2 py-1 rounded-full text-xs ${getResultColor(validation.resultado)}`}>
                          {validation.resultado}
                        </span>
                      </div>

                      <h4 className="text-white font-semibold text-lg mb-2">
                        Cliente - {validation?.ordem_servico?.pedido?.cliente_nome ?? '—'}
                      </h4>

                      <div className="flex items-center space-x-6 text-sm text-gray-300">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          Técnico - {validation?.ordem_servico?.tecnico?.nome ?? '—'}
                        </div>

                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          {validation?.profiles?.name ? (
                            <>Validador - {validation.profiles.name}</>
                          ) : (
                            <>
                              Validador -
                              <button
                                className="ml-2 px-3 py-1 bg-blue-500 text-white rounded"
                                onClick={() => onSelectNewValidador(validation)}
                              >
                                Cadastrar Validador
                              </button>
                            </>
                          )}
                        </div>

                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          Concluído em{' '}
                          {validation?.ordem_servico?.data_conclusao
                            ? new Date(validation.ordem_servico.data_conclusao).toLocaleDateString('pt-BR')
                            : '—'}
                        </div>

                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          Validado em{' '}
                          {validation.data_validacao
                            ? new Date(validation.data_validacao).toLocaleDateString('pt-BR')
                            : '—'}
                        </div>
                      </div>
                    </div>
                    <div className="h-4" />

                    {validation?.resultado !== 'Apto' && (
                      
                      <div className="flex items-center ml-4">
                        <RTooltip.Root open={needsValidador ? undefined : undefined}>
                          <RTooltip.Trigger asChild>
                            {/* Wrapper div para permitir tooltip mesmo com Button disabled */}
                           
                            <div className={needsValidador ? "cursor-not-allowed" : ""}>
                              <Button
                                onClick={() => {
                                  if (needsValidador) return;
                                  onSelectValidation({
                                    id: validation.id,
                                    osId: validation.os_id,
                                    numero: validation?.ordem_servico?.numero ?? "",
                                    cliente: validation?.ordem_servico?.pedido?.cliente_nome ?? "",
                                    tecnico: validation?.ordem_servico?.tecnico?.nome ?? "",
                                    dataConclusao: validation?.ordem_servico?.data_conclusao ?? null,
                                    resultado: validation?.resultado ?? "—",
                                    parecer: validation?.parecer ?? "",
                                    dataValidacao: validation?.data_validacao ?? null,
                                  });
                                }}
                                size="sm"
                                disabled={needsValidador}
                                className={[
                                  "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
                                  needsValidador ? "opacity-50" : ""
                                ].join(" ")}
                                title={needsValidador ? 'Cadastre um validador antes de revisar.' : 'Revisar'}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Revisar
                              </Button>
                            </div>
                          </RTooltip.Trigger>

                          {needsValidador && (
                            <RTooltip.Content
                              side="left"
                              sideOffset={8}
                              className="select-none rounded-md bg-black/90 px-3 py-2 text-xs text-white shadow-lg border border-white/10"
                            >
                              Cadastre um validador antes de revisar.
                              <RTooltip.Arrow className="fill-black/90" />
                            </RTooltip.Content>
                          )}
                        </RTooltip.Root>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
        </div>

        {!loading && filteredValidations.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-gray-400">
              Nenhuma inspeção para validação com os filtros aplicados.
            </p>
          </div>
        )}

        {loading && (
          <div className="p-12 text-center">
            <p className="text-gray-400">Carregando...</p>
          </div>
        )}
      </div>
    </RTooltip.Provider>
  );
};

export default ValidationList;
``
