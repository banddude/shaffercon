"use client";

import { SectionHeading, Paragraph, Button } from "@/app/components/UI";
import { ASSET_PATH } from "@/app/config";

interface CTAProps {
  heading?: string;
  text?: string;
  buttonText?: string;
  buttonHref?: string;
}

export default function CTA({
  heading = "Need Electrical Support Anywhere in California?",
  text = "Need electrical services anywhere in California? Contact us for a free consultation.",
  buttonText = "Contact Us",
  buttonHref = "/contact-us",
}: CTAProps) {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        background: "var(--background)",
        minHeight: "75vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Background Image with Pan/Zoom Animation */}
      <div className="absolute inset-0">
        <div
          className="w-full h-full cta-bg-image"
          style={{
            backgroundImage: `url(${ASSET_PATH("/brand-assets/img_2649.jpg")})`,
            backgroundSize: "cover",
            backgroundPosition: "center center",
            filter: "brightness(0.4)",
            animation: "slowPanZoom 45s ease-in-out infinite both",
          }}
        />
      </div>

      {/* Overlay for text contrast */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.4)",
        }}
      />

      {/* Title at top */}
      <div className="relative z-10 w-full px-4 sm:px-6 pt-8 sm:pt-16 cta-title">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold"
            style={{
              color: "#ffffff",
              marginBottom: "0",
            }}
          >
            {heading}
          </h2>
        </div>
      </div>

      {/* Contact info at bottom */}
      <div className="relative z-10 w-full px-4 sm:px-6 pb-8 sm:pb-12 cta-bottom">
        <div className="max-w-3xl mx-auto text-center">
          <Paragraph
            style={{
              color: "#d1d5db",
              marginBottom: "1.5rem",
              fontSize: "1rem",
            }}
            className="sm:text-lg"
          >
            {text}
          </Paragraph>
          <Button asLink href={buttonHref} variant="primary">
            {buttonText}
          </Button>
        </div>
      </div>

      <style>{`
        /* Reduce padding on landscape/wide screens to create 30% clear center */
        @media (min-aspect-ratio: 1/1) {
          .cta-title {
            padding-top: 1.5rem !important;
          }
          .cta-bottom {
            padding-bottom: 1.5rem !important;
          }
        }

        @media (min-aspect-ratio: 1/1) and (min-width: 640px) {
          .cta-title {
            padding-top: 2rem !important;
          }
          .cta-bottom {
            padding-bottom: 2rem !important;
          }
        }

        .cta-bg-image {
          background-position: 95% center;
        }

        @keyframes slowPanZoom {
          0% {
            transform: scale(1.8);
            transform-origin: 95% center;
          }
          100% {
            transform: scale(1);
            transform-origin: center center;
          }
        }

        @media (min-width: 768px) {
          .cta-bg-image {
            background-position: 70% center;
          }

          @keyframes slowPanZoom {
            0% {
              transform: scale(2);
              transform-origin: 70% center;
            }
            100% {
              transform: scale(1);
              transform-origin: center center;
            }
          }
        }
      `}</style>
    </section>
  );
}
