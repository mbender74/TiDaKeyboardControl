import { createHash, randomUUID } from "node:crypto";
import { access, mkdir, readFile, rename, writeFile } from "node:fs/promises";
import * as path from "node:path";
import type { ExtensionAPI, ExtensionCommandContext, ExtensionContext } from "@mariozechner/pi-coding-agent";
import { getMarkdownTheme } from "@mariozechner/pi-coding-agent";
import { Container, Image, Markdown, Spacer, matchesKey } from "@mariozechner/pi-tui";

type VisualSource = "assistant" | "tool";
type TextPart = { type?: string; text?: string };
type MessageLike = { role?: string; content?: unknown };
type MessageEndLike = { message?: MessageLike };

type VisualSnapshot = {
	id: string;
	ts: number;
	hash: string;
	source: VisualSource;
	text: string;
	mermaidBlocks: string[];
	renderedMermaidPath?: string;
	renderedMermaidPngPath?: string;
	markdownPngPath?: string;
	chartPngPath?: string;
	previewPngPath?: string;
	renderError?: string;
};

type NumericChart = {
	title: string;
	labels: string[];
	values: number[];
};

type CustomTextBlock = { type: "text"; text: string };
type CustomImageBlock = { type: "image"; data: string; mimeType: string };
type CustomMessageContent = string | Array<CustomTextBlock | CustomImageBlock>;

const WIDGET_ID = "pi-visual";
const MAX_CAPTURE_CHARS = 32_000;
const MAX_MERMAID_BLOCKS = 4;
const MAX_MERMAID_CHARS = 24_000;

const state: {
	latest?: VisualSnapshot;
	lastHash?: string;
	lastInlineHash?: string;
	widgetEnabled: boolean;
	visualizeActive: boolean;
	commands: {
		visualize: string;
		alias: string;
		clear: string;
		widget: string;
	};
} = {
	widgetEnabled: true,
	visualizeActive: false,
	commands: {
		visualize: "pi-visualize",
		alias: "pi-visual",
		clear: "pi-visual-clear",
		widget: "pi-visual-widget",
	},
};

let lastCtx: ExtensionContext | undefined;
let liveRenderQueue: Promise<void> = Promise.resolve();

function extractText(content: unknown): string {
	if (typeof content === "string") return content;
	if (!Array.isArray(content)) return "";
	const out: string[] = [];
	for (const part of content) {
		if (!part || typeof part !== "object") continue;
		const block = part as TextPart;
		if (block.type === "text" && typeof block.text === "string") out.push(block.text);
	}
	return out.join("\n");
}

function clampCapture(text: string): string {
	const trimmed = text.trim();
	if (trimmed.length <= MAX_CAPTURE_CHARS) return trimmed;
	return `${trimmed.slice(0, MAX_CAPTURE_CHARS)}\n\n… [truncated by pi-visual]`;
}

function extractMermaidBlocks(text: string): string[] {
	const blocks: string[] = [];
	const re = /```mermaid\s*\n([\s\S]*?)```/gi;
	let match: RegExpExecArray | null;
	while ((match = re.exec(text)) !== null && blocks.length < MAX_MERMAID_BLOCKS) {
		const block = match[1]?.trim();
		if (block) blocks.push(block.slice(0, MAX_MERMAID_CHARS));
	}
	return blocks;
}

function roleToSource(role: string | undefined): VisualSource | undefined {
	if (role === "assistant") return "assistant";
	if (role === "toolResult") return "tool";
	return undefined;
}

function statusText(): string {
	if (!state.latest) return `visual:${state.visualizeActive ? "on" : "off"}`;
	return `visual:${state.visualizeActive ? "on" : "off"} mmd:${state.latest.mermaidBlocks.length}`;
}

function updateWidget(ctx: ExtensionContext): void {
	if (!ctx.hasUI) return;
	ctx.ui.setStatus("pi-visual", ctx.ui.theme.fg("accent", statusText()));
	if (!state.widgetEnabled) return;
	if (!state.latest) {
		ctx.ui.setWidget(WIDGET_ID, undefined, { placement: "belowEditor" });
		return;
	}
	const age = Math.max(0, Math.round((Date.now() - state.latest.ts) / 1000));
	ctx.ui.setWidget(
		WIDGET_ID,
		[
			`visual latest · ${state.latest.source} · mmd ${state.latest.mermaidBlocks.length} · ${age}s · ${state.visualizeActive ? "live:on" : "live:off"} · /${state.commands.visualize}`,
		],
		{ placement: "belowEditor" },
	);
}

