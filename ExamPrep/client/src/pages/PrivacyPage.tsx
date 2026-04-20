import { Shield } from 'lucide-react';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-10">
    <h2 className="text-xl font-bold mb-3 text-foreground">{title}</h2>
    <div className="text-muted-foreground leading-relaxed space-y-3">{children}</div>
  </section>
);

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">

      {/* Header */}
      <div className="mb-12">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-primary/10 mb-6">
          <Shield className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-3">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">Last updated: April 2026</p>
      </div>

      <div className="rounded-xl border border-border bg-card/50 px-8 py-10">

        <Section title="1. Overview">
          <p>
            ExamPrep ("we", "us", "our") is committed to protecting your privacy. This policy explains what
            data we collect, how we use it, and how it is stored. ExamPrep is a learning platform — we collect
            only what is necessary to provide the service.
          </p>
        </Section>

        <Section title="2. Data We Collect">
          <p>When you create an account, we collect:</p>
          <ul className="list-none space-y-1 pl-2">
            {[
              'Full name — used to personalise your experience',
              'Email address — used for login and password reset',
              'Password — stored as a secure bcrypt hash, never as plain text',
            ].map(item => (
              <li key={item} className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p>When you use the platform, we also store:</p>
          <ul className="list-none space-y-1 pl-2">
            {[
              'Question attempt history — which questions you answered and whether they were correct',
              'Mock test attempt results — your scores, time taken, and answers submitted',
            ].map(item => (
              <li key={item} className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="3. Data We Do NOT Collect">
          <ul className="list-none space-y-1 pl-2">
            {[
              'No payment or billing information — ExamPrep is free',
              'No tracking pixels, advertising cookies, or third-party analytics',
              'No location data',
              'No device fingerprinting',
            ].map(item => (
              <li key={item} className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="4. How We Use Your Data">
          <ul className="list-none space-y-1 pl-2">
            {[
              'To authenticate you and maintain your session',
              'To display your dashboard — progress, accuracy stats, and attempt history',
              'To allow password reset via email',
              'We do not sell, share, or rent your data to any third party',
            ].map(item => (
              <li key={item} className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="5. Data Storage">
          <p>
            All data is stored in a SQL Server database. In the development environment this is a local
            SQL Server LocalDB instance on the host machine. No data is transmitted to external cloud
            databases or third-party services.
          </p>
          <p>
            Authentication tokens (JWT) are stored in your browser's <code className="text-primary text-sm bg-primary/10 px-1.5 py-0.5 rounded">localStorage</code>.
            Clearing your browser storage will log you out.
          </p>
        </Section>

        <Section title="6. Cookies">
          <p>
            ExamPrep does not use cookies. Your login state is maintained via a JWT token stored in
            localStorage, and your theme preference (dark/light) is stored in localStorage. Neither
            is shared with any third party.
          </p>
        </Section>

        <Section title="7. Your Rights">
          <p>You have the right to:</p>
          <ul className="list-none space-y-1 pl-2">
            {[
              'Access the data stored about your account',
              'Request deletion of your account and all associated data',
              'Update your account information',
            ].map(item => (
              <li key={item} className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="8. Changes to This Policy">
          <p>
            We may update this policy as the platform evolves. The "last updated" date at the top of
            this page will reflect any changes. Continued use of ExamPrep after changes constitutes
            acceptance of the updated policy.
          </p>
        </Section>

        <Section title="9. Contact">
          <p>
            If you have any questions about this privacy policy or your data, please open an issue on
            the project repository or contact the project maintainer directly.
          </p>
        </Section>

      </div>
    </div>
  );
}
