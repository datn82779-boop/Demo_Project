$ErrorActionPreference = "Stop"
$vocabJson = Get-Content "c:\Users\DELL\OneDrive\Desktop\Demo_Project\data\gs6\unit-7\vocab\vocab.json" -Raw -Encoding UTF8 | ConvertFrom-Json
$exampleSentences = @()
foreach ($g in $vocabJson) {
    foreach ($w in $g.words) {
        $exampleSentences += [PSCustomObject]@{
            Word = $w.english_word
            En = $w.example_sentence_en
            Vi = $w.example_sentence_vi
        }
    }
}

$dir = "c:\Users\DELL\OneDrive\Desktop\Demo_Project\data\gs6\unit-7\vocab\exercises"
$files = Get-ChildItem -Path $dir -Filter "*.json" | Sort-Object Name

Write-Output "=== CHECKING SIMILARITY WITH VOCAB.JSON EXAMPLE SENTENCES ==="
foreach ($f in $files) {
    $raw = Get-Content $f.FullName -Raw -Encoding UTF8
    foreach ($ex in $exampleSentences) {
        # Check if 4+ consecutive words match
        $words = ($ex.En -replace '[^\w\s]', '').Trim() -split '\s+'
        for ($i=0; $i -le $words.Count - 4; $i++) {
            $sub = ($words[$i..($i+3)]) -join ' '
            if ($raw -match [regex]::Escape($sub)) {
                Write-Output "[$($f.Name)] Match with vocab.json '$($ex.Word)' pattern '$sub'"
            }
        }
    }
}
