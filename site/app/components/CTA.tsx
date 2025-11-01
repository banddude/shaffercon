"use client";

import { Section, Container, SectionHeading, Paragraph, Button } from "@/app/components/UI";

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
    <Section border="top" padding="lg">
      <Container maxWidth="md">
        <div className="text-center space-y-6">
          <SectionHeading className="mb-0">{heading}</SectionHeading>
          <Paragraph className="mb-0">{text}</Paragraph>
          <div className="pt-2">
            <Button asLink href={buttonHref} variant="primary">
              {buttonText}
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
