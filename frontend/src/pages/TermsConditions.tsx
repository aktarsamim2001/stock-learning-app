import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchActiveTermsConditions } from "../store/legalSlice.ts";
import { RootState } from "../store/store.ts";
import { FileText, Book, AlertTriangle, ShieldCheck, UserX, Power } from "lucide-react";

const TermsConditions = () => {
  const dispatch = useDispatch();
  const { active: terms } = useSelector(
    (state: RootState) => state.legal.termsConditions
  );

  useEffect(() => {
    dispatch(fetchActiveTermsConditions());
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
            <h1 className="text-5xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-300 to-blue-400">Terms & Conditions</h1>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl space-y-8">
            <section className="space-y-4">
              <div className="flex items-start space-x-4">
                <Book className="w-6 h-6 text-purple-400 mt-1" />
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4">Acceptance of Terms</h2>
                  <div className="prose prose-invert max-w-none text-slate-300 [&>*]:text-slate-300" dangerouslySetInnerHTML={{ __html: terms?.content?.acceptanceTerms || "" }} />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-start space-x-4">
                <FileText className="w-10 h-10 text-blue-400 mt-1" />
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4">Use License</h2>
                  <div className="prose prose-invert max-w-none text-slate-300 [&>*]:text-slate-300" dangerouslySetInnerHTML={{ __html: terms?.content?.useLicense || "" }} />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-start space-x-4">
                <AlertTriangle className="w-6 h-6 text-indigo-400 mt-1" />
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4">Disclaimer</h2>
                  <div className="prose prose-invert max-w-none text-slate-300 [&>*]:text-slate-300" dangerouslySetInnerHTML={{ __html: terms?.content?.disclaimer || "" }} />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-start space-x-4">
                <ShieldCheck className="w-6 h-6 text-purple-400 mt-1" />
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4">Limitations</h2>
                  <div className="prose prose-invert max-w-none text-slate-300 [&>*]:text-slate-300" dangerouslySetInnerHTML={{ __html: terms?.content?.limitations || "" }} />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-start space-x-4">
                <UserX className="w-6 h-6 text-blue-400 mt-1" />
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4">User Conduct</h2>
                  <div className="prose prose-invert max-w-none text-slate-300 [&>*]:text-slate-300" dangerouslySetInnerHTML={{ __html: terms?.content?.userConduct || "" }} />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-start space-x-4">
                <Power className="w-6 h-6 text-indigo-400 mt-1" />
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4">Termination</h2>
                  <div className="prose prose-invert max-w-none text-slate-300 [&>*]:text-slate-300" dangerouslySetInnerHTML={{ __html: terms?.content?.termination || "" }} />
                </div>
              </div>
            </section>
          </div>

          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-2 text-purple-300">
              <AlertTriangle className="w-5 h-5" />
              <span>By using our service, you agree to these terms and conditions.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
