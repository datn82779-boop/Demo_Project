# post_process_and_audit.ps1
param(
    [string]$VocabPath = "c:\Users\DELL\OneDrive\Desktop\Demo_Project\data\gs6\unit-7\vocab\vocab.json",
    [string]$ExercisesDir = "c:\Users\DELL\OneDrive\Desktop\Demo_Project\data\gs6\unit-7\vocab\exercises"
)

$utf8NoBom = [System.Text.UTF8Encoding]::new($false)

Write-Host "========================================="
Write-Host " STEP 4.1: Reorder Vocab Exercise IDs & Filenames "
Write-Host "========================================="

function Get-VocabId($type, $title) {
    $t = if ($title) { $title.ToLower() } else { "" }
    switch ($type) {
        "multiple_choice" {
            if ($t.Contains("direct")) { return 1 }
            if ($t.Contains("sentence completion")) { return 2 }
            if ($t.Contains("conversation")) { return 3 }
            if ($t.Contains("closest")) { return 9 }
            if ($t.Contains("opposite")) { return 10 }
            return 1
        }
        "pic_to_word" { return 4 }
        "write_english_words" { return 5 }
        "fill_in_blanks" { return 6 }
        "paragraph_fill" { return 7 }
        "sentence_ordering_multiple_choice" { return 8 }
        "dictionary_entry" { return 11 }
        "signs_and_notices" { return 12 }
        "word_families_table" { return 13 }
        "word_families_mcq" { return 14 }
        "word_formation" { return 15 }
        "translate_sentences" { return 16 }
        default { return $null }
    }
}

$files = Get-ChildItem -Path $ExercisesDir -Filter "*.json"
foreach ($file in $files) {
    $raw = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    $obj = $raw | ConvertFrom-Json
    
    $type = $obj.type
    $title = $obj.title
    $newIdNum = Get-VocabId $type $title
    
    if ($newIdNum) {
        $newIdStr = "$newIdNum"
        $obj.id = $newIdStr
        
        $baseName = $file.Name -replace '^\d+_', ''
        $newName = "{0:D2}_{1}" -f [int]$newIdNum, $baseName
        
        $updatedJson = $obj | ConvertTo-Json -Depth 20
        [System.IO.File]::WriteAllText($file.FullName, $updatedJson, $utf8NoBom)
        
        if ($file.Name -ne $newName) {
            $destPath = Join-Path $ExercisesDir $newName
            if (Test-Path $destPath) {
                Remove-Item -Path $destPath -Force
            }
            Rename-Item -Path $file.FullName -NewName $newName
            Write-Host "Renamed $($file.Name) -> $newName (id: $newIdStr)"
        } else {
            Write-Host "Confirmed $($file.Name) (id: $newIdStr)"
        }
    }
}

Write-Host "`n========================================="
Write-Host " STEP 4.2: Balance MCQ Options "
Write-Host "========================================="

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

function Test-Balanced($counts, $total) {
    $minAllowed = [math]::Floor($total / 4.0)
    $maxAllowed = [math]::Ceiling($total / 4.0)
    for ($i = 0; $i -lt 4; $i++) {
        $c = if ($counts.ContainsKey($i)) { $counts[$i] } else { 0 }
        if ($c -lt $minAllowed -or $c -gt $maxAllowed) {
            return $false
        }
    }
    return $true
}

function Shuffle-Array($arr) {
    $list = [System.Collections.Generic.List[object]]::new($arr)
    $rand = [System.Random]::new()
    for ($i = $list.Count - 1; $i -gt 0; $i--) {
        $j = $rand.Next(0, $i + 1)
        $tmp = $list[$i]
        $list[$i] = $list[$j]
        $list[$j] = $tmp
    }
    return $list.ToArray()
}

