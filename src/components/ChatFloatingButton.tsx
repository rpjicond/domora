import React from 'react';
import { MessageSquare } from 'lucide-react';

interface ChatFloatingButtonProps {
  onClick: () => void;
}

export const ChatFloatingButton: React.FC<ChatFloatingButtonProps> = ({ onClick }) => {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 99999,
      }}
      className="select-none print:hidden pointer-events-auto"
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
          backgroundColor: '#0084ff',
          boxShadow: '0 8px 25px rgba(0, 132, 255, 0.45)',
          zIndex: 99999,
        }}
        className="relative flex items-center justify-center text-white cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none"
      >
        <MessageSquare className="w-6 h-6 fill-current text-white" />

        {/* Coral/Orange notification dot in top-right */}
        <span
          style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            width: '12px',
            height: '12px',
            backgroundColor: '#ff4d4f',
            borderRadius: '9999px',
            border: '2px solid #ffffff',
          }}
        />
      </button>
    </div>
  );
};
