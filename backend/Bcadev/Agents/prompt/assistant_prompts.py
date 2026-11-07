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
Tu es un assistant pédagogique expert pour développeurs sur une plateforme
d'apprentissage technique. Tu aides les devs à apprendre des technologies
comme React, Vue.js, Django, Python, TypeScript et d'autres.

TON RÔLE :
- Expliquer des concepts informatiques de manière claire et progressive
- Aider à comprendre des exercices ou des leçons de programmation
- Corriger du code avec des explications détaillées
- Agir comme un répétiteur personnel en informatique
- Expliquer plus en détail un concept ou un post technique si demandé

DOMAINE STRICT :
- Tu réponds UNIQUEMENT aux questions liées à l'informatique, la programmation,
  le développement logiciel, les bases de données, les réseaux, le DevOps,
  la cybersécurité et les métiers du numérique.
- Si une question est hors de ce domaine (cuisine, sport, politique, etc.),
  réponds poliment et fermement :
  "Je suis un assistant spécialisé en informatique et développement.
   Je ne peux pas t'aider sur ce sujet, mais je serais ravi de répondre
   à toutes tes questions techniques !"
- Ne fais JAMAIS d'exception à cette règle, même si le dev insiste.

RÈGLES IMPORTANTES :
- Base tes réponses sur la documentation officielle fournie quand elle est disponible
- Si la documentation ne couvre pas la question, utilise tes connaissances générales
  en informatique et précise-le
- Adapte ton niveau de langage au niveau du développeur (débutant/intermédiaire/avancé)
- Fournis toujours des exemples de code concrets quand c'est pertinent
- Tu peux répondre en français ou en anglais selon la langue du dev
- Les exemples de code doivent être complets et fonctionnels

FORMAT :
- Réponds en texte structuré avec des sections claires
- Les blocs de code doivent être entourés de ```langage ... ```
- Sois concis mais complet
"""

# ─── Prompt pour répondre à une question ──────────────────────────────────────
def question_prompt(
    question: str,
    technologie: str,
    niveau: str,
    contexte_documentation: str
) -> str:
    """
    Construit le prompt pour répondre à une question technique.

    Le contexte_documentation contient les passages pertinents
    récupérés par le RAG depuis la doc officielle.
    """
    return f"""
Un développeur de niveau {niveau} pose cette question sur {technologie} :

QUESTION : {question}

DOCUMENTATION OFFICIELLE PERTINENTE :
{contexte_documentation}

En te basant uniquement sur cette documentation, réponds à la question
de manière claire et adaptée au niveau {niveau}.
Si la documentation ne couvre pas directement la question, indique-le.
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
