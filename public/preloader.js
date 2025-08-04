const preloader = document.createElement("div");
preloader.setAttribute("id", "preloader");

const shadow = preloader.attachShadow({ mode: "open" });
const themeStorage = localStorage.getItem("theme_store");
let theme = "dark";

if (themeStorage) {
  theme = JSON.parse(themeStorage).state.theme;
}

shadow.innerHTML = `
  <style>
    :host {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      line-height: 1.15;
      font-family: 'Inter', sans-serif;
      font-weight: 500;
      margin: 0;
      transition: opacity 0.5s ease;
      background-color: ${theme === "light" ? "#fdfdfd" : "#1f242a"};
      color: ${theme === "light" ? "#344054" : "#e9ecef"};
      margin: 0;
    }

    .loader {
      border: 8px solid ${theme === "light" ? "#F2F4F7" : "#475467"};
      border-top: 8px solid ${theme === "light" ? "#0094D4" : "#5EDFFA"};
      border-radius: 50%;
      width: 60px;
      height: 60px;
      animation: spin 1s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    #loader-loading {
      margin-top: 20px !important;
      font-size: 18px;
    }

    #logo {
    padding-left:2px!important;
    }

    @media (max-width: 1375px) {
      #logo {
      padding-left:0px!important;
      }
    }

    @media (max-width: 767px) {
      #logo-wrapper {
      padding-left:15px!important;
      }
    }
  </style>
<div style="position: absolute; width: 100%; top: 0; display: flex; align-items: center; justify-content: center; box-sizing: border-box;padding: 16px 20px;" id="logo-wrapper">
  <div style="max-width: 1440px; width: 100%;height:42px;box-sizing: border-box;" id="logo">
    ${theme === "light" ? '<img src="/resources/preloader_logo_dark.svg" width="150" style="transform:translateX(-6px);" />' : '<img src="/resources/preloader_logo_light.svg" width="150" style="transform:translateX(-6px);" />'}
  </div>
</div>
  </div>
  <div class="loader"></div>
  <p id="loader-loading">
    Loading your favorite explorer...
  </p>
`;

document.body.append(preloader);
