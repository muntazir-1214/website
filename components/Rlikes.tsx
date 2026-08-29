"use client";

import { motion } from "framer-motion";
import { FaSearch, FaInstagram, FaFacebookF } from "react-icons/fa";

export default function Rlikes() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="min-h-screen bg-[#f5f7ff] flex items-center justify-center p-6"
    >
      <div className="bg-white rounded-[28px] shadow-xl p-10 max-w-6xl w-full">
        {/* Website Content Here */}
      </div>
    </motion.div>
  );
}
