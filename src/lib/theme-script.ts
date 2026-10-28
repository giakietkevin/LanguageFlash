export const THEME_KEY = "lf-theme";

/**
 * Runs before paint so the page never flashes the wrong theme; also marks that scripts run.
 * ?theme=dark|light overrides the stored choice for previews.
 */
export const themeScript = `(function(){try{var q=new URLSearchParams(location.search).get("theme");var p=q||localStorage.getItem("${THEME_KEY}");var d=p==="dark"||(p!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.dataset.theme=d?"dark":"light"}catch(e){}document.documentElement.classList.add("js")})()`;