function clearWidget(ctx: ExtensionContext): void {
	if (!ctx.hasUI) return;
	ctx.ui.setWidget(WIDGET_ID, undefined, { placement: "belowEditor" });
}

function visualScore(text: string, mermaidBlocks: string[]): number {
	let score = 0;
	if (mermaidBlocks.length > 0) score += 4;
	if (parseFirstNumericMarkdownTable(text)) score += 2;
	if (/^#{1,6}\s|^\s*[-*+]\s|\|\s*[-:]+\s*\|/m.test(text)) score += 1;
	return score;
}

function hasVisualSignal(text: string, mermaidBlocks: string[]): boolean {
	if (mermaidBlocks.length > 0) return true;
	if (parseFirstNumericMarkdownTable(text)) return true;
	if (/^#{1,6}\s/m.test(text)) return true;
	if (/^\s*[-*+]\s/m.test(text)) return true;
	if (/\n\|\s*[-:]+\s*\|/.test(text)) return true;
	if (/!\[[^\]]*]\([^\)]+\)/.test(text)) return true;
	return false;
}

function isSelfVisualEnvelope(text: string): boolean {
	const trimmed = text.trim();
	if (/^###\s*pi-visual\s+live\b/i.test(trimmed)) return true;
	if (/^#\s*pi-visualize\b/i.test(trimmed)) return true;
	if (/^####\s+Mermaid\s+\(terminal fallback\)/im.test(trimmed) && /^-\s+preview:\s+/im.test(trimmed)) return true;
	return false;
}

function captureLatest(source: VisualSource, raw: string, ctx: ExtensionContext): boolean {
	const text = clampCapture(raw);
	if (!text) return false;
	if (isSelfVisualEnvelope(text)) return false;
	const hash = createHash("sha256").update(text).digest("hex");
	if (hash === state.lastHash) return false;

	const mermaidBlocks = extractMermaidBlocks(text);
	if (!hasVisualSignal(text, mermaidBlocks)) return false;
	if (source === "tool" && state.latest) {
		const prevScore = visualScore(state.latest.text, state.latest.mermaidBlocks);
		const nextScore = visualScore(text, mermaidBlocks);
		if (nextScore < prevScore) return false;
	}

	state.latest = {
		id: randomUUID(),
		ts: Date.now(),
		hash,
		source,
		text,
		mermaidBlocks,
		markdownPngPath: undefined,
		chartPngPath: undefined,
		previewPngPath: undefined,
	};
	state.lastHash = hash;
	updateWidget(ctx);
	return true;
}

function maybeCapture(event: unknown, ctx: ExtensionContext): boolean {
	const e = event as MessageEndLike;
	const source = roleToSource(e.message?.role);
	if (!source) return false;
	const text = extractText(e.message?.content);
	if (!text.trim()) return false;
	return captureLatest(source, text, ctx);
}

async function resolveMmdcCommand(cwd: string): Promise<{ cmd: string; argsPrefix: string[] }> {
	const local = path.join(cwd, "node_modules", ".bin", "mmdc");
	try {
		await access(local);
		return { cmd: local, argsPrefix: [] };
	} catch {
		return { cmd: "npx", argsPrefix: ["-y", "@mermaid-js/mermaid-cli"] };
	}
}

function escapeXml(text: string): string {
	return text
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

async function writeAtomic(pathname: string, content: string): Promise<void> {
	const tmp = `${pathname}.tmp-${randomUUID()}`;
	await writeFile(tmp, content, { encoding: "utf8", mode: 0o600 });
	await rename(tmp, pathname);
}

function condensedLines(text: string): string[] {
	const lines = text
		.replace(/```mermaid[\s\S]*?```/gi, "[mermaid diagram]")
		.replace(/```[\s\S]*?```/g, "[code block]")
		.split("\n")
		.map((line) => line.trim())
		.filter(Boolean)
		.slice(0, 64)
		.map((line) => (line.length > 150 ? `${line.slice(0, 149)}…` : line));
	return lines.length > 0 ? lines : ["(empty)"];
}

function parseFirstNumericMarkdownTable(text: string): NumericChart | undefined {
	const lines = text.split("\n");
	for (let i = 0; i + 2 < lines.length; i += 1) {
		const header = lines[i]?.trim();
		const divider = lines[i + 1]?.trim();
		if (!header || !divider || !header.includes("|") || !/^\|?\s*:?-{3,}/.test(divider)) continue;

		const headers = header
			.replace(/^\||\|$/g, "")
			.split("|")
			.map((c) => c.trim())
			.filter(Boolean);
		if (headers.length < 2) continue;

		const rows: string[][] = [];
		for (let j = i + 2; j < lines.length; j += 1) {
			const row = lines[j]?.trim();
			if (!row || !row.includes("|")) break;
			const cols = row
				.replace(/^\||\|$/g, "")
				.split("|")
				.map((c) => c.trim());
			if (cols.length < 2) break;
			rows.push(cols);
			if (rows.length >= 10) break;
		}
		if (rows.length < 2) continue;

		let valueCol = -1;
		for (let c = 1; c < headers.length; c += 1) {
			if (rows.every((r) => Number.isFinite(Number(r[c])))) {
				valueCol = c;
				break;
			}
		}
		if (valueCol < 0) continue;

		const labels = rows.map((r) => r[0]).filter(Boolean);
		const values = rows.map((r) => Number(r[valueCol])).filter((v) => Number.isFinite(v));
		if (labels.length === values.length && values.length >= 2) {
			return { title: `${headers[0]} vs ${headers[valueCol]}`, labels, values };
		}
	}
	return undefined;
}

function renderChartSvg(chart: NumericChart, width: number, yStart: number): { svg: string; height: number } {
	const height = 240;
	const pad = 20;
	const gap = 8;
	const areaW = width - pad * 2;
	const barW = Math.max(12, Math.floor((areaW - gap * (chart.values.length - 1)) / chart.values.length));
	const max = Math.max(...chart.values, 1);

	let out = `<text x="${pad}" y="${yStart + 18}" fill="#94a3b8" font-size="13" font-family="ui-monospace,SFMono-Regular,Menlo,monospace">chart · ${escapeXml(chart.title)}</text>`;
	for (let i = 0; i < chart.values.length; i += 1) {
		const x = pad + i * (barW + gap);
		const h = Math.round((chart.values[i] / max) * 150);
		const y = yStart + 190 - h;
		out += `<rect x="${x}" y="${y}" width="${barW}" height="${h}" rx="4" fill="#60a5fa"/>`;
		out += `<text x="${x + barW / 2}" y="${yStart + 210}" fill="#cbd5e1" font-size="11" text-anchor="middle" font-family="ui-monospace,SFMono-Regular,Menlo,monospace">${escapeXml(chart.labels[i].slice(0, 12))}</text>`;
		out += `<text x="${x + barW / 2}" y="${Math.max(yStart + 22, y - 6)}" fill="#93c5fd" font-size="10" text-anchor="middle" font-family="ui-monospace,SFMono-Regular,Menlo,monospace">${chart.values[i]}</text>`;
	}
	return { svg: out, height };
}

function renderChartAscii(chart: NumericChart): string {
	const max = Math.max(...chart.values, 1);
	const barMax = 36;
	const labelWidth = Math.min(18, Math.max(...chart.labels.map((l) => l.length), 4));
	const rows = chart.values.map((value, idx) => {
		const label = chart.labels[idx]?.slice(0, labelWidth).padEnd(labelWidth, " ") ?? "".padEnd(labelWidth, " ");
		const barLen = Math.max(1, Math.round((value / max) * barMax));
		return `${label} | ${"#".repeat(barLen)} ${value}`;
	});
	return [`chart: ${chart.title}`, ...rows].join("\n");
}

function extractMermaidNodes(mermaidSource: string): Map<string, string> {
	const nodes = new Map<string, string>();
	const patterns = [
		/\b([A-Za-z][A-Za-z0-9_]*)\s*\[([^\]]+)\]/g,
		/\b([A-Za-z][A-Za-z0-9_]*)\s*\(\s*"([^"]+)"\s*\)/g,
		/\b([A-Za-z][A-Za-z0-9_]*)\s*\(\s*([^\)"\n][^\)]*?)\s*\)/g,
	];
	for (const re of patterns) {
		let match: RegExpExecArray | null;
		while ((match = re.exec(mermaidSource)) !== null) {
			const id = match[1]?.trim();
			const label = match[2]?.replaceAll('"', "").trim();
			if (id && label && !nodes.has(id)) nodes.set(id, label);
		}
	}
	return nodes;
}

function renderMermaidAscii(mermaidSource: string): string {
	const nodes = extractMermaidNodes(mermaidSource);
	const edges: Array<{ from: string; to: string }> = [];
	const edgeRe = /\b([A-Za-z][A-Za-z0-9_]*)\b(?:\s*\[[^\]]*\]|\s*\([^\)]*\))?\s*--+>?\s*\|?[^\n|]*\|?\s*\b([A-Za-z][A-Za-z0-9_]*)\b/g;
	let match: RegExpExecArray | null;
	while ((match = edgeRe.exec(mermaidSource)) !== null && edges.length < 32) {
		edges.push({ from: match[1]!, to: match[2]! });
	}
	if (edges.length === 0) {
		return mermaidSource
			.split("\n")
			.map((l) => l.trim())
			.filter(Boolean)
			.slice(0, 16)
			.join("\n");
	}

	const labelOf = (id: string) => nodes.get(id) ?? id;
	const chain = [edges[0]!.from, edges[0]!.to];
	for (let i = 1; i < edges.length; i += 1) {
		const prev = chain[chain.length - 1];
		if (edges[i]!.from !== prev) break;
		chain.push(edges[i]!.to);
	}

	if (chain.length >= 3 && chain.length === edges.length + 1) {
		return chain.map((id) => `[${labelOf(id)}]`).join(" -> ");
	}

	return edges.map((e) => `[${labelOf(e.from)}] -> [${labelOf(e.to)}]`).join("\n");
}

function formatMermaidError(raw: string, mermaidSource: string): string {
	const lineMatch = raw.match(/Lexical error on line\s+(\d+)/i) ?? raw.match(/Parse error on line\s+(\d+)/i);
	const line = lineMatch ? Number(lineMatch[1]) : undefined;
	const near = line && Number.isFinite(line) ? mermaidSource.split("\n")[line - 1]?.trim() : undefined;
	const quoteHint = `Wrap labels containing special chars in quotes, e.g. A["/pi-visualize"] or A["latest-mermaid.png"].`;

	if (/Lexical error|Unrecognized text|Parse error/i.test(raw)) {
		return `Mermaid parse error${line ? ` (line ${line})` : ""}.${near ? ` Near: ${near}` : ""} ${quoteHint}`.trim();
	}

	const first = raw
		.split("\n")
		.map((s) => s.trim())
		.find(Boolean);
	return first ? `Mermaid render failed: ${first}` : "Mermaid render failed.";
}

async function renderMermaid(pi: ExtensionAPI, ctx: ExtensionCommandContext): Promise<void> {
	if (!state.latest || state.latest.mermaidBlocks.length === 0) return;

	const cacheDir = path.join(ctx.cwd, ".pi", "visual-cache");
	await mkdir(cacheDir, { recursive: true });
	const input = path.join(cacheDir, "latest.mmd");
	const output = path.join(cacheDir, "latest-mermaid.svg");
	const pngOutput = path.join(cacheDir, "latest-mermaid.png");
	await writeFile(input, state.latest.mermaidBlocks[state.latest.mermaidBlocks.length - 1]!, "utf8");

	const { cmd, argsPrefix } = await resolveMmdcCommand(ctx.cwd);
	const result = await pi.exec(cmd, [...argsPrefix, "-i", input, "-o", output], { timeout: 90_000 });
	if (result.code !== 0) {
		const rawError = (result.stderr || result.stdout || "Mermaid CLI failed").trim();
		state.latest.renderError = formatMermaidError(rawError, state.latest.mermaidBlocks[state.latest.mermaidBlocks.length - 1] ?? "");
		state.latest.renderedMermaidPath = undefined;
		state.latest.renderedMermaidPngPath = undefined;
		return;
	}

	state.latest.renderedMermaidPath = output;
	state.latest.renderError = undefined;

	const pngResult = await pi.exec(cmd, [...argsPrefix, "-i", input, "-o", pngOutput], { timeout: 90_000 });
	if (pngResult.code === 0) {
		state.latest.renderedMermaidPngPath = pngOutput;
	} else {
		state.latest.renderedMermaidPngPath = undefined;
	}
	state.latest.previewPngPath = pickPrimaryPreview(state.latest);
}

async function convertSvgToPng(pi: ExtensionAPI, ctx: ExtensionCommandContext, svgPath: string, pngPath: string): Promise<string | undefined> {
	const cacheDir = path.join(ctx.cwd, ".pi", "visual-cache");
	const svgBase = path.basename(svgPath);
	const attempts: Array<{ cmd: string; args: string[]; outputs: string[] }> = [
		{ cmd: "rsvg-convert", args: ["-o", pngPath, svgPath], outputs: [pngPath] },
		{ cmd: "magick", args: [svgPath, pngPath], outputs: [pngPath] },
		{ cmd: "qlmanage", args: ["-t", "-s", "1200", "-o", cacheDir, svgPath], outputs: [path.join(cacheDir, `${svgBase}.png`)] },
	];

	for (const attempt of attempts) {
		const result = await pi.exec(attempt.cmd, attempt.args, { timeout: 30_000 });
		if (result.code !== 0) continue;
		for (const candidate of attempt.outputs) {
			try {
				await access(candidate);
				if (candidate !== pngPath) {
					await rename(candidate, pngPath);
				}
				return pngPath;
			} catch {
				// try next output candidate
			}
		}
	}

	return undefined;
}

function pickPrimaryPreview(latest: VisualSnapshot | undefined): string | undefined {
	if (!latest) return undefined;
	return latest.renderedMermaidPngPath ?? latest.chartPngPath ?? latest.markdownPngPath;
}

function mimeTypeFromPath(filePath: string): string | undefined {
	const ext = path.extname(filePath).toLowerCase();
	if (ext === ".png") return "image/png";
	if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
	if (ext === ".webp") return "image/webp";
	if (ext === ".gif") return "image/gif";
	if (ext === ".svg") return "image/svg+xml";
	return undefined;
}

async function pathToImageBlock(filePath: string): Promise<CustomImageBlock | undefined> {
	const mimeType = mimeTypeFromPath(filePath);
	if (!mimeType) return undefined;
	try {
		const data = (await readFile(filePath)).toString("base64");
		return { type: "image", data, mimeType };
	} catch {
		return undefined;
	}
}

async function renderInlineAssets(pi: ExtensionAPI, ctx: ExtensionCommandContext): Promise<void> {
	if (!state.latest) return;

	const cacheDir = path.join(ctx.cwd, ".pi", "visual-cache");
	await mkdir(cacheDir, { recursive: true });

	const width = 1200;
	const headerH = 54;
	const lineH = 22;
	const lines = condensedLines(state.latest.text);
	const textH = Math.max(200, lines.length * lineH + 24);
	const textY = headerH + 24;
	const textRows = lines
		.map((line, idx) => `<text x="20" y="${textY + idx * lineH}" fill="#d1d5db" font-size="14" font-family="ui-monospace,SFMono-Regular,Menlo,monospace">${escapeXml(line)}</text>`)
		.join("");
	const markdownHeight = textY + textH + 24;
	const markdownSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${markdownHeight}" viewBox="0 0 ${width} ${markdownHeight}"><rect x="0" y="0" width="${width}" height="${markdownHeight}" fill="#0b1020"/><rect x="0" y="0" width="${width}" height="${headerH}" fill="#111827"/><text x="20" y="34" fill="#e5e7eb" font-size="18" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif">pi-visual · markdown</text>${textRows}</svg>`;
	const markdownSvgPath = path.join(cacheDir, "latest-markdown.svg");
	const markdownPngPath = path.join(cacheDir, "latest-markdown.png");
	await writeAtomic(markdownSvgPath, markdownSvg);
	state.latest.markdownPngPath = await convertSvgToPng(pi, ctx, markdownSvgPath, markdownPngPath);

	const chart = parseFirstNumericMarkdownTable(state.latest.text);
	if (!chart) {
		state.latest.chartPngPath = undefined;
		state.latest.previewPngPath = pickPrimaryPreview(state.latest);
		return;
	}

	const chartHeight = 320;
	const chartInner = renderChartSvg(chart, width, 64).svg;
	const chartSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${chartHeight}" viewBox="0 0 ${width} ${chartHeight}"><rect x="0" y="0" width="${width}" height="${chartHeight}" fill="#0b1020"/><rect x="0" y="0" width="${width}" height="54" fill="#111827"/><text x="20" y="34" fill="#e5e7eb" font-size="18" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif">pi-visual · chart</text>${chartInner}</svg>`;
	const chartSvgPath = path.join(cacheDir, "latest-chart.svg");
	const chartPngPath = path.join(cacheDir, "latest-chart.png");
	await writeAtomic(chartSvgPath, chartSvg);
	state.latest.chartPngPath = await convertSvgToPng(pi, ctx, chartSvgPath, chartPngPath);
	state.latest.previewPngPath = pickPrimaryPreview(state.latest);
}

async function exportLatestMetadata(ctx: ExtensionCommandContext): Promise<{ jsonPath: string }> {
	if (!state.latest) throw new Error("No captured output yet.");
	const cacheDir = path.join(ctx.cwd, ".pi", "visual-cache");
	await mkdir(cacheDir, { recursive: true });

	const chart = parseFirstNumericMarkdownTable(state.latest.text);
	const jsonPath = path.join(cacheDir, "latest.json");
	await writeAtomic(
		jsonPath,
		JSON.stringify(
			{
				version: 4,
				ts: state.latest.ts,
				hash: state.latest.hash,
				source: state.latest.source,
				hasMermaid: Boolean(state.latest.renderedMermaidPath),
				hasMermaidPreview: Boolean(state.latest.renderedMermaidPngPath),
				hasMarkdownPreview: Boolean(state.latest.markdownPngPath),
				hasChartPreview: Boolean(state.latest.chartPngPath),
				hasPreviewPng: Boolean(state.latest.previewPngPath),
				previewPngPath: state.latest.previewPngPath,
				markdownPngPath: state.latest.markdownPngPath,
				chartPngPath: state.latest.chartPngPath,
				mermaidPngPath: state.latest.renderedMermaidPngPath,
				renderError: state.latest.renderError,
				hasChart: Boolean(chart),
			},
			null,
			2,
		),
	);
	return { jsonPath };
}

function buildInlineVisualMessage(latest: VisualSnapshot): string {
	const chart = parseFirstNumericMarkdownTable(latest.text);
	const mermaidSource = latest.mermaidBlocks[latest.mermaidBlocks.length - 1];
	const lines = [
		"### pi-visual live",
		"",
		latest.renderError ? `- mermaid: failed (${latest.renderError})` : `- mermaid: ${latest.renderedMermaidPath ? "rendered" : "not found"}`,
		`- chart: ${chart ? "detected" : "none"}`,
		latest.previewPngPath ? `- preview: \`${latest.previewPngPath}\`` : "- preview: _(none)_",
		"",
		"#### Mermaid (terminal fallback)",
		"",
		mermaidSource ? `\`\`\`text\n${renderMermaidAscii(mermaidSource)}\n\`\`\`` : "_(no mermaid block found)_",
	];
	if (chart) {
		lines.push("", "#### Chart (ASCII)", "", `\`\`\`text\n${renderChartAscii(chart)}\n\`\`\``);
	}
	return lines.join("\n");
}

async function buildInlineVisualContent(latest: VisualSnapshot): Promise<CustomMessageContent> {
	const blocks: Array<CustomTextBlock | CustomImageBlock> = [{ type: "text", text: buildInlineVisualMessage(latest) }];
	const candidates = [latest.previewPngPath, latest.renderedMermaidPngPath, latest.chartPngPath, latest.markdownPngPath].filter(
		(v): v is string => Boolean(v),
	);
	const seen = new Set<string>();
	for (const candidate of candidates) {
		if (seen.has(candidate)) continue;
		seen.add(candidate);
		const image = await pathToImageBlock(candidate);
		if (!image) continue;
		blocks.push({ type: "text", text: `\nPreview: \`${candidate}\`` });
		blocks.push(image);
	}
	return blocks;
}

async function publishInlineVisualMessage(pi: ExtensionAPI): Promise<void> {
	if (!state.latest) return;
	const inlineHash = createHash("sha256")
		.update(state.latest.hash)
		.update(state.latest.renderedMermaidPngPath ?? "")
		.update(state.latest.chartPngPath ?? "")
		.update(state.latest.markdownPngPath ?? "")
		.update(state.latest.renderError ?? "")
		.digest("hex");
	if (inlineHash === state.lastInlineHash) return;
	state.lastInlineHash = inlineHash;
	const content = await buildInlineVisualContent(state.latest);
	pi.sendMessage({
		customType: "pi-visual-live",
		content,
		display: true,
		details: {
			hash: state.latest.hash,
			ts: state.latest.ts,
			source: state.latest.source,
		},
	});
}

async function openInspector(ctx: ExtensionCommandContext): Promise<void> {
	if (!ctx.hasUI) return;
	const mdTheme = getMarkdownTheme();
	const latest = state.latest;
	const asciiChart = latest ? parseFirstNumericMarkdownTable(latest.text) : undefined;
	const asciiMermaid = latest?.mermaidBlocks?.[latest.mermaidBlocks.length - 1];
	const asciiMermaidRendered = asciiMermaid ? renderMermaidAscii(asciiMermaid) : undefined;
	const previewPaths = [latest?.previewPngPath, latest?.markdownPngPath, latest?.chartPngPath, latest?.renderedMermaidPngPath].filter(
		(v): v is string => Boolean(v),
	);

	const body = latest
		? [
				"# pi-visualize",
				"",
				`- source: **${latest.source}**`,
				`- live visualize: **${state.visualizeActive ? "on" : "off"}**`,
				`- mermaid blocks: **${latest.mermaidBlocks.length}**`,
				latest.renderedMermaidPath ? `- rendered mermaid: \`${latest.renderedMermaidPath}\`` : "- rendered mermaid: _(none)_",
				latest.renderError ? `- render error: ${latest.renderError}` : "",
				"- exported metadata: `.pi/visual-cache/latest.json`",
				"",
				"## ASCII fallback (always available)",
				"",
				asciiChart ? "```text\n" + renderChartAscii(asciiChart) + "\n```" : "_(no numeric chart table found)_",
				"",
				asciiMermaidRendered ? "```text\n" + asciiMermaidRendered + "\n```" : "_(no mermaid block found)_",
				"",
				"## PNG previews",
				"",
				previewPaths.length > 0 ? previewPaths.map((p) => `- \`${p}\``).join("\n") : "_(none available in this terminal/client)_",
				"",
				"## Latest output",
				"",
				latest.text,
			]
				.filter(Boolean)
				.join("\n")
		: "# pi-visualize\n\nNo output captured yet.";

	await ctx.ui.custom(
		(tui, theme, _kb, done) => {
			const markdown = new Markdown(body, 1, 0, mdTheme);
			let scroll = 0;
			let lastMaxScroll = 0;
			const clamp = () => {
				if (scroll < 0) scroll = 0;
				if (scroll > lastMaxScroll) scroll = lastMaxScroll;
			};

			return {
				render: (width: number) => {
					const rows = Math.max(10, tui.terminal.rows - 6);
					const lines = markdown.render(Math.max(20, width - 2));
					lastMaxScroll = Math.max(0, lines.length - rows);
					clamp();
					const visible = lines.slice(scroll, scroll + rows);
					const info = `scroll ${Math.min(scroll + 1, Math.max(1, lines.length))}-${Math.min(scroll + rows, lines.length)}/${lines.length}`;
					return [
						theme.fg("accent", theme.bold("pi-visualize · ↑/↓ PgUp/PgDn Home/End · Enter/Esc close")),
						...visible,
						theme.fg("dim", info),
					];
				},
				invalidate: () => markdown.invalidate(),
				handleInput: (data: string) => {
					const page = Math.max(5, Math.floor((tui.terminal.rows - 6) * 0.8));
					if (matchesKey(data, "enter") || matchesKey(data, "escape")) {
						done(undefined);
						return;
					}
					if (matchesKey(data, "up") || data === "k") scroll -= 1;
					else if (matchesKey(data, "down") || data === "j") scroll += 1;
					else if (matchesKey(data, "pageup")) scroll -= page;
					else if (matchesKey(data, "pagedown") || data === " ") scroll += page;
					else if (matchesKey(data, "home")) scroll = 0;
					else if (matchesKey(data, "end")) scroll = Number.MAX_SAFE_INTEGER;
					clamp();
					tui.requestRender();
				},
			};
		},
		{ overlay: true, overlayOptions: { width: "86%", maxHeight: "92%", anchor: "center" } },
	);
}

async function rerenderAndVisualizeInline(
	pi: ExtensionAPI,
	ctx: ExtensionCommandContext,
	notify: boolean,
): Promise<void> {
	if (!state.latest) {
		if (notify) ctx.ui.notify("No output captured yet", "info");
		return;
	}
	await renderMermaid(pi, ctx);
	await renderInlineAssets(pi, ctx);
	const { jsonPath } = await exportLatestMetadata(ctx);
	updateWidget(ctx);
	if (state.visualizeActive) await publishInlineVisualMessage(pi);
	if (notify) {
		const previewHint = state.latest.previewPngPath ? ` + preview ${path.basename(state.latest.previewPngPath)}` : "";
		ctx.ui.notify(
			state.latest.renderError ? `Mermaid render failed, updated ${jsonPath}${previewHint}` : `Updated: ${jsonPath}${previewHint}`,
			state.latest.renderError ? "warning" : "info",
		);
	}
}

async function runVisualize(pi: ExtensionAPI, ctx: ExtensionCommandContext): Promise<void> {
	state.visualizeActive = !state.visualizeActive;
	updateWidget(ctx);
	if (!state.visualizeActive) {
		ctx.ui.notify("Live visualization off", "info");
		return;
	}
	if (!state.latest) {
		ctx.ui.notify("Live visualization on (waiting for visual output)", "info");
		return;
	}
	await rerenderAndVisualizeInline(pi, ctx, true);
}

function registerCommandSafe(
	pi: ExtensionAPI,
	name: string,
	spec: { description: string; handler: (args: string, ctx: ExtensionCommandContext) => Promise<void> },
): boolean {
	try {
		pi.registerCommand(name, spec);
		return true;
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		if (/already|exists|conflict|duplicate/i.test(message)) return false;
		throw error;
	}
}

export default function (pi: ExtensionAPI) {
	pi.registerMessageRenderer("pi-visual-live", (message, { expanded }, theme) => {
		const mdTheme = getMarkdownTheme();
		const content = message.content as CustomMessageContent | undefined;
		if (typeof content === "string") return new Markdown(content, 1, 0, mdTheme);
		if (!Array.isArray(content)) return new Markdown(String(content ?? ""), 1, 0, mdTheme);

		const container = new Container();
		const maxImages = expanded ? 4 : 1;
		let renderedImages = 0;
		let hasAny = false;

		for (const block of content) {
			if (!block || typeof block !== "object") continue;
			if (block.type === "text" && typeof block.text === "string" && block.text.trim()) {
				container.addChild(new Markdown(block.text, 1, 0, mdTheme));
				hasAny = true;
				continue;
			}
			if (block.type === "image" && typeof block.data === "string" && typeof block.mimeType === "string") {
				if (renderedImages >= maxImages) continue;
				if (hasAny) container.addChild(new Spacer(1));
				container.addChild(
					new Image(block.data, block.mimeType, theme, {
						maxWidthCells: expanded ? 120 : 92,
						maxHeightCells: expanded ? 36 : 22,
					}),
				);
				hasAny = true;
				renderedImages += 1;
			}
		}

		if (renderedImages < content.filter((b) => b?.type === "image").length) {
			container.addChild(new Spacer(1));
			container.addChild(
				new Markdown(`_(expand message to show all previews · showing ${renderedImages})_`, 1, 0, mdTheme),
			);
			hasAny = true;
		}

		if (!hasAny) return new Markdown("_(no visual content)_", 1, 0, mdTheme);
		return container;
	});

	const primary = registerCommandSafe(pi, state.commands.visualize, {
		description: "Toggle live visualization for markdown/mermaid/chart output",
		handler: async (_args, ctx) => runVisualize(pi, ctx),
	});
	if (!primary) return;

	registerCommandSafe(pi, state.commands.alias, {
		description: "Alias for /pi-visualize toggle",
		handler: async (_args, ctx) => runVisualize(pi, ctx),
	});

	registerCommandSafe(pi, state.commands.clear, {
		description: "Clear latest snapshot",
		handler: async (_args, ctx) => {
			state.latest = undefined;
			state.lastHash = undefined;
			state.lastInlineHash = undefined;
			state.visualizeActive = false;
			clearWidget(ctx);
			updateWidget(ctx);
			ctx.ui.notify("Cleared latest snapshot (live visualize off)", "info");
		},
	});

	registerCommandSafe(pi, state.commands.widget, {
		description: "Toggle visual widget",
		handler: async (_args, ctx) => {
			state.widgetEnabled = !state.widgetEnabled;
			if (!state.widgetEnabled) {
				clearWidget(ctx);
				ctx.ui.notify("Widget off", "info");
				return;
			}
			updateWidget(ctx);
			ctx.ui.notify("Widget on", "info");
		},
	});

	pi.on("session_start", (_e, ctx) => {
		lastCtx = ctx;
		updateWidget(ctx);
	});
	pi.on("session_switch", (_e, ctx) => {
		lastCtx = ctx;
		updateWidget(ctx);
	});
	pi.on("message_end", (event, ctx) => {
		lastCtx = ctx;
		if (!maybeCapture(event, ctx)) return;
		if (!state.visualizeActive) return;
		liveRenderQueue = liveRenderQueue
			.catch(() => undefined)
			.then(async () => {
				await rerenderAndVisualizeInline(pi, ctx, false);
			})
			.catch(() => undefined);
	});
	pi.on("session_shutdown", () => {
		if (!lastCtx) return;
		clearWidget(lastCtx);
		if (lastCtx.hasUI) lastCtx.ui.setStatus("pi-visual", undefined);
	});
}
