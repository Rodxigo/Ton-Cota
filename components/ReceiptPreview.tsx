
import React from 'react';
import { QuoteData } from '../types';
import { formatBRL, cleanWhatsAppNumber } from '../utils/formatters';

interface ReceiptPreviewProps {
  data: QuoteData;
  receiptRef: React.RefObject<HTMLDivElement>;
}

const ReceiptPreview: React.FC<ReceiptPreviewProps> = ({ data, receiptRef }) => {
  const total = data.services.reduce((acc, curr) => acc + (curr.price || 0), 0);

  return (
    <div className="flex flex-col items-center w-full max-w-[440px] sticky top-28">
      <div className="text-[#00c868] text-[10px] font-black uppercase tracking-[0.3em] mb-4">
        Visualização em tempo real
      </div>
      
      <div 
        ref={receiptRef}
        className="receipt-paper w-full min-h-[600px] p-10 flex flex-col text-black rounded-sm"
      >
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-1">Recibo de Pagamento</h2>
          <div className="h-1 w-12 bg-black mx-auto mb-4"></div>
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">Digital Service</p>
        </div>

        {/* Info Grid */}
        <div className="space-y-8 mb-10">
          <div>
            <p className="text-[9px] text-gray-400 font-black uppercase mb-1">Prestador</p>
            <p className="text-lg font-black tracking-tight leading-none uppercase">
              {data.providerName || "Seu Nome Aqui"}
            </p>
            {data.pixKey && (
              <p className="text-sm font-medium mt-1">
                <span className="text-gray-400">Pix:</span> {data.pixKey}
              </p>
            )}
          </div>

          <div className="pt-4 border-t border-gray-100">
            <p className="text-[9px] text-gray-400 font-black uppercase mb-1">Cliente</p>
            <p className="text-lg font-black tracking-tight leading-none uppercase">
              {data.clientName || "Nome do Cliente"}
            </p>
          </div>
        </div>

        {/* Services Table */}
        <div className="flex-grow">
          <p className="text-[9px] text-gray-400 font-black uppercase mb-3">Detalhamento</p>
          <div className="space-y-4">
            {data.services.map((service, idx) => (
              <div key={service.id} className="flex justify-between items-start gap-4 pb-2 border-b border-gray-50">
                <div className="text-sm font-bold uppercase tracking-tight leading-tight">
                  {service.description || `Serviço Extra #${idx + 1}`}
                </div>
                <div className="text-sm font-black whitespace-nowrap">
                  {formatBRL(service.price)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer / Total */}
        <div className="mt-12">
          <div className="flex justify-between items-end border-t-2 border-black pt-6">
            <div className="text-[10px] font-black uppercase mb-1">Valor Total</div>
            <div className="text-4xl font-black text-[#00c868] tracking-tighter">
              {formatBRL(total)}
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-100 text-center">
            {data.providerWhatsApp && (
              <a 
                href={`https://wa.me/${cleanWhatsAppNumber(data.providerWhatsApp)}`}
                className="inline-block px-6 py-2 border-2 border-black text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all"
              >
                Falar com {data.providerName?.split(' ')[0] || "Prestador"}
              </a>
            )}
            <p className="text-[8px] text-gray-300 font-bold uppercase mt-6 tracking-[0.2em]">
              Autenticado via Ton Cota
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptPreview;
