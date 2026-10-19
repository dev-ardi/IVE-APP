/**
 * Safe expression evaluator for Formula Sandbox (design-cms.md §7.1, TAD §11.6).
 * STRICT ALLOWLIST ONLY: No eval, no Function(), no window/process access.
 */

const ALLOWED_FUNCTIONS: Record<string, (...args: number[]) => number> = {
  sin: (x) => Math.sin(x),
  cos: (x) => Math.cos(x),
  tan: (x) => Math.tan(x),
  asin: (x) => Math.asin(x),
  acos: (x) => Math.acos(x),
  atan: (x) => Math.atan(x),
  sqrt: (x) => (x < 0 ? NaN : Math.sqrt(x)),
  abs: (x) => Math.abs(x),
  log: (x) => (x <= 0 ? NaN : Math.log10(x)),
  ln: (x) => (x <= 0 ? NaN : Math.log(x)),
  exp: (x) => Math.exp(x),
  round: (x) => Math.round(x),
  floor: (x) => Math.floor(x),
  ceil: (x) => Math.ceil(x),
  min: (...args) => Math.min(...args),
  max: (...args) => Math.max(...args),
  pow: (base, exp) => Math.pow(base, exp),
};

const CONSTANTS: Record<string, number> = {
  pi: Math.PI,
  PI: Math.PI,
  e: Math.E,
  E: Math.E,
};

type TokenType =
  | "NUMBER"
  | "IDENT"
  | "PLUS"
  | "MINUS"
  | "MUL"
  | "DIV"
  | "POW"
  | "MOD"
  | "LPAREN"
  | "RPAREN"
  | "COMMA";

interface Token {
  type: TokenType;
  value: string | number;
}

/**
 * Tokenize input string. Throws error on forbidden characters or identifiers.
 */
function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  // Block prototype pollution / forbidden terms before scanning
  const forbidden = [
    "constructor",
    "prototype",
    "__proto__",
    "eval",
    "Function",
    "window",
    "document",
    "process",
    "global",
    "import",
    "require",
    "setTimeout",
    "setInterval",
    "fetch",
    "alert",
    "script",
    "=>",
    ";",
    "{",
    "}",
    "[",
    "]",
    "$",
    "`",
    "\\",
    "=",
    "!",
    "<",
    ">",
    "&",
    "|",
  ];

  for (const word of forbidden) {
    if (input.includes(word)) {
      throw new Error(`Karakter atau kata kunci terlarang terdeteksi: "${word}"`);
    }
  }

  while (i < input.length) {
    const ch = input[i];

    if (/\s/.test(ch)) {
      i++;
      continue;
    }

    if (ch === "+") {
      tokens.push({ type: "PLUS", value: "+" });
      i++;
      continue;
    }
    if (ch === "-") {
      tokens.push({ type: "MINUS", value: "-" });
      i++;
      continue;
    }
    if (ch === "*") {
      tokens.push({ type: "MUL", value: "*" });
      i++;
      continue;
    }
    if (ch === "/") {
      tokens.push({ type: "DIV", value: "/" });
      i++;
      continue;
    }
    if (ch === "^") {
      tokens.push({ type: "POW", value: "^" });
      i++;
      continue;
    }
    if (ch === "%") {
      tokens.push({ type: "MOD", value: "%" });
      i++;
      continue;
    }
    if (ch === "(") {
      tokens.push({ type: "LPAREN", value: "(" });
      i++;
      continue;
    }
    if (ch === ")") {
      tokens.push({ type: "RPAREN", value: ")" });
      i++;
      continue;
    }
    if (ch === ",") {
      tokens.push({ type: "COMMA", value: "," });
      i++;
      continue;
    }

    // Number literal
    if (/[0-9]/.test(ch) || (ch === "." && /[0-9]/.test(input[i + 1] ?? ""))) {
      let numStr = "";
      while (i < input.length && /[0-9.]/.test(input[i])) {
        numStr += input[i];
        i++;
      }
      const val = parseFloat(numStr);
      if (isNaN(val)) throw new Error(`Angka tidak valid: ${numStr}`);
      tokens.push({ type: "NUMBER", value: val });
      continue;
    }

    // Identifier: variable, constant, or function name
    if (/[a-zA-Z_]/.test(ch)) {
      let ident = "";
      while (i < input.length && /[a-zA-Z0-9_]/.test(input[i])) {
        ident += input[i];
        i++;
      }
      tokens.push({ type: "IDENT", value: ident });
      continue;
    }

    throw new Error(`Karakter tidak dikenal: "${ch}"`);
  }

  return tokens;
}

