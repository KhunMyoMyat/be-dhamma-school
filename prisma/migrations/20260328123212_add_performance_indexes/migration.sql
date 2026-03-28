-- CreateIndex
CREATE INDEX "donations_status_idx" ON "donations"("status");

-- CreateIndex
CREATE INDEX "donations_category_idx" ON "donations"("category");

-- CreateIndex
CREATE INDEX "donations_createdAt_idx" ON "donations"("createdAt");

-- CreateIndex
CREATE INDEX "events_date_idx" ON "events"("date");

-- CreateIndex
CREATE INDEX "events_is_active_idx" ON "events"("is_active");

-- CreateIndex
CREATE INDEX "lessons_category_idx" ON "lessons"("category");

-- CreateIndex
CREATE INDEX "lessons_published_idx" ON "lessons"("published");

-- CreateIndex
CREATE INDEX "lessons_created_at_idx" ON "lessons"("created_at");

-- CreateIndex
CREATE INDEX "monthly_donors_status_idx" ON "monthly_donors"("status");

-- CreateIndex
CREATE INDEX "monthly_donors_category_idx" ON "monthly_donors"("category");

-- CreateIndex
CREATE INDEX "teachings_category_idx" ON "teachings"("category");

-- CreateIndex
CREATE INDEX "teachings_is_published_idx" ON "teachings"("is_published");

-- CreateIndex
CREATE INDEX "teachings_createdAt_idx" ON "teachings"("createdAt");
