import React from 'react';
import ReactDOM from 'react-dom/client';
import Landing from './pages/Landing.jsx';
import './index.css';

const injectAnalytics = () => {
  const gtmId = import.meta.env.VITE_GTM_ID;
  const ga4Id = import.meta.env.VITE_GA4_ID;

  if (gtmId && !document.getElementById('gtm-init')) {
    const gtmScript = document.createElement('script');
    gtmScript.id = 'gtm-init';
    gtmScript.innerHTML = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${gtmId}');
    `;
    document.head.appendChild(gtmScript);
  }

  if (ga4Id && !document.getElementById('ga4-init')) {
    const gaScript = document.createElement('script');
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`;
    gaScript.async = true;
    document.head.appendChild(gaScript);

    const gaInline = document.createElement('script');
    gaInline.id = 'ga4-init';
    gaInline.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${ga4Id}');
    `;
    document.head.appendChild(gaInline);
  }
};

document.addEventListener('DOMContentLoaded', injectAnalytics);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Landing />
  </React.StrictMode>
);
