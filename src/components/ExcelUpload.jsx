import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, FileSpreadsheet, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const ExcelUpload = ({ onClose, onUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file) => {
    if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
        file.type === 'application/vnd.ms-excel') {
      setFile(file);
    } else {
      toast({
        title: "Formato inválido",
        description: "Por favor, selecione um arquivo Excel (.xlsx ou .xls)",
        variant: "destructive"
      });
    }
  };

  const handleUpload = () => {
    if (file) {
      onUpload(file);
    }
  };

  const downloadTemplate = () => {
    toast({
      title: "🚧 Esta funcionalidade não está implementada ainda—mas não se preocupe! Você pode solicitá-la no seu próximo prompt! 🚀"
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 w-full max-w-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Importar Pedidos Excel</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <FileSpreadsheet className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-white font-medium">Template Excel</p>
                <p className="text-gray-300 text-sm">Baixe o modelo para importação</p>
              </div>
            </div>
            <Button
              onClick={downloadTemplate}
              variant="outline"
              className="mt-3 border-blue-500/20 text-blue-400 hover:bg-blue-500/10"
            >
              <Download className="w-4 h-4 mr-2" />
              Baixar Template
            </Button>
          </div>

          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              dragActive 
                ? 'border-blue-500 bg-blue-500/10' 
                : 'border-white/20 hover:border-white/40'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-white mb-2">
              {file ? file.name : 'Arraste o arquivo Excel aqui'}
            </p>
            <p className="text-gray-400 text-sm mb-4">
              ou clique para selecionar
            </p>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileInput}
              className="hidden"
              id="excel-upload"
            />
            <label
              htmlFor="excel-upload"
              className="cursor-pointer inline-block px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
            >
              Selecionar Arquivo
            </label>
          </div>

          {file && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <FileSpreadsheet className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-white font-medium">{file.name}</p>
                  <p className="text-gray-300 text-sm">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!file}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50"
            >
              <Upload className="w-4 h-4 mr-2" />
              Importar
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ExcelUpload;