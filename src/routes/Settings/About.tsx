import { ArrowSquareOut } from "@phosphor-icons/react";

import pkg from "../../../package.json";

export const About = () => {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm">{pkg.productName}</p>
      <p className="text-xs">{pkg.description}</p>
      <p className="text-sm">Version: v{pkg.version}</p>
      <a
        className="flex items-center gap-1 text-sm link link-hover"
        href="https://dexterplanner.com/releases"
        rel="noopener noreferrer"
        target="_blank"
      >
        Release Notes
        <ArrowSquareOut />
      </a>
      <a
        className="flex items-center gap-1 text-sm link link-hover"
        href="https://dexterplanner.com/terms"
        rel="noopener noreferrer"
        target="_blank"
      >
        Terms of Service
        <ArrowSquareOut />
      </a>
      <a
        className="flex items-center gap-1 text-sm link link-hover"
        href="https://dexterplanner.com/privacy"
        rel="noopener noreferrer"
        target="_blank"
      >
        Privacy Policy
        <ArrowSquareOut />
      </a>
    </div>
  );
};
