const puppeteer = require("puppeteer");
const {
  generateText,
  createElement,
  validateInput,
  checkAndGenerate,
} = require("./util.js");
const { JSDOM } = require("jsdom");

describe("util.js tests", () => {
  test("generateText returns correct text", () => {
    expect(generateText("John", 25)).toBe("John (25 years old)");
  });

  test("createElement creates element with correct type, text, and class", () => {
    const dom = new JSDOM('<!DOCTYPE html><div id="container"></div>');
    global.document = dom.window.document;
    const container = document.querySelector("#container");
    const element = createElement("p", "Hello, world!", "test-class");
    container.appendChild(element);
    expect(container.innerHTML).toBe('<p class="test-class">Hello, world!</p>');
  });

  test("should generate a valid text output", () => {
    expect(checkAndGenerate("John", 29)).toBe("John (29 years old)");
  });

  test("validateInput correctly validates input", () => {
    expect(validateInput("", true, false)).toBe(false); // empty string, not allowed
    expect(validateInput("  ", true, false)).toBe(false); // string with only spaces, not allowed
    expect(validateInput("John", true, false)).toBe(true); // non-empty string, allowed
    expect(validateInput("25", false, true)).toBe(true); // number as string, allowed
    expect(validateInput("John", false, true)).toBe(false); // non-number string, not allowed
  });

  test("should create an element with text and class", async () => {
    const browser = await puppeteer.launch({
      headless: false,
    //   slowMo: 80,
    //   args: ["--window-size=1920,1080"],
    });
    const page = await browser.newPage();

    await page.goto(
      "file:///F:/FE/Javascript_Guide/testing-01-starting-setup/index.html"
    );
    await page.click('input#name');
    await page.type('input#name', 'Anna');
    await page.click('input#age');
    await page.type('input#age', '28');
    await page.click('#btnAddUser');
    const finalText = await page.$eval('.user-item', el => el.textContent);
    expect(finalText).toBe('Anna (28 years old)');
  },10000);
});
