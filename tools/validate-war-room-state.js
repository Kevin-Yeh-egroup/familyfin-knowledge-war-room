#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const repoRoot = path.resolve(__dirname, "..");

const paths = {
  suggestions: "suggestions.json",
  articlePackHistory: "article-pack-history.json",
  analysisHistory: "analysis-history.json",
  submissionGates: "data/submission-quality-gates-2026-06-09.json",
  gateContract: "data/gate-driven-article-generation-contract-2026-06-03.json",
  knowledgeBaseTitleIndex: "data/knowledge-base-title-index.json",
  improvementRuleDelta: "docs/reviewer-rule-delta-2026-06-10.md",
  approvedAuthorStructureTemplate: "data/approved-author-structure-card-template-2026-06-10.json",
  approvedAuthorStructureCards: "data/approved-author-structure-cards-2026-06-10.json",
  improvementPlanReport: "reports/2026-06-10-improvement-plan-gap-and-author-learning.md",
  approvedAuthorStructureReport: "reports/2026-06-10-approved-author-structure-cards.md",
};

const errors = [];
const warnings = [];
const checks = [];

function relPath(filePath) {
  return path.relative(repoRoot, filePath).replace(/\\/g, "/");
}

function readJson(relativePath) {
  const fullPath = path.join(repoRoot, relativePath);
  try {
    return JSON.parse(fs.readFileSync(fullPath, "utf8"));
  } catch (error) {
    errors.push(`${relativePath} parse failed: ${error.message}`);
    return null;
  }
}

function readJsonIfExists(relativePath) {
  const fullPath = path.join(repoRoot, relativePath);
  if (!fs.existsSync(fullPath)) return null;
  return readJson(relativePath);
}

function bodyText(rawText) {
  const normalized = rawText.replace(/\r\n/g, "\n").trim();
  const bodyMarker = normalized.match(/(^|\n)\s*正文\s*(\n|$)/);
  if (!bodyMarker) return normalized;
  return normalized.slice(bodyMarker.index + bodyMarker[0].length).trim();
}

function nonWhitespaceCount(text) {
  return (text.match(/\S/g) || []).length;
}

function normalizeTitleForSimilarity(title) {
  return String(title || "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[「」『』《》〈〉（）()【】\[\]{}、，。！？!?:：；;,.．・\-—_~～\s]/g, "")
    .trim();
}

function levenshteinDistance(a, b) {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const matrix = Array.from({ length: rows }, () => Array(cols).fill(0));
  for (let i = 0; i < rows; i += 1) matrix[i][0] = i;
  for (let j = 0; j < cols; j += 1) matrix[0][j] = j;

  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      );
    }
  }

  return matrix[a.length][b.length];
}

function titleSimilarityScore(a, b) {
  const left = normalizeTitleForSimilarity(a);
  const right = normalizeTitleForSimilarity(b);
  if (!left || !right) return 0;
  if (left === right) return 1;
  const longest = Math.max(left.length, right.length);
  return longest ? 1 - levenshteinDistance(left, right) / longest : 0;
}

function analyzeTitleNovelty(articles) {
  const exactPairs = [];
  const nearPairs = [];
  const containmentPairs = [];
  const warningPairs = [];
  const normalized = articles.map((article) => ({
    id: article.id,
    title: article.title,
    normalizedTitle: normalizeTitleForSimilarity(article.title),
  }));

  for (let i = 0; i < normalized.length; i += 1) {
    for (let j = i + 1; j < normalized.length; j += 1) {
      const left = normalized[i];
      const right = normalized[j];
      if (!left.normalizedTitle || !right.normalizedTitle) continue;

      const pair = `${left.id} <-> ${right.id}`;
      const score = titleSimilarityScore(left.title, right.title);
      const shorter = left.normalizedTitle.length <= right.normalizedTitle.length ? left : right;
      const longer = shorter === left ? right : left;
      const containsCoreTitle =
        shorter.normalizedTitle.length >= 12 && longer.normalizedTitle.includes(shorter.normalizedTitle);

      if (left.normalizedTitle === right.normalizedTitle) {
        exactPairs.push(pair);
      } else if (score >= 0.9) {
        nearPairs.push(`${pair} (${score.toFixed(2)})`);
      } else if (containsCoreTitle) {
        containmentPairs.push(`${pair} (${shorter.id} title contained)`);
      } else if (score >= 0.78) {
        warningPairs.push(`${pair} (${score.toFixed(2)})`);
      }
    }
  }

  return {
    exactPairs,
    nearPairs,
    containmentPairs,
    warningPairs,
    normalized,
  };
}

