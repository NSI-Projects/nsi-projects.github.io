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
            if (commits[0]) {
                localStorage.setItem(`lastModified_${folderName}`, commits[0]?.commit.author.date);
                localStorage.setItem(`cacheTime_${folderName}`, Date.now());
            }
            return commits[0]?.commit.author.date || null;
    });
}