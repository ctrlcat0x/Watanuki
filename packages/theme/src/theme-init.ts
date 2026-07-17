import { WATANUKI_DARK_THEMES } from './config';

export function getThemeInitScript(defaultTheme: string): string {
  const dark = JSON.stringify(WATANUKI_DARK_THEMES);
  return `(function(){try{var t=localStorage.getItem('watanuki-theme')||'${defaultTheme}';var d=document.documentElement;d.setAttribute('data-watanuki-theme',t);var dark=${dark};d.classList.toggle('dark',dark.indexOf(t)!==-1);}catch(e){}})();`;
}
