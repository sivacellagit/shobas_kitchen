import { useState, useEffect } from "react";
import api from "../utils/Api";
import { useNavigate } from "react-router-dom";
import NewCustomerForm from "../components/NewCustomerForm";

const Login = () => {
  const [step, setStep] = useState<"enter" | "otp" | "password" | "newCustomer">("enter");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"customer" | "staff" | "admin" | null>(null);
  const [, setIsRegistered] = useState<boolean | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (step === "otp" && timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setCanResend(true);
    }
  }, [step, timer]);

  const handleResendOTP = async () => {
    try {
      setTimer(60);
      setCanResend(false);
      await api.post("/auth/send-otp/", { phone_number: phoneNumber });
      setMessage("OTP resent.");
    } catch {
      setMessage("Failed to resend OTP.");
    }
  };

  const handleSendOTP = async () => {
    setLoading(true);
    setMessage("");
    try {
      console.log("Before Sending OTP to:", phoneNumber);
      const res = await api.post("/auth/send-otp/", { phone_number: phoneNumber });
      console.log("After Sending OTP to:", phoneNumber);
      setRole(res.data.role);
      setIsRegistered(res.data.is_registered);
      setStep("otp");
      setMessage("OTP sent to your phone.");
    } catch {
      setMessage("Failed to send OTP. Please check your number.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await api.post("/auth/verify-otp/", {
        phone_number: phoneNumber,
        otp,
      });

      if (!res.data.success) {
        setMessage("Invalid OTP. Please try again.");
        return;
      }

      setRole(res.data.role);

      if (!res.data.is_registered) {
        setStep("newCustomer"); // New customer registration
      } else {
        localStorage.setItem("token", res.data.token);
        if (res.data.role === "admin") navigate("/admin/dashboard");
        else if (res.data.role === "staff") navigate("/staff/dashboard");
        else navigate("/menu");
      }
    } catch {
      setMessage("OTP verification failed. Please check your OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await api.post("/auth/password-login/", {
        phone_number: phoneNumber,
        password,
      });

      localStorage.setItem("token", res.data.token);

      if (role === "admin") navigate("/admin/dashboard");
      else if (role === "staff") navigate("/staff/dashboard");
      else navigate("/menu");
    } catch {
      setMessage("Invalid password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>

      {/* Step 1: Enter Phone */}
      {step === "enter" && (
        <>
          <input
            type="tel"
            placeholder="Enter Phone Number"
            className="w-full border px-3 py-2 mb-3 rounded"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <button
            className="w-full bg-green-600 text-white py-2 rounded disabled:opacity-50"
            onClick={handleSendOTP}
            disabled={loading || !phoneNumber}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </>
      )}

      {/* Step 2: OTP Verification */}
      {step === "otp" && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            className="w-full border px-3 py-2 mb-3 rounded"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button
            className="w-full bg-green-600 text-white py-2 rounded disabled:opacity-50"
            onClick={handleVerifyOTP}
            disabled={loading || !otp}
          >
            {loading ? "Verifying OTP..." : "Verify OTP"}
          </button>
          <p className="text-sm text-gray-600">
            {canResend ? (
              <button onClick={handleResendOTP} className="text-green-600 underline">
                Resend OTP
              </button>
            ) : (
              `Resend available in ${timer}s`
            )}
          </p>
        </>
      )}

      {/* Step 3: Password for staff/admin */}
      {step === "password" && (
        <>
          <input
            type="password"
            placeholder="Enter Password"
            className="w-full border px-3 py-2 mb-3 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="w-full bg-green-600 text-white py-2 rounded disabled:opacity-50"
            onClick={handlePasswordLogin}
            disabled={loading || !password}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </>
      )}

      {/* Step 4: New customer registration */}
      {step === "newCustomer" && (
        <NewCustomerForm
          phone={phoneNumber}
          onRegistered={() => {
            navigate("/menu");
          }}
        />
      )}

      {message && <p className="text-sm text-center text-red-600 mt-4">{message}</p>}
    </div>
  );
};

export default Login;

