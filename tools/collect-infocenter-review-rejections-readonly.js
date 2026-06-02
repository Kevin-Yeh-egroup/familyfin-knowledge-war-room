const { spawn } = require("node:child_process");
const { createHash } = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const defaultProfile =
  "C:\\Users\\Kevin\\Documents\\Codex\\infocenter-chrome-profiles\\dictionary-egroup-kevin-v2";
const defaultEventIndex =
  "C:\\Users\\Kevin\\Documents\\Codex\\2026-05-29\\agent-1-2-websearching-3-websearching\\work\\infocenter-events-summary.json";
const defaultOrgId = "0A4f9LDYSg2A7OzOih8A3g";
const defaultOrgLabel = "\u597d\u7406\u5bb6\u5728\u6587\u7ae0\u7ba1\u7406\u5340";
const defaultRawOut = "work-private\\all-review-rejections-raw-2026-06-03.jsonl";
const defaultStateOut = "work-private\\all-review-rejections-state-2026-06-03.json";
const defaultPublicOut = "data\\review-rejection-derived-full-2026-06-03.json";

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

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(path.resolve(filePath)), { recursive: true });
}

function loadJsonl(filePath) {
  if (!fs.existsSync(filePath)) return [];
  return fs
    .readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function keywordMatch(text, keywords) {
  return keywords.some((keyword) => text.includes(keyword));
}

function classifyReview(title, content) {
  const text = `${title}\n${content}`;
  const checks = [
    [
      "case_accuracy",
      ["\u6848\u4f8b", "\u500b\u6848", "\u5bb6\u5ead", "\u4e09\u53e3", "\u56db\u53e3", "\u5316\u540d"],
    ],
    [
      "numeric_accuracy",
      ["\u6578\u5b57", "\u91d1\u984d", "\u8cbb\u7528", "\u6536\u5165", "\u652f\u51fa", "\u85aa\u8cc7", "\u5de5\u8cc7", "\u5143"],
    ],
    [
      "source_grounding",
      ["\u6b63\u78ba", "\u8cc7\u6599", "\u8cc7\u8a0a", "\u4f86\u6e90", "\u8868", "\u4e2d\u592e", "\u5730\u65b9", "\u653f\u5e9c"],
    ],
    [
      "reality_plausibility",
      ["\u73fe\u5be6\u4e0d\u7b26", "\u4e0d\u7b26\u5408\u73fe\u5be6", "\u4e0d\u5408\u7406", "\u6700\u4f4e\u5de5\u8cc7", "\u57fa\u672c\u5de5\u8cc7"],
    ],
    [
      "non_concept_concreteness",
      ["\u6982\u5ff5\u6027", "\u7f3a\u4e4f\u5177\u9ad4", "\u5177\u9ad4\u5167\u5bb9", "\u5de5\u5177", "\u8ca1\u52d9\u6578\u5b57\u8b8a\u5316"],
    ],
    [
      "platform_fit",
      ["\u5e73\u53f0\u8a34\u6c42", "\u8207\u5e73\u53f0", "\u6295\u7a3f", "\u6574\u5408\u6210\u4e00\u7bc7"],
    ],
    [
      "finance_focus_alignment",
      ["\u8ca1\u52d9\u8b70\u984c", "\u8ca1\u52d9", "\u5fc3\u7406\u8aee\u5546", "\u771f\u6b63\u95dc\u9375"],
    ],
    [
      "future_risk_missing",
      ["\u672a\u4f86", "\u98a8\u96aa", "\u8ca1\u52d9\u98a8\u96aa", "\u7e7c\u7e8c", "\u8ffd\u8e64"],
    ],
  ];
  const problemTypes = checks
    .filter(([, keywords]) => keywordMatch(text, keywords))
    .map(([key]) => key);
  if (!problemTypes.length) problemTypes.push("editorial_quality_gap");

  const rules = [];
  if (problemTypes.includes("numeric_accuracy")) {
    rules.push("\u7522\u7a3f\u524d\u5efa\u7acb claims table\uff0c\u5217\u51fa\u6536\u5165\u3001\u652f\u51fa\u3001\u88dc\u52a9\u3001\u8cbb\u7528\u3001\u524d\u5f8c\u5dee\u7570\u8207\u6bcf\u500b\u6578\u5b57\u7684\u4f86\u6e90\u6216\u5047\u8a2d\u3002");
  }
  if (problemTypes.includes("case_accuracy")) {
    rules.push("\u500b\u6848\u578b\u6587\u7ae0\u8981\u56fa\u5b9a\u5bb6\u5ead\u4eba\u6578\u3001\u89d2\u8272\u3001\u6536\u5165\u4f86\u6e90\u8207\u7167\u9867\u8cac\u4efb\uff0c\u5168\u6587\u4e0d\u5f97\u524d\u5f8c\u77db\u76fe\u3002");
  }
  if (problemTypes.includes("source_grounding") || problemTypes.includes("reality_plausibility")) {
    rules.push("\u6d89\u53ca\u53f0\u7063\u73fe\u6cc1\u3001\u85aa\u8cc7\u3001\u88dc\u52a9\u3001\u79df\u91d1\u6216\u6258\u80b2\u8cbb\u6642\uff0c\u5fc5\u9808\u5148\u6821\u6e96\u5e74\u5ea6\u3001\u9069\u7528\u5730\u5340\u8207\u8cc7\u6599\u4f86\u6e90\u3002");
  }
  if (problemTypes.includes("non_concept_concreteness")) {
    rules.push("\u6587\u7ae0\u9700\u5beb\u51fa\u5de5\u5177\u6216\u884c\u52d5\u5982\u4f55\u9020\u6210\u8ca1\u52d9\u6578\u5b57\u524d\u5f8c\u8b8a\u5316\uff0c\u4e0d\u80fd\u53ea\u505c\u5728\u89c0\u5ff5\u8aaa\u660e\u3002");
  }
  if (problemTypes.includes("future_risk_missing")) {
    rules.push("\u6587\u7ae0\u9700\u628a\u672a\u4f86\u8ca1\u52d9\u98a8\u96aa\u5177\u9ad4\u5316\uff0c\u4f8b\u5982\u4e0b\u4e00\u6b21\u652f\u51fa\u8b8a\u52d5\u3001\u50b5\u52d9\u5faa\u74b0\u6216\u6536\u5165\u4e2d\u65b7\u7684\u627f\u63a5\u80fd\u529b\u3002");
  }
  if (problemTypes.includes("platform_fit")) {
    rules.push("\u6295\u7a3f\u524d\u8981\u78ba\u8a8d\u6587\u7ae0\u662f\u5426\u670d\u52d9\u8ca1\u5546\u6559\u80b2\u3001\u52a9\u4eba\u5de5\u4f5c\u6216\u53f0\u7063\u751f\u6d3b\u6c7a\u7b56\uff0c\u504f\u96e2\u8005\u8981\u91cd\u6574\u4e3b\u8ef8\u3002");
  }
  if (problemTypes.includes("finance_focus_alignment")) {
    rules.push("\u82e5\u6848\u4f8b\u6539\u5584\u4e3b\u56e0\u4e0d\u662f\u8ca1\u52d9\u884c\u52d5\uff0c\u8981\u6539\u5beb\u70ba\u8de8\u7cfb\u7d71\u652f\u6301\uff0c\u6216\u660e\u78ba\u8aaa\u660e\u8ca1\u52d9\u4ecb\u5165\u7684\u4f4d\u7f6e\u3002");
  }

  const reviewerAgents = new Set(["quality_reviewer"]);
  if (
    problemTypes.includes("numeric_accuracy") ||
    problemTypes.includes("source_grounding") ||
    problemTypes.includes("reality_plausibility") ||
    problemTypes.includes("future_risk_missing")
  ) {
    reviewerAgents.add("numeric_proof_reviewer");
  }
  if (problemTypes.includes("case_accuracy")) reviewerAgents.add("fact_case_reviewer");
  if (problemTypes.includes("non_concept_concreteness")) reviewerAgents.add("non_concept_reviewer");
  if (problemTypes.includes("platform_fit") || problemTypes.includes("finance_focus_alignment")) {
    reviewerAgents.add("writing_angle_reviewer");
  }

  return { problemTypes, rules, reviewerAgents: Array.from(reviewerAgents) };
}

function articleSignals(articleBodies) {
  const text = articleBodies.map((item) => `${item.title || ""}\n${item.text || ""}`).join("\n");
  const numberMatches =
    text.match(/(?:NT\$|\$)?\s?\d[\d,]*(?:\.\d+)?\s?(?:\u5143|\u842c|%|\uff05|\u5e74|\u500b\u6708|\u5929|\u5206\u9418)?/g) || [];
  const scenarioKeywords = ["\u5bb6\u5ead", "\u5b69\u5b50", "\u7236\u89aa", "\u6bcd\u89aa", "\u59bb\u5b50", "\u4e08\u592b", "\u6848\u5bb6", "\u793e\u5de5", "\u5316\u540d"];
  const beforeAfterKeywords = ["\u539f\u672c", "\u5f8c\u4f86", "\u8abf\u6574\u5f8c", "\u6e1b\u5c11", "\u589e\u52a0", "\u6539\u5584", "\u964d\u5230"];
  const taiwanKeywords = ["\u88dc\u52a9", "\u653f\u5e9c", "\u4e2d\u592e", "\u5730\u65b9", "\u7e23\u5e02", "\u57fa\u672c\u5de5\u8cc7", "\u53f0\u7063"];
  return {
    articleBodyCount: articleBodies.length,
    articleBodyCharCount: text.length,
    numberCount: numberMatches.length,
    hasScenario: keywordMatch(text, scenarioKeywords),
    hasBeforeAfter: keywordMatch(text, beforeAfterKeywords),
    hasTaiwanPolicy: keywordMatch(text, taiwanKeywords),
  };
}

function derivePublic(rawRecords, eventTotal, processedCount) {
  const rejectRecords = rawRecords.filter((item) => item.status === "REJECT");
  const statusCounts = {};
  const tagCounts = {};
  for (const item of rawRecords) {
    statusCounts[item.status || "UNKNOWN"] = (statusCounts[item.status || "UNKNOWN"] || 0) + 1;
    for (const tag of item.tags || []) {
      const name = tag.name || "(blank)";
      tagCounts[name] = (tagCounts[name] || 0) + 1;
    }
  }

  const cards = rejectRecords.map((item, index) => {
    const title = item.review?.title || "";
    const content = item.review?.content || "";
    const classification = classifyReview(title, content);
    const signals = articleSignals(item.articleBodies || []);
    return {
      cardId: `review-rejection-full-20260603-${String(index + 1).padStart(3, "0")}`,
      sourceRef: `private-event-hash-${hashId(item.eventId)}`,
      status: "REJECT",
      primaryTag: (item.tags || [])[0]?.name || "",
      createdAtMonth: String(item.createdAt || "").slice(0, 7),
      reviewTitleFound: Boolean(title),
      reviewContentFound: Boolean(content),
      reviewDetailCompleteness: title && content ? "title_and_content" : title ? "title_only" : content ? "content_only" : "none",
      reviewLearningReady: Boolean(content && signals.articleBodyCount),
      reviewContentLength: content.length,
      reviewTitleLength: title.length,
      reviewProblemTypes: classification.problemTypes,
      contrastLearning: {
        checkableRules: classification.rules,
        reviewerAgents: classification.reviewerAgents,
        needsCrossCheck: [
          "article_claims",
          "review_feedback_content",
          "taiwan_current_sources",
          "reader_actionability",
        ],
      },
      articleSignals: signals,
      privacy: {
        rawEventIdStored: false,
        rawReviewTextStored: false,
        rawArticleTextStored: false,
        deidentifiedOnly: true,
      },
    };
  });

  return {
    updatedAt: new Date().toISOString(),
    source: "InfoCenter full review rejection collection derived from private raw JSONL",
    eventTotal,
    processedCount,
    privacy: {
      rawDataLocation: "work-private/all-review-rejections-raw-2026-06-03.jsonl",
      rawDataCommitted: false,
      publicFileStoresRawEventIds: false,
      publicFileStoresRawReviewText: false,
      publicFileStoresRawArticleText: false,
    },
    summary: {
      rejectCount: rejectRecords.length,
      reviewTitlesFound: cards.filter((card) => card.reviewTitleFound).length,
      reviewContentsFound: cards.filter((card) => card.reviewContentFound).length,
      completeReviewDetailsFound: cards.filter((card) => card.reviewDetailCompleteness === "title_and_content").length,
      reviewLearningReadyCards: cards.filter((card) => card.reviewLearningReady).length,
      statusCounts,
      rejectByPrimaryTag: rejectRecords.reduce((acc, item) => {
        const tag = (item.tags || [])[0]?.name || "(blank)";
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      }, {}),
      allRecordsByPrimaryTag: tagCounts,
    },
    cards,
  };
}

async function evaluate(cdp, sessionId, expression, timeout = 180000) {
  const result = await cdp.send(
    "Runtime.evaluate",
    { expression, awaitPromise: true, returnByValue: true, timeout },
    sessionId
  );
  if (result.result.exceptionDetails) {
    throw new Error(JSON.stringify(result.result.exceptionDetails));
  }
  return result.result.result.value;
}

async function main() {
  const args = parseArgs(process.argv);
  const profile = args.profile || defaultProfile;
  const eventIndexFile = args.eventIndex || defaultEventIndex;
  const orgId = args.orgId || defaultOrgId;
  const orgLabel = args.orgLabel || defaultOrgLabel;
  const rawOut = args.rawOut || defaultRawOut;
  const stateOut = args.stateOut || defaultStateOut;
  const publicOut = args.publicOut || defaultPublicOut;
  const chunkSize = Number(args.chunkSize || 40);
  const maxEvents = Number(args.maxEvents || 0);
  const reset = Boolean(args.reset);

  if (reset) {
    for (const file of [rawOut, stateOut, publicOut]) {
      if (fs.existsSync(file)) fs.rmSync(file);
    }
  }

  const index = JSON.parse(fs.readFileSync(eventIndexFile, "utf8"));
  const events = [...(index.eventIndex || [])].sort((a, b) => {
    const aTime = Date.parse(a.createdAt || "") || 0;
    const bTime = Date.parse(b.createdAt || "") || 0;
    if (aTime !== bTime) return aTime - bTime;
    return String(a.eventId || "").localeCompare(String(b.eventId || ""));
  });
  const existing = loadJsonl(rawOut);
  const processedIds = new Set(existing.map((item) => item.eventId));
  const nextEvents = events.filter((event) => event.eventId && !processedIds.has(event.eventId));
  const selected = maxEvents > 0 ? nextEvents.slice(0, maxEvents) : nextEvents;

  ensureDir(rawOut);
  ensureDir(stateOut);
  ensureDir(publicOut);

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
    await evaluate(
      cdp,
      sessionId,
      `(() => {
        const clean = (value) => String(value || "").replace(/\\s+/g, " ").trim();
        const label = ${JSON.stringify(orgLabel)};
        const candidates = Array.from(document.querySelectorAll("a,button,[role='button'],div,li,span"))
          .map((el) => ({ el, text: clean(el.innerText || el.textContent) }))
          .filter((item) => item.text.includes(label))
          .sort((a, b) => a.text.length - b.text.length);
        const item = candidates[0];
        const clickable = item && (item.el.closest("a,button,[role='button']") || item.el);
        if (clickable) clickable.click();
        return { clicked: Boolean(clickable), matches: candidates.length };
      })()`,
      60000
    );
    await wait(5000);

    let newlyProcessed = 0;
    for (let start = 0; start < selected.length; start += chunkSize) {
      const chunk = selected.slice(start, start + chunkSize);
      const expression = `((async () => {
        const orgId = ${JSON.stringify(orgId)};
        const chunk = ${JSON.stringify(chunk)};
        const base = "https://www.egroup-infocenter.com/api/v1/organizations/" + orgId;
        const clean = (value) => String(value || "").replace(/\\s+/g, " ").trim();
        const redact = (value) => clean(value)
          .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}/gi, "[email]")
          .replace(/09\\d{8}/g, "[phone]");
        const fetchJson = async (url) => {
          const response = await fetch(url, { credentials: "include" });
          const text = await response.text();
          if (!response.ok) return { ok: false, status: response.status, text: text.slice(0, 500) };
          try {
            return { ok: true, status: response.status, body: JSON.parse(text) };
          } catch (error) {
            return { ok: false, status: response.status, text: text.slice(0, 500) };
          }
        };
        const likelyArticleBody = (comment) => {
          const text = comment.text || "";
          const title = comment.title || "";
          return text.length >= 300 || title.includes("\\u6587\\u7ae0") || title.includes("\\u5167\\u5bb9");
        };
        const normalizeTags = (event, fallback) => {
          const rawTags = event.organizationTagTargetList || fallback.tags || [];
          return rawTags.map((item) => {
            const tag = item.organizationTag || item;
            return {
              group: tag.organizationTagGroup?.tagGroupName || item.group || "",
              name: tag.tagName || item.name || "",
            };
          }).filter((tag) => tag.name);
        };
        const latestReview = (event) => {
          const reviews = []
            .concat(event.organizationReviewList || [])
            .concat(event.organizationReview ? [event.organizationReview] : [])
            .filter(Boolean);
          reviews.sort((a, b) => {
            const at = Date.parse(a.organizationReviewUpdateDate || a.organizationReviewCreateDate || "") || 0;
            const bt = Date.parse(b.organizationReviewUpdateDate || b.organizationReviewCreateDate || "") || 0;
            return bt - at;
          });
          return reviews[0] || {};
        };
        const getOne = async (candidate) => {
          try {
            const eventResult = await fetchJson(base + "/events/" + candidate.eventId + "?locale=zh_TW");
            if (!eventResult.ok) {
              return { eventId: candidate.eventId, ok: false, error: "event_detail_" + eventResult.status };
            }
            const event = eventResult.body || {};
            const review = latestReview(event);
            const status = review.organizationReviewStatusType || event.organizationReviewStatusType || "UNKNOWN";
            let reviewDetail = null;
            if (status === "REJECT" && review.organizationReviewId) {
              const detailResult = await fetchJson(base + "/reviews/" + review.organizationReviewId + "?SERVICE_MODULE_VALUE_=EVENT");
              if (detailResult.ok) {
                const detail = detailResult.body || {};
                const comment = detail.organizationComment || {};
                reviewDetail = {
                  reviewId: detail.organizationReviewId || review.organizationReviewId,
                  status: detail.organizationReviewStatusType || status,
                  createdAt: detail.organizationReviewCreateDate || review.organizationReviewCreateDate || "",
                  updatedAt: detail.organizationReviewUpdateDate || review.organizationReviewUpdateDate || "",
                  title: redact(comment.organizationCommentTitle),
                  content: redact(comment.organizationCommentContent),
                };
              } else {
                reviewDetail = {
                  reviewId: review.organizationReviewId,
                  status,
                  createdAt: review.organizationReviewCreateDate || "",
                  updatedAt: review.organizationReviewUpdateDate || "",
                  title: "",
                  content: "",
                  error: "review_detail_" + detailResult.status,
                };
              }
            }
            const articleComments = (event.organizationCommnetList || []).map((comment) => ({
              title: redact(comment.organizationCommentTitle),
              text: redact(comment.organizationCommentContent),
              createdAt: comment.organizationCommentCreateDate || "",
              updatedAt: comment.organizationCommentUpdateDate || "",
            })).filter((comment) => comment.title || comment.text);
            const articleBodies = articleComments.filter(likelyArticleBody);
            return {
              eventId: candidate.eventId,
              ok: true,
              title: redact(event.organizationEventTitle || candidate.title),
              createdAt: event.organizationEventCreateDate || candidate.createdAt || "",
              updatedAt: event.organizationEventUpdateDate || candidate.updatedAt || "",
              status,
              tags: normalizeTags(event, candidate),
              review: reviewDetail,
              articleBodies,
              articleBodyCount: articleBodies.length,
              articleBodyCharCount: articleBodies.reduce((sum, item) => sum + (item.text || "").length, 0),
            };
          } catch (error) {
            return { eventId: candidate.eventId, ok: false, error: String(error && error.message || error) };
          }
        };
        const out = [];
        const concurrency = 8;
        for (let index = 0; index < chunk.length; index += concurrency) {
          const group = chunk.slice(index, index + concurrency);
          out.push(...await Promise.all(group.map(getOne)));
        }
        return out;
      })())`;
      const records = await evaluate(cdp, sessionId, expression, 240000);
      const authFailures = records.filter((record) => /_401$/.test(record.error || ""));
      if (authFailures.length) {
        throw new Error(
          `InfoCenter auth failed for ${authFailures.length} records in current chunk; raw output not appended.`
        );
      }
      for (const record of records) {
        fs.appendFileSync(rawOut, `${JSON.stringify(record)}\n`, "utf8");
      }
      newlyProcessed += records.length;
      const allRecords = existing.concat(loadJsonl(rawOut).slice(existing.length));
      const publicData = derivePublic(allRecords, events.length, processedIds.size + newlyProcessed);
      fs.writeFileSync(publicOut, `${JSON.stringify(publicData, null, 2)}\n`, "utf8");
      fs.writeFileSync(
        stateOut,
        `${JSON.stringify(
          {
            updatedAt: new Date().toISOString(),
            eventTotal: events.length,
            alreadyProcessedBeforeRun: processedIds.size,
            newlyProcessed,
            processedCount: processedIds.size + newlyProcessed,
            remaining: Math.max(0, events.length - processedIds.size - newlyProcessed),
            rawOut,
            publicOut,
            summary: publicData.summary,
          },
          null,
          2
        )}\n`,
        "utf8"
      );
      console.log(
        JSON.stringify({
          chunkDone: start + chunk.length,
          selected: selected.length,
          processedCount: processedIds.size + newlyProcessed,
          rejectCount: publicData.summary.rejectCount,
          reviewContentsFound: publicData.summary.reviewContentsFound,
        })
      );
    }
  } finally {
    child.kill();
  }

  const allRecords = loadJsonl(rawOut);
  const publicData = derivePublic(allRecords, events.length, allRecords.length);
  fs.writeFileSync(publicOut, `${JSON.stringify(publicData, null, 2)}\n`, "utf8");
  fs.writeFileSync(
    stateOut,
    `${JSON.stringify(
      {
        updatedAt: new Date().toISOString(),
        eventTotal: events.length,
        processedCount: allRecords.length,
        remaining: Math.max(0, events.length - allRecords.length),
        rawOut,
        publicOut,
        summary: publicData.summary,
      },
      null,
      2
    )}\n`,
    "utf8"
  );
  console.log(JSON.stringify({ done: true, processed: allRecords.length, summary: publicData.summary }, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error.message || String(error));
  process.exit(1);
});
