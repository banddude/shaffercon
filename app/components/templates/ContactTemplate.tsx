import type { Page } from "@/lib/pages";
import { getPageSections } from "@/lib/pages";
import { classNames, theme } from "@/app/styles/theme";
import ContactForm from "@/app/components/ContactForm";
import siteConfig from "@/data/site-config.json";
import type { SiteConfig } from "@/types";

interface ContactTemplateProps {
  page: Page;
}

export default function ContactTemplate({ page }: ContactTemplateProps) {
  const config = siteConfig as SiteConfig;
  const sections = getPageSections(page.id);
  const formSection = sections.find((s) => s.section_type === "form");
  const supportSection = sections.find((s) => s.section_type === "support");

  return (
    <div>
      {/* Hero Section */}
      <div
        className={classNames.heroSection}
        style={{
          background: `linear-gradient(to right, ${theme.colors.primary.main}, ${theme.colors.primary.dark})`,
        }}
      >
        <div className={classNames.sectionContainer}>
          <h1 className={classNames.heading1} style={{ color: theme.colors.background.light }}>
            {page.title}
          </h1>
          <p className="text-xl max-w-2xl" style={{ color: theme.colors.neutral[200] }}>
            Connect with Shaffer Construction for premier EV charging and electrical solutions in Southern California.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className={classNames.sectionContainer + " py-16"}>
        {/* Contact Form */}
        {formSection && (
          <div className="mb-16">
            <ContactForm title={formSection.heading || undefined} />
          </div>
        )}

        {/* Support Section */}
        {supportSection && (
          <div className={classNames.spacingY + " pt-12 border-t"} style={{ borderColor: theme.colors.border }}>
            <h2 className={classNames.heading3}>{supportSection.heading}</h2>
            <p className={classNames.body}>
              {supportSection.content}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
