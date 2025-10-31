// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import CenteredLoginSignupModal, { User } from "@/components/LoginModel";
// import { motion, AnimatePresence } from "framer-motion";
// import { CheckCircle2, Circle } from "lucide-react";

// export default function FundraisingPage() {
//   const router = useRouter();

//   const [step, setStep] = useState(1);
//   const [showLogin, setShowLogin] = useState(false);

//   const [formData, setFormData] = useState({
//     country: "",
//     postalCode: "",
//     reason: "",
//     recipient: "",
//     goal: "",
//   });

//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const totalSteps = 3;

//   // 🧩 Detect if user already logged in
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     const userData = localStorage.getItem("user");
//     if (userData) setIsLoggedIn(true);
//   }, []);

//   const handleLoginSuccess = (user: User) => {
//     localStorage.setItem("fundraisingData", JSON.stringify(formData));
//     setShowLogin(false);
//     router.push("/fundraiser/create-campaigns");
//   };

//   const validateStep = () => {
//     const newErrors: Record<string, string> = {};

//     if (step === 1) {
//       if (!formData.country) newErrors.country = "Country is required";
//       if (!formData.postalCode)
//         newErrors.postalCode = "Postal code is required";
//       if (!formData.reason) newErrors.reason = "Please select a reason";
//     }

//     if (step === 2 && !formData.recipient)
//       newErrors.recipient = "Please select who benefits";

//     if (step === 3 && (!formData.goal || Number(formData.goal) <= 0))
//       newErrors.goal = "Please enter a valid goal amount";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const nextStep = () => {
//     if (!validateStep()) return;

//     if (step === totalSteps) {
//       localStorage.setItem("fundraisingData", JSON.stringify(formData)); // 🧩 always store
//       if (isLoggedIn) {
//         // 🧩 if already logged in → go directly
//         router.push("/fundraiser/create-campaigns");
//       } else {
//         // 🧩 else open login modal
//         setShowLogin(true);
//       }
//     } else {
//       setStep(step + 1);
//     }
//   };

//   const prevStep = () => step > 1 && setStep(step - 1);

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-indigo-100 via-white to-indigo-50 flex flex-col items-center justify-start py-8 sm:py-12 px-3 sm:px-6">
//       <motion.h1
//         initial={{ opacity: 0, y: -10 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#094C3B] mb-6 sm:mb-10 text-center leading-snug"
//       >
//         Start Your Fundraising Journey
//       </motion.h1>

//       <div className="flex items-center justify-between w-full max-w-2xl mb-8 sm:mb-10 relative">
//         {[1, 2, 3].map((num) => (
//           <div key={num} className="flex flex-col items-center w-full">
//             <div className="relative flex items-center justify-center">
//               {step > num ? (
//                 <CheckCircle2 className="text-[#094C3B] w-6 h-6 sm:w-8 sm:h-8" />
//               ) : (
//                 <Circle
//                   className={`w-6 h-6 sm:w-8 sm:h-8 transition ${
//                     step === num ? "text-[#094C3B]" : "text-gray-300"
//                   }`}
//                 />
//               )}
//               {num < totalSteps && (
//                 <div
//                   className={`absolute top-1/2 -right-[50%] transform -translate-y-1/2 w-full h-[2px] sm:h-[3px] ${
//                     step > num ? "bg-[#094C3B]" : "bg-gray-300"
//                   }`}
//                 />
//               )}
//             </div>
//             <p
//               className={`text-[11px] sm:text-xs md:text-sm mt-1 sm:mt-2 ${
//                 step === num ? "text-[#094C3B] font-semibold" : "text-gray-500"
//               }`}
//             >
//               {num === 1
//                 ? "Basic Info"
//                 : num === 2
//                 ? "Who Benefits"
//                 : "Goal Amount"}
//             </p>
//           </div>
//         ))}
//       </div>

