import React, { useEffect, useRef, useState } from 'react';
import WebViewer from '@pdftron/webviewer';
import { useParams } from 'react-router-dom';
import SEOHelmet from '../engine/SEOHelmet';

const DeffViewer = () => {
  const { fileUrl } = useParams();
  const decodedFileUrl = fileUrl ? atob(fileUrl) : null;
  const isProduction = import.meta.env.VITE_PROD ?? false;
  const viewerRef = useRef(null);
  const instanceRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const initializeViewer = async () => {
      if (!viewerRef.current || instanceRef.current) return;

      try {
        const config = {
          path: '/lib/webviewer',
          licenseKey: import.meta.env.VITE_VIEWER_LICENSE_KEY,
        };

        if (decodedFileUrl) {
          config.initialDoc = isProduction
            ? `${import.meta.env.VITE_BASE_URL}secure/${decodedFileUrl}`
            : `/secure/${decodedFileUrl}`; // still works locally via Vite proxy
        } else {
          config.enableOfficeEditing = true;
        }

        const instance = await WebViewer(config, viewerRef.current);

        if (!cancelled) {
          instanceRef.current = instance;
          console.log(instance);

          const { documentViewer } = instance.Core;

          documentViewer.setWatermark({
            diagonal: {
              fontSize: 70,
              fontFamily: 'sans-serif',
              color: '#36460A',
              opacity: 20,
              text: 'Deffcomm',
            },
          });

          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError('Failed to load viewer');
          setLoading(false);
        }
      }
    };

    initializeViewer();

    return () => {
      cancelled = true;

      if (viewerRef.current) {
        while (viewerRef.current.firstChild) {
          viewerRef.current.removeChild(viewerRef.current.firstChild);
        }
      }

      instanceRef.current = null;
    };
  }, [decodedFileUrl]);

  return (
    <div className="w-full h-[80vh] relative">
      {/* SEO Content */}
      <SEOHelmet title="Deffcomm File" />
      {loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
          <span className="text-gray-600 font-medium">Loading document...</span>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-100 z-10">
          <span className="text-red-600 font-medium">{error}</span>
        </div>
      )}
      <div className="webviewer w-full h-full" ref={viewerRef}></div>
    </div>
  );
};

export default DeffViewer;
