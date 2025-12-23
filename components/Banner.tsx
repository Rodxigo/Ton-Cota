
import React from 'react';

const Banner: React.FC = () => {
  const AFFILIATE_LINK = "https://ton.com.br/checkout/cart/?coupon=RODRIGOGUIMARAES10&productId=TONBLACK_TIER_SMART_POS&userAnticipation=0&userTag=tonblack_tier&utm_medium=invite_share&utm_source=revendedor";

  return (
    <div className="sticky top-0 z-50 bg-[#00c868] py-3 px-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-black font-bold text-center md:text-left text-sm md:text-base">
          Dica: Pague menos taxas! Maquininha com 73% de desconto e garantia vitalícia.
        </p>
        <a 
          href={AFFILIATE_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-black text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-800 transition-colors whitespace-nowrap"
        >
          Pegar Desconto
        </a>
      </div>
    </div>
  );
};

export default Banner;
