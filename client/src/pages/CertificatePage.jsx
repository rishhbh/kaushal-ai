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
        <div ref={certRef} className="w-[1123px] h-[794px] bg-[#FFFEFA] relative shadow-2xl shrink-0 overflow-hidden font-sans border-4 border-double border-[#F4A223] flex flex-col justify-between p-12">
          
          {/* Header */}
          <div className="text-center mt-8 relative z-10">
            <h1 className="text-5xl font-extrabold text-[#1A2E5A] tracking-tight">Kaushal<span className="text-accent">AI</span></h1>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-2">{t('cert.auth') || 'Skill Certification Authority'}</p>
          </div>

          {/* Title & Content */}
          <div className="text-center flex-1 flex flex-col justify-center relative z-10">
            <h2 className="text-[56px] font-bold text-gray-800 mb-8" style={{fontFamily: "'Playfair Display', Georgia, serif"}}>
              {t('cert.title') || 'Certificate of Completion'}
            </h2>
            
            <p className="text-2xl text-gray-500 italic mb-6" style={{fontFamily: "Georgia, serif"}}>
              {t('cert.certify_that') || 'This is to certify that'}
            </p>
            
            <h3 className="text-6xl font-extrabold text-[#1A2E5A] mb-8 capitalize underline decoration-2 underline-offset-8 decoration-gray-200 pb-2">
              {cert.workerName}
            </h3>
            
            <p className="text-2xl text-gray-500 italic mb-6" style={{fontFamily: "Georgia, serif"}}>
              {t('cert.completed_course') || 'has successfully completed the course'}
            </p>
            
            <h4 className="text-4xl font-bold text-[#F4A223] mb-8">
              {cert.courseName.toUpperCase()}
            </h4>
            
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium">
              {t('cert.demonstrated') || 'and demonstrated'} <strong className="text-primary font-bold">{cert.skillLevel}</strong> {t('cert.proficiency_in') || 'proficiency in'} <strong className="text-gray-900 border-b-2 border-primary pb-0.5">{cert.trade}</strong>.
            </p>
          </div>

           {/* Footer Elements */}
          <div className="flex justify-between items-end px-12 mb-8 relative z-10">
            {/* Bottom Left: Issued Date & UUID */}
            <div className="text-left flex flex-col justify-end w-64 h-32">
              <p className="text-lg font-serif italic text-gray-600 font-bold border-b-2 border-gray-300 pb-2 mb-2 inline-block px-4 w-max">
                {new Date(cert.issuedAt).toLocaleDateString()}
              </p>
              <p className="font-bold text-gray-800 text-sm uppercase tracking-wider">Issued Date</p>
              <p className="text-xs text-gray-400 mt-2 font-mono break-all">UUID: {cert.certUUID}</p>
            </div>

            {/* Bottom Center: Signature */}
            <div className="text-center w-64 h-32 flex flex-col justify-end items-center">
              <div className="h-20 w-full border-b-2 border-gray-400 mb-2 flex justify-center items-end relative pb-1">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Signature_of_John_Hancock.svg" alt="Signature" className="h-16 opacity-80 mix-blend-multiply drop-shadow-md absolute -bottom-2" />
              </div>
              <p className="font-bold text-gray-800 text-sm uppercase tracking-wider">Director, KaushalAI</p>
            </div>

            {/* Bottom Right: QR Code */}
            <div className="flex flex-col items-center justify-end w-64 h-32">
              <div className="bg-white p-2 border-2 border-primary/20 dark:border-slate-700 shadow-sm rounded-lg mb-2">
                <QRCode value={`https://kaushalai.app/verify/${cert.certUUID}`} size={128} level="M" fgColor="#1A2E5A" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatePage;