function compareTitlesWithKnowledgeBase(articles, titleIndex) {
  const titleRecords = titleIndex?.titles || [];
  const exactMatches = [];
  const nearMatches = [];
  const warnings = [];

  const normalizedIndex = titleRecords
    .map((record) => ({
      articleId: record.articleId,
      title: record.title,
      normalizedTitle: record.normalizedTitle || normalizeTitleForSimilarity(record.title),
    }))
    .filter((record) => record.articleId && record.title && record.normalizedTitle);

  for (const article of articles) {
    const articleNormalized = normalizeTitleForSimilarity(article.title);
    if (!articleNormalized) continue;

    let best = null;
    for (const record of normalizedIndex) {
      const score = titleSimilarityScore(article.title, record.title);
      const shorterLength = Math.min(articleNormalized.length, record.normalizedTitle.length);
      const containsCoreTitle =
        shorterLength >= 12 &&
        (articleNormalized.includes(record.normalizedTitle) || record.normalizedTitle.includes(articleNormalized));

      if (!best || score > best.score) {
        best = { ...record, score, containsCoreTitle };
      }

      const detail = `${article.id} -> ${record.articleId} (${score.toFixed(2)})`;
      if (articleNormalized === record.normalizedTitle) {
        exactMatches.push(detail);
      } else if (score >= 0.94) {
        nearMatches.push(detail);
      } else if (containsCoreTitle || score >= 0.86) {
        warnings.push(detail);
      }
    }
  }

  return {
    sourceTitleCount: normalizedIndex.length,
    exactMatches,
    nearMatches,
    warnings: warnings.slice(0, 12),
    warningOverflow: Math.max(0, warnings.length - 12),
  };
}


function pushCheck(name, status, detail) {
  checks.push({ name, status, detail });
}

function validateApprovedAuthorStructureUse(scopeId, approvedAuthorStructureUse) {
  if (!approvedAuthorStructureUse) {
    errors.push(`${scopeId} approvedAuthorStructureUse missing`);
    return false;
  }

  const requiredPatternIds = [
    "case_before_after_difference",
    "policy_decision_order",
    "support_and_risk_layering",
  ];
  const appliedPatterns = approvedAuthorStructureUse.appliedPatterns || [];
  const appliedPatternIds = appliedPatterns.map((pattern) => pattern.id || pattern.patternId);
  const missingPatternIds = requiredPatternIds.filter((id) => !appliedPatternIds.includes(id));

  if (approvedAuthorStructureUse.status !== "passed") {
    errors.push(`${scopeId} approvedAuthorStructureUse status drift: ${approvedAuthorStructureUse.status}`);
    return false;
  }
  if (approvedAuthorStructureUse.source !== paths.approvedAuthorStructureCards) {
    errors.push(`${scopeId} approvedAuthorStructureUse source drift: ${approvedAuthorStructureUse.source}`);
    return false;
  }
  if (!approvedAuthorStructureUse.primaryPattern) {
    errors.push(`${scopeId} approvedAuthorStructureUse primaryPattern missing`);
    return false;
  }
  if (!Array.isArray(appliedPatterns) || appliedPatterns.length < 3 || missingPatternIds.length) {
    errors.push(
      `${scopeId} approvedAuthorStructureUse pattern coverage invalid: missing=${
        missingPatternIds.join(",") || "none"
      }`,
    );
    return false;
  }
  if (!approvedAuthorStructureUse.generationConstraint || !approvedAuthorStructureUse.publicBodyRule) {
    errors.push(`${scopeId} approvedAuthorStructureUse generation/public body rules missing`);
    return false;
  }

  return true;
}

function checkExists(relativePath, label = relativePath) {
  const fullPath = path.join(repoRoot, relativePath);
  if (!fs.existsSync(fullPath)) {
    errors.push(`${label} missing: ${relativePath}`);
    return false;
  }
  return true;
}

function auditRoleIntegrity(target) {
  try {
    const output = execFileSync(
      process.execPath,
      [path.join(repoRoot, "tools", "audit-article-role-integrity.js"), target],
      { cwd: repoRoot, encoding: "utf8" },
    );
    return JSON.parse(output);
  } catch (error) {
    const output = error.stdout?.toString() || error.message;
    try {
      return JSON.parse(output);
    } catch {
      errors.push(`role integrity audit failed for ${target}: ${output}`);
      return null;
    }
  }
}

