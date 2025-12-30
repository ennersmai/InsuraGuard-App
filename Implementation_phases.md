---

## 15. Implementation Phases

### Phase 1: Foundation 
- [x] Initialize Nuxt 3 project
- [x] Set up TailwindCSS with Inter font
- [x] Configure Supabase client
- [x] Create database schema + migrations
- [x] Set up Supabase Storage buckets
- [x] Implement RLS policies
- [x] Create layout components (Header, Footer)
- [x] Build landing page structure

### Phase 2: Authentication 
- [x] Implement Supabase Auth
- [x] Create login/signup pages
- [x] Set up auth middleware
- [x] Configure SendGrid for auth emails
- [x] Test password reset flow

### Phase 3: Registration Flow 
- [x] Build registration form component
- [x] Implement form validation (zod)
- [x] Set up file upload to Supabase Storage
- [x] Create URN generation utility
- [x] Integrate Stripe Checkout
- [x] Build Stripe webhook handler (Edge Function)
- [x] Test end-to-end registration flow

### Phase 4: PDF & Email 
- [x] Create PDF generation Edge Function
- [x] Design PDF template (matching brand)
- [x] Implement document embedding in PDF
- [x] Create email template
- [x] Build send-confirmation-email Edge Function
- [x] Test PDF generation + email delivery

### Phase 5: Admin Panel 
- [x] Set up admin role + middleware
- [x] Build admin dashboard (registrations table)
- [x] Implement search/filter/sort
- [x] Create registration detail view
- [x] Build template editor
- [x] Implement CSV export
- [x] Add GDPR delete functionality

### Phase 6: Content & Legal 
- [x] Write FAQ content
- [x] Write About page
- [x] Copy/adapt Terms & Conditions
- [x] Copy/adapt Privacy Policy
- [x] Create Claim form template
- [x] Create DSAR form template
- [x] Build URN verification tool
- [x] Implement cookie consent banner

### Phase 7: Polish & Testing 
- [ ] Mobile responsiveness check (User to test)
- [ ] Accessibility audit (WCAG AA) (User to test)
- [ ] Test all user flows (User to test)
- [ ] Test admin flows (User to test)
- [ ] Security audit (OWASP basics) (User to test)
- [x] Performance optimization
- [x] SEO meta tags
- [x] Error handling + user feedback
- [ ] Final brand consistency check (User to test)

### Phase 8: Deployment 
- [ ] Set up Vercel project
- [ ] Configure environment variables (production)
- [ ] Deploy Supabase Edge Functions
- [ ] Set up Stripe webhooks (production)
- [ ] Deploy to Vercel
- [ ] Test production environment
- [ ] Prepare handover documentation for Simon

---