//       <motion.div
//         layout
//         className="w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-lg p-5 sm:p-8 border border-gray-100"
//       >
//         <AnimatePresence mode="wait">
//           <motion.div
//             key={step}
//             initial={{ opacity: 0, y: 25 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -25 }}
//             transition={{ duration: 0.3 }}
//           >
//             {step === 1 && (
//               <Step1
//                 formData={formData}
//                 setFormData={setFormData}
//                 errors={errors}
//               />
//             )}
//             {step === 2 && (
//               <Step2
//                 formData={formData}
//                 setFormData={setFormData}
//                 errors={errors}
//               />
//             )}
//             {step === 3 && (
//               <Step3
//                 formData={formData}
//                 setFormData={setFormData}
//                 errors={errors}
//               />
//             )}
//           </motion.div>
//         </AnimatePresence>

//         <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
//           {step > 1 ? (
//             <button
//               onClick={prevStep}
//               className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
//             >
//               ← Back
//             </button>
//           ) : (
//             <div />
//           )}
//           <button
//             onClick={nextStep}
//             className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#2B8C73] hover:bg-[#2B8C80] text-white font-semibold shadow-md transition"
//           >
//             {step === totalSteps ? "Finish & Continue" : "Continue →"}
//           </button>
//         </div>
//       </motion.div>

//       <AnimatePresence>
//         {showLogin && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 px-4"
//           >
//             <div className="w-full max-w-sm sm:max-w-md md:max-w-lg">
//               <CenteredLoginSignupModal
//                 isOpen={showLogin}
//                 onClose={() => setShowLogin(false)}
//                 onLoginSuccess={handleLoginSuccess}
//               />
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// /* ----------------------------- STEP 1 ----------------------------- */
// function Step1({ formData, setFormData, errors }: any) {
//   const update = (k: string, v: string) =>
//     setFormData((p: any) => ({ ...p, [k]: v }));

//   return (
//     <div>
//       <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
//         Let’s begin your fundraising
//       </h2>
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
//         <div>
//           <label className="block text-sm font-medium mb-2 text-gray-700">
//             Country*
//           </label>
//           <select
//             value={formData.country}
//             onChange={(e) => update("country", e.target.value)}
//             className="border border-gray-300 w-full rounded-xl p-3 focus:ring-2 focus:ring-indigo-400"
//           >
//             <option value="">Select Country</option>
//             <option>India</option>
//             <option>USA</option>
//             <option>UK</option>
//             <option>Canada</option>
//           </select>
//           {errors.country && (
//             <p className="text-red-500 text-sm mt-1">{errors.country}</p>
//           )}
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-2 text-gray-700">
//             Postal Code*
//           </label>
//           <input
//             value={formData.postalCode}
//             onChange={(e) => update("postalCode", e.target.value)}
//             placeholder="110011"
//             className="border border-gray-300 w-full rounded-xl p-3 focus:ring-2 focus:ring-indigo-400"
//           />
//           {errors.postalCode && (
//             <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>
//           )}
//         </div>
//       </div>

//       <div className="mt-6 sm:mt-8">
//         <p className="text-sm font-medium mb-3 text-gray-700">
//           What best describes why you’re fundraising?
//         </p>
//         <div className="flex flex-wrap gap-3">
//           {[
//             "Health",
//             "Education",
//             "Emergency",
//             "Charity",
//             "Community",
//             "Animal Welfare",
//             "Women Empowerment",
//           ].map((tag) => (
//             <button
//               key={tag}
//               onClick={() => update("reason", tag)}
//               className={`border rounded-full px-4 sm:px-5 py-2 text-sm transition-all duration-200 ${
//                 formData.reason === tag
//                   ? "bg-[#2B8C73] text-white border-indigo-600 shadow-sm"
//                   : "border-gray-300 hover:bg-indigo-50 hover:border-indigo-500"
//               }`}
//             >
//               {tag}
//             </button>
//           ))}
//         </div>
//         {errors.reason && (
//           <p className="text-red-500 text-sm mt-2">{errors.reason}</p>
//         )}
//       </div>
//     </div>
//   );
// }

// /* ----------------------------- STEP 2 ----------------------------- */
// function Step2({ formData, setFormData, errors }: any) {
//   const update = (k: string, v: string) =>
//     setFormData((p: any) => ({ ...p, [k]: v }));

