param([string]$Url)
Add-Type -AssemblyName System.Windows.Forms
$p = $Url -replace '^pamfolder://open\?p=', '' -replace '/$', ''
$p = [uri]::UnescapeDataString($p) -replace '/', '\'
$seg = [System.Collections.Generic.List[string]]($p -split '\\')
# remove nome de arquivo / curinga (*.pdf) do final
while ($seg.Count -gt 1 -and ($seg[$seg.Count-1] -match '[\*\?]' -or $seg[$seg.Count-1] -match '\.[A-Za-z0-9]{2,4}$' -or $seg[$seg.Count-1] -eq '')) { $seg.RemoveAt($seg.Count-1) }
# sobe até achar uma pasta existente
while ($seg.Count -gt 1) {
  $c = $seg -join '\'
  if (Test-Path -LiteralPath $c -PathType Container) { Start-Process explorer.exe -ArgumentList "`"$c`""; exit }
  $seg.RemoveAt($seg.Count-1)
}
[System.Windows.Forms.MessageBox]::Show("Pasta não encontrada:`n$p", "PAM Explorer") | Out-Null
