import { ScrollText } from 'lucide-react';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-10">
    <h2 className="text-xl font-bold mb-3 text-foreground">{title}</h2>
    <div className="text-muted-foreground leading-relaxed space-y-3">{children}</div>
  </section>
);

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">

      {/* Header */}
      <div className="mb-12">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-primary/10 mb-6">
          <ScrollText className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-3">Terms of Use</h1>
        <p className="text-sm text-muted-foreground">Last updated: April 2026</p>
      </div>

      <div className="rounded-xl border border-border bg-card/50 px-8 py-10">

        <Section title="1. Acceptance of Terms">
          <p>
            By accessing or using ExamPrep ("the platform"), you agree to be bound by these Terms of Use.
            If you do not agree with any part of these terms, you may not use the platform.
          </p>
        </Section>

        <Section title="2. Description of Service">
          <p>
            ExamPrep is a free educational platform that provides:
          </p>
          <ul className="list-none space-y-1 pl-2">
            {[
              'Study materials and structured lessons for IT certifications',
              'Practice questions with explanations',
              'Timed mock exams',
              'Certification learning paths',
              'Personal progress tracking',
            ].map(item => (
              <li key={item} className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="3. User Accounts">
          <p>
            To access certain features (mock exams, dashboard, progress tracking), you must create an
            account. You are responsible for:
          </p>
          <ul className="list-none space-y-1 pl-2">
            {[
              'Providing accurate information when registering',
              'Keeping your password secure and confidential',
              'All activity that occurs under your account',
              'Notifying us immediately of any unauthorised use',
            ].map(item => (
              <li key={item} className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="4. Acceptable Use">
          <p>You agree not to:</p>
          <ul className="list-none space-y-1 pl-2">
            {[
              'Use the platform for any unlawful purpose',
              'Attempt to reverse-engineer, scrape, or copy exam content for commercial redistribution',
              'Share your account credentials with others',
              'Submit false or misleading information',
              'Interfere with or disrupt the platform\'s infrastructure',
            ].map(item => (
              <li key={item} className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="5. Intellectual Property">
          <p>
            The content on ExamPrep — including questions, explanations, lesson material, and course
            structure — is provided for personal educational use only. You may not reproduce, distribute,
            or create derivative works from this content without explicit written permission.
          </p>
          <p>
            Certification names (e.g., Microsoft Azure, AWS, CompTIA) are trademarks of their respective
            owners. ExamPrep is not affiliated with, endorsed by, or officially associated with any
            certification vendor.
          </p>
        </Section>

        <Section title="6. Disclaimer of Warranties">
          <p>
            ExamPrep is provided "as is" without warranties of any kind. We do not guarantee that:
          </p>
          <ul className="list-none space-y-1 pl-2">
            {[
              'The platform will be error-free or uninterrupted',
              'Content is always accurate, complete, or up to date with the latest exam objectives',
              'Using the platform will result in passing any certification exam',
            ].map(item => (
              <li key={item} className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p>
            Always refer to the official certification vendor's website for the most current exam
            objectives and requirements.
          </p>
        </Section>

        <Section title="7. Limitation of Liability">
          <p>
            To the maximum extent permitted by law, ExamPrep and its contributors shall not be liable
            for any indirect, incidental, or consequential damages arising from your use of the platform,
            including but not limited to loss of data or failure to pass an exam.
          </p>
        </Section>

        <Section title="8. Modifications to Terms">
          <p>
            We reserve the right to update these terms at any time. Changes will be reflected by the
            updated date at the top of this page. Continued use of the platform after changes are posted
            constitutes your acceptance of the new terms.
          </p>
        </Section>

        <Section title="9. Governing Law">
          <p>
            These terms are governed by applicable law. Any disputes shall be resolved through good-faith
            negotiation before pursuing formal legal remedies.
          </p>
        </Section>

        <Section title="10. Contact">
          <p>
            For any questions about these terms, please open an issue on the project repository or
            contact the maintainer directly.
          </p>
        </Section>

      </div>
    </div>
  );
}