foreach ($mcqName in $mcqFiles) {
    $mcqPath = Join-Path $ExercisesDir $mcqName
    if (-not (Test-Path $mcqPath)) {
        Write-Warning "File not found: $mcqPath"
        continue
    }
    
    $raw = [System.IO.File]::ReadAllText($mcqPath, [System.Text.Encoding]::UTF8)
    $data = $raw | ConvertFrom-Json
    
    if (-not $data.questions) { continue }
    
    $questions = $data.questions | Where-Object { $_.options -and $_.options.Count -eq 4 -and $_.correct_answer }
    $total = $questions.Count
    if ($total -eq 0) { continue }
    
    $attempts = 0
    $maxAttempts = 10000
    $balanced = $false
    
    while ($attempts -lt $maxAttempts) {
        $attempts++
        foreach ($q in $questions) {
            $q.options = Shuffle-Array $q.options
        }
        
        $counts = @{ 0 = 0; 1 = 0; 2 = 0; 3 = 0 }
        $valid = $true
        foreach ($q in $questions) {
            $idx = -1
            for ($k = 0; $k -lt 4; $k++) {
                if ($q.options[$k] -eq $q.correct_answer) {
                    $idx = $k
                    break
                }
            }
            if ($idx -eq -1) {
                Write-Error "correct_answer '$($q.correct_answer)' not found in options!"
                $valid = $false
                break
            }
            $counts[$idx]++
        }
        
        if ($valid -and (Test-Balanced $counts $total)) {
            $balanced = $true
            Write-Host "Balanced $mcqName in $attempts attempts. Distribution: A=$($counts[0]), B=$($counts[1]), C=$($counts[2]), D=$($counts[3])"
            break
        }
    }
    
    if (-not $balanced) {
        Write-Warning "Could not perfectly balance $mcqName after $maxAttempts attempts."
    }
    
    $updatedJson = $data | ConvertTo-Json -Depth 20
    [System.IO.File]::WriteAllText($mcqPath, $updatedJson, $utf8NoBom)
}

Write-Host "`n========================================="
Write-Host " STEP 4.3: Shuffle Word Box "
Write-Host "========================================="

$wordBoxFiles = @(
    "06_fill_in_blanks.json",
    "07_paragraph_fill.json"
)

foreach ($wbName in $wordBoxFiles) {
    $wbPath = Join-Path $ExercisesDir $wbName
    if (Test-Path $wbPath) {
        $raw = [System.IO.File]::ReadAllText($wbPath, [System.Text.Encoding]::UTF8)
        $data = $raw | ConvertFrom-Json
        if ($data.word_box) {
            $data.word_box = Shuffle-Array $data.word_box
            $updatedJson = $data | ConvertTo-Json -Depth 20
            [System.IO.File]::WriteAllText($wbPath, $updatedJson, $utf8NoBom)
            Write-Host "Shuffled word_box in $wbName -> $($data.word_box -join ', ')"
        }
    }
}

Write-Host "`n========================================="
Write-Host " STEP 4.4: Shuffle Dictionary Entry "
Write-Host "========================================="

$dictFile = Join-Path $ExercisesDir "11_dictionary_entry.json"
if (Test-Path $dictFile) {
    $raw = [System.IO.File]::ReadAllText($dictFile, [System.Text.Encoding]::UTF8)
    $data = $raw | ConvertFrom-Json
    if ($data.entries) {
        $qCounter = 1
        foreach ($entry in $data.entries) {
            if ($entry.bullet_points) {
                $entry.bullet_points = Shuffle-Array $entry.bullet_points
            }
            if ($entry.questions) {
                $entry.questions = Shuffle-Array $entry.questions
                foreach ($q in $entry.questions) {
                    $q.id = "$qCounter"
                    $qCounter++
                }
            }
        }
        $updatedJson = $data | ConvertTo-Json -Depth 20
        [System.IO.File]::WriteAllText($dictFile, $updatedJson, $utf8NoBom)
        Write-Host "Shuffled bullet_points and questions in 11_dictionary_entry.json (re-indexed 1..$($qCounter - 1))"
    }
}

Write-Host "`n========================================="
Write-Host " STEP 5: Vocabulary Coverage Checker "
Write-Host "========================================="

$vocabRaw = [System.IO.File]::ReadAllText($VocabPath, [System.Text.Encoding]::UTF8)
$vocabData = $vocabRaw | ConvertFrom-Json

$allVocabWords = @{}
$wordToGroup = @{}
foreach ($group in $vocabData) {
    $groupName = $group.group
    $allVocabWords[$groupName] = @()
    foreach ($w in $group.words) {
        $term = $w.english_word.Trim()
        $allVocabWords[$groupName] += $term
        $wordToGroup[$term] = $groupName
    }
}

