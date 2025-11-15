import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchActivePrivacyPolicy } from "../store/legalSlice.ts";
import { RootState } from "../store/store.ts";
import { Shield, Lock, UserCheck, Database, FileText, AlertCircle } from "lucide-react";

const PrivacyPolicy = () => {
  const dispatch = useDispatch();
  const { active: policy } = useSelector(
    (state: RootState) => state.legal.privacyPolicy
  );

  useEffect(() => {
    dispatch(fetchActivePrivacyPolicy());
  }, [dispatch]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto mt-20">
          {/* Title Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-300 to-blue-400">Privacy Policy</h1>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl space-y-8">
            <section className="space-y-4">
              <div className="flex items-start space-x-4">
                <Shield className="w-6 h-6 text-purple-400 mt-1" />
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4">Information We Collect</h2>
                  <div className="prose prose-invert max-w-none text-slate-300 [&>*]:text-slate-300" dangerouslySetInnerHTML={{ __html: policy?.content?.informationCollected || "" }} />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-start space-x-4">
                <Database className="w-6 h-6 text-blue-400 mt-1" />
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4">How We Use Your Information</h2>
                  <div className="prose prose-invert max-w-none text-slate-300 [&>*]:text-slate-300" dangerouslySetInnerHTML={{ __html: policy?.content?.informationUsage || "" }} />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-start space-x-4">
                <UserCheck className="w-6 h-6 text-indigo-400 mt-1" />
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4">Information Sharing</h2>
                  <div className="prose prose-invert max-w-none text-slate-300 [&>*]:text-slate-300" dangerouslySetInnerHTML={{ __html: policy?.content?.informationSharing || "" }} />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-start space-x-4">
                <Lock className="w-6 h-6 text-purple-400 mt-1" />
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4">Data Security</h2>
                  <div className="prose prose-invert max-w-none text-slate-300 [&>*]:text-slate-300" dangerouslySetInnerHTML={{ __html: policy?.content?.dataSecurity || "" }} />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-start space-x-4">
                <FileText className="w-6 h-6 text-blue-400 mt-1" />
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4">Your Rights</h2>
                  <div className="prose prose-invert max-w-none text-slate-300 [&>*]:text-slate-300" dangerouslySetInnerHTML={{ __html: policy?.content?.userRights || "" }} />
                </div>
              </div>
            </section>
          </div>

          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-2 text-purple-300">
              <AlertCircle className="w-5 h-5" />
              <span>If you have any questions about our privacy policy, please contact us.</span>
            </div>
          </div>
        </div>
      </div>
      </div>
);
};

export default PrivacyPolicy;
