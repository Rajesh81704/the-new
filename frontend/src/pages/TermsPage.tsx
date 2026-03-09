const TermsPage = () => {
  return (
    <div className="max-w-lg mx-auto px-4 py-4 space-y-6">
      <div>
        <h2 className="font-heading font-bold text-xl text-foreground">Terms & Conditions</h2>
        <p className="text-sm text-muted-foreground">Last updated: March 1, 2026</p>
      </div>

      <div className="space-y-5 text-sm text-foreground/80 leading-relaxed">
        <section>
          <h3 className="font-heading font-semibold text-foreground mb-2">1. Acceptance of Terms</h3>
          <p>By accessing and using Magically Super, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not access the platform.</p>
        </section>

        <section>
          <h3 className="font-heading font-semibold text-foreground mb-2">2. User Accounts</h3>
          <p>You are responsible for maintaining the confidentiality of your account credentials. You agree to accept responsibility for all activities that occur under your account.</p>
        </section>

        <section>
          <h3 className="font-heading font-semibold text-foreground mb-2">3. Acceptable Use</h3>
          <p>You agree not to use the platform for any unlawful purpose or in any way that could damage, disable, or impair the service. Professional conduct is expected at all times.</p>
        </section>

        <section>
          <h3 className="font-heading font-semibold text-foreground mb-2">4. Content</h3>
          <p>Users retain ownership of content they post. By posting content, you grant Magically Super a non-exclusive license to display and distribute your content within the platform.</p>
        </section>

        <section>
          <h3 className="font-heading font-semibold text-foreground mb-2">5. Privacy</h3>
          <p>Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information when you use our services.</p>
        </section>

        <section>
          <h3 className="font-heading font-semibold text-foreground mb-2">6. Modifications</h3>
          <p>We reserve the right to modify these terms at any time. Continued use of the platform following any changes constitutes your acceptance of the revised terms.</p>
        </section>
      </div>
    </div>
  );
};

export default TermsPage;
