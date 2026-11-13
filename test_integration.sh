#!/bin/bash
# Script de test d'intégration complète

echo "=================================================="
echo "🧪 Test d'intégration - Exécution de code"
echo "=================================================="

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variables
BACKEND_URL="http://localhost:8000"
HEALTH_ENDPOINT="$BACKEND_URL/api/code-execution/health/"
EXECUTE_ENDPOINT="$BACKEND_URL/api/code-execution/execute/"

echo ""
echo "1️⃣  Vérification Docker..."
if docker --version > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Docker est installé${NC}"
else
    echo -e "${RED}❌ Docker n'est pas installé${NC}"
    exit 1
fi

if docker ps > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Docker est lancé${NC}"
else
    echo -e "${RED}❌ Docker n'est pas lancé${NC}"
    exit 1
fi

echo ""
echo "2️⃣  Vérification Backend..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_ENDPOINT")
if [ "$HTTP_CODE" -eq 200 ]; then
    echo -e "${GREEN}✅ Backend répond${NC}"
    HEALTH=$(curl -s "$HEALTH_ENDPOINT" | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
    echo "   Status: $HEALTH"
else
    echo -e "${RED}❌ Backend ne répond pas (HTTP $HTTP_CODE)${NC}"
    echo -e "${YELLOW}⚠️  Lancer : cd backend/Bcadev && python manage.py runserver${NC}"
    exit 1
fi

echo ""
echo "3️⃣  Test Python..."
RESULT=$(curl -s -X POST "$EXECUTE_ENDPOINT" \
    -H "Content-Type: application/json" \
    -d '{"language":"python","code":"print(\"Test Python OK\")"}')

if echo "$RESULT" | grep -q "Test Python OK"; then
    echo -e "${GREEN}✅ Python fonctionne${NC}"
else
    echo -e "${RED}❌ Python échoue${NC}"
    echo "Résultat: $RESULT"
fi

echo ""
echo "4️⃣  Test JavaScript..."
RESULT=$(curl -s -X POST "$EXECUTE_ENDPOINT" \
    -H "Content-Type: application/json" \
    -d '{"language":"javascript","code":"console.log(\"Test JS OK\")"}')

if echo "$RESULT" | grep -q "Test JS OK"; then
    echo -e "${GREEN}✅ JavaScript fonctionne${NC}"
else
    echo -e "${RED}❌ JavaScript échoue${NC}"
fi

echo ""
echo "5️⃣  Test C..."
CODE='#include <stdio.h>\nint main() { printf(\"Test C OK\"); return 0; }'
RESULT=$(curl -s -X POST "$EXECUTE_ENDPOINT" \
    -H "Content-Type: application/json" \
    -d "{\"language\":\"c\",\"code\":\"$CODE\"}")

if echo "$RESULT" | grep -q "Test C OK"; then
    echo -e "${GREEN}✅ C fonctionne${NC}"
else
    echo -e "${RED}❌ C échoue${NC}"
fi

echo ""
echo "6️⃣  Test PHP..."
CODE='<?php echo \"Test PHP OK\"; ?>'
RESULT=$(curl -s -X POST "$EXECUTE_ENDPOINT" \
    -H "Content-Type: application/json" \
    -d "{\"language\":\"php\",\"code\":\"$CODE\"}")

if echo "$RESULT" | grep -q "Test PHP OK"; then
    echo -e "${GREEN}✅ PHP fonctionne${NC}"
else
    echo -e "${RED}❌ PHP échoue${NC}"
fi

echo ""
echo "=================================================="
echo "🎉 Tests terminés !"
echo "=================================================="
echo ""
echo "Pour tester le frontend :"
echo "1. cd frontend"
echo "2. npm run dev"
echo "3. Ouvrir http://localhost:5173"
echo "4. Aller dans Learning > Choisir un cours"
echo "5. Cliquer sur 'Exécuter' dans un exercice"
