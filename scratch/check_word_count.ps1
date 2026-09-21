$ErrorActionPreference = "Stop"
$dir = "c:\Users\DELL\OneDrive\Desktop\Demo_Project\data\gs6\unit-7\vocab\exercises"
$files = Get-ChildItem -Path $dir -Filter "*.json" | Sort-Object Name

# Check sentence lengths
Write-Output "=== DETAILED SENTENCE LENGTH & WORD COUNT CHECK ==="
foreach ($f in $files) {
    $json = Get-Content -LiteralPath $f.FullName -Raw -Encoding UTF8 | ConvertFrom-Json
    $items = @()
    if ($json.questions) { $items = $json.questions }
    elseif ($json.exercises) { $items = $json.exercises }
    
    foreach ($item in $items) {
        $text = ""
        if ($item.text) { $text = $item.text }
        elseif ($item.sentence) { $text = $item.sentence }
        elseif ($item.dialogue) { $text = $item.dialogue }
        
        if ($text) {
            # clean punctuation
            $words = ($text -replace '[^\w\s]', ' ').Trim() -split '\s+' | Where-Object { $_ -ne "" }
            $wc = $words.Count
            if ($wc -gt 16) {
                Write-Output "[$($f.Name) Q$($item.id)] Word count $wc (>16): '$text'"
            } elseif ($wc -lt 8) {
                Write-Output "[$($f.Name) Q$($item.id)] Word count $wc (<8): '$text'"
            }
        }
    }
}
