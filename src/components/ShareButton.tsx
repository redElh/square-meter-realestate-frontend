// src/components/ShareButton.tsx
import React, { useState, useEffect, useRef } from 'react';
import { ShareIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

interface ShareButtonProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
  iconClassName?: string;
  variant?: 'icon' | 'button';
  buttonText?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({
  url,
  title,
  description = '',
  className = '',
  iconClassName = 'w-5 h-5',
  variant = 'icon',
  buttonText = 'Partager',
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isOutsideContainer = containerRef.current && !containerRef.current.contains(event.target as Node);
      const isOutsideDropdown = dropdownMenuRef.current && !dropdownMenuRef.current.contains(event.target as Node);
      
      if (isOutsideContainer && isOutsideDropdown) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  // Close dropdown on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) setIsOpen(false);
    };

    if (isOpen) {
      window.addEventListener('scroll', handleScroll, true);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen]);

  // Reset copied state when dropdown closes
  useEffect(() => {
    if (!isOpen && copied) {
      const timer = setTimeout(() => setCopied(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, copied]);

  const handleShareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isOpen && buttonRef.current) {
      // Calculate dropdown position
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownWidth = 256; // w-64 = 16rem = 256px
      const dropdownHeight = 400; // approximate height
      const margin = 8; // mt-2 = 0.5rem = 8px
      
      // Position below the button, aligned to the right
      let top = rect.bottom + margin;
      let left = rect.right - dropdownWidth;
      
      // Adjust if dropdown would go off-screen
      if (left < 10) left = 10; // min 10px from left edge
      if (left + dropdownWidth > window.innerWidth - 10) {
        left = window.innerWidth - dropdownWidth - 10;
      }
      if (top + dropdownHeight > window.innerHeight - 10) {
        // Position above the button if no room below
        top = rect.top - dropdownHeight - margin;
      }
      
      setDropdownPosition({ top, left });
    }
    
    setIsOpen(!isOpen);
  };

  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
    setIsOpen(false);
  };

  const shareToLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedInUrl, '_blank', 'width=600,height=600');
    setIsOpen(false);
  };

  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
    setIsOpen(false);
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(title);
    const body = encodeURIComponent(`${description}\n\n${url}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    setIsOpen(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => {
        setIsOpen(false);
      }, 1500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: url,
        });
        setIsOpen(false);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      {variant === 'icon' ? (
        <button
          ref={buttonRef}
          onClick={handleShareClick}
          className={className || 'p-2 text-gray-400 hover:text-[#023927] transition-colors duration-300'}
          aria-label={t('mag.share.title')}
        >
          <ShareIcon className={iconClassName} />
        </button>
      ) : (
        <button
          ref={buttonRef}
          onClick={handleShareClick}
          className={className || 'inline-flex items-center gap-2 px-4 py-2 bg-[#023927] text-white hover:bg-[#023927]/90 transition-colors duration-300 font-inter text-sm'}
        >
          <ShareIcon className={iconClassName} />
          {buttonText}
        </button>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          ref={dropdownMenuRef}
          className="fixed w-64 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden"
          style={{ 
            top: `${dropdownPosition.top}px`, 
            left: `${dropdownPosition.left}px`,
            zIndex: 9999 
          }}
        >
          <div className="p-3 border-b border-gray-100 flex items-center justify-between">
            <span className="font-inter text-sm font-medium text-gray-900">{t('mag.share.title')}</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={t('mag.share.close')}
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="p-2">
            {/* Facebook */}
            <button
              onClick={shareToFacebook}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-gray-50 rounded-md transition-colors group"
            >
              <div className="w-8 h-8 bg-[#1877F2] rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
              <span className="font-inter text-sm text-gray-700 group-hover:text-gray-900">{t('mag.share.facebook')}</span>
            </button>

            {/* LinkedIn */}
            <button
              onClick={shareToLinkedIn}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-gray-50 rounded-md transition-colors group"
            >
              <div className="w-8 h-8 bg-[#0A66C2] rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </div>
              <span className="font-inter text-sm text-gray-700 group-hover:text-gray-900">{t('mag.share.linkedin')}</span>
            </button>

            {/* Twitter */}
            <button
              onClick={shareToTwitter}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-gray-50 rounded-md transition-colors group"
            >
              <div className="w-8 h-8 bg-[#1DA1F2] rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </div>
              <span className="font-inter text-sm text-gray-700 group-hover:text-gray-900">{t('mag.share.twitter')}</span>
            </button>

            {/* Email */}
            <button
              onClick={shareViaEmail}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-gray-50 rounded-md transition-colors group"
            >
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="font-inter text-sm text-gray-700 group-hover:text-gray-900">{t('mag.share.email')}</span>
            </button>

            <div className="my-2 border-t border-gray-100" />

            {/* Copy Link */}
            <button
              onClick={copyToClipboard}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-gray-50 rounded-md transition-colors group"
            >
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <span className="font-inter text-sm text-gray-700 group-hover:text-gray-900">
                {copied ? t('mag.share.copied') : t('mag.share.copyLink')}
              </span>
            </button>

            {/* Native Share (if available) */}
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                onClick={shareNative}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-gray-50 rounded-md transition-colors group"
              >
                <div className="w-8 h-8 bg-[#023927] rounded-full flex items-center justify-center flex-shrink-0">
                  <ShareIcon className="w-4 h-4 text-white" />
                </div>
                <span className="font-inter text-sm text-gray-700 group-hover:text-gray-900">{t('mag.share.moreOptions')}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareButton;