$allExercisesText = [System.Text.StringBuilder]::new()
Get-ChildItem -Path $ExercisesDir -Filter "*.json" | ForEach-Object {
    $raw = [System.IO.File]::ReadAllText($_.FullName, [System.Text.Encoding]::UTF8)
    $matches = [regex]::Matches($raw, '"((?:\\.|[^"\\])*)"')
    foreach ($m in $matches) {
        [void]$allExercisesText.Append(" " + $m.Groups[1].Value + " ")
    }
}

$corpusText = $allExercisesText.ToString().ToLower()

function Get-WordVariations($term) {
    $vars = [System.Collections.Generic.HashSet[string]]::new()
    $w = $term.ToLower()
    
    # plurals
    if ($w.EndsWith("y") -and -not ($w -match "[aeiou]y$")) {
        [void]$vars.Add($w.Substring(0, $w.Length - 1) + "ies")
    } elseif ($w.EndsWith("s") -or $w.EndsWith("sh") -or $w.EndsWith("ch") -or $w.EndsWith("x")) {
        [void]$vars.Add($w + "es")
    } else {
        [void]$vars.Add($w + "s")
    }
    
    # verb inflections
    if ($w.EndsWith("e")) {
        [void]$vars.Add($w + "d")
        [void]$vars.Add($w.Substring(0, $w.Length - 1) + "ing")
    } else {
        [void]$vars.Add($w + "ed")
        [void]$vars.Add($w + "ing")
    }
    
    # adjective comparatives / superlatives
    if ($w.EndsWith("y")) {
        [void]$vars.Add($w.Substring(0, $w.Length - 1) + "ier")
        [void]$vars.Add($w.Substring(0, $w.Length - 1) + "iest")
    }
    
    return $vars
}

$usedWords = @{}
$unusedWords = @{}
$wordCounts = @{}

foreach ($groupName in $allVocabWords.Keys) {
    $usedWords[$groupName] = [System.Collections.Generic.List[string]]::new()
    $unusedWords[$groupName] = [System.Collections.Generic.List[string]]::new()
    
    foreach ($term in $allVocabWords[$groupName]) {
        $wLower = $term.ToLower()
        $pattern = "\b" + [regex]::Escape($wLower) + "\b"
        $matches = [regex]::Matches($corpusText, $pattern)
        $count = $matches.Count
        
        if ($count -eq 0) {
            $variations = Get-WordVariations $wLower
            foreach ($var in $variations) {
                $varPattern = "\b" + [regex]::Escape($var) + "\b"
                $varMatches = [regex]::Matches($corpusText, $varPattern)
                $count += $varMatches.Count
            }
        }
        
        $wordCounts[$term] = $count
        if ($count -gt 0) {
            $usedWords[$groupName].Add($term)
        } else {
            $unusedWords[$groupName].Add($term)
        }
    }
}

$totalVocab = $wordToGroup.Count
$totalUsed = ($usedWords.Values | ForEach-Object { $_.Count } | Measure-Object -Sum).Sum
$totalUnused = ($unusedWords.Values | ForEach-Object { $_.Count } | Measure-Object -Sum).Sum
$pct = [math]::Round(($totalUsed / $totalVocab) * 100, 1)

Write-Host "Overall Coverage: $totalUsed / $totalVocab words ($pct%)"
Write-Host "Used words: $totalUsed | Unused words: $totalUnused`n"

foreach ($g in $allVocabWords.Keys | Sort-Object) {
    $uCount = $usedWords[$g].Count
    $gTotal = $allVocabWords[$g].Count
    $gPct = [math]::Round(($uCount / $gTotal) * 100, 1)
    Write-Host "[$g] $uCount / $gTotal ($gPct%)"
    if ($uCount -gt 0) {
        $details = $usedWords[$g] | ForEach-Object { "$_ ($($wordCounts[$_]))" }
        Write-Host "   Used: $($details -join ', ')"
    }
    if ($unusedWords[$g].Count -gt 0) {
        Write-Host "   Unused: $($unusedWords[$g] -join ', ')" -ForegroundColor Yellow
    }
}

if ($pct -ge 95) {
    Write-Host "`nSUCCESS: Vocabulary coverage is $pct%, which exceeds the 95% threshold!" -ForegroundColor Green
} else {
    Write-Host "`nWARNING: Vocabulary coverage is $pct%, which is below 95%." -ForegroundColor Red
}
