$ErrorActionPreference = "Stop"
$dir = "c:\Users\DELL\OneDrive\Desktop\Demo_Project\data\gs6\unit-7\vocab\exercises"

$files = Get-ChildItem -Path $dir -Filter "*.json" | Sort-Object Name

# Load raw vocabulary
$rawVocabFile = "c:\Users\DELL\OneDrive\Desktop\Demo_Project\data\gs6\unit-7\raw-vocabulary.md"
$rawVocabLines = Get-Content $rawVocabFile -Encoding UTF8 | Where-Object { $_ -match '^\d+\.\s+(.*)$' } | ForEach-Object {
    $matches[1].Trim().ToLower()
}
Write-Output "Loaded $($rawVocabLines.Count) target vocabulary items from raw-vocabulary.md."

# Check 1: File structure, IDs, counts
Write-Output "`n=== AUDIT DIMENSION 6: SCHEMA, FORMATTING & ID SEQUENCES ==="
$allQuestions = @()

foreach ($f in $files) {
    $json = Get-Content -LiteralPath $f.FullName -Raw -Encoding UTF8 | ConvertFrom-Json
    $qCount = 0
    $idErrors = @()
    
    # Identify items
    $items = @()
    if ($json.questions) { $items = $json.questions }
    elseif ($json.exercises) { $items = $json.exercises }
    elseif ($json.entries) { $items = $json.entries }
    elseif ($json.table) { $items = $json.table }
    
    $qCount = $items.Count
    
    # Check IDs
    for ($i = 0; $i -lt $items.Count; $i++) {
        $expectedId = [string]($i + 1)
        $actualId = [string]$items[$i].id
        if ($actualId -ne $expectedId) {
            $idErrors += "Item index $i has id '$actualId', expected '$expectedId'"
        }
    }
    
    Write-Output "[$($f.Name)] Type: $($json.type) | Count: $qCount | ID errors: $(if ($idErrors.Count -eq 0) {'None'} else {$idErrors -join '; '})"
}

# Check 2: Word box overlap between ex 6 and ex 7
Write-Output "`n=== WORD-BOX OVERLAP BETWEEN EX 6 & EX 7 ==="
$ex6 = Get-Content "$dir\06_fill_in_blanks.json" -Raw -Encoding UTF8 | ConvertFrom-Json
$ex7 = Get-Content "$dir\07_paragraph_fill.json" -Raw -Encoding UTF8 | ConvertFrom-Json

$ex6Words = if ($ex6.word_box) { $ex6.word_box | ForEach-Object { $_.ToLower().Trim() } } else { @() }
$ex7Words = if ($ex7.word_box) { $ex7.word_box | ForEach-Object { $_.ToLower().Trim() } } else { @() }

$overlap = $ex6Words | Where-Object { $ex7Words -contains $_ }
if ($overlap) {
    Write-Output "WARNING: Overlap found between ex 6 and ex 7 word boxes: $($overlap -join ', ')"
} else {
    Write-Output "PASS: No overlap between ex 6 and ex 7 word boxes."
}

# Check 3: MCQ Option distribution for files with options
Write-Output "`n=== MCQ OPTION BALANCING DETAIL ==="
$mcqFiles = @(
    "01_multiple_choice_direct.json",
    "02_multiple_choice_sentence.json",
    "03_multiple_choice_conversation.json",
    "08_sentence_ordering.json",
    "09_multiple_choice_closest.json",
    "10_multiple_choice_opposite.json",
    "12_signs_and_notices.json",
    "14_word_families_mcq.json"
)

foreach ($mf in $mcqFiles) {
    $fPath = Join-Path $dir $mf
    if (Test-Path $fPath) {
        $json = Get-Content $fPath -Raw -Encoding UTF8 | ConvertFrom-Json
        $qs = if ($json.questions) { $json.questions } else { $json.exercises }
        $dist = @{ 'A'=0; 'B'=0; 'C'=0; 'D'=0; 'Unknown'=0 }
        
        foreach ($q in $qs) {
            $ans = [string]$q.correct_answer
            # Check if answer is text matching one of options
            if ($q.options) {
                $idx = -1
                for ($k=0; $k -lt $q.options.Count; $k++) {
                    if ($q.options[$k] -eq $ans) {
                        $idx = $k
                        break
                    }
                }
                if ($idx -eq 0) { $dist['A']++ }
                elseif ($idx -eq 1) { $dist['B']++ }
                elseif ($idx -eq 2) { $dist['C']++ }
                elseif ($idx -eq 3) { $dist['D']++ }
                else {
                    if ($ans -in @('A','B','C','D')) { $dist[$ans]++ }
                    else { $dist['Unknown']++ }
                }
            } else {
                if ($ans -in @('A','B','C','D')) { $dist[$ans]++ }
                else { $dist['Unknown']++ }
            }
        }
        Write-Output "[$mf] Options count: $($qs.Count) -> A: $($dist['A']), B: $($dist['B']), C: $($dist['C']), D: $($dist['D']), Unknown: $($dist['Unknown'])"
    }
}

# Check 4: Past tense scan (Unit 8 taught, forbidden in Unit 7!)
Write-Output "`n=== AUDIT DIMENSION 2: TENSE CEILING (PAST TENSE SCAN) ==="
$pastTensePatterns = @(
    '\bwas\b', '\bwere\b', '\bdid\b', '\bdidn''t\b', '\bhad\b', '\bwent\b', '\bsaw\b', '\bcame\b',
    '\btook\b', '\bgave\b', '\bmade\b', '\bfound\b', '\btold\b', '\bbought\b', '\bwrote\b', '\bread\b',
    '\bwatched\b', '\bvisited\b', '\bliked\b', '\bplayed\b', '\bstarted\b', '\bdecided\b', '\bjoined\b',
    '\bwaited\b', '\blistened\b', '\bworked\b', '\bhelped\b', '\basked\b', '\bopened\b', '\bclosed\b'
)

foreach ($f in $files) {
    $raw = Get-Content -LiteralPath $f.FullName -Raw -Encoding UTF8
    $json = $raw | ConvertFrom-Json
    $qs = if ($json.questions) { $json.questions } elseif ($json.exercises) { $json.exercises } else { $null }
    
    if ($qs) {
        foreach ($q in $qs) {
            $txt = "$($q.text) $($q.sentence) $($q.dialogue) $($q.correct_answer) $($q.explanation)"
            foreach ($pt in $pastTensePatterns) {
                if ($txt -match $pt) {
                    Write-Output "[$($f.Name) Q$($q.id)] Matched '$($matches[0])': '$txt'"
                }
            }
        }
    }
}
