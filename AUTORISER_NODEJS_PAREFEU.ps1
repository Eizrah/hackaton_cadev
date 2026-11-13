# Script PowerShell pour autoriser Node.js dans le pare-feu Windows
# À exécuter en mode Administrateur

Write-Host "🔧 Configuration du pare-feu Windows pour Node.js..." -ForegroundColor Cyan

# Réactiver le pare-feu d'abord
Write-Host "✅ Réactivation du pare-feu..." -ForegroundColor Green
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled True

# Trouver le chemin de Node.js
$nodePath = (Get-Command node).Path
Write-Host "📍 Node.js trouvé : $nodePath" -ForegroundColor Yellow

# Supprimer les anciennes règles si elles existent
Write-Host "🗑️ Suppression des anciennes règles..." -ForegroundColor Yellow
Remove-NetFirewallRule -DisplayName "Node.js Server" -ErrorAction SilentlyContinue
Remove-NetFirewallRule -DisplayName "Node.js Inbound" -ErrorAction SilentlyContinue
Remove-NetFirewallRule -DisplayName "Node.js Outbound" -ErrorAction SilentlyContinue

# Créer les nouvelles règles
Write-Host "➕ Création des règles de pare-feu..." -ForegroundColor Green

# Règle entrante (Inbound)
New-NetFirewallRule -DisplayName "Node.js Server" `
    -Direction Inbound `
    -Program $nodePath `
    -Action Allow `
    -Profile Domain,Private,Public `
    -Protocol TCP `
    -LocalPort 5173,8080,3000 `
    -Description "Autorise Node.js pour les serveurs de développement (Vite, Express, etc.)"

# Règle sortante (Outbound) - optionnel mais recommandé
New-NetFirewallRule -DisplayName "Node.js Outbound" `
    -Direction Outbound `
    -Program $nodePath `
    -Action Allow `
    -Profile Domain,Private,Public `
    -Description "Autorise Node.js connexions sortantes"

Write-Host "✅ Configuration terminée !" -ForegroundColor Green
Write-Host ""
Write-Host "Node.js est maintenant autorisé sur les ports :" -ForegroundColor Cyan
Write-Host "  - 5173 (Vite)" -ForegroundColor White
Write-Host "  - 8080 (Serveur alternatif)" -ForegroundColor White
Write-Host "  - 3000 (Express)" -ForegroundColor White
Write-Host ""
Write-Host "Tu peux maintenant lancer : npm run dev" -ForegroundColor Green
