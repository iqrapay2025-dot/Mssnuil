import { useState, MouseEvent } from "react";
import { motion } from "motion/react";
import { UserPlus, CheckCircle2 } from "lucide-react";
import { toast, Toaster } from "sonner";

export default function MembershipForm() {
  const [formData, setFormData] = useState({ fullname: "", faculty: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!formData.fullname.trim() || !formData.faculty.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const body = new URLSearchParams(formData).toString();

      console.log("Submitting form data:", formData);
      console.log("Request body:", body);

      await fetch(
        "https://script.google.com/macros/s/AKfycbzp6c51QxllGaEyWXGLIkfcypFg7nNIA_jMU5_TLQ0quAPiVmwQmAsO9Iii4bbGOa5L/exec",
        {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: body,
        }
      );

      console.log("Request sent successfully");

      // With no-cors mode, we can't read the response, but if fetch completes without error, the request was sent
      // Google Apps Script will process the data even though we can't see the response
      setIsSuccess(true);
      toast.success(
        "Registration successful! Welcome to MSSN UNILORIN family! 🎉"
      );
      setFormData({ fullname: "", faculty: "" });

      // Reset success state after animation
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      console.error("Form submission error:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Error details:", errorMessage);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" richColors />
      <section className="min-h-screen py-24 px-4 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 text-white relative overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        {/* Floating orbs */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"
          animate={{
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl"
          animate={{
            y: [0, -40, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, type: "spring", bounce: 0.5 }}
              className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/30"
            >
              <UserPlus className="w-10 h-10 text-white" />
            </motion.div>

            <h2 className="text-4xl md:text-5xl text-white mb-4 font-bold">
              Join MSSN UNILORIN
            </h2>
            <div className="w-20 h-1 bg-white mx-auto mb-6"></div>
            <p className="text-xl text-emerald-50 max-w-2xl mx-auto">
              Take the first step towards being part of a vibrant Muslim
              community dedicated to faith, excellence, and service.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl"
          >
            {isSuccess ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.6, delay: 0.1 }}
                >
                  <CheckCircle2 className="w-24 h-24 text-white mx-auto mb-6" />
                </motion.div>
                <h3 className="text-3xl text-white mb-4 font-bold">
                  Welcome to the Family!
                </h3>
                <p className="text-emerald-50 text-lg">
                  Your registration has been successfully submitted.
                </p>
              </motion.div>
            ) : (
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <label
                    htmlFor="fullname"
                    className="block text-white text-lg mb-3 font-medium"
                  >
                    Full Name <span className="text-emerald-200">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullname"
                    name="fullname"
                    value={formData.fullname}
                    onChange={(e) =>
                      setFormData({ ...formData, fullname: e.target.value })
                    }
                    className="w-full text-white px-6 py-4 bg-white/95 backdrop-blur-sm border-2 border-white/30 rounded-2xl focus:outline-none focus:ring-4 focus:ring-white/50 focus:border-white transition-all text-gray-900 placeholder-gray-400 text-lg"
                    placeholder="Enter your full name"
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <label
                    htmlFor="faculty"
                    className="block text-white text-lg mb-3 font-medium"
                  >
                    Faculty <span className="text-emerald-200">*</span>
                  </label>
                  <select
                    id="faculty"
                    name="faculty"
                    value={formData.faculty}
                    onChange={(e) =>
                      setFormData({ ...formData, faculty: e.target.value })
                    }
                    className="w-full px-6 py-4 bg-white/95 backdrop-blur-sm border-2 border-white/30 rounded-2xl focus:outline-none focus:ring-4 focus:ring-white/50 focus:border-white transition-all text-gray-900 text-lg appearance-none cursor-pointer"
                    required
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23059669' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 1rem center",
                      backgroundSize: "1.5rem",
                    }}
                  >
                    <option value="">Select your faculty</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Arts">Arts</option>
                    <option value="Basic Medical Sciences">
                      Basic Medical Sciences
                    </option>
                    <option value="Clinical Sciences">Clinical Sciences</option>
                    <option value="Communication and Information Sciences">
                      Communication and Information Sciences
                    </option>
                    <option value="Education">Education</option>
                    <option value="Engineering and Technology">
                      Engineering and Technology
                    </option>
                    <option value="Environmental Sciences">
                      Environmental Sciences
                    </option>
                    <option value="Law">Law</option>
                    <option value="Life Sciences">Life Sciences</option>
                    <option value="Management Sciences">
                      Management Sciences
                    </option>
                    <option value="Pharmaceutical Sciences">
                      Pharmaceutical Sciences
                    </option>
                    <option value="Physical Sciences">Physical Sciences</option>
                    <option value="Social Sciences">Social Sciences</option>
                    <option value="Veterinary Medicine">
                      Veterinary Medicine
                    </option>
                  </select>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <motion.button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-white text-emerald-700 py-6 px-6 rounded-2xl text-lg font-semibold hover:bg-emerald-50 transition-all duration-300 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      {isSubmitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="w-6 h-6 border-3 border-emerald-700 border-t-transparent rounded-full"
                          />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-6 h-6" />
                          <span>Register Now</span>
                        </>
                      )}
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-emerald-100 to-teal-100 opacity-0 group-hover:opacity-100 transition-opacity"
                      initial={false}
                    />
                  </motion.button>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="text-center text-emerald-50 text-sm"
                >
                  By registering, you agree to be part of the MSSN UNILORIN
                  community and receive updates about our programs and events.
                </motion.p>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-12 text-center"
          >
            <p className="text-emerald-50 text-lg mb-4">Already a member?</p>
            <div className="flex flex-wrap justify-center gap-4 text-white">
              <a
                href="#programs"
                className="hover:text-emerald-200 transition-colors underline"
              >
                View Programs
              </a>
              <span className="text-emerald-300">•</span>
              <a
                href="#contact"
                className="hover:text-emerald-200 transition-colors underline"
              >
                Contact Us
              </a>
              <span className="text-emerald-300">•</span>
              <a
                href="#about"
                className="hover:text-emerald-200 transition-colors underline"
              >
                Learn More
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
