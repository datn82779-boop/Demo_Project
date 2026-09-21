$ErrorActionPreference = "Stop"
$dir = "c:\Users\DELL\OneDrive\Desktop\Demo_Project\data\gs6\unit-7\vocab\exercises"
$files = Get-ChildItem -Path $dir -Filter "*.json" | Sort-Object Name

foreach ($f in $files) {
    $json = Get-Content -LiteralPath $f.FullName -Raw -Encoding UTF8 | ConvertFrom-Json
    $keys = $json | Get-Member -MemberType NoteProperty | Select-Object -ExpandProperty Name
    Write-Output "[$($f.Name)] Root keys: $($keys -join ', ')"
}