//   const options = [
//     { label: "Yourself", desc: "Funds go directly to your account" },
//     { label: "Someone else", desc: "You’ll invite a beneficiary" },
//     { label: "Charity", desc: "Funds go to a nonprofit" },
//   ];

//   return (
//     <div>
//       <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">
//         Who are you raising funds for?
//       </h2>
//       <p className="text-gray-500 mb-6 sm:mb-8 text-sm sm:text-base">
//         Choose a recipient so we know who the fundraiser will benefit.
//       </p>

//       <div className="grid gap-3 sm:gap-4">
//         {options.map((opt) => (
//           <label
//             key={opt.label}
//             className={`flex justify-between items-center border rounded-2xl p-3 sm:p-4 cursor-pointer transition-all duration-200 ${
//               formData.recipient === opt.label
//                 ? "border-indigo-500 bg-indigo-50 shadow-sm"
//                 : "border-gray-200 hover:border-indigo-400 hover:bg-indigo-50"
//             }`}
//             onClick={() => update("recipient", opt.label)}
//           >
//             <div>
//               <p className="font-medium text-gray-800 text-sm sm:text-base">
//                 {opt.label}
//               </p>
//               <p className="text-xs sm:text-sm text-gray-500 mt-1">
//                 {opt.desc}
//               </p>
//             </div>
//             <input
//               type="radio"
//               checked={formData.recipient === opt.label}
//               readOnly
//               className="w-4 h-4 sm:w-5 sm:h-5 accent-indigo-600"
//             />
//           </label>
//         ))}
//       </div>
//       {errors.recipient && (
//         <p className="text-red-500 text-sm mt-2">{errors.recipient}</p>
//       )}
//     </div>
//   );
// }

// /* ----------------------------- STEP 3 ----------------------------- */
// function Step3({ formData, setFormData, errors }: any) {
//   const update = (k: string, v: string) =>
//     setFormData((p: any) => ({ ...p, [k]: v }));

//   return (
//     <div>
//       <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">
//         Set your fundraising goal
//       </h2>
//       <p className="text-gray-500 mb-6 sm:mb-8 text-sm sm:text-base">
//         Set a goal amount — you’ll still receive funds even if you don’t reach
//         it.
//       </p>

//       <div className="flex items-center gap-2 sm:gap-3 mb-5 sm:mb-6">
//         <span className="font-semibold text-[#094C3B] text-lg sm:text-xl">
//           ₹
//         </span>
//         <input
//           type="number"
//           min="0"
//           value={formData.goal}
//           onChange={(e) => {
//             const val = Number(e.target.value);
//             if (val >= 0) update("goal", e.target.value);
//           }}
//           className="border border-gray-300 w-full rounded-xl p-3 text-base sm:text-lg focus:ring-2 focus:ring-indigo-400"
//           placeholder="Enter target amount"
//         />
//       </div>
//       {errors.goal && <p className="text-red-500 text-sm">{errors.goal}</p>}
//     </div>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CenteredLoginSignupModal, { User } from "@/components/LoginModel";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle } from "lucide-react";

/* ----------------------------- TYPES ----------------------------- */
interface FormDataType {
  country: string;
  postalCode: string;
  reason: string;
  recipient: string;
  goal: string;
}

interface StepProps {
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
  errors: Record<string, string>;
}

