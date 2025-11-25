import React, { useState } from 'react';
import { AppState, PolicyDocument, SignatureData } from './types';
import { DEFAULT_POLICY } from './constants';
import { parsePolicyFromImage } from './services/geminiService';
import { DocumentViewer } from './components/DocumentViewer';
import { SignedCertificate } from './components/SignedCertificate';
import { Upload, FileText, Loader2, Image as ImageIcon } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.UPLOAD);
  const [policy, setPolicy] = useState<PolicyDocument | null>(null);
  const [signature, setSignature] = useState<SignatureData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setAppState(AppState.PROCESSING);
    setError(null);

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64String = (reader.result as string).split(',')[1];
        const extractedPolicy = await parsePolicyFromImage(base64String);
        setPolicy(extractedPolicy);
        setAppState(AppState.REVIEW);
      } catch (err) {
        console.error(err);
        setError("تعذر معالجة الصورة. يرجى التأكد من وضوح النص والمحاولة مرة أخرى.");
        setAppState(AppState.UPLOAD);
      }
    };
    reader.readAsDataURL(file);
  };

  const useDefaultTemplate = () => {
    setPolicy(DEFAULT_POLICY);
    setAppState(AppState.REVIEW);
  };

  const handleSign = (data: SignatureData) => {
    setSignature(data);
    setAppState(AppState.SIGNED);
  };

  const handleReset = () => {
    setAppState(AppState.UPLOAD);
    setPolicy(null);
    setSignature(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans" dir="rtl">
      
      {/* Top Navbar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <FileText className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold text-slate-800">بوابة السياسات</span>
        </div>
        <div className="text-sm text-slate-500 hidden md:block">
          نظام التوقيع الرقمي للموظفين
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8">
        
        {appState === AppState.UPLOAD && (
          <div className="max-w-2xl mx-auto mt-10 animate-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-extrabold text-slate-900 mb-4">أهلاً بك</h1>
              <p className="text-lg text-slate-600">
                يرجى تحميل صورة من سياسة العمل لتحويلها إلى وثيقة رقمية، أو استخدام النموذج الجاهز.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-center">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Upload Card */}
                <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow group relative overflow-hidden">
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-slate-300 rounded-lg group-hover:border-blue-500 group-hover:bg-blue-50 transition-colors">
                        <div className="bg-blue-100 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                            <Upload className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">رفع صورة السياسة</h3>
                        <p className="text-sm text-slate-500 text-center px-4">
                            اسحب الصورة هنا أو اضغط للاختيار
                            <br/>
                            <span className="text-xs text-slate-400 mt-1 block">(PNG, JPG)</span>
                        </p>
                    </div>
                </div>

                {/* Template Card */}
                <button 
                    onClick={useDefaultTemplate}
                    className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all group text-right relative overflow-hidden"
                >
                    <div className="flex flex-col items-center justify-center h-64 border-2 border-transparent rounded-lg bg-slate-50 group-hover:bg-green-50 transition-colors">
                        <div className="bg-green-100 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                            <ImageIcon className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">استخدام "قواعد السلوك"</h3>
                        <p className="text-sm text-slate-500 text-center px-4">
                            استخدم نموذج "Global Network" الافتراضي للبدء فوراً
                        </p>
                    </div>
                </button>
            </div>
          </div>
        )}

        {appState === AppState.PROCESSING && (
          <div className="flex flex-col items-center justify-center h-[60vh] animate-in fade-in">
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-6" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">جاري المعالجة الذكية</h2>
            <p className="text-slate-500">يقوم الذكاء الاصطناعي بقراءة النص وتحليله...</p>
          </div>
        )}

        {appState === AppState.REVIEW && policy && (
          <DocumentViewer 
            policy={policy} 
            onSign={handleSign}
            onCancel={handleReset}
          />
        )}

        {appState === AppState.SIGNED && policy && signature && (
          <SignedCertificate 
            policy={policy}
            signature={signature}
            onReset={handleReset}
          />
        )}
      </main>
      
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-slate-400 text-sm">
        &copy; {new Date().getFullYear()} جميع الحقوق محفوظة لشركة Global Network
      </footer>
    </div>
  );
};

export default App;