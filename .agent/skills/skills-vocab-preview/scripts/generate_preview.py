#!/usr/bin/env python3
"""
generate_preview.py
Generates an interactive, standalone HTML preview for a Unit vocab folder.
Usage:
    python generate_preview.py <path_to_vocab_folder> [output_file_path]
Example:
    python generate_preview.py "data/gs6/unit-7/vocab"
"""

import sys
import os
import glob
import json
import re
from datetime import datetime

def main():
    if len(sys.argv) < 2:
        print("Usage: python generate_preview.py <path_to_vocab_folder> [output_file_path]")
        sys.exit(1)

    vocab_dir = os.path.abspath(sys.argv[1])
    if not os.path.isdir(vocab_dir):
        print(f"Error: Directory not found: {vocab_dir}", file=sys.stderr)
        sys.exit(1)

    output_path = (
        os.path.abspath(sys.argv[2])
        if len(sys.argv) > 2
        else os.path.join(vocab_dir, "preview.html")
    )

    script_dir = os.path.dirname(os.path.abspath(__file__))
    template_path = os.path.join(script_dir, "template.html")
    if not os.path.isfile(template_path):
        print(f"Error: template.html not found at {template_path}", file=sys.stderr)
        sys.exit(1)

    print("========================================")
    print("  VOCAB PREVIEW GENERATOR (Python)")
    print("========================================")
    print(f"Vocab Directory: {vocab_dir}")
    print(f"Output File:     {output_path}")

    # 1. Read vocab.json
    vocab_json_path = os.path.join(vocab_dir, "vocab.json")
    vocab_raw = "[]"
    if os.path.isfile(vocab_json_path):
        print("[+] Reading vocab.json...")
        with open(vocab_json_path, "r", encoding="utf-8") as f:
            vocab_raw = f.read()
    else:
        print(f"[!] Warning: vocab.json not found in {vocab_dir}")

    # 2. Read all exercise JSON files in exercises/
    exercises_dir = os.path.join(vocab_dir, "exercises")
    exercise_contents = []
    if os.path.isdir(exercises_dir):
        print(f"[+] Scanning exercises in {exercises_dir}...")
        exercise_files = sorted(glob.glob(os.path.join(exercises_dir, "*.json")))
        for fpath in exercise_files:
            try:
                with open(fpath, "r", encoding="utf-8") as f:
                    content = f.read()
                    exercise_contents.append(content)
                    print(f"    - Loaded {os.path.basename(fpath)}")
            except Exception as e:
                print(f"[!] Failed to read {fpath}: {e}", file=sys.stderr)
    else:
        print(f"[!] Warning: exercises folder not found in {vocab_dir}")

    exercises_raw = "[" + ",".join(exercise_contents) + "]"

    # 3. Read image-prompts.json
    prompts_path = os.path.join(vocab_dir, "image-prompts.json")
    prompts_raw = "[]"
    if os.path.isfile(prompts_path):
        print("[+] Reading image-prompts.json...")
        with open(prompts_path, "r", encoding="utf-8") as f:
            prompts_raw = f.read()

    # 4. Infer metadata from directory path
    norm_path = vocab_dir.replace("\\", "/")
    parts = norm_path.split("/")
    unit_name = "Unit"
    grade_name = "Grade"

    for i, part in enumerate(parts):
        m = re.match(r"^(unit-\d+|unit\d+)$", part, re.IGNORECASE)
        if m:
            unit_name = m.group(1).upper()
            if i > 0:
                grade_name = parts[i - 1].upper()

    meta_obj = {
        "title": f"{grade_name} - {unit_name}",
        "grade": grade_name,
        "unit": unit_name,
        "subtitle": f"Review & Practice Suite for {grade_name} {unit_name}",
        "generatedAt": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    meta_raw = json.dumps(meta_obj, ensure_ascii=False)

    # 5. Read template and inject data
    print("[+] Reading HTML template...")
    with open(template_path, "r", encoding="utf-8") as f:
        template_content = f.read()

    output_content = template_content
    output_content = output_content.replace("/* __VOCAB_DATA__ */ []", vocab_raw)
    output_content = output_content.replace("/* __EXERCISES_DATA__ */ []", exercises_raw)
    output_content = output_content.replace("/* __IMAGE_PROMPTS_DATA__ */ []", prompts_raw)
    output_content = output_content.replace("/* __UNIT_INFO__ */ {}", meta_raw)

    # 6. Write output
    print(f"[+] Writing output file to {output_path}...")
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(output_content)

    print("========================================")
    print("SUCCESS! Generated preview at:")
    print(output_path)
    print("========================================")

if __name__ == "__main__":
    main()
