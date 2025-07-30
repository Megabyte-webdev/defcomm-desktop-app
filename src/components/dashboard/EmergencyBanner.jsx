import { useState } from 'react';
import Modal from '../modal/Modal';

function EmergencyBanner() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleExploreClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-oliveGreen text-gray-900 p-6 min-h-64 flex flex-col md:flex-row md:flex-wrap justify-between gap-2">
      <div className="flex-1 flex flex-col md:w-1/2 gap-2 justify-between">
        <h2 className="text-xl md:text-2xl font-bold flex items-center space-x-2">
          <span>DEFCOMM Presentation With Nigeria Army Signal Corp Lagos</span>
        </h2>
        <p className="text-sm opacity-70 font-medium max-w-[90%]">
          The presentation scheduled for April 22, 2025, is confirmed at 11:00 AM, and a notification has been sent accordingly.
        </p>
        <button
          onClick={handleExploreClick}
          className="bg-gray-900 text-white/70 px-4 py-2 mt-4 w-max"
        >
          Explore Now
        </button>
      </div>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} closeModal={handleCloseModal}>
          <div className="max-w-[600px] p-4 space-y-4 text-gray-800 bg-white">
            <h3 className="text-xl font-bold">
              Defcomm Unveils Innovative End-to-End Encryption System to Nigerian Army Signal Corps
            </h3>
            <p className="text-sm">
              Defcomm will be officially presenting its groundbreaking end-to-end Encryption System to the Nigerian Army Signal Corps,
              marking a major step forward in secure military communications.
            </p>
            <p className="text-sm">
              Designed with military-grade encryption protocols, the end-to-end system ensures full-spectrum protection for voice, data,
              and digital transmissions—offering end-to-end security with enhanced speed, reliability, and resilience against modern cyber threats.
            </p>
            <p className="text-sm">
              During the presentation, Defcomm’s technical team will demonstrate the system’s capabilities, highlighting real-time secure messaging,
              encrypted data transfer, and seamless integration with existing military infrastructure.
            </p>
            <p className="text-sm">
              Defcomm remains committed to supporting national defense with cutting-edge communication solutions built for the challenges of today and the future.
            </p>
            
          </div>
        </Modal>
      )}
    </div>
  );
}

export default EmergencyBanner;
