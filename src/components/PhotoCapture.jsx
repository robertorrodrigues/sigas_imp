import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Camera, Upload, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const PhotoCapture = ({ onClose, onSave, itemId }) => {
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [photoMetadata, setPhotoMetadata] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Verificar se é JPEG
      if (!file.type.includes('jpeg') && !file.type.includes('jpg')) {
        toast({
          title: "Formato inválido",
          description: "Por favor, selecione apenas arquivos JPEG.",
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const photoData = {
          file: file,
          dataUrl: event.target.result,
          metadata: {
            timestamp: new Date().toISOString(),
            filename: file.name,
            size: file.size,
            type: file.type,
            // Simular GPS (em produção seria obtido via navigator.geolocation)
            gps: {
              latitude: -23.5505 + (Math.random() - 0.5) * 0.01,
              longitude: -46.6333 + (Math.random() - 0.5) * 0.01,
              accuracy: Math.floor(Math.random() * 10) + 5
            },
            itemId: itemId,
            osId: 'OS-2024-001' // Em produção seria passado como prop
          }
        };
        
        setCapturedPhoto(photoData);
        setPhotoMetadata(photoData.metadata);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePhoto = () => {
    if (capturedPhoto) {
      onSave(capturedPhoto);
    }
  };

  const simulateCamera = () => {
    // Simular captura de câmera
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    
    // Criar uma imagem simulada
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 640, 480);
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(50, 50, 540, 380);
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Foto Simulada da Inspeção', 320, 240);
    ctx.font = '16px Arial';
    ctx.fillText(`Item: ${itemId}`, 320, 280);
    ctx.fillText(new Date().toLocaleString(), 320, 320);

    canvas.toBlob((blob) => {
      const file = new File([blob], `inspecao_${itemId}_${Date.now()}.jpg`, { type: 'image/jpeg' });
      const photoData = {
        file: file,
        dataUrl: canvas.toDataURL('image/jpeg'),
        metadata: {
          timestamp: new Date().toISOString(),
          filename: file.name,
          size: file.size,
          type: file.type,
          gps: {
            latitude: -23.5505 + (Math.random() - 0.5) * 0.01,
            longitude: -46.6333 + (Math.random() - 0.5) * 0.01,
            accuracy: Math.floor(Math.random() * 10) + 5
          },
          itemId: itemId,
          osId: 'OS-2024-001'
        }
      };
      
      setCapturedPhoto(photoData);
      setPhotoMetadata(photoData.metadata);
    }, 'image/jpeg', 0.8);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 w-full max-w-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Capturar Foto</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {!capturedPhoto ? (
            <div className="space-y-4">
              <div className="bg-white/5 rounded-xl p-6 text-center">
                <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-white mb-4">Capture uma foto para o item {itemId}</p>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={simulateCamera}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Simular Câmera
                  </Button>
                  
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload JPEG
                  </Button>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                <p className="text-yellow-300 text-sm">
                  <strong>Importante:</strong> A foto deve ser em formato JPEG e será automaticamente 
                  marcada com timestamp, GPS e vinculada ao item do checklist.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Photo Preview */}
              <div className="bg-white/5 rounded-xl p-4">
                <img
                  src={capturedPhoto.dataUrl}
                  alt="Foto capturada"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>

              {/* Metadata */}
              <div className="bg-white/5 rounded-xl p-4">
                <h4 className="text-white font-semibold mb-3">Metadados da Foto</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-300">
                      <Clock className="w-4 h-4 mr-2" />
                      {new Date(photoMetadata.timestamp).toLocaleString()}
                    </div>
                    <div className="flex items-center text-gray-300">
                      <MapPin className="w-4 h-4 mr-2" />
                      {photoMetadata.gps.latitude.toFixed(6)}, {photoMetadata.gps.longitude.toFixed(6)}
                    </div>
                  </div>
                  <div className="space-y-2 text-gray-300">
                    <div>Arquivo: {photoMetadata.filename}</div>
                    <div>Tamanho: {(photoMetadata.size / 1024).toFixed(1)} KB</div>
                    <div>Item: {photoMetadata.itemId}</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  onClick={() => setCapturedPhoto(null)}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Capturar Novamente
                </Button>
                <Button
                  onClick={handleSavePhoto}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                >
                  Salvar Foto
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default PhotoCapture;