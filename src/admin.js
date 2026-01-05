export async function is_admin(user_email, rank) {
    if (user_email === "") {
        const { data: { session }, error } = await sb.auth.getSession();
        var email = session?.user.email;
        if (!email) return false;
    } else {
        var email = user_email;
    }

    const { data, error } = await sb
        .from("DataUsers")
        .select("*")
        .eq("email", email)
        .maybeSingle();

    if (error) {
        return false;
    }

    return data?.admin === true && data?.rank >= rank;
}

export async function getUserData(email="") {
    if (!email) {
        const { data: { session }, error: sessionError } = await sb.auth.getSession();
        if (sessionError || !session?.user) return null;
        email = session?.user.email;
    }

    const { data: userData, error: userError } = await sb
        .from("DataUsers")
        .select("*")
        .eq("email", email)
        .single();

    return userData;
}