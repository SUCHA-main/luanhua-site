Authorized local security assessment scope.

Target:
- Local repository only: current luanhua-site project

Allowed:
- Static site source code review
- Astro/Vercel configuration review
- Dependency risk review
- Security header recommendations
- External link safety review
- XSS risk review in static rendering, Markdown, HTML, and client-side scripts
- Secret leakage check for committed files only

Forbidden:
- Do not scan production website
- Do not scan third-party domains
- Do not perform high-frequency requests
- Do not perform stress testing or DoS testing
- Do not brute force
- Do not bypass authentication, CAPTCHA, or WAF
- Do not access real sensitive data
- Do not print API keys, cookies, tokens, or secrets
- Do not modify source code
- Do not commit files

Output requirements:
- List findings by High / Medium / Low
- Include evidence and file path when possible
- Explain impact
- Provide fix suggestions
- Provide verification steps
