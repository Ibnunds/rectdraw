export function extractCodeValueUsingRegex(text, target) {
  let reg;

  if (target == "HTMLCSS" || target == "HTMLTAILWIND") {
    reg = /```html([^`]+)```/;
  } else if (target == "RNJS") {
    reg = /```javascript([^`]+)```/;
  } else if (target == "RNTS") {
    reg = /```typescript([^`]+)```/;
  } else {
    reg = /```dart([^`]+)```/;
  }

  const match = text.match(reg);

  if (match && match[1]) {
    return match[1].trim();
  } else {
    return "Code not found or invalid format";
  }
}
