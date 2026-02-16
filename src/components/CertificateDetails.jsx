import React from 'react';
import { motion } from 'framer-motion';
import { X, Download, Share2, Printer, Award, FileWarning } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const CertificateDetails = ({ certificate, onClose }) => {
  const isCertificate = certificate.tipo === 'certificado';

  const handleAction = (action) => {
    toast({
      title: `Funcionalidade não implementada: ${action}`,
      description: "🚧 Esta funcionalidade não está implementada ainda—mas não se preocupe! Você pode solicitá-la no seu próximo prompt! 🚀",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 w-full max-w-4xl max-h-[90vh] flex flex-col"
      >
        <div className="flex items-center justify-between mb-6 shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {isCertificate ? 'Detalhes do Certificado' : 'Detalhes do Relatório'}
            </h2>
            <p className="text-gray-300">{certificate.id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
          {/* PDF Preview */}
          <div className="flex-1 bg-white/5 rounded-xl flex items-center justify-center p-4 overflow-hidden">
            <div className="w-full h-full border-2 border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center text-center p-4">
              {isCertificate ? (
                <Award className="w-16 h-16 text-green-400 mb-4" />
              ) : (
                <FileWarning className="w-16 h-16 text-yellow-400 mb-4" />
              )}
              <h3 className="text-xl font-bold text-white">
                Visualização do {isCertificate ? 'Certificado' : 'Relatório'}
              </h3>
              <p className="text-gray-300 mt-2">
                A pré-visualização do PDF será exibida aqui.
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Modelo: {certificate.modelo}
              </p>
            </div>
          </div>

          {/* Info and Actions */}
          <div className="w-full md:w-72 shrink-0 flex flex-col gap-6">
            <div className="bg-white/5 rounded-xl p-4 space-y-3">
              <h4 className="text-white font-semibold">Informações</h4>
              <div className="text-sm">
                <label className="block text-gray-400">Cliente</label>
                <p className="text-white">{certificate.cliente}</p>
              </div>
              <div className="text-sm">
                <label className="block text-gray-400">OS Vinculada</label>
                <p className="text-white">{certificate.osId}</p>
              </div>
              <div className="text-sm">
                <label className="block text-gray-400">Técnico</label>
                <p className="text-white">{certificate.tecnico}</p>
              </div>
              <div className="text-sm">
                <label className="block text-gray-400">Data de Emissão</label>
                <p className="text-white">{new Date(certificate.dataEmissao).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-4 space-y-3">
              <h4 className="text-white font-semibold">Ações</h4>
              <Button onClick={() => handleAction('Download')} variant="outline" className="w-full justify-start border-white/20 text-white hover:bg-white/10">
                <Download className="w-4 h-4 mr-2" /> Baixar PDF
              </Button>
              <Button onClick={() => handleAction('Compartilhar')} variant="outline" className="w-full justify-start border-white/20 text-white hover:bg-white/10">
                <Share2 className="w-4 h-4 mr-2" /> Compartilhar
              </Button>
              <Button onClick={() => handleAction('Imprimir')} variant="outline" className="w-full justify-start border-white/20 text-white hover:bg-white/10">
                <Printer className="w-4 h-4 mr-2" /> Imprimir
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CertificateDetails;