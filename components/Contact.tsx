"use client";

import { contact, meta } from "@/lib/content";
import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { Tilt3D } from "./Tilt3D";
import { FlipText } from "./FlipText";

export function Contact() {
  return (
    <Section id="contact">
      <Reveal>
        <Tilt3D
          max={5}
          className="relative overflow-hidden rounded-card border border-amber/25 bg-gradient-to-br from-amber/[0.12] via-bg-2 to-teal/[0.1] p-[clamp(2rem,5vw,3.4rem)]"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-amber/15 blur-[90px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-20 left-1/4 h-64 w-64 rounded-full bg-teal/15 blur-[90px]"
          />
          <h2 className="group depth-2 relative font-display text-[clamp(1.9rem,5vw,2.9rem)] font-semibold tracking-[-0.02em]">
            <FlipText a={contact.heading} b="ok, just hire me already" />
          </h2>
          <p className="depth-1 my-3.5 max-w-[50ch] text-muted">{contact.body}</p>
          <div className="depth-1 flex flex-wrap gap-3">
            <a
              href={`mailto:${meta.email}`}
              className="rounded-[9px] border border-amber bg-amber px-5 py-2.5 font-mono text-[0.88rem] font-semibold text-[#1a1206] transition-colors hover:bg-[#f6c47e]"
            >
              {meta.email}
            </a>
            <ContactLink href={meta.phoneHref}>{meta.phone}</ContactLink>
            <ContactLink href={meta.github} external>
              GitHub
            </ContactLink>
            {meta.linkedin && (
              <ContactLink href={meta.linkedin} external>
                LinkedIn
              </ContactLink>
            )}
          </div>
        </Tilt3D>
      </Reveal>
    </Section>
  );
}

function ContactLink({
  href,
  children,
  external,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener" } : {})}
      className="rounded-[9px] border border-line px-5 py-2.5 font-mono text-[0.88rem] text-ink transition-colors hover:border-muted"
    >
      {children}
    </a>
  );
}
