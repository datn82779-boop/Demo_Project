$ErrorActionPreference = "Stop"
$fPath = "c:\Users\DELL\OneDrive\Desktop\Demo_Project\data\gs6\unit-7\vocab\exercises\12_signs_and_notices.json"
$json = Get-Content $fPath -Raw -Encoding UTF8 | ConvertFrom-Json

Write-Output "=== 12_signs_and_notices.json OPTION LENGTH CHECK ==="
foreach ($q in $json.questions) {
    $lens = $q.options | ForEach-Object { $_.Length }
    $equal = ($lens | Select-Object -Unique).Count -eq 1
    Write-Output "Q$($q.id): lengths=[$($lens -join ', ')] | Equal: $equal"
}

$fConv = "c:\Users\DELL\OneDrive\Desktop\Demo_Project\data\gs6\unit-7\vocab\exercises\03_multiple_choice_conversation.json"
$jConv = Get-Content $fConv -Raw -Encoding UTF8 | ConvertFrom-Json

Write-Output "`n=== 03_multiple_choice_conversation.json OPTION LENGTH CHECK ==="
foreach ($q in $jConv.questions) {
    $lens = $q.options | ForEach-Object { $_.Length }
    Write-Output "Q$($q.id): lengths=[$($lens -join ', ')] (diff: $(($lens | Measure-Object -Maximum).Maximum - ($lens | Measure-Object -Minimum).Minimum))"
}