const suggestions = readJson(paths.suggestions);
const articlePackHistory = readJson(paths.articlePackHistory);
const analysisHistory = readJson(paths.analysisHistory);
const submissionGates = readJson(paths.submissionGates);
const gateContract = readJson(paths.gateContract);
const knowledgeBaseTitleIndex = readJsonIfExists(paths.knowledgeBaseTitleIndex);

const improvementRuleAssets = [
  paths.improvementRuleDelta,
  paths.approvedAuthorStructureTemplate,
  paths.approvedAuthorStructureCards,
  paths.improvementPlanReport,
  paths.approvedAuthorStructureReport,
];
const missingImprovementRuleAssets = improvementRuleAssets.filter((relativePath) => !checkExists(relativePath));
if (missingImprovementRuleAssets.length === 0) {
  pushCheck("2026-06-10 improvement plan rule assets", "pass", `${improvementRuleAssets.length} files found`);
}

const approvedAuthorStructureCards = readJson(paths.approvedAuthorStructureCards);
if (approvedAuthorStructureCards) {
  const cards = approvedAuthorStructureCards.cards || [];
  const expectedAuthors = ["劉泰一", "李婉仙", "蔡思樂"];
  const foundAuthors = cards.map((card) => card.targetAuthor);
  const missingAuthors = expectedAuthors.filter((author) => !foundAuthors.includes(author));
  const unsafeSourceCards = cards.filter(
    (card) =>
      !card.fullBodyRead ||
      card.reviewStatus !== "審核成功" ||
      card.sourceKind?.includes("FB短文") ||
      card.sourceKind?.includes("社群導流"),
  );
  const incompleteImprovementCards = cards.filter((card) => {
    const plan = card.improvementPlanPattern;
    return !plan || !plan.hasCurrentGap || !plan.hasActions || !plan.hasBreakEvenOrHelpPath;
  });

  if (cards.length !== 3) {
    errors.push(`approved author structure card count should be 3, found ${cards.length}`);
  }
  if (missingAuthors.length) {
    errors.push(`approved author structure cards missing authors: ${missingAuthors.join(", ")}`);
  }
  if (unsafeSourceCards.length) {
    errors.push(
      `approved author structure cards have unsafe or incomplete source boundaries: ${unsafeSourceCards
        .map((card) => card.cardId || card.targetAuthor)
        .join(", ")}`,
    );
  }
  if (incompleteImprovementCards.length) {
    errors.push(
      `approved author structure cards missing improvement plan signals: ${incompleteImprovementCards
        .map((card) => card.cardId || card.targetAuthor)
        .join(", ")}`,
    );
  }
  if (!cards.some((card) => card.improvementPlanPattern?.hasBeforeAfterEffect)) {
    errors.push("approved author structure cards need at least one before/after effect sample");
  }
  if (!approvedAuthorStructureCards.sourceBoundary?.publicSafety?.storesOnlyDeidentifiedStructure) {
    errors.push("approved author structure cards public safety boundary missing deidentified-only flag");
  }
  if (
    cards.length === 3 &&
    !missingAuthors.length &&
    !unsafeSourceCards.length &&
    !incompleteImprovementCards.length
  ) {
    pushCheck("approved author structure cards", "pass", `${cards.length} authors, deidentified structure only`);
  }
}

if (suggestions && submissionGates) {
  const expectedGateCount = submissionGates.gates?.length || 0;
  const metricGateCount = suggestions.metrics?.submissionQualityGateCount;
  if (metricGateCount !== expectedGateCount) {
    errors.push(`submissionQualityGateCount drift: suggestions=${metricGateCount}, gates=${expectedGateCount}`);
  } else {
    pushCheck("submission gate count", "pass", `${expectedGateCount} gates`);
  }
}

if (suggestions && gateContract) {
  const contractGateCount = Object.keys(gateContract.gateToGenerationMoves || {}).length;
  if (contractGateCount !== (submissionGates?.gates?.length || contractGateCount)) {
    errors.push(`gate contract count drift: contract=${contractGateCount}, gates=${submissionGates?.gates?.length}`);
  } else {
    pushCheck("gate contract count", "pass", `${contractGateCount} gate moves`);
  }
}

