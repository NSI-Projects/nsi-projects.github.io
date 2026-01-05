export async function is_admin() {
    const { data: { session }, error } = await sb.auth.getSession();
    const user = session?.user;
    if (!user) return false;

    const { data, e } = await sb
        .from("Projects")
        .select("admin")
        .eq("email", user.email)
        .maybeSingle();

    if (error) {
        return false;
    }

    return data?.admin === true;
}