import React from 'react';
import { PolicyDocument, SignatureData } from '../types';
import { Award, Download, Check, RefreshCw } from 'lucide-react';

interface SignedCertificateProps {
  policy: PolicyDocument;
  signature: SignatureData;
  onReset: () => void;
}

export const SignedCertificate: React.FC<SignedCertificateProps> = ({ policy, signature, onReset }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 animate-in fade-in zoom-in duration-500">
      <div className="bg-white p-8 md:p-12 rounded-xl shadow-2xl max-w-2xl w-full border border-slate-100 text-center relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-full -mr-16 -mt-16 z-0"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-50 rounded-tr-full -ml-16 -mb-16 z-0"></div>

        <div className="relative z-10">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award className="w-10 h-10 text-green-600" />
            </div>

            <h2 className="text-3xl font-bold text-slate-800 mb-2">تم الاعتماد بنجاح</h2>
            <p className="text-slate-500 mb-8">شكراً لك، تم تسجيل موافقتك على السياسة بنجاح.</p>

            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 text-right mb-8">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs text-slate-400 mb-1">اسم الموظف</p>
                        <p className="font-bold text-slate-800">{signature.employeeName}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 mb-1">الرقم الوظيفي</p>
                        <p className="font-bold text-slate-800">{signature.employeeId || '-'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 mb-1">السياسة</p>
                        <p className="font-bold text-slate-800">{policy.documentTitle}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 mb-1">تاريخ التوقيع</p>
                        <p className="font-bold text-slate-800" dir="ltr">{new Date(signature.timestamp).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                    onClick={() => window.print()}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                    <Download className="w-4 h-4" />
                    تحميل الإيصال
                </button>
                <button 
                    onClick={onReset}
                    className="flex items-center justify-center gap-2 px-6 py-3 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    بدء عملية جديدة
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};