if (suggestions) {
  if (suggestions.metrics?.approvedAuthorStructureLearningRequired !== true) {
    errors.push("approvedAuthorStructureLearningRequired metric missing or false");
  }
  if (suggestions.metrics?.approvedAuthorStructureCardCount !== 3) {
    errors.push(
      `approvedAuthorStructureCardCount drift: suggestions=${suggestions.metrics?.approvedAuthorStructureCardCount}, expected=3`,
    );
  }
  if (suggestions.metrics?.approvedAuthorStructureLearningPath !== paths.approvedAuthorStructureCards) {
    errors.push(
      `approvedAuthorStructureLearningPath drift: suggestions=${suggestions.metrics?.approvedAuthorStructureLearningPath}`,
    );
  }
  if (suggestions.approvedAuthorStructureLearning?.status !== "integrated_into_war_room_and_generation") {
    errors.push("approvedAuthorStructureLearning summary missing or status drift");
  } else {
    pushCheck("approved author structure generation integration", "pass", "metrics and public summary present");
  }
}

if (analysisHistory) {
  const weeklyCount = analysisHistory.weeklyReports?.length || 0;
  const entryCount = analysisHistory.entries?.length || 0;
  pushCheck("analysis history parse", "pass", `${weeklyCount} weekly reports, ${entryCount} records`);
}

let currentPackStats = null;

