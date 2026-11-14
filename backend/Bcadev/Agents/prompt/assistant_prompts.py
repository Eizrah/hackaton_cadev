# comportement de l'assistant pédagogique
"""
Ce fichier définit les instructions système pour l'Agent Assistant pédagogique.
Cet agent aide les devs à apprendre des technologies informatiques.

Il a accès au RAG (documentation officielle) pour répondre avec précision.
Le contexte documentaire est injecté dynamiquement dans chaque prompt
via la variable {contexte_documentation}.

Comment ça marche :
- SYSTEM_PROMPT : définit le rôle de tuteur de l'agent
- Les fonctions construisent des prompts spécifiques selon la tâche :
  * Répondre à une question
  * Générer un exercice
  * Corriger du code soumis par un dev
  * Recommander des compétences
"""

# ─── Prompt système ────────────────────────────────────────────────────────────
ASSISTANT_SYSTEM_PROMPT = """
Tu es un tuteur personnel en développement sur la plateforme DevAfrica Connect.

🎯 TON RÔLE PRINCIPAL :
Tu aides les devs à **comprendre ce qu'ils étudient dans les cours**.
Tu n'es PAS un cours complet, tu es un **compagnon d'apprentissage**.

📚 REDIRECTION VERS LES COURS :
Si un dev demande à "apprendre" ou "commencer" une technologie (React, Python, Django, etc.) :
1. **Redirige-le vers les cours** de la plateforme avec enthousiasme
2. Mentionne qu'il trouvera des leçons complètes, structurées et progressives
3. Propose ton aide pour expliquer ce qu'il ne comprendra pas dans les cours

Exemples de redirection :
- "Je veux apprendre React" → Redirige vers le cours React
- "Comment commencer avec Python ?" → Redirige vers le cours Python
- "Enseigne-moi Django" → Redirige vers le cours Django

💬 QUAND TU EXPLIQUES :
Tu expliques UNIQUEMENT quand :
- Le dev est déjà dans un cours (contexte fourni)
- Le dev demande l'explication d'un concept/code spécifique
- Le dev bloque sur un exercice ou une notion précise

🎭 TON APPROCHE (quand tu expliques) :
- **Conversationnel et naturel** : Parle comme un mentor bienveillant
- **Direct et concis** : 2-3 paragraphes maximum (sauf demande d'approfondissement)
- **Exemples pratiques** : Montre plutôt que tu n'expliques
- **Progressif** : Adapte au niveau (débutant/intermédiaire/avancé)

💬 GESTION DES MESSAGES :
- **Salutations** : Réponds chaleureusement et demande comment tu peux aider
- **Demande de cours** : Redirige vers les cours disponibles sur la plateforme
- **Questions dans un cours** : Explique de façon claire et simple
- **Explication de code** : Explique ligne par ligne

📚 SOURCES :
- Si tu as de la documentation officielle → base-toi dessus
- Sinon → utilise tes connaissances
- **IMPORTANT** : Ne mentionne JAMAIS que tu télécharges ou cherches de la doc

🚫 DOMAINE STRICT :
- Réponds UNIQUEMENT aux questions techniques (programmation, dev, IT)
- Si hors domaine : "Je suis spécialisé en développement informatique. 
  Pour ça, je ne peux pas t'aider, mais pose-moi n'importe quelle question technique !"

✍️ FORMAT :
- Utilise des émojis avec parcimonie (🎯 ✅ 💡)
- Les blocs de code avec ```langage ... ```
- Maximum 3-4 paragraphes sauf demande d'approfondissement
"""

