
import React, { useState, useRef } from 'react';
import Banner from './components/Banner';
import ServiceRow from './components/ServiceRow';
import ReceiptPreview from './components/ReceiptPreview';
import { QuoteData, ServiceItem } from './types';
import { formatBRL } from './utils/formatters';

// Dynamic library loader
const getPDFLibraries = async () => {
  const [jspdf, html2canvas] = await Promise.all([
    import('https://esm.sh/jspdf'),
    import('https://esm.sh/html2canvas')
  ]);
  return { jsPDF: jspdf.jsPDF, html2canvas: html2canvas.default };
};

const App: React.FC = () => {
  const [data, setData] = useState<QuoteData>({
    providerName: '',
    providerWhatsApp: '',
    pixKey: '',
    clientName: '',
    services: [{ id: Math.random().toString(36).substr(2, 9), description: '', price: 0 }]
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  const addService = () => {
    setData(prev => ({
      ...prev,
      services: [...prev.services, { id: Math.random().toString(36).substr(2, 9), description: '', price: 0 }]
    }));
  };

  const removeService = (id: string) => {
    if (data.services.length === 1) return;
    setData(prev => ({
      ...prev,
      services: prev.services.filter(s => s.id !== id)
    }));
  };

  const updateService = (id: string, field: keyof ServiceItem, value: any) => {
    setData(prev => ({
      ...prev,
      services: prev.services.map(s => s.id === id ? { ...s, [field]: value } : s)
    }));
  };

  const total = data.services.reduce((acc, curr) => acc + (curr.price || 0), 0);

  const generatePDFBlob = async (): Promise<Blob | null> => {
    if (!receiptRef.current) return null;
    try {
      const { jsPDF, html2canvas } = await getPDFLibraries();
      const canvas = await html2canvas(receiptRef.current, {
        scale: 3, // Higher scale for professional look
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width / 3, canvas.height / 3]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 3, canvas.height / 3);
      return pdf.output('blob');
    } catch (error) {
      console.error('Error generating PDF:', error);
      return null;
    }
  };

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    const blob = await generatePDFBlob();
    if (blob) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Recibo_${data.clientName || 'TonCota'}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    }
    setIsGenerating(false);
  };

  const handleShareWhatsApp = async () => {
    setIsGenerating(true);
    
    // Formatting precisely as requested
    const message = `ORÇAMENTO - ${data.providerName || 'Prestador'}
Olá ${data.clientName || 'Cliente'}, aqui está o resumo do seu orçamento:

💰 Valor Total: ${formatBRL(total)}
${data.pixKey ? `🔑 Chave Pix: ${data.pixKey}` : ''}

Por favor, aguarde que vou lhe enviar o PDF detalhado em seguida.

Gerado via Ton Cota`.trim();

    const blob = await generatePDFBlob();

    // Check for native sharing (Mobile)
    if (blob && navigator.share && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      try {
        const file = new File([blob], 'Orcamento_TonCota.pdf', { type: 'application/pdf' });
        await navigator.share({
          files: [file],
          text: message,
          title: 'Seu Orçamento'
        });
      } catch (e) {
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
      }
    } else {
      // Fallback: Download file and open WhatsApp link
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Orcamento_TonCota.pdf`;
        link.click();
        URL.revokeObjectURL(url);
      }
      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    }
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#1d1d1d]">
      <Banner />
      
      <main className="flex-grow p-4 md:p-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Form Side */}
          <div className="space-y-8">
            <header className="mb-4">
              <h1 className="text-4xl font-black text-white flex items-center gap-2">
                <span className="text-[#00c868]">Ton</span>Cota
              </h1>
              <p className="text-gray-400 font-medium">Crie e envie orçamentos profissionais na hora.</p>
            </header>

            <section className="bg-[#242424] p-6 rounded-2xl border border-gray-800 shadow-2xl space-y-4">
              <div className="flex items-center gap-2 text-[#00c868] font-bold uppercase text-xs tracking-wider mb-2">
                <div className="w-2 h-2 rounded-full bg-[#00c868]"></div>
                Seus Dados
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-gray-500 font-bold uppercase">Nome do Prestador</label>
                  <input
                    type="text"
                    value={data.providerName}
                    onChange={(e) => setData(p => ({ ...p, providerName: e.target.value }))}
                    placeholder="Seu Nome"
                    className="w-full bg-[#1d1d1d] border border-gray-800 text-white rounded-xl p-3 focus:ring-2 focus:ring-[#00c868] outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-500 font-bold uppercase">WhatsApp (Apenas números)</label>
                  <input
                    type="tel"
                    value={data.providerWhatsApp}
                    onChange={(e) => setData(p => ({ ...p, providerWhatsApp: e.target.value }))}
                    placeholder="11999999999"
                    className="w-full bg-[#1d1d1d] border border-gray-800 text-white rounded-xl p-3 focus:ring-2 focus:ring-[#00c868] outline-none transition-all"
                  />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs text-gray-500 font-bold uppercase">Chave Pix</label>
                  <input
                    type="text"
                    value={data.pixKey}
                    onChange={(e) => setData(p => ({ ...p, pixKey: e.target.value }))}
                    placeholder="CPF, E-mail ou Aleatória"
                    className="w-full bg-[#1d1d1d] border border-gray-800 text-white rounded-xl p-3 focus:ring-2 focus:ring-[#00c868] outline-none transition-all"
                  />
                </div>
              </div>
            </section>

            <section className="bg-[#242424] p-6 rounded-2xl border border-gray-800 shadow-2xl space-y-4">
              <div className="flex items-center gap-2 text-[#00c868] font-bold uppercase text-xs tracking-wider mb-2">
                <div className="w-2 h-2 rounded-full bg-[#00c868]"></div>
                Dados do Cliente
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-500 font-bold uppercase">Nome do Cliente</label>
                <input
                  type="text"
                  value={data.clientName}
                  onChange={(e) => setData(p => ({ ...p, clientName: e.target.value }))}
                  placeholder="Nome de quem vai pagar"
                  className="w-full bg-[#1d1d1d] border border-gray-800 text-white rounded-xl p-3 focus:ring-2 focus:ring-[#00c868] outline-none transition-all"
                />
              </div>
            </section>

            <section className="bg-[#242424] p-6 rounded-2xl border border-gray-800 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2 text-[#00c868] font-bold uppercase text-xs tracking-wider">
                  <div className="w-2 h-2 rounded-full bg-[#00c868]"></div>
                  Serviços
                </div>
                <button
                  onClick={addService}
                  className="text-[#00c868] text-xs font-black uppercase hover:opacity-80 transition-all"
                >
                  + Add Serviço
                </button>
              </div>
              
              <div className="space-y-4">
                {data.services.map((item) => (
                  <ServiceRow 
                    key={item.id} 
                    item={item} 
                    onUpdate={updateService} 
                    onRemove={removeService} 
                  />
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-800 flex justify-between items-center">
                <div className="text-gray-500 font-bold uppercase text-sm">Total Geral</div>
                <div className="text-3xl font-black text-[#00c868]">{formatBRL(total)}</div>
              </div>
            </section>

            <div className="flex flex-col md:flex-row gap-4 pt-4">
              <button
                disabled={isGenerating}
                onClick={handleShareWhatsApp}
                className="flex-1 bg-[#00c868] text-black font-black py-5 rounded-2xl hover:bg-[#00e075] transition-all flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(0,200,104,0.2)]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                </svg>
                {isGenerating ? 'PROCESSANDO...' : 'ENVIAR NO ZAP'}
              </button>
              <button
                disabled={isGenerating}
                onClick={handleDownloadPDF}
                className="md:w-48 bg-[#333] text-white font-bold py-5 rounded-2xl hover:bg-[#444] transition-all flex items-center justify-center gap-2"
              >
                {isGenerating ? '...' : 'BAIXAR PDF'}
              </button>
            </div>
          </div>

          {/* Preview Side */}
          <div className="flex justify-center lg:justify-start">
            <ReceiptPreview data={data} receiptRef={receiptRef} />
          </div>
          
        </div>
      </main>

      <footer className="py-12 px-4 text-center border-t border-gray-900 mt-20">
        <p className="text-gray-600 text-xs font-bold uppercase tracking-widest">
          Gerado via Ton Cota • 2024
        </p>
      </footer>
    </div>
  );
};

export default App;
