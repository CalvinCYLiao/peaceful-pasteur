# How to Deploy to GitHub Pages (如何部署至 GitHub Pages)

This project is built using pure static technologies (HTML, CSS, and Vanilla JavaScript). It can be hosted on GitHub Pages for free, allowing anyone to view the interactive agenda page in their browser.

這個專案使用純靜態網頁技術（HTML、CSS、原生 JS）編寫，可以直接免費部署到 GitHub Pages 上，讓所有人直接透過網頁連結查看互動式議程。

---

## Step 1: Create a Repository on GitHub (在 GitHub 上建立儲存庫)

1. Open [GitHub](https://github.com/) and log in.
2. Click the **New** button (or go to `https://github.com/new`) to create a new repository.
3. Set a repository name, e.g., `aieh2026-agenda`.
4. Choose **Public** (required for free GitHub Pages).
5. Leave "Add a README", "Add .gitignore", and "Choose a license" **unchecked** (unselected).
6. Click **Create repository**.

---

## Step 2: Push Local Code to GitHub (將本地代碼推送至 GitHub)

Open your terminal in this directory and run the following commands (or run `./publish.sh`):

在終端機中開啟此專案目錄，依序執行以下指令（或直接執行 `./publish.sh`）：

```bash
# 1. Add all files to git staging (將所有檔案加入 Git)
git add .

# 2. Commit the files (提交變更)
git commit -m "feat: AIEH 2026 interactive agenda with chronological panel ordering"

# 3. Rename branch to main (將分支命名為 main)
git branch -M main

# 4. Link your local repo to your GitHub repo (連結遠端 GitHub 儲存庫)
# (Replace USERNAME and REPO-NAME with your GitHub username and the repo name you just created)
git remote add origin https://github.com/USERNAME/REPO-NAME.git

# 5. Push to GitHub (推送至 GitHub)
git push -u origin main
```

---

## Step 3: Enable GitHub Pages (啟用 GitHub Pages)

1. Go to your repository page on GitHub.
2. Click the **Settings** tab at the top.
3. On the left sidebar, click **Pages** (under the "Code and automation" section).
4. Under **Build and deployment** -> **Source**, make sure **Deploy from a branch** is selected.
5. Under **Branch**, select `main` and `/ (root)`, then click **Save**.
6. Wait 1-2 minutes. Refresh the settings page, and you will see your live site link at the top:
   `Your site is live at https://USERNAME.github.io/REPO-NAME/`

---

## 📄 Included Files (專案檔案清單)
* [index.html](file:///Users/calvin/Documents/antigravity/peaceful-pasteur/index.html): Interactive schedule webpage
* [styles.css](file:///Users/calvin/Documents/antigravity/peaceful-pasteur/styles.css): Light academic stylesheets (responsive layout)
* [app.js](file:///Users/calvin/Documents/antigravity/peaceful-pasteur/app.js): Jump navigation and category filters logic
* [conference_agenda.md](file:///Users/calvin/Documents/antigravity/peaceful-pasteur/conference_agenda.md): Markdown schedule with Gantt chart
* [publish.sh](file:///Users/calvin/Documents/antigravity/peaceful-pasteur/publish.sh): Automation helper script
