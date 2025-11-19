-- RLS Policies for cohorts
CREATE POLICY "Admins and teachers can manage cohorts"
ON public.cohorts
FOR ALL
USING (
  has_role(auth.uid(), 'admin') OR 
  has_role(auth.uid(), 'teacher')
);

CREATE POLICY "Students can view cohorts they belong to"
ON public.cohorts
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.cohort_members
    WHERE cohort_id = cohorts.id AND user_id = auth.uid()
  )
);

-- RLS Policies for cohort_members
CREATE POLICY "Admins and teachers can manage cohort members"
ON public.cohort_members
FOR ALL
USING (
  has_role(auth.uid(), 'admin') OR 
  has_role(auth.uid(), 'teacher')
);

CREATE POLICY "Users can view their cohort memberships"
ON public.cohort_members
FOR SELECT
USING (user_id = auth.uid());

-- RLS Policies for enrollments
CREATE POLICY "Users can view their own enrollments"
ON public.enrollments
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Admins and teachers can view all enrollments"
ON public.enrollments
FOR SELECT
USING (
  has_role(auth.uid(), 'admin') OR 
  has_role(auth.uid(), 'teacher')
);

CREATE POLICY "Admins and teachers can manage enrollments"
ON public.enrollments
FOR ALL
USING (
  has_role(auth.uid(), 'admin') OR 
  has_role(auth.uid(), 'teacher')
);

-- RLS Policies for cohort_enrollments
CREATE POLICY "Admins and teachers can manage cohort enrollments"
ON public.cohort_enrollments
FOR ALL
USING (
  has_role(auth.uid(), 'admin') OR 
  has_role(auth.uid(), 'teacher')
);

-- RLS Policies for meta_courses
CREATE POLICY "Admins can manage meta courses"
ON public.meta_courses
FOR ALL
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Everyone can view meta courses"
ON public.meta_courses
FOR SELECT
USING (true);

-- RLS Policies for progress_tracking
CREATE POLICY "Users can view their own progress"
ON public.progress_tracking
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own progress"
ON public.progress_tracking
FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own progress"
ON public.progress_tracking
FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins and teachers can view all progress"
ON public.progress_tracking
FOR SELECT
USING (
  has_role(auth.uid(), 'admin') OR 
  has_role(auth.uid(), 'teacher')
);

CREATE POLICY "Admins and teachers can manage all progress"
ON public.progress_tracking
FOR ALL
USING (
  has_role(auth.uid(), 'admin') OR 
  has_role(auth.uid(), 'teacher')
);

-- RLS Policies for library_items
CREATE POLICY "Everyone can view public library items"
ON public.library_items
FOR SELECT
USING (is_public = true);

CREATE POLICY "Enrolled users can view course-specific library items"
ON public.library_items
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.enrollments
    WHERE user_id = auth.uid() 
    AND course_id = library_items.course_id
    AND status = 'active'
  )
);

CREATE POLICY "Admins and teachers can manage library items"
ON public.library_items
FOR ALL
USING (
  has_role(auth.uid(), 'admin') OR 
  has_role(auth.uid(), 'teacher')
);

-- RLS Policies for library storage
CREATE POLICY "Enrolled users can view course library files"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'library' AND
  (
    has_role(auth.uid(), 'admin') OR
    has_role(auth.uid(), 'teacher') OR
    EXISTS (
      SELECT 1 FROM public.library_items li
      JOIN public.enrollments e ON li.course_id = e.course_id
      WHERE li.file_path = name
      AND e.user_id = auth.uid()
      AND e.status = 'active'
    ) OR
    EXISTS (
      SELECT 1 FROM public.library_items li
      WHERE li.file_path = name
      AND li.is_public = true
    )
  )
);

CREATE POLICY "Admins and teachers can upload library files"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'library' AND
  (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'teacher'))
);

CREATE POLICY "Admins and teachers can update library files"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'library' AND
  (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'teacher'))
);

CREATE POLICY "Admins and teachers can delete library files"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'library' AND
  (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'teacher'))
);

-- Create triggers for updated_at
CREATE TRIGGER update_cohorts_updated_at
BEFORE UPDATE ON public.cohorts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_enrollments_updated_at
BEFORE UPDATE ON public.enrollments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_progress_tracking_updated_at
BEFORE UPDATE ON public.progress_tracking
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_library_items_updated_at
BEFORE UPDATE ON public.library_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to auto-enroll cohort members when cohort is enrolled in course
CREATE OR REPLACE FUNCTION public.sync_cohort_enrollments()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') AND NEW.auto_sync = true THEN
    -- Enroll all cohort members in the course
    INSERT INTO public.enrollments (user_id, course_id, role, enrolled_by)
    SELECT cm.user_id, NEW.course_id, 'student', auth.uid()
    FROM public.cohort_members cm
    WHERE cm.cohort_id = NEW.cohort_id
    ON CONFLICT (user_id, course_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER cohort_enrollment_sync
AFTER INSERT OR UPDATE ON public.cohort_enrollments
FOR EACH ROW
EXECUTE FUNCTION public.sync_cohort_enrollments();

-- Function to auto-enroll new cohort members
CREATE OR REPLACE FUNCTION public.sync_new_cohort_member()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Enroll new member in all courses the cohort is enrolled in
  INSERT INTO public.enrollments (user_id, course_id, role, enrolled_by)
  SELECT NEW.user_id, ce.course_id, 'student', auth.uid()
  FROM public.cohort_enrollments ce
  WHERE ce.cohort_id = NEW.cohort_id AND ce.auto_sync = true
  ON CONFLICT (user_id, course_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER new_cohort_member_sync
AFTER INSERT ON public.cohort_members
FOR EACH ROW
EXECUTE FUNCTION public.sync_new_cohort_member();

-- Function to enroll in parent meta courses
CREATE OR REPLACE FUNCTION public.sync_meta_course_enrollment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- When user enrolls in child course, enroll them in parent meta course
    INSERT INTO public.enrollments (user_id, course_id, role, enrolled_by)
    SELECT NEW.user_id, mc.parent_course_id, NEW.role, NEW.enrolled_by
    FROM public.meta_courses mc
    WHERE mc.child_course_id = NEW.course_id
    ON CONFLICT (user_id, course_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER meta_course_enrollment_sync
AFTER INSERT ON public.enrollments
FOR EACH ROW
EXECUTE FUNCTION public.sync_meta_course_enrollment();