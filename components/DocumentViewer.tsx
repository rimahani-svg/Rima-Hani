import React, { useRef, useState, useEffect } from 'react';
import { PolicyDocument, SignatureData } from '../types';
import { CheckCircle, AlertCircle, FileText, ChevronDown } from 'lucide-react';

interface DocumentViewerProps {
  policy: PolicyDocument;
  onSign: (data: SignatureData) => void;
  onCancel: () => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ policy, onSign, onCancel }) => {
  const [hasReadToBottom, setHasReadToBottom] = useState(false);
  const [employeeName, setEmployeeName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [agreed, setAgreed] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (contentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      // Allow a small buffer (e.g., 50px)
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        setHasReadToBottom(true);
      }
    }
  };

  useEffect(() => {
    // Check if content is short enough to not require scrolling
    if (contentRef.current) {
        if (contentRef.current.scrollHeight <= contentRef.current.clientHeight) {
            setHasReadToBottom(true);
        }
    }
  }, [policy]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (agreed && employeeName) {
      onSign({
        employeeName,
        employeeId,
        timestamp: new Date().toISOString()
      });
    }
  };

  return (
    <div className="flex flex-col h-[85vh] max-w-4xl mx-auto bg-white shadow-2xl rounded-lg overflow-hidden border border-slate-200">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 flex items-center justify-between shadow-md z-10">
        <div>
          <h1 className="text-2xl font-bold">{policy.companyName}</h1>
          <p className="text-slate-400 text-sm">{policy.documentTitle}</p>
        </div>
        <div className="bg-slate-800 p-2 rounded-full">
            <FileText className="w-6 h-6 text-blue-400" />
        </div>
      </div>

      {/* Scrollable Content */}
      <div 
        ref={contentRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-8 bg-slate-50 space-y-8 scroll-smooth"
      >
        <div className="bg-white p-8 shadow-sm rounded-lg border border-slate-100 max-w-3xl mx-auto">
            <div className="text-center mb-8 border-b pb-4">
                <h2 className="text-3xl font-bold text-slate-800 mb-2">{policy.documentTitle}</h2>
                <p className="text-slate-500">تاريخ الإصدار: {policy.date}</p>
            </div>

            <div className="space-y-8">
            {policy.sections.map((section, idx) => (
                <div key={idx} className="relative">
                    <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-800 w-8 h-8 flex items-center justify-center rounded-full text-sm ml-3">
                            {idx + 1}
                        </span>
                        {section.title}
                    </h3>
                    <ul className="mr-11 space-y-3">
                        {section.rules.map((rule, rIdx) => (
                        <li key={rIdx} className="text-slate-700 leading-relaxed flex items-start">
                            <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mt-2.5 ml-3 flex-shrink-0"></span>
                            {rule}
                        </li>
                        ))}
                    </ul>
                </div>
            ))}
            </div>
            
            <div className="mt-12 p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>
                    يُرجى قراءة كافة البنود أعلاه بعناية. يُعد توقيعك أدناه إقراراً بالاطلاع على هذه القواعد والالتزام بها، وأن مخالفتها قد تعرضك للمساءلة وفقاً للوائح الشركة.
                </p>
            </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="bg-white border-t p-6 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        {!hasReadToBottom && (
             <div className="text-center mb-4 animate-bounce text-blue-600 flex flex-col items-center text-sm">
                <span>يرجى التمرير للأسفل لقراءة كامل المستند</span>
                <ChevronDown className="w-4 h-4" />
             </div>
        )}
        
        <form onSubmit={handleSubmit} className={`transition-opacity duration-500 ${hasReadToBottom ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">الاسم الكامل</label>
              <input
                required
                type="text"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                placeholder="أدخل اسمك الثلاثي"
                className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">الرقم الوظيفي (اختياري)</label>
              <input
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="أدخل رقمك الوظيفي"
                className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <input
              required
              id="agree"
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="agree" className="text-slate-700 font-medium select-none cursor-pointer">
              أقر بأنني قرأت وفهمت مدونة السلوك المهني وأتعهد بالالتزام بها.
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={!agreed || !employeeName}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg shadow transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              توقيع واعتماد
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-slate-300 text-slate-600 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};