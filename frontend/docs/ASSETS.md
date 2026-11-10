# Ressources visuelles

- Illustration d’apprentissage : troisième image de la demande du 4 novembre 2026, copiée sans modification dans `public/images/learning-lab.jpg`. Les deux autres images servent de références de mise en page et de sommaire.

- Logo et illustration d’accueil : ressources du projet fourni, conservées.
- Illustration d’authentification : troisième image fournie avec la demande, copiée sans modification dans `public/images/auth-developer.jpg`.
- Google : SVG local à quatre couleurs dans `src/components/GoogleIcon.tsx`. GitHub : SVG local déjà présent. Les deux marques identifient les futurs fournisseurs OAuth ; aucun service tiers n’est appelé par ces boutons.
- Icônes de technologies : sélection SVG de Simple Icons 16.36.0, intégrée dans `public/tech`. Le nom reste visible à côté de l’icône.
- C# : petit badge SVG local pour le nom du langage ; Java : pictogramme tasse fourni par Lucide. Une technologie inconnue reçoit un symbole de code générique.
- Drapeaux : SVG de country-flag-icons 1.6.20, format 3:2, intégrés dans `public/flags`. Les noms français/anglais sont rapprochés des codes ISO. Un pays non reconnu conserve son nom et un symbole globe.
- Icônes d’interface : dépendance Lucide React déjà présente.

Les licences des ressources ajoutées sont conservées dans `docs/licenses/`. Ces fichiers sont servis localement avec le projet : aucun téléchargement d’icône à l’exécution depuis un CDN. Les deux paquets de ressources ont servi à la préparation ; ils ne sont pas ajoutés comme dépendances à installer pour lancer le frontend.
