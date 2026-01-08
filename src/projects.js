export function formatName(name) {
    return "🔗 " + name
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, char => char.toUpperCase());
}

export function fetchLastModifiedDate(folderName) {
    const url = `https://api.github.com/repos/NSI-Projects/nsi-projects.github.io/commits?path=${folderName}&per_page=1`;

    return fetch(url)
        .then(res => res.ok ? res.json() : [])
        .then(commits => {
            localStorage.setItem(`lastModified_${folderName}`, commits[0]?.commit.author.date || null);
            localStorage.setItem(`cacheTime_${folderName}`, Date.now());
            if (commits.length === 0) return null;
            return new Date(commits[0].commit.author.date);
    });
}

export function fetchReadme(folderName) {
    const url = `https://api.github.com/repos/NSI-Projects/nsi-projects.github.io/contents/${folderName}/readme.md`;

    return fetch(url)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
        if (!data) return null;

        const content = decodeURIComponent(
            escape(atob(data.content))
        );

        const lines = content.split("\n");

        localStorage.setItem(`readme_${folderName}`, JSON.stringify({
            title: lines[0]?.replace(/^#\s*/, "").trim() || formatName(folderName),
            description: lines.slice(2).join(" ").trim()
        }));
        localStorage.setItem(`cacheTime_${folderName}`, Date.now());
        
        return {
            title: lines[0]?.replace(/^#\s*/, "").trim() || formatName(folderName),
            description: lines.slice(2).join(" ").trim()
        };
    });
}

export async function check_status(project) {
    const { data, error } = await sb
        .from("CurrentProjects")
        .select("*")
        .eq("project", project)
        .single();

    return {
        refused: data.refused,
        hidden: data.hidden,
        beta: data.beta,
        building: data.building,
        admin: data.admin
    };
}