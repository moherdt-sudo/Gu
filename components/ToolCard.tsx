
import React from 'react';
import { ToolItem } from '../types';

interface ToolCardProps {
  tool: ToolItem;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  return (
    <div className="group bg-white rounded-2xl border border-slate-200 p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative flex flex-col h-full">
      {/* Badges */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
        {tool.isNew && (
          <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
            Nouveau
          </span>
        )}
        {tool.isTopDeal && (
          <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
            Top Deal
          </span>
        )}
      </div>

      <div className="flex items-start space-x-4 mb-4">
        <img 
          src={tool.logo} 
          alt={tool.name} 
          className="w-14 h-14 rounded-xl object-cover border border-slate-100 shadow-sm"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
            {tool.name}
          </h3>
          <p className="text-xs font-medium text-slate-500 flex items-center gap-1">
            <span>via</span>
            <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 uppercase tracking-tighter font-bold">
              {tool.source}
            </span>
          </p>
        </div>
      </div>

      <p className="text-sm text-slate-600 line-clamp-3 mb-4 flex-grow">
        {tool.description}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {tool.tags.map(tag => (
          <span key={tag} className="text-[10px] bg-slate-50 text-slate-500 border border-slate-100 px-2 py-0.5 rounded-full">
            #{tag}
          </span>
        ))}
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
        <div>
          {tool.promoPrice ? (
            <div className="flex flex-col">
              <span className="text-xs text-slate-400 line-through leading-none mb-1">{tool.price}</span>
              <span className="text-lg font-bold text-indigo-600 leading-none">{tool.promoPrice}</span>
            </div>
          ) : tool.discountValue ? (
            <span className="text-lg font-bold text-green-600">{tool.discountValue}</span>
          ) : tool.askedPrice ? (
             <span className="text-lg font-bold text-blue-600">{tool.askedPrice}</span>
          ) : (
            <span className="text-lg font-bold text-slate-900">{tool.price}</span>
          )}
        </div>
        
        <a
          href={tool.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
        >
          Voir l'offre
          <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default ToolCard;
