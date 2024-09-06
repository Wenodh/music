import { useEffect, useState } from 'react';
import Modal from './components/Modal';
import { Button } from '@/components/ui/button';
declare global {
        interface Window {
          wb: ServiceWorker | null;
        }
      }

const PwaUpdater = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onConfirmActivate = () => {
    if (window.wb) {
      // Send a message to the service worker to skip waiting
      window.wb.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  useEffect(() => {
    // Listen for the custom event to show the updater
    const onUpdateAvailable = () => {
      setIsOpen(true);
    };

    window.addEventListener('pwa-update-available', onUpdateAvailable);

    return () => {
      window.removeEventListener('pwa-update-available', onUpdateAvailable);
    };
  }, []);

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} heading="New version available!">
      <div className="mb-4">
        Hey, a new version is available! Please click below to update.
      </div>
      <Button onClick={onConfirmActivate}>Reload and update</Button>
      <Button className="ml-2" onClick={() => setIsOpen(false)}>Cancel</Button>
    </Modal>
  );
};

export default PwaUpdater;
