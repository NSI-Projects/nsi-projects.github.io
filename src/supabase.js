const SUPABASE_URL = "https://nkaesmbhlhyrdkyxjwvu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rYWVzbWJobGh5cmRreXhqd3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0NjI0MjIsImV4cCI6MjA4MzAzODQyMn0.xu30-4ev4hIkJpRTU67NAoGUHT_9uC-F1s8qdxpKPcM";

const sb = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);