# Script de nettoyage avant déploiement
# Usage: .\cleanup.ps1

Write-Host "🧹 Nettoyage des fichiers de documentation..." -ForegroundColor Yellow

$filesToRemove = @(
    "AMELIORATIONS_EXPRESS_FAITES.md",
    "AMELIORATIONS_FINALES_VUE_REACT.md",
    "AMELIORATIONS_FRAMEWORKS_BACKEND.md",
    "AMELIORATIONS_LARAVEL_FAITES.md",
    "AMELIORATIONS_SPRINGBOOT_FAITES.md",
    "AMELIORATIONS_VUE_FAITES.md",
    "ARRETER_ET_DEMARRER.md",
    "CODE_EXECUTION_SETUP.md",
    "CORRECTIONS_PHOTOS.md",
    "DJANGO_ANIMAL_CODE.md",
    "EXEMPLE_FIL_ROUGE_BACKEND.md",
    "INTEGRATION_IA_APPRENTISSAGE.md",
    "NIVEAU_AVANCE_CPP_COMPLETE.md",
    "PLAN_AMELIORATION_DJANGO.md",
    "PLAN_AMELIORATION_EXPRESS.md",
    "PLAN_AMELIORATION_LARAVEL.md",
    "PLAN_AMELIORATION_REACT.md",
    "PLAN_AMELIORATION_SPRINGBOOT.md",
    "PLAN_AMELIORATION_VUE.md",
    "PLAN_COURS_JAVASCRIPT.md",
    "PLAN_COURS_PHP.md",
    "PLAN_COURS_TYPESCRIPT.md",
    "PROCHAINES_ETAPES_3_COURS.md",
    "RECAP_COMPLET_COURS_2024.md",
    "REFONTE_DJANGO_ANIMAL.md",
    "RESOUDRE_ERREUR_PORT.md",
    "RESTRUCTURATION_JAVA_AVANCE.md",
    "SOLUTION_FINALE_PORT.md",
    "SUCCESS_SUMMARY.txt",
    "test_code_execution.py",
    "test_context.py",
    "TEST_CPP_COURSE.md",
    "TEST_DEBUG.md",
    "TEST_IMAGE.html",
    "test_integration.ps1",
    "test_integration.sh",
    "AUTORISER_NODEJS_PAREFEU.ps1"
)

$removed = 0
$notFound = 0

foreach ($file in $filesToRemove) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "  ✅ Supprimé: $file" -ForegroundColor Green
        $removed++
    } else {
        Write-Host "  ⏭️  Ignoré (inexistant): $file" -ForegroundColor Gray
        $notFound++
    }
}

Write-Host "`n📊 Résumé:" -ForegroundColor Cyan
Write-Host "  - Fichiers supprimés: $removed" -ForegroundColor Green
Write-Host "  - Fichiers non trouvés: $notFound" -ForegroundColor Gray

Write-Host "`n✅ Nettoyage terminé!" -ForegroundColor Green
Write-Host "`n📝 Fichiers conservés:" -ForegroundColor Yellow
Write-Host "  - README.md"
Write-Host "  - QUICK_START.md"
Write-Host "  - DEPLOYMENT.md"
Write-Host "  - docker-compose.yml"
Write-Host "  - docker-compose.prod.yml"
Write-Host "  - deploy.sh"
Write-Host "  - .gitignore"
Write-Host "  - .env.example"

Write-Host "`n⚠️  Prochaines étapes:" -ForegroundColor Yellow
Write-Host "  1. Vérifier que .env n'est pas commité: git status"
Write-Host "  2. Ajouter les changements: git add ."
Write-Host "  3. Commit: git commit -m 'Préparation pour production'"
Write-Host "  4. Push: git push origin main"
