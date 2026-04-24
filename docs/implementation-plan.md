# Step-by-step Implementation Plan

1. **Initialize Monorepo**
   - Setup `frontend` and `backend` projects.
   - Configure env files and deployment variables.

2. **Database Setup**
   - Execute `database/schema.sql`.
   - Insert single admin user using bcrypt hash.

3. **Backend Core**
   - Configure DB pool, auth middleware, validation middleware.
   - Implement auth + public inquiry + admin modules.
   - Add file upload endpoint (multer) and secure MIME filtering.

4. **Automation Modules**
   - Estimate CRUD + item management + duplicate feature.
   - Convert estimate to invoice + GST + status updates.
   - Finance reports endpoint with monthly aggregations.
   - License generation endpoint with expiry jobs.

5. **PDF Engine**
   - Build branded HTML templates for estimate/invoice.
   - Render/download using Puppeteer.

6. **Frontend Public Website**
   - Finalize premium landing sections and products pages.
   - Connect contact form to `/api/public/inquiries`.

7. **Frontend Admin Panel**
   - Implement protected routing + login lifecycle.
   - Build table/form components reusable across modules.
   - Integrate dashboard cards and charts.

8. **Hardening & QA**
   - Validate inputs, sanitize uploads, test API auth.
   - Add unit/integration tests and perform UAT.

9. **Deploy**
   - Frontend on Vercel, backend on Render/VPS, DB on MySQL host.
   - Set production environment variables and CORS origins.
