export function handleTarget(target) {
  switch (target) {
    case "htmltailwind":
      return "HTML_TAILWIND";
      break;
    case "htmlbasic":
      return "HTML_BASIC";
      break;
    case "react_nativejs":
      return "RN_JS";
      break;
    case "react_nativets":
      return "RN_TS";
      break;
    case "flutter":
      return "FLUTTER";
      break;
    default:
      break;
  }
}
