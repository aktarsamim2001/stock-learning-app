import React from 'react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
  title?: string;
}

const socialLinks = [
  {
    name: 'Facebook',
    url: (shareUrl: string, title: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    color: 'bg-blue-600',
  },
  {
    name: 'Twitter',
    url: (shareUrl: string, title: string) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`,
    color: 'bg-blue-400',
  },
  {
    name: 'WhatsApp',
    url: (shareUrl: string, title: string) => `https://wa.me/?text=${encodeURIComponent(title + ' ' + shareUrl)}`,
    color: 'bg-green-500',
  },
];

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, shareUrl, title = '' }) => {
  if (!isOpen) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xs relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800">✕</button>
        <h2 className="text-xl font-bold mb-4 text-center">Share this course</h2>
        <div className="flex flex-col gap-3 mb-4">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.url(shareUrl, title)}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full py-2 rounded-lg text-white text-center font-medium ${social.color} hover:opacity-90`}
            >
              Share on {social.name}
            </a>
          ))}
          <button
            onClick={handleCopy}
            className="w-full py-2 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300"
          >
            Copy Link
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
