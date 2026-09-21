$ErrorActionPreference = "Stop"
$vocabExercisesDir = "c:\Users\DELL\OneDrive\Desktop\Demo_Project\data\gs6\unit-7\vocab\exercises"
$files = Get-ChildItem -Path $vocabExercisesDir -Filter "*.json" | Sort-Object Name

Write-Output "=== 1. FILE & QUESTION COUNT OVERVIEW ==="
$summary = foreach ($f in $files) {
    try {
        $json = Get-Content -LiteralPath $f.FullName -Raw -Encoding UTF8 | ConvertFrom-Json
        $count = if ($json.exercises) { $json.exercises.Count } else { 0 }
        [PSCustomObject]@{
            FileName = $f.Name
            Title = $json.title
            Type = $json.type
            Count = $count
            ValidJSON = $true
        }
    } catch {
        [PSCustomObject]@{
            FileName = $f.Name
            Title = "ERROR"
            Type = "ERROR"
            Count = 0
            ValidJSON = $false
        }
    }
}
$summary | Format-Table -AutoSize | Out-String | Write-Output

Write-Output "=== 2. MCQ OPTION DISTRIBUTION CHECK ==="
foreach ($f in $files) {
    $json = Get-Content -LiteralPath $f.FullName -Raw -Encoding UTF8 | ConvertFrom-Json
    $hasOptions = $false
    $dist = @{ A = 0; B = 0; C = 0; D = 0; Other = 0 }
    if ($json.exercises) {
        foreach ($ex in $json.exercises) {
            if ($ex.options -or $ex.correct_answer -in @('A','B','C','D')) {
                $hasOptions = $true
                $ans = [string]$ex.correct_answer
                if ($dist.ContainsKey($ans)) {
                    $dist[$ans]++
                } else {
                    $dist["Other"]++
                }
            }
        }
    }
    if ($hasOptions) {
        Write-Output "$($f.Name): Total=$($json.exercises.Count), A=$($dist['A']), B=$($dist['B']), C=$($dist['C']), D=$($dist['D']), Other=$($dist['Other'])"
    }
}

Write-Output "=== 3. UK vs US SPELLING SCAN ==="
$ukUsPatterns = @(
    @{ Word = "color/colour"; Pattern = "\bcolou?rs?\b" },
    @{ Word = "favorite/favourite"; Pattern = "\bfavou?rite\b" },
    @{ Word = "traveling/travelling"; Pattern = "\btravell?ing\b" },
    @{ Word = "traveled/travelled"; Pattern = "\btravell?ed\b" },
    @{ Word = "center/centre"; Pattern = "\bcent(er|re)s?\b" },
    @{ Word = "theater/theatre"; Pattern = "\btheat(er|re)s?\b" },
    @{ Word = "program/programme"; Pattern = "\bprogram(me)?s?\b" },
    @{ Word = "movie/film"; Pattern = "\b(movie|film)s?\b" },
    @{ Word = "neighbor/neighbour"; Pattern = "\bneighbou?rs?\b" },
    @{ Word = "practice/practise"; Pattern = "\bpracti[cs]e\b" }
)

foreach ($f in $files) {
    $raw = Get-Content -LiteralPath $f.FullName -Raw -Encoding UTF8
    foreach ($p in $ukUsPatterns) {
        $matches = [regex]::Matches($raw, $p.Pattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
        if ($matches.Count -gt 0) {
            $distinctMatches = ($matches | ForEach-Object { $_.Value.ToLower() } | Select-Object -Unique) -join ", "
            Write-Output "[$($f.Name)] Pattern '$($p.Word)' found ($($matches.Count) times): $distinctMatches"
        }
    }
}
