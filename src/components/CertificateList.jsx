import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Award, FileWarning, User, Calendar, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CertificateList = ({ searchTerm, filterStatus, onSelectCertificate }) => {
  const documents = [
    {
      id: 'CERT-2024-01-003-RES',
      osId: 'OS-2024-003',
      cliente: 'Edifício Central',
      tecnico: 'Carlos Lima',
      dataEmissao: '2024-01-16',
      tipo: 'certificado',
      modelo: 'FT-01 - Certificado Residencial'
    },
    {
      id: 'REL-NC-2024-01-004-COM',
      osId: 'OS-2024-004',
      cliente: 'Indústria XYZ',
      tecnico: 'Ana Costa',
      dataEmissao: '2024-01-16',
      tipo: 'relatorio_nc',
      modelo: 'Relatório de Não Conformidade'
    },
    {
      id: 'CERT-2024-01-001-RES',
      osId: 'OS-2024-001',
      cliente: 'Condomínio Solar',
      tecnico: 'João Silva',
      dataEmissao: '2024-01-15',
      tipo: 'certificado',
      modelo: 'FT-09B - Certificado Residencial Coletivo'
    },
    {
      id: 'REL-NC-2024-01-005-RES',
      osId: 'OS-2024-005',
      cliente: 'Residencial Park',
      tecnico: 'João Silva',
      dataEmissao: '2024-01-14',
      tipo: 'relatorio_nc',
      modelo: 'Relatório de Não Conformidade'
    }
  ];

  const getTypeInfo = (type) => {
    const types = {
      certificado: {
        icon: Award,
        color: 'bg-green-500/20 text-green-300',
        label: 'Certificado'
      },
      relatorio_nc: {
        icon: FileWarning,
        color: 'bg-yellow-500/20 text-yellow-300',
        label: 'Relatório NC'
      }
    };
    return types[type] || { icon: FileWarning, color: 'bg-gray-500/20 text-gray-300', label: 'Desconhecido' };
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = searchTerm === '' ||
      doc.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.osId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'todos' || doc.tipo === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
      <div className="p-6 border-b border-white/20">
        <h3 className="text-xl font-semibold text-white">
          Documentos Emitidos ({filteredDocuments.length})
        </h3>
      </div>

      <div className="divide-y divide-white/10">
        {filteredDocuments.map((doc, index) => {
          const typeInfo = getTypeInfo(doc.tipo);
          return (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 hover:bg-white/5 transition-colors duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs flex items-center ${typeInfo.color}`}>
                      <typeInfo.icon className="w-3 h-3 mr-1.5" />
                      {typeInfo.label}
                    </span>
                    <span className="text-blue-400 font-medium">{doc.id}</span>
                  </div>

                  <h4 className="text-white font-semibold text-lg mb-2">{doc.cliente}</h4>
                  <p className="text-sm text-gray-400 mb-3">{doc.modelo}</p>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-300">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      {doc.tecnico}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Emitido em {new Date(doc.dataEmissao).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    onClick={() => onSelectCertificate(doc)}
                    size="sm"
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Visualizar
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="p-12 text-center">
          <p className="text-gray-400">Nenhum documento encontrado com os filtros aplicados.</p>
        </div>
      )}
    </div>
  );
};

export default CertificateList;