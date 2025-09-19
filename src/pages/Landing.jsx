import { useEffect } from 'react';
import Header from '../components/Header.jsx';
import Hero from '../components/Hero.jsx';
import Services from '../components/Services/Services.jsx';
import Advantages from '../components/Advantages/Advantages.jsx';
import Pricing from '../components/Pricing/Pricing.jsx';
import Faq from '../components/FAQ/Faq.jsx';
import Contact from '../components/Contact/Contact.jsx';
import Footer from '../components/Footer.jsx';
import FloatingWhatsAppButton from '../components/FloatingWhatsAppButton.jsx';
import { site } from '../config/site.js';

const metaConfig = [
  { name: 'description', content: site.seo.description },
  { property: 'og:title', content: site.seo.title },
  { property: 'og:description', content: site.seo.description },
  { property: 'og:url', content: site.seo.url },
  { property: 'og:image', content: site.seo.image },
  { name: 'twitter:title', content: site.seo.title },
  { name: 'twitter:description', content: site.seo.description },
  { name: 'twitter:image', content: site.seo.image },
];

export default function Landing() {
  useEffect(() => {
    document.title = site.seo.title;

    const ensureMeta = (key, value, attr = 'name') => {
      let element = document.head.querySelector(`meta[${attr}='${key}']`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', value);
    };

    metaConfig.forEach((meta) => {
      if (meta.name) {
        ensureMeta(meta.name, meta.content, 'name');
      }
      if (meta.property) {
        ensureMeta(meta.property, meta.content, 'property');
      }
    });

    let canonical = document.head.querySelector("link[rel='canonical']");
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', site.seo.url);
  }, []);

  return (
    <div className="relative min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <Services />
        <Advantages />
        <Pricing />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsAppButton />
    </div>
  );
}
