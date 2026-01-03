import os

def create_project_structure(project_name: str, project_title:str, project_description: str = ""):
    """
    Create a basic project structure with the given project name.
    
    The structure will include:
    - project_name/
        - index.html
        - style.css
        - script.js
        - readme.md
    """

    HTML_TEMPLATE = f"""<!DOCTYPE html>
<html lang="fr">
    <head>
        <meta charset="UTF-8">
        <title>NSI Projects - {project_title}</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
        <link rel="stylesheet" href="style.css">
        <link rel="icon" href="../favicon.ico" type="image/x-icon">
    </head>
    <body>
        <div class="header">
            <a class="icon home" href="../index.html"><i class="fa-solid fa-house-user"></i></a>
            <h2>{project_title}</h2>
            <a class="icon github" target="_blank" href="https://github.com/NSI-Projects/nsi-projects.github.io/tree/main/{project_name}"><i class="fa-brands fa-github"></i></a>
        </div>
    </body>
    <script src="script.js"></script>
    <script src="../inspect_script.js"></script>
</html>"""

    CSS_TEMPLATE = """body { 
    background-color:#1e1e1e;
    color:#f0f0f0;
    font-family:Consolas, 
    monospace;
    margin:0;
    padding:0; 
}
.header {
    display:flex;
    align-items:center;
    justify-content:center;
    padding:1vw;
    background:#2c2c2c;
    box-shadow:0 0 5vw rgba(0,0,0,0.4);
    position:relative;
}
.icon {
    transition: all 0.5s ease;
    cursor:pointer;
    font-size: 3vw;
    color: #fff;
    position: absolute;
    top : 1.5vh;
}
.icon:hover {
    transform: translateY(-0.5vh);
}
.icon.home {
    left: 2vw;
}
.icon.github {
    right: 2vw;
}

h2 {
    text-align:center;
    color:#fff;
    margin: 1vh 0;
    font-size: 2vw;
}"""

    README_TITLE = f"# 🔗 {project_title}\n\n"
    README_DESC = f"{project_description}\n" if project_description else "Project description goes here.\n"

    os.makedirs(project_name, exist_ok=True)

    with open(f"{project_name}/index.html", 'w', encoding="utf-8") as index_file:
        index_file.write(HTML_TEMPLATE)
    
    with open(f"{project_name}/style.css", 'w', encoding="utf-8") as css_file:
        css_file.write(CSS_TEMPLATE)
    
    with open(f"{project_name}/script.js", 'w', encoding="utf-8") as js_file:
        js_file.write("// Add your JavaScript code here\n")
    
    with open(f"{project_name}/readme.md", 'w', encoding="utf-8") as readme_file:
        readme_file.write(README_TITLE + README_DESC)
    
    print(f"Project structure for '{project_name}' created successfully.")

if __name__ == "__main__":
    create_project_structure(input("Enter the project name: "), input("Enter the project title: "), input("Enter the project description (optional): "))