/* ----------------------------- MAIN PAGE ----------------------------- */
export default function FundraisingPage() {
  const router = useRouter();

  const [step, setStep] = useState<number>(1);
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormDataType>({
    country: "",
    postalCode: "",
    reason: "",
    recipient: "",
    goal: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const totalSteps = 3;

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setIsLoggedIn(true);
  }, []);

  const handleLoginSuccess = (user: User) => {
    localStorage.setItem("fundraisingData", JSON.stringify(formData));
    setShowLogin(false);
    router.push("/fundraiser/create-campaigns");
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.country) newErrors.country = "Country is required";
      if (!formData.postalCode)
        newErrors.postalCode = "Postal code is required";
      if (!formData.reason) newErrors.reason = "Please select a reason";
    }

    if (step === 2 && !formData.recipient)
      newErrors.recipient = "Please select who benefits";

    if (step === 3 && (!formData.goal || Number(formData.goal) <= 0))
      newErrors.goal = "Please enter a valid goal amount";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (!validateStep()) return;

    if (step === totalSteps) {
      localStorage.setItem("fundraisingData", JSON.stringify(formData));

      if (isLoggedIn) {
        router.push("/fundraiser/create-campaigns");
      } else {
        setShowLogin(true);
      }
    } else {
      setStep(step + 1);
    }
  };

  const prevStep = () => step > 1 && setStep(step - 1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 via-white to-indigo-50 flex flex-col items-center justify-start py-8 sm:py-12 px-3 sm:px-6">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#094C3B] mb-6 sm:mb-10 text-center leading-snug"
      >
        Start Your Fundraising Journey
      </motion.h1>

      {/* Progress Bar */}
      <div className="flex items-center justify-between w-full max-w-2xl mb-8 sm:mb-10 relative">
        {[1, 2, 3].map((num) => (
          <div key={num} className="flex flex-col items-center w-full">
            <div className="relative flex items-center justify-center">
              {step > num ? (
                <CheckCircle2 className="text-[#094C3B] w-6 h-6 sm:w-8 sm:h-8" />
              ) : (
                <Circle
                  className={`w-6 h-6 sm:w-8 sm:h-8 transition ${
                    step === num ? "text-[#094C3B]" : "text-gray-300"
                  }`}
                />
              )}

              {num < totalSteps && (
                <div
                  className={`absolute top-1/2 -right-[50%] transform -translate-y-1/2 w-full h-[2px] sm:h-[3px] ${
                    step > num ? "bg-[#094C3B]" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
            <p
              className={`text-[11px] sm:text-xs md:text-sm mt-1 sm:mt-2 ${
                step === num ? "text-[#094C3B] font-semibold" : "text-gray-500"
              }`}
            >
              {num === 1
                ? "Basic Info"
                : num === 2
                ? "Who Benefits"
                : "Goal Amount"}
            </p>
          </div>
        ))}
      </div>

      {/* Main Section */}
      <motion.div
        layout
        className="w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-lg p-5 sm:p-8 border border-gray-100"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -25 }}
            transition={{ duration: 0.3 }}
          >
            {step === 1 && (
              <Step1
                formData={formData}
                setFormData={setFormData}
                errors={errors}
              />
            )}
            {step === 2 && (
              <Step2
                formData={formData}
                setFormData={setFormData}
                errors={errors}
              />
            )}
            {step === 3 && (
              <Step3
                formData={formData}
                setFormData={setFormData}
                errors={errors}
              />
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
          {step > 1 ? (
            <button
              onClick={prevStep}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
            >
              ← Back
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={nextStep}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#2B8C73] hover:bg-[#2B8C80] text-white font-semibold shadow-md transition"
          >
            {step === totalSteps ? "Finish & Continue" : "Continue →"}
          </button>
        </div>
      </motion.div>

      {/* Login Modal */}
      <AnimatePresence>
        {showLogin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 px-4"
          >
            <div className="w-full max-w-sm sm:max-w-md md:max-w-lg">
              <CenteredLoginSignupModal
                isOpen={showLogin}
                onClose={() => setShowLogin(false)}
                onLoginSuccess={handleLoginSuccess}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ----------------------------- STEP 1 ----------------------------- */
function Step1({ formData, setFormData, errors }: StepProps) {
  const update = (k: keyof FormDataType, v: string) =>
    setFormData((p) => ({ ...p, [k]: v }));

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
        Let’s begin your fundraising
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Country*
          </label>
          <select
            value={formData.country}
            onChange={(e) => update("country", e.target.value)}
            className="border border-gray-300 w-full rounded-xl p-3 focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">Select Country</option>
            <option>India</option>
            <option>USA</option>
            <option>UK</option>
            <option>Canada</option>
          </select>
          {errors.country && (
            <p className="text-red-500 text-sm mt-1">{errors.country}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Postal Code*
          </label>
          <input
            value={formData.postalCode}
            onChange={(e) => update("postalCode", e.target.value)}
            placeholder="110011"
            className="border border-gray-300 w-full rounded-xl p-3 focus:ring-2 focus:ring-indigo-400"
          />
          {errors.postalCode && (
            <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>
          )}
        </div>
      </div>

      <div className="mt-6 sm:mt-8">
        <p className="text-sm font-medium mb-3 text-gray-700">
          What best describes why you’re fundraising?
        </p>
        <div className="flex flex-wrap gap-3">
          {[
            "Health",
            "Education",
            "Emergency",
            "Charity",
            "Community",
            "Animal Welfare",
            "Women Empowerment",
          ].map((tag) => (
            <button
              key={tag}
              onClick={() => update("reason", tag)}
              className={`border rounded-full px-4 sm:px-5 py-2 text-sm transition-all duration-200 ${
                formData.reason === tag
                  ? "bg-[#2B8C73] text-white border-indigo-600 shadow-sm"
                  : "border-gray-300 hover:bg-indigo-50 hover:border-indigo-500"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
        {errors.reason && (
          <p className="text-red-500 text-sm mt-2">{errors.reason}</p>
        )}
      </div>
    </div>
  );
}

/* ----------------------------- STEP 2 ----------------------------- */
function Step2({ formData, setFormData, errors }: StepProps) {
  const update = (k: keyof FormDataType, v: string) =>
    setFormData((p) => ({ ...p, [k]: v }));

  const options = [
    { label: "Yourself", desc: "Funds go directly to your account" },
    { label: "Someone else", desc: "You’ll invite a beneficiary" },
    { label: "Charity", desc: "Funds go to a nonprofit" },
  ];

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">
        Who are you raising funds for?
      </h2>
      <p className="text-gray-500 mb-6 sm:mb-8 text-sm sm:text-base">
        Choose a recipient so we know who the fundraiser will benefit.
      </p>

      <div className="grid gap-3 sm:gap-4">
        {options.map((opt) => (
          <label
            key={opt.label}
            className={`flex justify-between items-center border rounded-2xl p-3 sm:p-4 cursor-pointer transition-all duration-200 ${
              formData.recipient === opt.label
                ? "border-indigo-500 bg-indigo-50 shadow-sm"
                : "border-gray-200 hover:border-indigo-400 hover:bg-indigo-50"
            }`}
            onClick={() => update("recipient", opt.label)}
          >
            <div>
              <p className="font-medium text-gray-800 text-sm sm:text-base">
                {opt.label}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {opt.desc}
              </p>
            </div>
            <input
              type="radio"
              checked={formData.recipient === opt.label}
              readOnly
              className="w-4 h-4 sm:w-5 sm:h-5 accent-indigo-600"
            />
          </label>
        ))}
      </div>

      {errors.recipient && (
        <p className="text-red-500 text-sm mt-2">{errors.recipient}</p>
      )}
    </div>
  );
}

/* ----------------------------- STEP 3 ----------------------------- */
function Step3({ formData, setFormData, errors }: StepProps) {
  const update = (k: keyof FormDataType, v: string) =>
    setFormData((p) => ({ ...p, [k]: v }));

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">
        Set your fundraising goal
      </h2>
      <p className="text-gray-500 mb-6 sm:mb-8 text-sm sm:text-base">
        Set a goal amount — you’ll still receive funds even if you don’t reach
        it.
      </p>

      <div className="flex items-center gap-2 sm:gap-3 mb-5 sm:mb-6">
        <span className="font-semibold text-[#094C3B] text-lg sm:text-xl">
          ₹
        </span>
        <input
          type="number"
          min="0"
          value={formData.goal}
          onChange={(e) => {
            const val = Number(e.target.value);
            if (val >= 0) update("goal", e.target.value);
          }}
          className="border border-gray-300 w-full rounded-xl p-3 text-base sm:text-lg focus:ring-2 focus:ring-indigo-400"
          placeholder="Enter target amount"
        />
      </div>

      {errors.goal && <p className="text-red-500 text-sm">{errors.goal}</p>}
    </div>
  );
}
