
import React from 'react';
import { ServiceItem } from '../types';

interface ServiceRowProps {
  item: ServiceItem;
  onUpdate: (id: string, field: keyof ServiceItem, value: any) => void;
  onRemove: (id: string) => void;
}

const ServiceRow: React.FC<ServiceRowProps> = ({ item, onUpdate, onRemove }) => {
  return (
    <div className="flex gap-3 items-end group">
      <div className="flex-grow space-y-1">
        <input
          type="text"
          value={item.description}
          onChange={(e) => onUpdate(item.id, 'description', e.target.value)}
          placeholder="Descrição do serviço..."
          className="w-full bg-[#1d1d1d] border border-gray-800 text-white rounded-xl p-3 focus:ring-1 focus:ring-[#00c868] outline-none transition-all text-sm"
        />
      </div>
      <div className="w-24 md:w-32 space-y-1">
        <input
          type="number"
          value={item.price || ''}
          onChange={(e) => onUpdate(item.id, 'price', parseFloat(e.target.value) || 0)}
          placeholder="0,00"
          className="w-full bg-[#1d1d1d] border border-gray-800 text-white rounded-xl p-3 focus:ring-1 focus:ring-[#00c868] outline-none transition-all text-sm font-bold"
        />
      </div>
      <button
        onClick={() => onRemove(item.id)}
        className="p-3 text-gray-600 hover:text-red-500 transition-colors"
        title="Remover"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
          <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
        </svg>
      </button>
    </div>
  );
};

export default ServiceRow;
