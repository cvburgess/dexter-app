import pkg from "../../../package.json";
import ossProjects from "../../licenses.json";

export const About = () => {
  return (
    <>
      <div className="flex flex-col gap-2">
        <p className="text-4xl font-bold">
          {pkg.productName}
          <span className="ml-2 text-sm font-normal">v{pkg.version}</span>
        </p>
        <p className="text-sm">{pkg.description}</p>
      </div>

      <ExternalLink
        link="https://dexterplanner.com/method"
        title="Learn about the Dexter Method"
      />

      <details className="bg-base-100 border border-base-300 mb-4 rounded-box">
        <summary className="collapse-title font-semibold text-sm min-h-0">
          Open source projects that make Dexter possible
        </summary>
        <div className="flex flex-col gap-4 p-4 @container">
          {Object.entries(ossProjects).map(([title, project]) => (
            <OpenSourceProject
              key={title}
              licenseUrl={project.licenseUrl}
              licenses={project.licenses}
              repository={project.repository}
              title={title}
            />
          ))}
        </div>
      </details>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-4 mt-auto">
        <ExternalLink
          link="https://dexterplanner.com/releases"
          title="Release Notes"
        />
        <ExternalLink
          link="https://dexterplanner.com/terms"
          title="Terms of Service"
        />
        <ExternalLink
          link="https://dexterplanner.com/privacy"
          title="Privacy Policy"
        />
      </div>
    </>
  );
};

type TOpenSourceProjectProps = {
  licenses: string;
  licenseUrl: string;
  repository: string;
  title: string;
};

const OpenSourceProject = ({
  licenses,
  licenseUrl,
  repository,
  title,
}: TOpenSourceProjectProps) => (
  <div className="flex gap-2 flex-col @md:flex-row">
    <p className="text-sm font-bold mr-auto self-center">{title}</p>
    <ExternalLink link={licenseUrl} title={licenses} />
    <ExternalLink link={repository} title="Repository" />
  </div>
);

const ExternalLink = ({ link, title }: { link: string; title: string }) => (
  <a className="btn" href={link} rel="noopener noreferrer" target="_blank">
    {title}
  </a>
);
