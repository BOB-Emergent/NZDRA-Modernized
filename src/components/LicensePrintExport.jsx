import React, { useState } from 'react';
import html2canvas from 'html2canvas';

export default function LicensePrintExport({ cardRef, memberNumber, qrValue, userRole }) {
  const [generating, setGenerating] = useState(false);
  const allowedRoles = ['nzdra_admin', 'track_official', 'admin'];
  if (!allowedRoles.includes(userRole)) return null;

  const downloadImage = (canvas, filename) => {
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handlePrint = async () => {
    setGenerating(true);
    try {
      const card = cardRef.current;
      const badge = card.querySelector('[data-print-hide="badge"]');
      const qr = card.querySelector('[data-print-hide="qr"]');
      if (badge) badge.style.display = 'none';
      if (qr) qr.style.display = 'none';
      const frontCanvas = await html2canvas(card, { useCORS: true, backgroundColor: null, scale: 2 });
      downloadImage(frontCanvas, `License_Front_${memberNumber}.png`);
      if (badge) badge.style.display = '';
      if (qr) qr.style.display = '';

      const backDiv = document.createElement('div');
      backDiv.style.cssText = `width:${card.offsetWidth}px;height:${card.offsetHeight}px;background:white;display:flex;align-items:center;justify-content:center;position:fixed;left:-9999px;`;
      backDiv.style.flexDirection = 'column';
      const qrImg = document.createElement('img');
      qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qrValue || window.location.href)}`;
      qrImg.style.cssText = 'width:55%;height:auto;';
      qrImg.crossOrigin = 'anonymous';
      backDiv.appendChild(qrImg);
      const memberLabel = document.createElement('div');
      memberLabel.textContent = `Member Number: ${memberNumber || ''}`;
      memberLabel.style.cssText = 'margin-top:20px;font-family:Arial,sans-serif;font-size:22px;font-weight:bold;color:#111;letter-spacing:0.5px;';
      backDiv.appendChild(memberLabel);
      document.body.appendChild(backDiv);
      await new Promise(r => setTimeout(r, 1000));
      const backCanvas = await html2canvas(backDiv, { useCORS: true, scale: 2 });
      downloadImage(backCanvas, `License_Back_${memberNumber}.png`);
      document.body.removeChild(backDiv);
    } catch(e) { console.error('Print export error:', e); }
    setGenerating(false);
  };

  return (
    <button onClick={handlePrint} disabled={generating} data-testid="print-download-btn"
      style={{marginTop:'16px',padding:'12px 24px',background:'#1a1a2e',color:'white',border:'none',borderRadius:'8px',cursor:'pointer',fontSize:'14px',fontWeight:'bold'}}>
      {generating ? 'Generating\u2026' : 'Download for Printing'}
    </button>
  );
}