/**
 * Shunting-Yard Parser + Evaluator
 */
export function evaluateFormula(
  expression: string,
  variables: Record<string, number> = {},
): number {
  if (!expression || !expression.trim()) return 0;

  const tokens = tokenize(expression.trim());
  const values: number[] = [];
  const ops: string[] = [];

  const precedence: Record<string, number> = {
    "+": 1,
    "-": 1,
    "*": 2,
    "/": 2,
    "%": 2,
    "^": 3,
  };

  const applyOp = () => {
    const op = ops.pop();
    if (!op) return;

    // Check if it's a function call
    if (ALLOWED_FUNCTIONS[op]) {
      const fn = ALLOWED_FUNCTIONS[op];
      const arg = values.pop() ?? 0;
      values.push(fn(arg));
      return;
    }

    const b = values.pop() ?? 0;
    const a = values.pop() ?? 0;

    switch (op) {
      case "+":
        values.push(a + b);
        break;
      case "-":
        values.push(a - b);
        break;
      case "*":
        values.push(a * b);
        break;
      case "/":
        values.push(b === 0 ? (a >= 0 ? Infinity : -Infinity) : a / b);
        break;
      case "%":
        values.push(b === 0 ? NaN : a % b);
        break;
      case "^":
        values.push(Math.pow(a, b));
        break;
    }
  };

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.type === "NUMBER") {
      values.push(token.value as number);
      continue;
    }

    if (token.type === "IDENT") {
      const name = token.value as string;
      const nextToken = tokens[i + 1];

      // Function call
      if (nextToken && nextToken.type === "LPAREN") {
        if (!ALLOWED_FUNCTIONS[name]) {
          throw new Error(`Fungsi tidak diizinkan atau tidak dikenal: "${name}"`);
        }
        ops.push(name);
        continue;
      }

      // Variable or constant
      if (name in variables) {
        values.push(variables[name]);
      } else if (name in CONSTANTS) {
        values.push(CONSTANTS[name]);
      } else {
        throw new Error(`Variabel belum terdefinisi: "${name}"`);
      }
      continue;
    }

    if (token.type === "LPAREN") {
      ops.push("(");
      continue;
    }

    if (token.type === "RPAREN") {
      while (ops.length > 0 && ops[ops.length - 1] !== "(") {
        applyOp();
      }
      if (ops.length > 0 && ops[ops.length - 1] === "(") {
        ops.pop(); // discard '('
      }
      // If function is on top of ops, apply it
      if (ops.length > 0 && ALLOWED_FUNCTIONS[ops[ops.length - 1]]) {
        applyOp();
      }
      continue;
    }

    if (token.type === "COMMA") {
      while (ops.length > 0 && ops[ops.length - 1] !== "(") {
        applyOp();
      }
      continue;
    }

    // Binary operator
    const op = token.value as string;

    // Handle unary minus: if at start or right after another operator / '('
    if (
      op === "-" &&
      (i === 0 ||
        tokens[i - 1].type === "LPAREN" ||
        tokens[i - 1].type === "PLUS" ||
        tokens[i - 1].type === "MINUS" ||
        tokens[i - 1].type === "MUL" ||
        tokens[i - 1].type === "DIV")
    ) {
      values.push(0); // Treat unary -x as 0 - x
    }

    while (
      ops.length > 0 &&
      ops[ops.length - 1] !== "(" &&
      (precedence[ops[ops.length - 1]] || 0) >= (precedence[op] || 0)
    ) {
      applyOp();
    }
    ops.push(op);
  }

  while (ops.length > 0) {
    applyOp();
  }

  const result = values.pop() ?? 0;
  return isNaN(result) ? 0 : result;
}