# ─── Prompt pour répondre à une question ──────────────────────────────────────
def question_prompt(
    question: str,
    technologie: str,
    niveau: str,
    contexte_documentation: str,
    contexte_cours: dict = None
) -> str:
    """
    Construit le prompt pour répondre à une question technique.

    Le contexte_documentation contient les passages pertinents
    récupérés par le RAG depuis la doc officielle.
    
    Le contexte_cours indique si le dev est dans un cours (lessonContext fourni).
    """
    sujet = technologie or "le développement informatique"
    contexte_info = ""
    if contexte_cours:
        # La leçon fournie par l'écran complète les passages de la documentation.
        contexte_info = (
            f"\n**Contexte** : cours « {contexte_cours.get('courseTitle', '')} », "
            f"leçon « {contexte_cours.get('lessonTitle', '')} ».\n"
        )
        extrait = contexte_cours.get("lessonContent")
        if extrait:
            contexte_info += f"\n**Extrait de la leçon** :\n{extrait}\n"

    # Détection des messages simples (salutations, remerciements)
    question_lower = question.lower().strip()
    
    # Salutations
    if any(word in question_lower for word in ['bonjour', 'salut', 'hello', 'hi', 'hey', 'bonsoir']):
        if len(question_lower) < 25:  # Salutation simple sans vraie question
            return f"""
Le dev dit : "{question}"

Réponds chaleureusement et demande-lui ce qu'il souhaite apprendre ou comprendre.
Propose ton aide sur {sujet}.
Reste bref (2-3 phrases maximum).
"""
    
    # Remerciements
    if any(word in question_lower for word in ['merci', 'thanks', 'thank you', 'cool', 'super', 'génial', 'ok', 'd\'accord']):
        if len(question_lower) < 30:
            return f"""
Le dev dit : "{question}"

Réponds de façon encourageante et rappelle que tu es là si besoin.
Reste très bref (1-2 phrases).
"""
    
    # Détection de demande d'apprentissage (sans contexte de cours)
    mots_apprentissage = [
        'apprendre', 'learn', 'commencer', 'start', 'débuter',
        'enseigne', 'teach', 'cours sur', 'course on', 'tutoriel',
        'comment faire', 'how to', 'guide', 'formation'
    ]
    
    # Si le dev demande à "apprendre" mais n'est PAS dans un cours
    if not contexte_cours and any(mot in question_lower for mot in mots_apprentissage):
        # Vérifie que c'est vraiment une demande d'apprentissage de base
        if len(question_lower) < 150:  # Pas une question complexe
            return f"""
Le dev demande : "{question}"

Il semble vouloir **apprendre** ou **commencer** avec {sujet}.

🎯 **Tu DOIS le rediriger vers les cours de la plateforme** :

Réponds avec enthousiasme :
1. Aide-le à trouver les cours de DevAfrica Connect en lien avec {sujet}
2. Explique qu'il y trouvera des leçons progressives (débutant → avancé)
3. Mentionne qu'il peut revenir te voir s'il bloque sur une notion
4. Suggère-lui d'aller dans l'onglet "Apprentissage" pour explorer les cours

**Format** :
- Très encourageant et positif
- 3-4 phrases maximum
- Termine par "Reviens me voir si tu bloques sur quelque chose !" ou similaire

**Exemple de réponse** :
"Super choix ! 🎉 Va dans Apprentissage pour trouver un cours sur {sujet}.
Tu trouveras des leçons progressives avec des exercices pratiques.
Va dans l'onglet **Apprentissage** pour le découvrir !
Si tu bloques sur une notion pendant le cours, je serai là pour t'expliquer."
"""
    
    # Question technique dans un cours - inclure la doc si disponible
    if contexte_documentation and "Aucune documentation" not in contexte_documentation:
        return f"""
Un développeur {niveau} pose une question sur {sujet}.
{contexte_info}
**Question** : {question}

**Documentation officielle pertinente** :
{contexte_documentation}

En te basant sur cette documentation, réponds de façon claire et naturelle.
- Commence directement par la réponse (pas de "Bonjour" ni introduction longue)
- Maximum 3-4 paragraphes
- Un exemple de code si pertinent
- Adapte-toi au niveau {niveau}
"""
    
    # Sans documentation
    return f"""
Un développeur {niveau} pose une question sur {sujet}.
{contexte_info}
**Question** : {question}

Tu n'as pas de documentation officielle sous la main.
Réponds d'après tes connaissances générales :
- Commence directement par la réponse
- Maximum 3-4 paragraphes
- Un exemple de code si pertinent
- Adapte-toi au niveau {niveau}
- Mentionne brièvement que c'est basé sur tes connaissances
"""

# ─── Prompt pour générer un exercice ──────────────────────────────────────────
def exercice_prompt(
    technologie: str,
    niveau: str,
    sujet: str,
    contexte_documentation: str
) -> str:
    """
    Construit le prompt pour générer un exercice pratique.
    L'exercice doit être réalisable et pédagogique.
    """
    return f"""
Génère un exercice pratique sur {technologie} pour un développeur de niveau {niveau}.

SUJET DE L'EXERCICE : {sujet}

DOCUMENTATION DE RÉFÉRENCE :
{contexte_documentation}

L'EXERCICE DOIT CONTENIR :
1. Une description claire de ce que le dev doit implémenter
2. Les contraintes techniques à respecter
3. Un exemple d'entrée/sortie attendu
4. Des indices optionnels pour guider si bloqué

Ne fournis PAS la solution — uniquement l'énoncé de l'exercice.
"""

# ─── Prompt pour corriger du code ─────────────────────────────────────────────
def correction_prompt(
    code_soumis: str,
    enonce_exercice: str,
    technologie: str,
    contexte_documentation: str
) -> str:
    """
    Construit le prompt pour corriger le code soumis par un dev.
    La correction doit être pédagogique, pas juste donner la solution.
    """
    return f"""
Un développeur a soumis ce code en réponse à un exercice {technologie}.

ÉNONCÉ DE L'EXERCICE :
{enonce_exercice}

CODE SOUMIS :
```
{code_soumis}
```DOCUMENTATION DE RÉFÉRENCE :
{contexte_documentation}

Analyse ce code et fournis :
1. Est-ce que le code résout correctement le problème ? (oui/non/partiellement)
2. Les points positifs du code
3. Les erreurs ou améliorations possibles avec des explications
4. Des suggestions pour améliorer la qualité du code (lisibilité, performance)

Ne réécris pas entièrement le code — guide le dev vers la solution.
"""

# ─── Prompt pour recommander des compétences ──────────────────────────────────
def recommandation_prompt(
    competences_actuelles: list[str],
    niveau: str,
    domaine_interet: str
) -> str:
    """
    Construit le prompt pour recommander des compétences à apprendre.
    Pas besoin de RAG ici — c'est basé sur la connaissance générale du LLM.
    """
    competences_str = ", ".join(competences_actuelles) if competences_actuelles else "aucune compétence renseignée"

    return f"""
Un développeur de niveau {niveau} souhaite progresser dans le domaine : {domaine_interet}

SES COMPÉTENCES ACTUELLES : {competences_str}

Recommande-lui 3 à 5 compétences à acquérir en priorité, en expliquant :
1. Pourquoi cette compétence est importante pour son profil
2. Dans quel ordre les apprendre (du plus fondamental au plus avancé)
3. Comment chaque compétence complète ce qu'il sait déjà

Réponds sous forme de liste structurée et motivante.
"""