if (suggestions?.articlePack) {
  const pack = suggestions.articlePack;
  const articles = pack.articles || [];
  const bodyFiles = pack.files?.bodyFiles || articles.map((article) => article.bodyPath).filter(Boolean);
  const computed = [];
  let greenReviewCount = 0;
  let preGenerationPassCount = 0;
  const nonGreenReviewIds = [];
  const preGenerationFailures = [];
  const titleNovelty = analyzeTitleNovelty(articles);
  const knowledgeBaseTitleComparison = knowledgeBaseTitleIndex
    ? compareTitlesWithKnowledgeBase(articles, knowledgeBaseTitleIndex)
    : null;

  if (articles.length !== 10) {
    errors.push(`current article pack should contain 10 articles, found ${articles.length}`);
  }

  if (titleNovelty.exactPairs.length) {
    errors.push(`current pack has duplicate normalized titles: ${titleNovelty.exactPairs.join(", ")}`);
  }
  if (titleNovelty.nearPairs.length) {
    errors.push(`current pack has near-duplicate titles: ${titleNovelty.nearPairs.join(", ")}`);
  }
  if (titleNovelty.containmentPairs.length) {
    errors.push(`current pack has contained/reused core titles: ${titleNovelty.containmentPairs.join(", ")}`);
  }
  if (titleNovelty.warningPairs.length) {
    warnings.push(`current pack has title similarity warnings: ${titleNovelty.warningPairs.join(", ")}`);
  }
  if (!titleNovelty.exactPairs.length && !titleNovelty.nearPairs.length && !titleNovelty.containmentPairs.length) {
    pushCheck("current pack title novelty", "pass", `${articles.length} titles, ${titleNovelty.warningPairs.length} warnings`);
  }

  if (knowledgeBaseTitleComparison) {
    if (knowledgeBaseTitleComparison.exactMatches.length) {
      errors.push(`current pack has titles already in knowledge base: ${knowledgeBaseTitleComparison.exactMatches.join(", ")}`);
    }
    if (knowledgeBaseTitleComparison.nearMatches.length) {
      errors.push(`current pack has near-duplicate knowledge-base titles: ${knowledgeBaseTitleComparison.nearMatches.join(", ")}`);
    }
    if (knowledgeBaseTitleComparison.warnings.length) {
      warnings.push(
        `knowledge-base title similarity warnings: ${knowledgeBaseTitleComparison.warnings.join(", ")}${
          knowledgeBaseTitleComparison.warningOverflow ? ` (+${knowledgeBaseTitleComparison.warningOverflow} more)` : ""
        }`,
      );
    }
    if (!knowledgeBaseTitleComparison.exactMatches.length && !knowledgeBaseTitleComparison.nearMatches.length) {
      pushCheck(
        "knowledge-base title index",
        "pass",
        `${knowledgeBaseTitleComparison.sourceTitleCount} indexed titles, ${knowledgeBaseTitleComparison.warnings.length} warnings`,
      );
    }
  } else {
    warnings.push("knowledge-base title index missing; run node tools/build-knowledge-base-title-index.js before formal prewrite checks");
  }

  for (const article of articles) {
    const preGenerationReview = article.preGenerationReview;
    if (!preGenerationReview) {
      errors.push(`${article.id} preGenerationReview missing`);
      preGenerationFailures.push(`${article.id}:missing`);
    } else {
      const requiredCards = [
        "topicEvidenceCard",
        "readerFitCard",
        "financialDecisionCard",
        "financialLiteracyTransfer",
        "approvedAuthorStructureUse",
      ];
      const missingCards = requiredCards.filter((field) => !preGenerationReview[field]);
      const failedCards = requiredCards.filter(
        (field) => preGenerationReview[field] && preGenerationReview[field].status !== "passed",
      );
      if (preGenerationReview.status !== "passed_prewrite_protocol") {
        errors.push(`${article.id} preGenerationReview status drift: ${preGenerationReview.status}`);
        preGenerationFailures.push(`${article.id}:status`);
      } else if (missingCards.length || failedCards.length) {
        errors.push(
          `${article.id} preGenerationReview cards invalid: missing=${missingCards.join(",") || "none"} failed=${
            failedCards.join(",") || "none"
          }`,
        );
        preGenerationFailures.push(`${article.id}:cards`);
      } else if (
        !preGenerationReview.financialDecisionCard.assessmentTask ||
        !preGenerationReview.financialLiteracyTransfer.capability
      ) {
        errors.push(`${article.id} preGenerationReview lacks financial assessment task or literacy transfer`);
        preGenerationFailures.push(`${article.id}:financial`);
      } else if (!validateApprovedAuthorStructureUse(article.id, preGenerationReview.approvedAuthorStructureUse)) {
        preGenerationFailures.push(`${article.id}:approvedAuthorStructureUse`);
      } else {
        preGenerationPassCount += 1;
      }
    }

    const reviewGate = article.articlePackReviewGate;
    if (!reviewGate) {
      errors.push(`${article.id} articlePackReviewGate missing`);
      nonGreenReviewIds.push(`${article.id}:missing`);
    } else {
      if (reviewGate.status !== "green") {
        errors.push(`${article.id} articlePackReviewGate not green: ${reviewGate.status}`);
        nonGreenReviewIds.push(`${article.id}:${reviewGate.status || "unknown"}`);
      } else {
        greenReviewCount += 1;
      }
      if (!Number.isFinite(reviewGate.round) || reviewGate.round < 1) {
        errors.push(`${article.id} articlePackReviewGate round missing or invalid`);
      }
      if (!Array.isArray(reviewGate.reviewers) || reviewGate.reviewers.length < 5) {
        errors.push(`${article.id} articlePackReviewGate reviewers missing or too shallow`);
      }
      if (reviewGate.loopPolicy !== "review_then_revise_until_green") {
        errors.push(`${article.id} articlePackReviewGate loopPolicy drift: ${reviewGate.loopPolicy}`);
      }
      if (!reviewGate.revisionRequiredWhen || !reviewGate.revisionMove) {
        errors.push(`${article.id} articlePackReviewGate revision rule missing`);
      }
    }

    if (!article.bodyPath || !checkExists(article.bodyPath, `bodyPath for ${article.id}`)) continue;
    const raw = fs.readFileSync(path.join(repoRoot, article.bodyPath), "utf8");
    const body = bodyText(raw);
    const chars = nonWhitespaceCount(body);
    const includingWhitespace = body.length;
    computed.push({ id: article.id, path: article.bodyPath, chars, includingWhitespace });

    if (chars <= 2000) {
      errors.push(`${article.id} body length gate failed: ${chars} non-whitespace chars`);
    } else if (chars <= 2050) {
      warnings.push(`${article.id} is close to body length floor: ${chars} non-whitespace chars`);
    }

    if (article.bodyChars !== chars) {
      errors.push(`${article.id} bodyChars drift: suggestions=${article.bodyChars}, computed=${chars}`);
    }

    if (article.bodyCharsIncludingWhitespace && article.bodyCharsIncludingWhitespace !== includingWhitespace) {
      errors.push(
        `${article.id} bodyCharsIncludingWhitespace drift: suggestions=${article.bodyCharsIncludingWhitespace}, computed=${includingWhitespace}`,
      );
    }
  }

  const missingBodyFiles = bodyFiles.filter((relativePath) => !checkExists(relativePath, "article pack body file"));
  if (missingBodyFiles.length === 0) {
    pushCheck("article body files", "pass", `${bodyFiles.length} files found`);
  }

  if (greenReviewCount === articles.length && nonGreenReviewIds.length === 0) {
    pushCheck("article pack green review", "pass", `${greenReviewCount}/${articles.length} articles green`);
  }

  if (preGenerationPassCount === articles.length && preGenerationFailures.length === 0) {
    pushCheck("article pack pre-generation protocol", "pass", `${preGenerationPassCount}/${articles.length} articles passed`);
  }

  const audit = auditRoleIntegrity(pack.files?.directory || "articles/2026-06-03-public-regenerated-pack");
  if (audit?.pass) {
    pushCheck("role integrity audit", "pass", `${audit.scannedFiles} files, ${audit.matches} matches`);
  } else if (audit) {
    errors.push(`role integrity audit failed: ${audit.matches} matches`);
  }

  currentPackStats = {
    id: pack.id,
    articleCount: articles.length,
    bodyCharsMin: computed.length ? Math.min(...computed.map((item) => item.chars)) : 0,
    bodyCharsMax: computed.length ? Math.max(...computed.map((item) => item.chars)) : 0,
    computed,
    greenReview: {
      green: greenReviewCount,
      nonGreen: nonGreenReviewIds.length,
      nonGreenReviewIds,
    },
    preGenerationReview: {
      passed: preGenerationPassCount,
      failed: preGenerationFailures.length,
      failures: preGenerationFailures,
    },
    titleNovelty: {
      exactPairs: titleNovelty.exactPairs.length,
      nearPairs: titleNovelty.nearPairs.length,
      containmentPairs: titleNovelty.containmentPairs.length,
      warningPairs: titleNovelty.warningPairs.length,
    },
    knowledgeBaseTitleComparison: knowledgeBaseTitleComparison
      ? {
          sourceTitleCount: knowledgeBaseTitleComparison.sourceTitleCount,
          exactMatches: knowledgeBaseTitleComparison.exactMatches.length,
          nearMatches: knowledgeBaseTitleComparison.nearMatches.length,
          warnings: knowledgeBaseTitleComparison.warnings.length,
          warningOverflow: knowledgeBaseTitleComparison.warningOverflow,
        }
      : null,
  };

  const metricGreenReviewCount = suggestions.metrics?.articlePackGreenReviewCount;
  if (metricGreenReviewCount !== undefined && metricGreenReviewCount !== articles.length) {
    errors.push(`articlePackGreenReviewCount drift: suggestions=${metricGreenReviewCount}, articles=${articles.length}`);
  }
  if (suggestions.metrics?.articlePackGreenReviewRequired !== true) {
    errors.push("articlePackGreenReviewRequired metric missing or false");
  }
  if (suggestions.metrics?.preGenerationProtocolRequired !== true) {
    errors.push("preGenerationProtocolRequired metric missing or false");
  }
  if (suggestions.metrics?.topicEvidenceGateRequired !== true) {
    errors.push("topicEvidenceGateRequired metric missing or false");
  }
  if (suggestions.metrics?.readerFitGateRequired !== true) {
    errors.push("readerFitGateRequired metric missing or false");
  }
  if (suggestions.metrics?.financialDecisionSupportGateRequired !== true) {
    errors.push("financialDecisionSupportGateRequired metric missing or false");
  }
  if (suggestions.metrics?.financialLiteracyTransferGateRequired !== true) {
    errors.push("financialLiteracyTransferGateRequired metric missing or false");
  }
  if (pack.exportMode?.greenReviewRequired !== true) {
    errors.push("articlePack exportMode.greenReviewRequired missing or false");
  }
  if (pack.articlePackGreenReviewPolicy?.status !== "required_before_review_board") {
    errors.push("articlePackGreenReviewPolicy missing or status drift");
  }
}

