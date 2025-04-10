CREATE POLICY "Users can delete their own <TABLE>" 
ON public.<TABLE>
FOR DELETE
TO authenticated
USING (( SELECT auth.uid() AS uid) = user_id);

CREATE POLICY "Users can insert their own <TABLE>" 
ON public.<TABLE>
FOR INSERT
TO authenticated
WITH CHECK (( SELECT auth.uid() AS uid) = user_id);

CREATE POLICY "Users can read their own <TABLE>" 
ON public.<TABLE>
FOR SELECT
TO authenticated
USING (( SELECT auth.uid() AS uid) = user_id);

CREATE POLICY "Users can update their own <TABLE>" 
ON public.<TABLE>
FOR UPDATE
TO authenticated
USING (( SELECT auth.uid() AS uid) = user_id)
WITH CHECK (true);