/*import { useState, useEffect } from "react";
import api from "../utils/Api";
import { useNavigate } from "react-router-dom";
import { useCustomer } from "../contexts/CustomerContext";
//import { Logger } from "html2canvas/dist/types/core/logger";


const Login = () => {
 const [step, setStep] = useState<"enter" | "otp" | "password" | "newCustomer">("enter");
 const [phoneNumber, setPhoneNumber] = useState("");
 const [otp, setOtp] = useState("");
 const [password, setPassword] = useState("");
 const [role, setRole] = useState<"customer" | "staff" | "admin" | null>(null);
 const [message, setMessage] = useState("");
 const [loading, setLoading] = useState(false);
 const navigate = useNavigate();
 const [isRegistered, setIsRegistered] = useState<boolean | null>(null);
 const [timer, setTimer] = useState(60); // 60 seconds
 const [canResend, setCanResend] = useState(false);


 useEffect(() => {
   if (step === "otp" && timer > 0) {
     const interval = setInterval(() => setTimer(t => t - 1), 1000);
     return () => clearInterval(interval);
   } else if (timer === 0) {
     setCanResend(true);
   }
 }, [step, timer]);


 const handleResendOTP = async () => {
   try {
     setTimer(60);
     setCanResend(false);
     await api.post("/auth/send-otp/", { phone_number: phoneNumber });
     setMessage("OTP resent.");
   } catch (err) {
     setMessage("Failed to resend OTP.");
   }
 };


 const handleSendOTP = async () => {
   setLoading(true);
   setMessage("");
   try {
     console.log("Sending OTP to:", phoneNumber);
     const res = await api.post("/auth/send-otp/", { phone_number: phoneNumber });
     setRole(res.data.role); // e.g. "customer", "staff", "admin"
     setStep("otp");
     setMessage("OTP sent to your phone.");
   } catch (err) {
     setMessage("Failed to send OTP. Please check your number.");
   } finally {
     setLoading(false);
   }
 };


 const handleVerifyOTP = async () => {
   setLoading(true);
   setMessage("");
   try {
     const res = await api.post("/auth/verify-otp/", {
       phone_number: phoneNumber,
       otp,
     });

    if (!res.data.success) {
      setMessage("Invalid OTP. Please try again.");
      return;
    }
    /*
     if (res.data.success) {
       const { token, role: userRole } = res.data;
       setRole(userRole);
    
    setRole(res.data.role);

    if (!res.data.is_registered) {
      setStep("newCustomer"); // Show NewCustomerForm
    } else {
      localStorage.setItem("token", res.data.token);
      if (res.data.role === "admin") navigate("/admin/dashboard");
      else if (res.data.role === "staff") navigate("/staff/dashboard");
      else navigate("/menu");
    }
    } catch {
      setMessage("OTP verification failed. Please check your OTP.");
    } finally {
      setLoading(false);
    }
/*
       if (userRole === "customer") {
         localStorage.setItem("token", token);
         navigate("/menu");
       } else {
         // Require password for staff/admin
         setStep("password");
         setMessage("OTP verified. Please enter your password.");
       }
     } else {
       setMessage("Invalid OTP. Please try again.");
     }
   } catch {
     setMessage("OTP verification failed. Please check your OTP.");
   } finally {
     setLoading(false);
   }
     
 };


 const handlePasswordLogin = async () => {
   setLoading(true);
   setMessage("");
   try {
     const res = await api.post("/auth/password-login/", {
       phone_number: phoneNumber,
       password,
     });


     localStorage.setItem("token", res.data.token);


     if (role === "admin") navigate("/admin/dashboard");
     else if (role === "staff") navigate("/staff/dashboard");
     else navigate("/");
   } catch {
     setMessage("Invalid password. Please try again.");
   } finally {
     setLoading(false);
   }
 };


 return (
   <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
     <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>
     {step === "enter" && (
       <>
         <input
           type="tel"
           placeholder="Enter Phone Number"
           className="w-full border px-3 py-2 mb-3 rounded"
           value={phoneNumber}
           onChange={(e) => setPhoneNumber(e.target.value)}
         />
         <button
           className="w-full bg-green-600 text-white py-2 rounded disabled:opacity-50"
           onClick={handleSendOTP}
           disabled={loading || !phoneNumber}
         >
           {loading ? "Sending OTP..." : "Send OTP"}
         </button>
       </>
     )}


     {step === "otp" && (
       <>
         <input
           type="text"
           placeholder="Enter OTP"
           className="w-full border px-3 py-2 mb-3 rounded"
           value={otp}
           onChange={(e) => setOtp(e.target.value)}
         />
         <button
           className="w-full bg-green-600 text-white py-2 rounded disabled:opacity-50"
           onClick={handleVerifyOTP}
           disabled={loading || !otp}
         >
           {loading ? "Verifying OTP..." : "Verify OTP"}
         </button>
         <p className="text-sm text-gray-600">
           {canResend ? (
             <button onClick={handleResendOTP} className="text-green-600 underline">Resend OTP</button>
           ) : (
             `Resend available in ${timer}s`
           )}
         </p>
       </>
     )}


     {step === "password" && (
       <>
         <input
           type="password"
           placeholder="Enter Password"
           className="w-full border px-3 py-2 mb-3 rounded"
           value={password}
           onChange={(e) => setPassword(e.target.value)}
         />
         <button
           className="w-full bg-green-600 text-white py-2 rounded disabled:opacity-50"
           onClick={handlePasswordLogin}
           disabled={loading || !password}
         >
           {loading ? "Logging in..." : "Login"}
         </button>
       </>
     )}


     {message && <p className="text-sm text-center text-red-600 mt-4">{message}</p>}
   </div>
 );
};


export default Login;
*/