# Script de test d'intégration complète (PowerShell)

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "🧪 Test d'intégration - Exécution de code" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

$BACKEND_URL = "http://localhost:8000"
$HEALTH_ENDPOINT = "$BACKEND_URL/api/code-execution/health/"
$EXECUTE_ENDPOINT = "$BACKEND_URL/api/code-execution/execute/"

# 1. Docker
Write-Host "`n1️⃣  Vérification Docker..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version 2>&1
    Write-Host "✅ Docker est installé : $dockerVersion" -ForegroundColor Green
    
    $dockerPs = docker ps 2>&1
    Write-Host "✅ Docker est lancé" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker n'est pas disponible" -ForegroundColor Red
    exit 1
}

# 2. Backend
Write-Host "`n2️⃣  Vérification Backend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri $HEALTH_ENDPOINT -Method GET -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Backend répond" -ForegroundColor Green
        $health = ($response.Content | ConvertFrom-Json).status
        Write-Host "   Status: $health" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Backend ne répond pas" -ForegroundColor Red
    Write-Host "⚠️  Lancer : cd backend\Bcadev ; python manage.py runserver" -ForegroundColor Yellow
    exit 1
}

# 3. Python
Write-Host "`n3️⃣  Test Python..." -ForegroundColor Yellow
$body = @{
    language = "python"
    code = 'print("Test Python OK")'
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri $EXECUTE_ENDPOINT -Method POST -Body $body -ContentType "application/json"
    if ($response.stdout -like "*Test Python OK*") {
        Write-Host "✅ Python fonctionne" -ForegroundColor Green
    } else {
        Write-Host "❌ Python échoue" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Python échoue : $_" -ForegroundColor Red
}

# 4. JavaScript
Write-Host "`n4️⃣  Test JavaScript..." -ForegroundColor Yellow
$body = @{
    language = "javascript"
    code = 'console.log("Test JS OK")'
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri $EXECUTE_ENDPOINT -Method POST -Body $body -ContentType "application/json"
    if ($response.stdout -like "*Test JS OK*") {
        Write-Host "✅ JavaScript fonctionne" -ForegroundColor Green
    } else {
        Write-Host "❌ JavaScript échoue" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ JavaScript échoue : $_" -ForegroundColor Red
}

# 5. C
Write-Host "`n5️⃣  Test C..." -ForegroundColor Yellow
$body = @{
    language = "c"
    code = '#include <stdio.h>
int main() { 
    printf("Test C OK"); 
    return 0; 
}'
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri $EXECUTE_ENDPOINT -Method POST -Body $body -ContentType "application/json"
    if ($response.stdout -like "*Test C OK*") {
        Write-Host "✅ C fonctionne" -ForegroundColor Green
    } else {
        Write-Host "❌ C échoue" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ C échoue : $_" -ForegroundColor Red
}

# 6. PHP
Write-Host "`n6️⃣  Test PHP..." -ForegroundColor Yellow
$body = @{
    language = "php"
    code = '<?php echo "Test PHP OK"; ?>'
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri $EXECUTE_ENDPOINT -Method POST -Body $body -ContentType "application/json"
    if ($response.stdout -like "*Test PHP OK*") {
        Write-Host "✅ PHP fonctionne" -ForegroundColor Green
    } else {
        Write-Host "❌ PHP échoue" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ PHP échoue : $_" -ForegroundColor Red
}

Write-Host "`n==================================================" -ForegroundColor Cyan
Write-Host "🎉 Tests terminés !" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan

Write-Host "`nPour tester le frontend :" -ForegroundColor Yellow
Write-Host "1. cd frontend" -ForegroundColor White
Write-Host "2. npm run dev" -ForegroundColor White
Write-Host "3. Ouvrir http://localhost:5173" -ForegroundColor White
Write-Host "4. Aller dans Learning > Choisir un cours" -ForegroundColor White
Write-Host "5. Cliquer sur 'Exécuter' dans un exercice" -ForegroundColor White
