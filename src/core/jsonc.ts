export interface StrippedJson {
  hasComment: boolean;
  text: string;
}

export function stripJsonComments(input: string): StrippedJson {
  const stripped = takeComments(input);
  return { hasComment: stripped.hasComment, text: stripTrailingCommas(stripped.text) };
}

export function findMatchingBrace(source: string, openIndex: number): number | undefined {
  let depth = 0;
  let escaped = false;
  let inString = false;

  for (let index = openIndex; index < source.length; index += 1) {
    const char = source[index] ?? "";
    const next = source[index + 1] ?? "";
    if (inString) {
      ({ escaped, inString } = stepString(char, escaped));
      continue;
    }
    if (char === "\"") {
      inString = true;
      continue;
    }
    if (char === "/" && next === "/") {
      index = skipLineComment(source, index);
      continue;
    }
    if (char === "/" && next === "*") {
      index = skipBlockComment(source, index);
      continue;
    }
    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) return index;
    }
  }

  return undefined;
}

export function findRootOpen(source: string): number | undefined {
  let escaped = false;
  let inString = false;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index] ?? "";
    const next = source[index + 1] ?? "";
    if (inString) {
      ({ escaped, inString } = stepString(char, escaped));
      continue;
    }
    if (char === "\"") {
      inString = true;
      continue;
    }
    if (char === "/" && next === "/") {
      index = skipLineComment(source, index);
      continue;
    }
    if (char === "/" && next === "*") {
      index = skipBlockComment(source, index);
      continue;
    }
    if (char === "{") return index;
  }

  return undefined;
}

function takeComments(input: string): StrippedJson {
  let text = "";
  let hasComment = false;
  let escaped = false;
  let inString = false;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index] ?? "";
    const next = input[index + 1] ?? "";
    if (inString) {
      text += char;
      ({ escaped, inString } = stepString(char, escaped));
      continue;
    }
    if (char === "\"") {
      inString = true;
      text += char;
      continue;
    }
    if (char === "/" && next === "/") {
      hasComment = true;
      index = skipLineComment(input, index);
      continue;
    }
    if (char === "/" && next === "*") {
      hasComment = true;
      index = skipBlockComment(input, index);
      continue;
    }
    text += char;
  }

  return { hasComment, text };
}

function stripTrailingCommas(input: string): string {
  let text = "";
  let escaped = false;
  let inString = false;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index] ?? "";
    if (inString) {
      text += char;
      ({ escaped, inString } = stepString(char, escaped));
      continue;
    }
    if (char === "\"") {
      inString = true;
      text += char;
      continue;
    }
    if (char === "," && nextNonSpaceIsCloser(input, index + 1)) continue;
    text += char;
  }

  return text;
}

function stepString(char: string, escaped: boolean): { escaped: boolean; inString: boolean } {
  if (escaped) return { escaped: false, inString: true };
  if (char === "\\") return { escaped: true, inString: true };
  if (char === "\"") return { escaped: false, inString: false };
  return { escaped: false, inString: true };
}

function nextNonSpaceIsCloser(input: string, start: number): boolean {
  for (let index = start; index < input.length; index += 1) {
    const char = input[index] ?? "";
    if (char === " " || char === "\t" || char === "\r" || char === "\n") continue;
    return char === "}" || char === "]";
  }
  return false;
}

function skipLineComment(input: string, index: number): number {
  let cursor = index + 1;
  while (cursor + 1 < input.length && input[cursor + 1] !== "\n") cursor += 1;
  return cursor;
}

function skipBlockComment(input: string, index: number): number {
  let cursor = index + 2;
  while (cursor < input.length && !(input[cursor] === "*" && input[cursor + 1] === "/")) cursor += 1;
  return cursor + 1;
}
