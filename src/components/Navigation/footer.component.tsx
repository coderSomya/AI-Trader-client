import React from "react";
import {
  FaSquareGithub,
  FaSquareInstagram,
  FaSquareXTwitter,
  FaSquareYoutube,
} from "react-icons/fa6";

export const Footer = () => {
  return (
    <div className="w-full flex justify-center items-center p-5 border-t border-[#2d2d2d] gap-4">
      <a
        href="https://www.instagram.com/ethindiaco/?hl=en"
        referrerPolicy="no-referrer"
        target="_blank"
      >
        <FaSquareInstagram size={40} />
      </a>
      <a
        href="https://github.com/ETHIndia"
        referrerPolicy="no-referrer"
        target="_blank"
      >
        <FaSquareGithub size={40} />
      </a>
      <a
        href="https://x.com/ETHIndiaco"
        referrerPolicy="no-referrer"
        target="_blank"
      >
        <FaSquareXTwitter size={40} />
      </a>
      <a
        href="www.youtube.com/@ethindia965"
        referrerPolicy="no-referrer"
        target="_blank"
      >
        <FaSquareYoutube size={40} />
      </a>
    </div>
  );
};
