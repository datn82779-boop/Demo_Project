$ErrorActionPreference = "Stop"
$dir = "c:\Users\DELL\OneDrive\Desktop\Demo_Project\data\gs6\unit-7\vocab\exercises"
$files = Get-ChildItem -Path $dir -Filter "*.json" | Sort-Object Name

$report = @()

foreach ($f in $files) {
    $raw = Get-Content -LiteralPath $f.FullName -Raw -Encoding UTF8
    $json = $raw | ConvertFrom-Json
    $report += "========================================================"
    $report += "FILE: $($f.Name) | Title: $($json.title) | Type: $($json.type)"
    $report += "========================================================"
    
    if ($json.questions) {
        foreach ($q in $json.questions) {
            $qInfo = "ID: $($q.id)"
            if ($q.text) { $qInfo += " | Text: $($q.text)" }
            if ($q.question) { $qInfo += " | Stem: $($q.question)" }
            if ($q.sentences) { $qInfo += " | Sentences: " + ($q.sentences -join " // ") }
            if ($q.options) { $qInfo += " | Options: [" + ($q.options -join ", ") + "]" }
            if ($q.correct_answer) { $qInfo += " | Ans: $($q.correct_answer)" }
            if ($q.sign_text) { $qInfo += " | SignText: $($q.sign_text)" }
            if ($q.base_word) { $qInfo += " | Base: $($q.base_word)" }
            if ($q.vietnamese_prompt) { $qInfo += " | Prompt: $($q.vietnamese_prompt)" }
            if ($q.parts) { 
                $pts = $q.parts | ForEach-Object { "$($_.id). $($_.vietnamese_word) -> $($_.correct_answer)" }
                $qInfo += " | Parts: " + ($pts -join "; ")
            }
            $report += $qInfo
        }
    } elseif ($json.entries) {
        foreach ($e in $json.entries) {
            $report += "ENTRY: $($e.id). Word: $($e.word) ($($e.part_of_speech)) Pron: $($e.pronunciation)"
            $report += "  Def: $($e.definition)"
            $report += "  Bullets: " + ($e.bullet_points -join " // ")
            foreach ($q in $e.questions) {
                $report += "    Q$($q.id): $($q.text) -> $($q.correct_answer)"
            }
        }
    } elseif ($json.paragraph_parts) {
        $report += "PARAGRAPH FILL: word_box=[" + ($json.word_box -join ", ") + "]"
        $txt = ""
        foreach ($p in $json.paragraph_parts) {
            if ($p -is [string]) { $txt += $p }
            else { $txt += " [Blank $($p.id): $($p.correct_answer)] " }
        }
        $report += "  Content: $txt"
    }
}

$report | Out-File "c:\Users\DELL\OneDrive\Desktop\Demo_Project\scratch\all_exercises_dump.txt" -Encoding UTF8
Write-Output "Dump completed. Total lines: $($report.Count)"
