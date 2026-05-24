import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import Modal from './Modal';
import Button from './Button';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type?: 'danger' | 'warning' | 'info';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'danger'
}) => {
  const colors = {
    danger: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="text-center">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${colors[type]} mb-4`}>
          <FiAlertTriangle className="w-8 h-8" />
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
        <div className="flex gap-3 justify-center">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant={type === 'danger' ? 'danger' : 'primary'} onClick={onConfirm}>
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;