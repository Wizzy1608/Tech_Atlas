#Requires -RunAsAdministrator
# Idempotent: ensure role techatlas (CREATEDB) + database techatlas exist.
# Logs to %TEMP%\pg-fix.log so the caller can verify across the UAC boundary.
$ErrorActionPreference = 'Continue'
$log = Join-Path $env:TEMP 'pg-fix.log'
function Note($m) { Add-Content $log $m; Write-Host $m }
Set-Content $log "start $(Get-Date -Format o)"

$pg   = 'D:\Applications\postgrsql\17'
$hba  = "$pg\data\pg_hba.conf"
$role = 'techatlas'

try {
  Copy-Item $hba "$hba.bak" -Force
  (Get-Content $hba) -replace 'scram-sha-256', 'trust' | Set-Content $hba
  Restart-Service postgresql-x64-18
  Start-Sleep 3
  Note 'service restarted with trust auth'

  & "$pg\bin\psql.exe" -U postgres -h 127.0.0.1 -w -c "CREATE ROLE $role LOGIN PASSWORD '$role'"
  Note "create role exit=$LASTEXITCODE"
  & "$pg\bin\psql.exe" -U postgres -h 127.0.0.1 -w -c "ALTER ROLE $role CREATEDB"
  Note "alter role exit=$LASTEXITCODE"
  & "$pg\bin\psql.exe" -U postgres -h 127.0.0.1 -w -c "CREATE DATABASE $role OWNER $role"
  Note "create db exit=$LASTEXITCODE (nonzero ok if it already exists)"
} catch {
  Note "ERROR: $_"
} finally {
  Copy-Item "$hba.bak" $hba -Force
  Restart-Service postgresql-x64-18
  Start-Sleep 3
  Note 'hba restored, service restarted'
}

$env:PGPASSWORD = $role
& "$pg\bin\psql.exe" -U $role -h 127.0.0.1 -d $role -w -c 'select current_database()'
Note "verify exit=$LASTEXITCODE"
Note "done $(Get-Date -Format o)"
