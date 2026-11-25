# Execute com PowerShell (não precisa ser administrador)
$dest = "$env:LOCALAPPDATA\PamFolder"
New-Item -ItemType Directory -Force $dest | Out-Null
Copy-Item "$PSScriptRoot\pam-open.ps1" $dest -Force
$k = "HKCU:\Software\Classes\pamfolder"
New-Item -Force $k | Out-Null
Set-ItemProperty $k "(default)" "URL:PAM Folder"
Set-ItemProperty $k "URL Protocol" ""
New-Item -Force "$k\shell\open\command" | Out-Null
Set-ItemProperty "$k\shell\open\command" "(default)" "powershell.exe -NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$dest\pam-open.ps1`" `"%1`""
Write-Host "Handler instalado em $dest"
