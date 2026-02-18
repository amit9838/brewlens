<div align="center">
  <h1>🍺 BrewLens</h1>
  <p><strong>A modern, web-based explorer for Homebrew Casks and Formulae.</strong></p>

  <p>
    <a href="https://amit9838.github.io/brewlens/">View Live Demo</a>
    ·
    <a href="https://github.com/amit9838/brewlens/issues">Report Bug</a>
    ·
    <a href="https://github.com/amit9838/brewlens/issues">Request Feature</a>
  </p>

  <!-- You can add badges here later, e.g., for GitHub stars, license, etc. -->
  <img src="https://img.shields.io/github/stars/amit9838/brewlens?style=social" alt="GitHub stars">
  <img src="https://img.shields.io/github/languages/top/amit9838/brewlens" alt="Top language">
</div>

---

## ✨ What is BrewLens?

BrewLens is a modern browser-based tool that fetches and parses **Homebrew Cask and Formula** metadata directly from official Homebrew sources. It helps developers and power users inspect application and command-line tool details with clarity and speed — **all without using a single terminal command.**

You can browse both **Casks (macOS Apps)** and **Formulae (CLI Tools)** , inspecting crucial details such as:
*   Version details (stable, etc.)
*   Installation commands
*   Homepages and download URLs
*   SHA256 checksums
*   Dependencies and build dependencies
*   Artifacts (for casks)
*   Full JSON representation
*   Deprecation and disable status

## ⭐ Key Features

### 📦 **Cask & Formula Switcher**
Instantly toggle between browsing the entire **Cask** (macOS apps) or **Formula** (CLI tools) database.

### 🔍 **Powerful Search**
Instantly search across thousands of Homebrew packages with pagination and fast filtering. Filter by name, token, description keywords, and more.

### 🌗 **Dynamic Light/Dark Theme**
The entire UI (body, cards, header, modals) updates instantly when switching themes and remembers your preference for a seamless experience.

## 🎯 Who is it For?

*   **Developers:** Inspect metadata, versions, URLs, and dependencies while building or debugging casks and formulae.
*   **Security / Compliance Teams:** Quickly verify download URLs, SHA256 checksums, and source authenticity for any package.
*   **SysAdmins:** Audit applications and tools before deploying to managed macOS or Linux environments.
*   **Homebrew Contributors:** Easily investigate cask or formula structure before making pull requests.
*   **General Users:** Discover new macOS apps and command-line tools available via Homebrew without ever opening the Terminal.

## 🛠️ Built With

*   [![React][React.js]][React-url]
*   [![TypeScript][TypeScript]][TypeScript-url]
*   [![Vite][Vite]][Vite-url]


## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites
*   Node.js (which includes npm) - [Download here](https://nodejs.org/)

### Installation
1.  Clone the repo
    ```sh
    git clone https://github.com/amit9838/brewlens.git
    ```
2.  Navigate to the project directory
    ```sh
    cd brewlens
    ```
3.  Install NPM packages
    ```sh
    npm install
    ```
4.  Start the development server
    ```sh
    npm run dev
    ```
5.  Open `http://localhost:5173` (or the port shown in your terminal) to view it in the browser.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` file for more information.

## 📬 Contact

Project Link: [https://github.com/amit9838/brewlens](https://github.com/amit9838/brewlens)

---

<p align="center">Made with ❤️ for the Homebrew community</p>

<!-- MARKDOWN LINKS & IMAGES -->
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[TypeScript]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
[Vite]: https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white
[Vite-url]: https://vitejs.dev/
[MUI]: https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=mui&logoColor=white
[MUI-url]: https://mui.com/