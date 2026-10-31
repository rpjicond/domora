import React from 'react';
import { MessageSquare } from 'lucide-react';

interface ChatFloatingButtonProps {
  onClick: () => void;
}

export const ChatFloatingButton: React.FC<ChatFloatingButtonProps> = ({ onClick }) => {
  return (
    <div
      className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 select-none print:hidden pointer-events-auto"
    >
      <button
        type="button"
        onClick={onClick}
        aria-label="Abrir Chat de Atendimento"
        title="Falar com um Consultor"
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '9999px',
          backgroundColor: '#0c241b',
          boxShadow: '0 8px 25px rgba(12, 36, 27, 0.4)',
          zIndex: 99999,
        }}
        className="relative flex items-center justify-center text-white cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none border-2 border-[#10b981]/40"
      >
        <MessageSquare className="w-6 h-6 fill-current text-white" />

        {/* Amber/Gold notification dot */}
        <span
          style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            width: '12px',
            height: '12px',
            backgroundColor: '#f59e0b',
            borderRadius: '9999px',
            border: '2px solid #ffffff',
          }}
        />
      </button>
    </div>
  );
};
