---
name: data-vocab-step-1-ocr-pdf-to-raw-content
description: Use this skill when the user wants to turn textbook page images or a textbook PDF into a structured `raw-content.md` for a Unit. Trigger when the user references page images or a PDF file plus page numbers and wants the vision-extracted markdown saved under a Unit folder (typically `.../unit-N/vocab/raw-content.md`), or when the user is following the lesson-data pipeline and is on "vocab step 1 OCR raw content".
---

# Image / PDF to Raw-Content Markdown

## Role

You are an experienced English teacher reading textbook pages. The markdown you produce must preserve the lesson exactly as printed — no invented sections, no summarized phrasing, and no skipped exercises.

## What this skill does

Given textbook page images (or a textbook PDF and page numbers), inspect and extract text from the pages directly using the agent's built-in tool (`view_file` with multimodal vision), and write a structured `raw-content.md` that faithfully mirrors the printed lesson (headings, exercises, tables, dialogs, vocabulary boxes, grammar callouts, captions).

**NO Python scripts are used** — text extraction and page inspection are performed directly by the agent using `view_file` and its multimodal vision capabilities.

## When to use this skill

- The user provides textbook page images (or a PDF path and page numbers) and asks for `raw-content.md`.
- The user is following the lesson-data pipeline and is on "vocab step 1 OCR raw content".
- A Unit folder is empty and needs its source markdown produced from textbook page scans/images.

This skill does not cover vocabulary extraction, exercise generation, or later pipeline steps — each has its own skill.

## Non-negotiable rules

1. **USE AGENT'S BUILT-IN TOOL (`view_file`) ONLY**:
   - The agent MUST use `view_file` to view each image (or PDF) directly. The agent reads and transcribes text using its own multimodal vision capability.
   - **STRICTLY PROHIBITED**: DO NOT write or run Python scripts (e.g. `python`, `python3`, `pytesseract`, `easyocr`, `cv2`, `pdf2images.py`, or any custom script). There must be ZERO Python script execution.
2. **Faithful preservation**:
   - Extract every visible text element on the requested pages: section headings, instructions, numbered exercises, answer choices (A, B, C, D), fill-in-the-blanks (`___`), tables, dialogs, vocabulary boxes, grammar/remember boxes, examples, and captions.
   - Later pipeline steps rely on complete, verbatim markdown.
   - Do not invent, paraphrase, or hallucinate content. If any text is smudged or ambiguous, record it as seen or add a brief inline flag `[unclear: ...]`.
3. **Exact output format**:
   - Output must be a single Markdown file named exactly `raw-content.md` saved in the **Save Location**. No `.txt`, no other filenames.

## Initial information needed

Ask the user for two things before starting and wait until provided:

1. **Input Images / PDF** (`hình ảnh hoặc file pdf đầu vào`):
   - Path to the textbook page images (e.g., a folder of images or specific image files: `.png`, `.jpg`, `.jpeg`, `.webp`), OR
   - Path to the PDF file and the specific page numbers to process (e.g. pages 6 to 15).
2. **Save Location** (`vị trí lưu file`):
   - The directory where `raw-content.md` should be written (e.g. `.../unit-7/vocab`).

Do not guess these paths or page numbers.

## Workflow

### Step 1 — Inspect the input pages using `view_file`

- **If the input is page images** (e.g., `page_1.png`, `unit7_p1.jpg` or a directory of images):
  1. Identify all image files belonging to the unit/lesson.
  2. Order the images sequentially by page number.
  3. Call `view_file` on each image file one by one.
- **If the input is a PDF**:
  1. Call `view_file` on the PDF file directly.
  2. Inspect the requested page range directly from the page screenshots rendered in your multimodal context.

*Remember: Do NOT execute any Python scripts or command-line OCR tools. The agent reads the visuals directly via `view_file`.*

### Step 2 — Transcribe and structure the content into clean Markdown

As you inspect each page image, transcribe the content verbatim and structure it systematically:
- **Headings**: Unit titles and main sections become `#`, `##`, `###` headings (e.g. `# Unit 7: TELEVISION`, `## GETTING STARTED`).
- **Exercises**: Keep original numbers, instructions, options (A, B, C, D), and blanks (`___`).
- **Dialogues & Conversations**: Preserve speaker labels accurately (e.g., `Phong: ...`, `Hung: ...`).
- **Tables & Grids**: Convert printed tables and matching columns into clean Markdown tables (`| ... | ... |`).
- **Vocabulary Boxes & Prompts**: Keep word boxes verbatim in bulleted lists or blockquotes.
- **Grammar & "Remember!" Boxes**: Format with Markdown blockquotes (`> **Remember!** ...`).
- **Captions & Audio Labels**: Include audio track indicators (e.g. `[Track 15]`) and image captions where present.
- **Page Transitions**: Separate pages with clear markdown comments (e.g. `<!-- Page 7 -->`) or assemble all pages in order into one continuous, cohesive document.

### Step 3 — Save `raw-content.md`

Use `write_to_file` to write the complete assembled content into `<Save Location>/raw-content.md`.

### Step 4 — Confirm with the user

Confirm to the user that `raw-content.md` has been successfully created at the Save Location, summarize the pages/sections processed, and invite them to review the content before proceeding to Step 2 (`data-vocab-step-2-raw-vocabulary`).
