import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import QRCode from 'react-qr-code';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Download, Share2, Sparkles, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const CertificatePage = () => {
  const { t } = useTranslation();
  const { certUUID } = useParams();
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const certRef = useRef();

  useEffect(() => {
    // Show confetti if coming from course completion
    if(localStorage.getItem('certificateConfetti') === 'true') {
      import('canvas-confetti').then(confetti => confetti.default());
      localStorage.removeItem('certificateConfetti');
    }

    api.get(`/certificates/${certUUID}`)
      .then(res => setCert(res.data.data))
      .catch((e) => toast.error('Certificate not found'))
      .finally(() => setLoading(false));
  }, [certUUID]);

  const downloadPDF = async () => {
    const loader = toast.loading('Generating PDF...');
    try {
      setTimeout(async () => {
        try {
          const canvas = await html2canvas(certRef.current, { scale: 2, useCORS: true });
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('landscape', 'mm', 'a4');
          pdf.addImage(imgData, 'PNG', 0, 0, 297, 210);
          pdf.save(`KaushalAI_Cert_${cert.certUUID}.pdf`);
          toast.success('Downloaded successfully!', { id: loader });
        } catch(e) {
          toast.error('Failed to generate PDF', { id: loader });
        }
      }, 500);
    } catch(e) {
      toast.error('Failed to initiate Export', { id: loader });
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`https://kaushalai.app/verify/${cert.certUUID}`);
    toast.success('Verification link copied to clipboard!');
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 flex flex-col items-center animate-pulse">
      <div className="w-48 h-10 bg-gray-200 rounded mb-8 ml-auto"></div>
      <div className="w-full h-[600px] bg-gray-200 rounded-3xl"></div>
    </div>
  );
  
  if (!cert) return (
    <div className="flex flex-col items-center justify-center py-32 text-gray-500">
      <AlertCircle size={64} className="text-red-400 mb-4" />
      <h2 className="text-2xl font-bold text-gray-800">Invalid or Expired Certificate</h2>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-6 rounded-2xl mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
        <div>
          <h2 className="font-extrabold text-blue-900 text-xl flex items-center gap-2"><Sparkles size={20} className="text-accent" /> Verify Identity</h2>
          <p className="text-sm font-medium text-blue-700 opacity-80 mt-1">This certificate is secured uniquely on KaushalAI tracking systems.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={copyLink} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-primary/20 dark:border-slate-700 rounded-xl shadow-sm hover:bg-primary/5 text-gray-800 font-bold hover-lift">
            <Share2 size={18} className="text-gray-500" /> Share Link
          </button>
          <button onClick={downloadPDF} className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl shadow-lg shadow-blue-900/20 hover:bg-blue-700 font-bold hover-lift">
            <Download size={18} /> Download High-Res
          </button>
        </div>
      </div>

      <div className="overflow-x-auto pb-12 flex justify-center">
        {/* Certificate Container fixed to A4 Landscape ratio scaling for view */}
        <div 
          ref={certRef} 
          className="w-[1123px] h-[794px] relative shadow-2xl shrink-0 overflow-hidden flex flex-col items-center justify-between p-16"
          style={{ 
            backgroundColor: '#FFFFFF',
            backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            color: '#1F2937'
          }}
        >
          {/* Decorative Borders */}
          <div className="absolute inset-4 border-2 border-solid opacity-20 pointer-events-none" style={{ borderColor: '#1A2E5A' }}></div>
          <div className="absolute inset-6 border border-solid opacity-40 pointer-events-none" style={{ borderColor: '#F4A223' }}></div>
          <div className="absolute inset-8 border border-solid opacity-20 pointer-events-none" style={{ borderColor: '#1A2E5A' }}></div>

          {/* Corner Ornaments */}
          <div className="absolute top-6 left-6 w-12 h-12 border-t-4 border-l-4" style={{ borderColor: '#1A2E5A' }}></div>
          <div className="absolute top-6 right-6 w-12 h-12 border-t-4 border-r-4" style={{ borderColor: '#1A2E5A' }}></div>
          <div className="absolute bottom-6 left-6 w-12 h-12 border-b-4 border-l-4" style={{ borderColor: '#1A2E5A' }}></div>
          <div className="absolute bottom-6 right-6 w-12 h-12 border-b-4 border-r-4" style={{ borderColor: '#1A2E5A' }}></div>

          {/* Header */}
          <div className="text-center w-full relative z-10 mt-2">
            <h1 className="text-5xl font-extrabold tracking-tight" style={{ color: '#1A2E5A' }}>
              Kaushal<span style={{ color: '#F4A223' }}>AI</span>
            </h1>
            <p className="text-xs font-bold uppercase tracking-[0.3em] mt-3" style={{ color: '#6B7280' }}>
              {t('cert.auth') !== 'cert.auth' ? t('cert.auth') : 'Skill Certification Authority'}
            </p>
          </div>

          {/* Title & Content */}
          <div className="text-center flex-1 flex flex-col justify-center items-center relative z-10 w-full max-w-4xl mx-auto mt-6">
            <h2 className="text-[52px] font-black uppercase tracking-widest mb-10" style={{ color: '#1A2E5A', fontFamily: "'Playfair Display', Georgia, serif" }}>
              {t('cert.title') !== 'cert.title' ? t('cert.title') : 'Certificate of Completion'}
            </h2>
            
            <p className="text-2xl italic mb-8" style={{ color: '#4B5563', fontFamily: "Georgia, serif" }}>
              {t('cert.certify_that') !== 'cert.certify_that' ? t('cert.certify_that') : 'This is to proudly certify that'}
            </p>
            
            <div className="w-full flex justify-center mb-8">
              <h3 className="text-6xl font-extrabold pb-2 border-b-2 px-12 capitalize" style={{ color: '#111827', borderColor: '#F4A223', fontFamily: "'Playfair Display', Georgia, serif" }}>
                {cert.workerName}
              </h3>
            </div>
            
            <p className="text-2xl italic mb-8" style={{ color: '#4B5563', fontFamily: "Georgia, serif" }}>
              {t('cert.completed_course') !== 'cert.completed_course' ? t('cert.completed_course') : 'has successfully completed the comprehensive course'}
            </p>
            
            <h4 className="text-4xl font-bold uppercase tracking-wide mb-8" style={{ color: '#F4A223' }}>
              {cert.courseName}
            </h4>
            
            <p className="text-xl max-w-3xl mx-auto leading-relaxed font-medium" style={{ color: '#374151' }}>
              {t('cert.demonstrated') !== 'cert.demonstrated' ? t('cert.demonstrated') : 'and has demonstrated a'} <strong style={{ color: '#1A2E5A', fontWeight: '800' }}>{cert.skillLevel}</strong> {t('cert.proficiency_in') !== 'cert.proficiency_in' ? t('cert.proficiency_in') : 'level of proficiency in'} <strong style={{ color: '#111827', borderBottom: '2px solid #F4A223' }}>{cert.trade}</strong>.
            </p>
          </div>

           {/* Footer Elements */}
          <div className="w-full flex justify-between items-end px-12 relative z-10 mb-2 mt-4">
            {/* Bottom Left: Issued Date & UUID */}
            <div className="text-left flex flex-col justify-end w-64">
              <p className="text-xl font-bold border-b pb-2 mb-2 inline-block px-2" style={{ color: '#1F2937', borderColor: '#9CA3AF' }}>
                {new Date(cert.issuedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <p className="font-bold text-sm uppercase tracking-widest" style={{ color: '#6B7280' }}>Date of Issue</p>
              <p className="text-[10px] mt-4 font-mono break-all" style={{ color: '#9CA3AF' }}>ID: {cert.certUUID}</p>
            </div>

            {/* Bottom Center: Signature */}
            <div className="text-center w-64 flex flex-col justify-end items-center">
              <div className="h-24 w-full border-b mb-2 flex justify-center items-end pb-2 relative" style={{ borderColor: '#9CA3AF' }}>
                 <img src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Signature_of_John_Hancock.svg" alt="Signature" className="h-20 opacity-90 absolute -bottom-4 mix-blend-multiply" />
              </div>
              <p className="font-bold text-sm uppercase tracking-widest" style={{ color: '#6B7280' }}>Director, KaushalAI</p>
            </div>

            {/* Bottom Right: QR Code */}
            <div className="flex flex-col items-end justify-end w-64">
              <div className="bg-white p-3 border border-gray-200 shadow-sm rounded-xl mb-2" style={{ backgroundColor: '#FFFFFF' }}>
                <QRCode value={`https://kaushalai.app/verify/${cert.certUUID}`} size={100} level="M" fgColor="#1A2E5A" />
              </div>
              <p className="font-bold text-xs uppercase tracking-widest text-right" style={{ color: '#9CA3AF' }}>Scan to Verify</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatePage;