if (articlePackHistory && currentPackStats) {
  const currentRecord = (articlePackHistory.records || []).find((record) => record.currentReviewBoard);
  if (!currentRecord) {
    errors.push("article-pack-history currentReviewBoard record missing");
  } else {
    if (currentRecord.id !== currentPackStats.id) {
      errors.push(`article-pack-history current record drift: ${currentRecord.id} !== ${currentPackStats.id}`);
    }
    if (currentRecord.bodyCharsMin !== currentPackStats.bodyCharsMin || currentRecord.bodyCharsMax !== currentPackStats.bodyCharsMax) {
      errors.push(
        `article-pack-history body range drift: history=${currentRecord.bodyCharsMin}-${currentRecord.bodyCharsMax}, computed=${currentPackStats.bodyCharsMin}-${currentPackStats.bodyCharsMax}`,
      );
    } else {
      pushCheck("article-pack-history body range", "pass", `${currentRecord.bodyCharsMin}-${currentRecord.bodyCharsMax}`);
    }
  }

  for (const attempt of articlePackHistory.generationAttempts || []) {
    for (const logPath of attempt.relatedLogs || []) {
      checkExists(logPath, `generation attempt log ${attempt.id}`);
    }
  }
}

if (suggestions?.trialArticlePacks?.length) {
  const trialPacks = suggestions.trialArticlePacks;
  let currentTrialPackStats = null;

  for (const trialPack of trialPacks) {
    const articles = trialPack.articles || [];
    const computed = [];
    let greenReviewCount = 0;
    let preGenerationPassCount = 0;
    const nonGreenReviewIds = [];
    const preGenerationFailures = [];

    if (!articles.length) {
      errors.push(`${trialPack.id} trial pack has no articles`);
    }

    for (const article of articles) {
      const preGenerationReview = article.preGenerationReview;
      if (!preGenerationReview) {
        errors.push(`${trialPack.id}/${article.id} preGenerationReview missing`);
        preGenerationFailures.push(`${article.id}:missing`);
      } else {
        const requiredCards = [
          "topicEvidenceCard",
          "readerFitCard",
          "financialDecisionCard",
          "financialLiteracyTransfer",
          "approvedAuthorStructureUse",
        ];
        const missingCards = requiredCards.filter((field) => !preGenerationReview[field]);
        const failedCards = requiredCards.filter(
          (field) => preGenerationReview[field] && preGenerationReview[field].status !== "passed",
        );
        if (preGenerationReview.status !== "passed_prewrite_protocol") {
          errors.push(`${trialPack.id}/${article.id} preGenerationReview status drift: ${preGenerationReview.status}`);
          preGenerationFailures.push(`${article.id}:status`);
        } else if (missingCards.length || failedCards.length) {
          errors.push(
            `${trialPack.id}/${article.id} preGenerationReview cards invalid: missing=${
              missingCards.join(",") || "none"
            } failed=${failedCards.join(",") || "none"}`,
          );
          preGenerationFailures.push(`${article.id}:cards`);
        } else if (
          !preGenerationReview.financialDecisionCard.assessmentTask ||
          !preGenerationReview.financialLiteracyTransfer.capability
        ) {
          errors.push(`${trialPack.id}/${article.id} lacks financial assessment task or literacy transfer`);
          preGenerationFailures.push(`${article.id}:financial`);
        } else if (
          !validateApprovedAuthorStructureUse(
            `${trialPack.id}/${article.id}`,
            preGenerationReview.approvedAuthorStructureUse,
          )
        ) {
          preGenerationFailures.push(`${article.id}:approvedAuthorStructureUse`);
        } else {
          preGenerationPassCount += 1;
        }
      }

      const reviewGate = article.articlePackReviewGate;
      if (!reviewGate) {
        errors.push(`${trialPack.id}/${article.id} articlePackReviewGate missing`);
        nonGreenReviewIds.push(`${article.id}:missing`);
      } else {
        if (reviewGate.status !== "green") {
          errors.push(`${trialPack.id}/${article.id} articlePackReviewGate not green: ${reviewGate.status}`);
          nonGreenReviewIds.push(`${article.id}:${reviewGate.status || "unknown"}`);
        } else {
          greenReviewCount += 1;
        }
        if (!Array.isArray(reviewGate.reviewers) || reviewGate.reviewers.length < 5) {
          errors.push(`${trialPack.id}/${article.id} articlePackReviewGate reviewers missing or too shallow`);
        }
        if (reviewGate.loopPolicy !== "review_then_revise_until_green") {
          errors.push(`${trialPack.id}/${article.id} articlePackReviewGate loopPolicy drift: ${reviewGate.loopPolicy}`);
        }
      }

      if (!article.bodyPath || !checkExists(article.bodyPath, `trial bodyPath for ${trialPack.id}/${article.id}`)) {
        continue;
      }

      const raw = fs.readFileSync(path.join(repoRoot, article.bodyPath), "utf8");
      const body = bodyText(raw);
      const chars = nonWhitespaceCount(body);
      const includingWhitespace = body.length;
      computed.push({ id: article.id, path: article.bodyPath, chars, includingWhitespace });

      if (chars <= 2000) {
        errors.push(`${trialPack.id}/${article.id} body length gate failed: ${chars} non-whitespace chars`);
      }
      if (article.bodyChars !== chars) {
        errors.push(`${trialPack.id}/${article.id} bodyChars drift: suggestions=${article.bodyChars}, computed=${chars}`);
      }
      if (article.bodyCharsIncludingWhitespace && article.bodyCharsIncludingWhitespace !== includingWhitespace) {
        errors.push(
          `${trialPack.id}/${article.id} bodyCharsIncludingWhitespace drift: suggestions=${article.bodyCharsIncludingWhitespace}, computed=${includingWhitespace}`,
        );
      }
    }

    const auditTarget = trialPack.files?.directory || `articles/${trialPack.id}`;
    const audit = auditRoleIntegrity(auditTarget);
    if (audit?.pass) {
      pushCheck(`${trialPack.id} role integrity audit`, "pass", `${audit.scannedFiles} files, ${audit.matches} matches`);
    } else if (audit) {
      errors.push(`${trialPack.id} role integrity audit failed: ${audit.matches} matches`);
    }

    if (greenReviewCount === articles.length && nonGreenReviewIds.length === 0) {
      pushCheck(`${trialPack.id} green review`, "pass", `${greenReviewCount}/${articles.length} articles green`);
    }
    if (preGenerationPassCount === articles.length && preGenerationFailures.length === 0) {
      pushCheck(`${trialPack.id} pre-generation protocol`, "pass", `${preGenerationPassCount}/${articles.length} articles passed`);
    }

    const stats = {
      id: trialPack.id,
      articleCount: articles.length,
      bodyCharsMin: computed.length ? Math.min(...computed.map((item) => item.chars)) : 0,
      bodyCharsMax: computed.length ? Math.max(...computed.map((item) => item.chars)) : 0,
      computed,
      greenReview: {
        green: greenReviewCount,
        nonGreen: nonGreenReviewIds.length,
        nonGreenReviewIds,
      },
      preGenerationReview: {
        passed: preGenerationPassCount,
        failed: preGenerationFailures.length,
        failures: preGenerationFailures,
      },
    };

    if (trialPack.id === suggestions.currentTrialArticlePackId) {
      currentTrialPackStats = stats;
    }
  }

  const metricTrialPackCount = suggestions.metrics?.trialArticlePackCount;
  if (metricTrialPackCount !== undefined && metricTrialPackCount !== trialPacks.length) {
    errors.push(`trialArticlePackCount drift: suggestions=${metricTrialPackCount}, packs=${trialPacks.length}`);
  }
  const currentTrial = trialPacks.find((pack) => pack.id === suggestions.currentTrialArticlePackId) || trialPacks[0];
  const metricCurrentTrialCount = suggestions.metrics?.currentTrialArticlePackArticleCount;
  if (metricCurrentTrialCount !== undefined && metricCurrentTrialCount !== (currentTrial?.articles || []).length) {
    errors.push(
      `currentTrialArticlePackArticleCount drift: suggestions=${metricCurrentTrialCount}, articles=${
        (currentTrial?.articles || []).length
      }`,
    );
  }

  if (articlePackHistory && currentTrialPackStats) {
    const currentTrialRecord = (articlePackHistory.records || []).find((record) => record.currentTrialPack);
    if (!currentTrialRecord) {
      errors.push("article-pack-history currentTrialPack record missing");
    } else {
      if (currentTrialRecord.id !== currentTrialPackStats.id) {
        errors.push(`article-pack-history trial record drift: ${currentTrialRecord.id} !== ${currentTrialPackStats.id}`);
      }
      if (
        currentTrialRecord.bodyCharsMin !== currentTrialPackStats.bodyCharsMin ||
        currentTrialRecord.bodyCharsMax !== currentTrialPackStats.bodyCharsMax
      ) {
        errors.push(
          `article-pack-history trial body range drift: history=${currentTrialRecord.bodyCharsMin}-${currentTrialRecord.bodyCharsMax}, computed=${currentTrialPackStats.bodyCharsMin}-${currentTrialPackStats.bodyCharsMax}`,
        );
      } else {
        pushCheck(
          "article-pack-history trial body range",
          "pass",
          `${currentTrialRecord.bodyCharsMin}-${currentTrialRecord.bodyCharsMax}`,
        );
      }
    }
  }
}

const reviewReadyCards = suggestions?.metrics?.reviewRejectionLearningReadyCards;
if (typeof reviewReadyCards === "number" && reviewReadyCards < 8) {
  warnings.push(`review learning still below formal 10-article threshold: ${reviewReadyCards}/8 ready cards`);
}

const result = {
  status: errors.length ? "fail" : warnings.length ? "pass_with_warnings" : "pass",
  checkedAt: new Date().toISOString(),
  errors,
  warnings,
  checks,
  currentPackStats,
};

console.log(JSON.stringify(result, null, 2));
process.exit(errors.length ? 1 : 0);
