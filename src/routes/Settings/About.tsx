import pkg from "../../../package.json";

export const About = () => {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm">{pkg.productName}</p>
      <p className="text-xs">{pkg.description}</p>
      <p className="text-sm">Version: v{pkg.version}</p>
      <p className="text-sm">Terms of Service</p>
      <p className="text-sm">Privacy Policy</p>
    </div>
  );
};
