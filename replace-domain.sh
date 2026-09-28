#!/bin/bash
# Script pour remplacer le domaine de test par le domaine réel
# Usage: ./replace-domain.sh mon-domaine-reel.fr

if [ -z "$1" ]; then
  echo "Usage: ./replace-domain.sh votre-domaine.fr"
  echo "Exemple: ./replace-domain.sh leretro-paris.fr"
  exit 1
fi

NEW_DOMAIN="$1"
OLD_DOMAIN="leretro-paris.fr"

echo "🔄 Remplacement de $OLD_DOMAIN par $NEW_DOMAIN..."

# Fichiers à modifier
FILES=(
  "src/index.html"
  "public/robots.txt"
  "public/sitemap.xml"
  "src/app/services/schema.service.ts"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    sed -i '' "s|$OLD_DOMAIN|$NEW_DOMAIN|g" "$file"
    echo "✅ $file"
  else
    echo "⚠️  Fichier non trouvé : $file"
  fi
done

echo "✅ Domaine remplacé avec succès !"
echo "📝 N'oubliez pas de :"
echo "   1. Compiler : ng build --configuration production"
echo "   2. Déployer : firebase deploy"
echo "   3. Soumettre le sitemap à Google Search Console"
