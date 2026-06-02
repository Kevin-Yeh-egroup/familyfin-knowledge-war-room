const { spawn } = require("node:child_process");
const { createHash } = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

function parseArgs(argv) {
  const args = {};
  for (let index = 2; index < argv.length; index += 1) {
    const item = argv[index];
    if (!item.startsWith("--")) continue;
    const key = item.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
      continue;
    }
    args[key] = next;
    index += 1;
  }
  return args;
}

class CdpPipe {
  constructor(child) {
    this.nextId = 0;
    this.pending = new Map();
    this.buffer = "";
    this.write = child.stdio[3];
    this.read = child.stdio[4];
    this.read.on("data", (chunk) => this.onData(chunk));
  }

  onData(chunk) {
    this.buffer += chunk.toString();
    const parts = this.buffer.split("\0");
    this.buffer = parts.pop();
    for (const part of parts) {
      if (!part) continue;
      const message = JSON.parse(part);
      if (!message.id || !this.pending.has(message.id)) continue;
      const callbacks = this.pending.get(message.id);
      this.pending.delete(message.id);
      if (message.error) callbacks.reject(new Error(JSON.stringify(message.error)));
      else callbacks.resolve(message);
    }
  }

  send(method, params = {}, sessionId) {
    const id = ++this.nextId;
    const message = { id, method, params };
    if (sessionId) message.sessionId = sessionId;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.write.write(JSON.stringify(message) + "\0");
    });
  }
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function clean(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function hashId(value) {
  return createHash("sha256").update(String(value)).digest("hex").slice(0, 12);
}

function classifyReview(title, content) {
  const text = `${title}\n${content}`;
  const checks = [
    ["case_accuracy", /案例|個案|一家|家庭|三口|四口|人物|化名/],
    ["numeric_accuracy", /數字|費用|收費|元|薪資|工資|月薪|金額|收入|支出|補助/],
    ["source_grounding", /正確|資料|資訊|來源|表|政府|縣市|中央|地方/],
    ["reality_plausibility", /現實不符|不符合現實|不合理|最低工資|基本工資/],
    ["non_concept_concreteness", /概念性|缺乏具體|空泛|具體內容|太抽象/],
    ["platform_fit", /平台訴求|與平台|可參考|投稿|整合成一篇/],
    ["finance_focus_alignment", /財務議題|財務|心理諮商|真正關鍵/],
    ["financial_change_proof_missing", /財務數字|數字變化|未來的財務風險|風險|工具/],
    ["article_integration", /整合|一篇|拆成|分散/],
    ["title_body_alignment", /標題|主題|題目/],
  ];
  const problemTypes = checks.filter(([, regex]) => regex.test(text)).map(([key]) => key);
  if (problemTypes.length === 0) problemTypes.push("editorial_quality_gap");

  let issueSummary = "審核意見指出文章需要更明確的實務判讀與可驗證內容。";
  if (problemTypes.includes("case_accuracy") && problemTypes.includes("numeric_accuracy")) {
    issueSummary = "審核重點落在案例條件與數字設定不一致，文章不能為了敘事效果拼湊人物、費用或收支。";
  } else if (problemTypes.includes("reality_plausibility")) {
    issueSummary = "審核重點落在生活情境與台灣現實不符，收入、工資或支出設定需要能被現場經驗檢驗。";
  } else if (problemTypes.includes("non_concept_concreteness")) {
    issueSummary = "審核重點落在內容過於概念化，文章需要具體情境、數值前後差異與可操作的改善關鍵。";
  } else if (problemTypes.includes("platform_fit")) {
    issueSummary = "審核重點落在平台定位與文章整合度不足，需要重新整理成符合好理家在知識庫用途的主軸。";
  } else if (problemTypes.includes("finance_focus_alignment")) {
    issueSummary = "審核重點落在改變關鍵偏離財務議題，需要分清楚心理支持、家庭支持與財務介入的主次。";
  } else if (problemTypes.includes("financial_change_proof_missing")) {
    issueSummary = "審核重點落在文章沒有說清楚工具或行動如何改變財務數字，也沒有把未來風險具體化。";
  }

  const rules = [];
  if (problemTypes.includes("numeric_accuracy")) {
    rules.push("產稿前建立 claims table，列出收入、支出、補助、費用、前後差異與每個數字的來源或假設。");
  }
  if (problemTypes.includes("case_accuracy")) {
    rules.push("個案型文章要固定家庭人數、角色、收入來源與照顧責任，全文不得前後矛盾。");
  }
  if (problemTypes.includes("reality_plausibility")) {
    rules.push("所有薪資、補助、租金、托育費與生活成本都要先用台灣當年度資料或合理區間校準。");
  }
  if (problemTypes.includes("non_concept_concreteness")) {
    rules.push("每個核心段落至少要有一個具體場景、數值變化或行動後結果，不能只停在觀念說明。");
  }
  if (problemTypes.includes("platform_fit")) {
    rules.push("投稿前先檢查文章是否服務財商教育、助人工作或台灣生活決策，偏離者要重整主軸。");
  }
  if (problemTypes.includes("finance_focus_alignment")) {
    rules.push("若案例改善主因不是財務行動，要改寫為跨系統支持，或明確說明財務介入的位置。");
  }
  if (problemTypes.includes("financial_change_proof_missing")) {
    rules.push("文章需寫出工具或行動前後的財務數字差異，並說明未來財務風險如何降低或仍需追蹤。");
  }

  const reviewerAgents = new Set(["quality_reviewer"]);
  if (
    problemTypes.includes("numeric_accuracy") ||
    problemTypes.includes("reality_plausibility") ||
    problemTypes.includes("financial_change_proof_missing")
  ) {
    reviewerAgents.add("numeric_proof_reviewer");
  }
  if (problemTypes.includes("case_accuracy")) reviewerAgents.add("fact_case_reviewer");
  if (problemTypes.includes("non_concept_concreteness")) reviewerAgents.add("non_concept_reviewer");
  if (problemTypes.includes("platform_fit") || problemTypes.includes("finance_focus_alignment")) {
    reviewerAgents.add("writing_angle_reviewer");
  }

  return {
    problemTypes,
    issueSummary,
    checkableRules: rules,
    reviewerAgents: Array.from(reviewerAgents),
  };
}

function analyzeArticleSignals(articleText) {
  const text = String(articleText || "");
  const numberMatches = text.match(/(?:NT\$|\$|新台幣)?\s?\d[\d,]*(?:\.\d+)?\s?(?:元|萬|%|％|小時|分鐘|天|個月|年)?/g) || [];
  const hasScenario = /化名|一家|家庭|孩子|父親|母親|妻子|丈夫|案家|社工/.test(text);
  const hasBeforeAfter = /原本|後來|半年後|調整後|從原本|降到|增加|減少|改善/.test(text);
  const hasTaiwanPolicy = /補助|公立|非營利|準公共|政府|中央|地方|縣市|基本工資/.test(text);
  const hasAction = /開始|調整|盤點|重新|申請|減少|增加|固定|分工/.test(text);
  return {
    articleOpened: Boolean(text),
    charCount: text.length,
    numberCount: numberMatches.length,
    hasScenario,
    hasBeforeAfter,
    hasTaiwanPolicy,
    hasAction,
  };
}

async function evaluate(cdp, sessionId, expression) {
  const result = await cdp.send(
    "Runtime.evaluate",
    {
      expression,
      awaitPromise: true,
      returnByValue: true,
      timeout: 60000,
    },
    sessionId
  );
  if (result.result.exceptionDetails) {
    throw new Error(JSON.stringify(result.result.exceptionDetails));
  }
  return result.result.result.value;
}

async function waitForValue(cdp, sessionId, expression, timeoutMs = 20000) {
  const startedAt = Date.now();
  let lastValue = null;
  while (Date.now() - startedAt < timeoutMs) {
    lastValue = await evaluate(cdp, sessionId, expression);
    if (lastValue) return lastValue;
    await wait(750);
  }
  return lastValue;
}

async function clickPoint(cdp, sessionId, x, y) {
  await cdp.send("Input.dispatchMouseEvent", { type: "mouseMoved", x, y }, sessionId);
  await cdp.send(
    "Input.dispatchMouseEvent",
    { type: "mousePressed", x, y, button: "left", clickCount: 1 },
    sessionId
  );
  await cdp.send(
    "Input.dispatchMouseEvent",
    { type: "mouseReleased", x, y, button: "left", clickCount: 1 },
    sessionId
  );
}

async function selectOrganization(cdp, sessionId, orgLabel) {
  await evaluate(
    cdp,
    sessionId,
    `(() => {
      const clean = (value) => String(value || "").replace(/\\s+/g, " ").trim();
      const candidates = Array.from(document.querySelectorAll("a,button,[role='button'],div,li,span"))
        .map((el) => ({ el, text: clean(el.innerText || el.textContent) }))
        .filter((item) => item.text.includes(${JSON.stringify(orgLabel)}))
        .sort((a, b) => a.text.length - b.text.length);
      const item = candidates[0];
      const clickable = item && (item.el.closest("a,button,[role='button']") || item.el);
      if (!clickable) return { clicked: false, matches: candidates.length };
      clickable.click();
      return { clicked: true, matches: candidates.length };
    })()`
  );
  await wait(5000);
  const state = await evaluate(
    cdp,
    sessionId,
    `(() => ({
      url: location.href,
      body: (document.body.innerText || "").slice(0, 1200),
      orgOk: (document.body.innerText || "").includes(${JSON.stringify(orgLabel)})
    }))()`
  );
  if (!state.orgOk) {
    throw new Error(`Organization label not visible after selection: ${orgLabel}`);
  }
  return state;
}

function parseReviewPanel(text) {
  const lines = String(text || "")
    .split(/\r?\n/)
    .map((line) => clean(line));
  const titleIndex = lines.map((line) => line === "審核標題").lastIndexOf(true);
  if (titleIndex < 0) return { title: "", content: "" };
  const contentLabelIndex = lines.findIndex((line, index) => index > titleIndex && line === "審核內容");
  const statusIndex = lines.findIndex((line, index) => index > titleIndex && line === "審核狀態");
  if (contentLabelIndex < 0 || statusIndex < 0) return { title: "", content: "" };
  const title = lines
    .slice(titleIndex + 1, contentLabelIndex)
    .filter(Boolean)
    .join(" ");
  const content = lines
    .slice(contentLabelIndex + 1, statusIndex)
    .filter(Boolean)
    .join(" ");
  return {
    title,
    content,
  };
}

async function extractReview(cdp, sessionId, eventId) {
  const reviewUrl = `https://www.egroup-infocenter.com/me/event/events/${eventId}?tab=EVENT_REVIEW`;
  await cdp.send("Page.navigate", { url: reviewUrl }, sessionId);
  await wait(8500);
  const box = await waitForValue(
    cdp,
    sessionId,
    `(() => {
      const clean = (value) => String(value || "").replace(/\\s+/g, " ").trim();
      const cells = Array.from(document.querySelectorAll("td,span,div"))
        .map((el) => {
          const r = el.getBoundingClientRect();
          return { text: clean(el.innerText || el.textContent), tag: el.tagName, x: r.x, y: r.y, w: r.width, h: r.height };
        })
        .filter((item) => item.text === "審核駁回" && item.tag === "TD")
        .sort((a, b) => a.y - b.y);
      const cell = cells[0];
      if (!cell) return null;
      return { x: cell.x + cell.w / 2, y: cell.y + cell.h / 2, cell };
    })()`,
    22000
  );
  if (!box) {
    return { clickedRow: false, opened: false, title: "", content: "", reviewUrl };
  }
  await wait(1500);
  await clickPoint(cdp, sessionId, box.x, box.y);
  await wait(6000);
  const page = await evaluate(
    cdp,
    sessionId,
    `(() => ({
      title: document.title,
      text: document.body.innerText || "",
      url: location.href
    }))()`
  );
  if (!String(page.text || "").includes("審核標題")) {
    return { clickedRow: true, opened: false, title: "", content: "", reviewUrl };
  }
  const parsed = parseReviewPanel(page.text || "");
  return {
    clickedRow: true,
    opened: Boolean(parsed.title || parsed.content),
    title: parsed.title,
    content: parsed.content,
    reviewUrl,
    eventTitle: clean(String(page.title || "").replace("| 事件管理 | InfoCenter 智能中台", "")),
  };
}

async function extractArticleSignals(cdp, sessionId, eventId, eventTitle) {
  const commentUrl = `https://www.egroup-infocenter.com/me/event/events/${eventId}?tab=EVENT_COMMENT`;
  await cdp.send("Page.navigate", { url: commentUrl }, sessionId);
  await wait(9000);
  const target = await evaluate(
    cdp,
    sessionId,
    `(() => {
      const clean = (value) => String(value || "").replace(/\\s+/g, " ").trim();
      const hint = ${JSON.stringify(clean(eventTitle).slice(0, 10))};
      const cells = Array.from(document.querySelectorAll("td,span,div"))
        .map((el) => {
          const r = el.getBoundingClientRect();
          return { text: clean(el.innerText || el.textContent), tag: el.tagName, x: r.x, y: r.y, w: r.width, h: r.height };
        })
        .filter((item) => item.tag === "TD" && item.y > 250 && item.text.includes(hint))
        .sort((a, b) => (a.w * a.h) - (b.w * b.h));
      const cell = cells[0];
      if (!cell) return null;
      return { x: cell.x + cell.w / 2, y: cell.y + cell.h / 2, cell };
    })()`
  );
  if (!target) {
    return {
      commentTabChecked: true,
      articleOpened: false,
      charCount: 0,
      numberCount: 0,
      hasScenario: false,
      hasBeforeAfter: false,
      hasTaiwanPolicy: false,
      hasAction: false,
    };
  }
  await clickPoint(cdp, sessionId, target.x, target.y);
  await wait(4000);
  const page = await evaluate(
    cdp,
    sessionId,
    `(() => ({
      text: document.body.innerText || "",
      url: location.href
    }))()`
  );
  const contentIndex = String(page.text || "").indexOf("內容:");
  const articleText = contentIndex >= 0 ? String(page.text || "").slice(contentIndex) : "";
  return {
    commentTabChecked: true,
    ...analyzeArticleSignals(articleText),
  };
}

async function main() {
  const args = parseArgs(process.argv);
  const profile = args.profile;
  const ids = String(args.ids || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const outPath = args.out ? path.resolve(args.out) : "";
  const orgLabel = args.org || "好理家在文章管理區";
  const limit = Number(args.limit || ids.length || 0);
  if (!profile || !ids.length || !outPath) {
    console.error("Usage: node tools/infocenter-review-rejection-click-readonly.js --profile <path> --ids <id,id> --out <json> [--limit n]");
    process.exit(2);
  }

  const selectedIds = ids.slice(0, limit);
  const child = spawn(
    chromePath,
    [
      "--headless=new",
      "--disable-gpu",
      "--remote-debugging-pipe",
      "--no-first-run",
      "--force-renderer-accessibility",
      `--user-data-dir=${profile}`,
      "https://www.egroup-infocenter.com/me",
    ],
    {
      stdio: ["ignore", "ignore", "pipe", "pipe", "pipe"],
      windowsHide: true,
    }
  );
  child.stderr.on("data", (data) => {
    const text = data.toString();
    if (!/Registration response error|DEPRECATED_ENDPOINT|TensorFlow Lite/.test(text)) {
      process.stderr.write(text);
    }
  });

  const cdp = new CdpPipe(child);
  const cards = [];
  const errors = [];
  try {
    await wait(6000);
    const targetsResult = await cdp.send("Target.getTargets");
    const page = targetsResult.result.targetInfos.find((target) => target.type === "page");
    if (!page) throw new Error("No page target found");
    const attachResult = await cdp.send("Target.attachToTarget", {
      targetId: page.targetId,
      flatten: true,
    });
    const sessionId = attachResult.result.sessionId;
    await wait(4000);
    await cdp.send("Page.enable", {}, sessionId);
    const orgState = await selectOrganization(cdp, sessionId, orgLabel);

    for (let index = 0; index < selectedIds.length; index += 1) {
      const eventId = selectedIds[index];
      try {
        const review = await extractReview(cdp, sessionId, eventId);
        const classification = classifyReview(review.title, review.content);
        const articleSignals = await extractArticleSignals(cdp, sessionId, eventId, review.eventTitle);
        const reviewTitleFound = Boolean(review.title);
        const reviewContentFound = Boolean(review.content);
        const reviewDetailCompleteness =
          reviewTitleFound && reviewContentFound
            ? "title_and_content"
            : reviewTitleFound
              ? "title_only"
              : reviewContentFound
                ? "content_only"
                : "none";
        cards.push({
          cardId: `review-contrast-20260603-${String(index + 1).padStart(3, "0")}`,
          sourceRef: `private-event-hash-${hashId(eventId)}`,
          status: "REJECT",
          clickedReviewRow: review.clickedRow,
          reviewDetailFound: Boolean(review.title || review.content),
          reviewTitleFound,
          reviewContentFound,
          reviewDetailCompleteness,
          reviewLearningReady: reviewContentFound && articleSignals.articleOpened,
          reviewProblemTypes: classification.problemTypes,
          reviewIssueSummary: classification.issueSummary,
          articleSignals,
          contrastLearning: {
            needsCrossCheck: [
              "article_claims",
              "review_feedback",
              "taiwan_current_sources",
              "reader_actionability",
            ],
            checkableRules: classification.checkableRules,
            reviewerAgents: classification.reviewerAgents,
          },
          privacy: {
            rawEventIdStored: false,
            rawReviewTextStored: false,
            rawArticleTextStored: false,
            deidentifiedOnly: true,
          },
        });
      } catch (error) {
        errors.push({
          sourceRef: `private-event-hash-${hashId(eventId)}`,
          message: error.message,
        });
      }
    }

    const output = {
      updatedAt: new Date().toISOString(),
      source: "InfoCenter EVENT_REVIEW clicked rejection rows and EVENT_COMMENT article cross-check",
      orgLabel,
      profileMode: "external profile path supplied at runtime; profile path is not stored in output",
      privacy: {
        rawEventIdsStored: false,
        rawReviewTextStored: false,
        rawArticleTextStored: false,
        publicSafeDerivedCardsOnly: true,
      },
      run: {
        attempted: selectedIds.length,
        cardsCreated: cards.length,
        clickedReviewRows: cards.filter((card) => card.clickedReviewRow).length,
        reviewDetailsFound: cards.filter((card) => card.reviewDetailFound).length,
        reviewTitlesFound: cards.filter((card) => card.reviewTitleFound).length,
        reviewContentsFound: cards.filter((card) => card.reviewContentFound).length,
        completeReviewDetailsFound: cards.filter(
          (card) => card.reviewDetailCompleteness === "title_and_content"
        ).length,
        reviewLearningReadyCards: cards.filter((card) => card.reviewLearningReady).length,
        commentArticlesOpened: cards.filter((card) => card.articleSignals.articleOpened).length,
        errors: errors.length,
        orgVerified: Boolean(orgState.orgOk),
      },
      cards,
      errors,
    };
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
    console.log(JSON.stringify(output.run, null, 2));
  } finally {
    child.kill();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
