import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createPrivacyPolicy,
  updatePrivacyPolicy,
  getAllPrivacyPolicies,
  createTermsConditions,
  updateTermsConditions,
  getAllTermsConditions,
} from "../../store/legalSlice.ts";
import { RootState } from "../../store/store.ts";
import { Shield, Book, AlertCircle, Check } from "lucide-react";

const AdminLegalSettings = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<"privacy" | "terms">("privacy");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const { privacyPolicy, termsConditions } = useSelector(
    (state: RootState) => state.legal
  );

  const [privacyFormData, setPrivacyFormData] = useState({
    informationCollected: "",
    informationUsage: "",
    informationSharing: "",
    dataSecurity: "",
    userRights: "",
  });

  const [termsFormData, setTermsFormData] = useState({
    acceptanceTerms: "",
    useLicense: "",
    disclaimer: "",
    limitations: "",
    userConduct: "",
    termination: "",
  });

  useEffect(() => {
    dispatch(getAllPrivacyPolicies());
    dispatch(getAllTermsConditions());
  }, [dispatch]);

  const handlePrivacySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(createPrivacyPolicy({ content: privacyFormData }));
    showSuccess();
  };

  const handleTermsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(createTermsConditions({ content: termsFormData }));
    showSuccess();
  };

  const showSuccess = () => {
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Legal Settings</h1>
          <p className="text-lg text-gray-600">Manage Privacy Policy and Terms & Conditions</p>
        </div>

        {showSuccessMessage && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg flex items-center justify-center space-x-2">
            <Check className="w-5 h-5" />
            <span>Successfully updated!</span>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("privacy")}
                className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                  activeTab === "privacy"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Privacy Policy</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("terms")}
                className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                  activeTab === "terms"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Book className="w-5 h-5" />
                  <span>Terms & Conditions</span>
                </div>
              </button>
            </nav>
          </div>

          <div className="p-8">
            {activeTab === "privacy" ? (
              <form onSubmit={handlePrivacySubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Information We Collect</label>
                  <textarea
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={privacyFormData.informationCollected}
                    onChange={(e) =>
                      setPrivacyFormData({ ...privacyFormData, informationCollected: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">How We Use Information</label>
                  <textarea
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={privacyFormData.informationUsage}
                    onChange={(e) =>
                      setPrivacyFormData({ ...privacyFormData, informationUsage: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Information Sharing</label>
                  <textarea
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={privacyFormData.informationSharing}
                    onChange={(e) =>
                      setPrivacyFormData({ ...privacyFormData, informationSharing: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Data Security</label>
                  <textarea
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={privacyFormData.dataSecurity}
                    onChange={(e) =>
                      setPrivacyFormData({ ...privacyFormData, dataSecurity: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">User Rights</label>
                  <textarea
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={privacyFormData.userRights}
                    onChange={(e) =>
                      setPrivacyFormData({ ...privacyFormData, userRights: e.target.value })
                    }
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Save Privacy Policy
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleTermsSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Acceptance of Terms</label>
                  <textarea
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={termsFormData.acceptanceTerms}
                    onChange={(e) =>
                      setTermsFormData({ ...termsFormData, acceptanceTerms: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Use License</label>
                  <textarea
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={termsFormData.useLicense}
                    onChange={(e) =>
                      setTermsFormData({ ...termsFormData, useLicense: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Disclaimer</label>
                  <textarea
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={termsFormData.disclaimer}
                    onChange={(e) =>
                      setTermsFormData({ ...termsFormData, disclaimer: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Limitations</label>
                  <textarea
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={termsFormData.limitations}
                    onChange={(e) =>
                      setTermsFormData({ ...termsFormData, limitations: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">User Conduct</label>
                  <textarea
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={termsFormData.userConduct}
                    onChange={(e) =>
                      setTermsFormData({ ...termsFormData, userConduct: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Termination</label>
                  <textarea
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={termsFormData.termination}
                    onChange={(e) =>
                      setTermsFormData({ ...termsFormData, termination: e.target.value })
                    }
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Save Terms & Conditions
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLegalSettings;
