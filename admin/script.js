async function test(){
    const { data: {user}, error} = await sb.auth.getUser();
    if (!error && user) {
        const email = user.email;
        const { data, error } = await sb
        .from("Projects")
        .select("admin")
        .eq("email", email)
        .single();

        if (!error && data && data.admin) {
            console.log("Access granted");
        }
    }
}