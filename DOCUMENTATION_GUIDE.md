# Guide de Lecture de la Documentation

Bienvenue dans l'analyse technique du projet Square Meter Real Estate. Ce guide vous aide à naviguer efficacement dans la documentation pour votre audit.

## 📋 Structure Recommandée de Lecture

### 1. **Commencez par ici** → [README.md](README.md)
   - **Durée:** 5 minutes
   - **Contenu:** Vue d'ensemble du projet, structure des dossiers, capacités principales
   - **Objectif:** Comprendre ce que fait l'application et sa stack de base

### 2. **Architecture Technique** → [ARCHITECTURE.md](ARCHITECTURE.md)
   - **Durée:** 10 minutes
   - **Contenu:** Composantes système (frontend, API, services externes), flux de requêtes
   - **Objectif:** Comprendre comment les différents éléments interagissent

### 3. **Stack Technologique Détaillé** → [TECH_STACK.md](TECH_STACK.md)
   - **Durée:** 15 minutes
   - **Contenu:** Liste complète des dépendances, versions, justifications d'usage
   - **Sections clés:**
     - Frontend: React, TypeScript, Tailwind, i18n
     - Backend: Nodemailer, API serverless
     - Services externes: APIMO, Gemini AI, WordPress
     - Infrastructure: Vercel, build configuration
   - **Objectif:** Valider la qualité et la pertinence des choix technologiques

### 4. **Gestion des Données & Formulaires** → [DATA_HANDLING.md](DATA_HANDLING.md)
   - **Durée:** 20 minutes
   - **Contenu:** Modes d'envoi des formulaires, stockage, rétention, sécurité
   - **Sections clés:**
     - Points de collecte (formulaires inquiry, careers, contact)
     - **Architecture d'envoi SMTP:** Gmail, Custom SMTP, SendGrid
     - **Stockage:** Email inbox (INDEFINI), logs (30 jours), pas de DB persistante
     - **Sécurité:** TLS in-transit, env vars, limitations connues
     - **GDPR:** Droits utilisateur, conformité, incidents
   - **Objectif:** Évaluer la conformité RGPD et les risques de sécurité

### 5. **Déploiement & Infrastructure** → [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
   - **Durée:** 10 minutes
   - **Contenu:** Variables d'environnement, processus de déploiement Vercel
   - **Objectif:** Comprendre comment l'app se déploie en production

### 6. **Sécurité & Secrets** → [SECURITY_NOTICE.md](SECURITY_NOTICE.md)
   - **Durée:** 5 minutes
   - **Contenu:** Historique de fuite de clé Gemini, corrections appliquées
   - **Objectif:** Évaluer la gestion des incidents de sécurité

## 🎯 Lectures par Persona

### **Recruteur / Manager Technique**
1. README.md (vue d'ensemble)
2. TECH_STACK.md (qualité des choix)
3. ARCHITECTURE.md (complexité et design)
4. DATA_HANDLING.md (conscience de la sécurité/GDPR)

**Temps total:** ~40 minutes

### **Audit de Conformité (RGPD/Sécurité)**
1. DATA_HANDLING.md (points de collecte, stockage, rétention)
2. SECURITY_NOTICE.md (incident response)
3. DEPLOYMENT_GUIDE.md (gestion des secrets)
4. .env.example (variables d'environnement requises)

**Temps total:** ~30 minutes

### **Développeur (Onboarding)**
1. README.md (structure du projet)
2. ARCHITECTURE.md (flux système)
3. TECH_STACK.md (dépendances à connaître)
4. api/ folder (endpoints expérimentaux)
5. src/ folder (structure React)

**Temps total:** ~1 heure

## 📂 Fichiers Importants à Consulter

### Fichiers de Contenu
| Fichier | Objectif | Audience |
|---------|----------|----------|
| [README.md](README.md) | Vue d'ensemble du projet | Tous |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Conception système | Techs, Managers |
| [TECH_STACK.md](TECH_STACK.md) | Dépendances & versions | Techs, Recruteurs |
| [DATA_HANDLING.md](DATA_HANDLING.md) | Données, formulaires, RGPD | Compliance, Techs |
| [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) | Déploiement Vercel | DevOps, Techs |
| [SECURITY_NOTICE.md](SECURITY_NOTICE.md) | Incidents et corrections | Security, Managers |

### Fichiers de Configuration
| Fichier | Objectif |
|---------|----------|
| [.env.example](.env.example) | Variables d'environnement requises |
| [package.json](package.json) | Dépendances npm, scripts |
| [vercel.json](vercel.json) | Configuration Vercel (timeouts, memory) |
| [tsconfig.json](tsconfig.json) | Configuration TypeScript |
| [tailwind.config.js](tailwind.config.js) | Configuration Tailwind CSS |

### Code Source
| Dossier | Objectif |
|--------|----------|
| [src/](src/) | Code React (composants, pages, services) |
| [api/](api/) | Fonctions Vercel serverless (email, IA, etc.) |
| [public/](public/) | Assets statiques |

## 🔍 Points Clés à Valider

### Pour un Audit de Qualité Code
- ✅ TypeScript utilisé pour type safety
- ✅ React 19 moderne avec hooks
- ✅ Tailwind CSS (no inline styles)
- ✅ i18n support (6 langues: FR, EN, ES, DE, AR, RU)
- ⚠️ ESLint warnings dans certains fichiers (voir warnings de build)

### Pour un Audit de Sécurité
- ✅ HTTPS/TLS sur tous les transports
- ✅ Secrets en env vars (jamais dans le code)
- ✅ .env fichiers ignorés par Git
- ⚠️ Pas de rate limiting sur formulaires (spam vulnerability)
- ⚠️ Pas de CAPTCHA implémenté
- ⚠️ Données personnelles peuvent apparaître dans logs (30 jours)

### Pour un Audit RGPD
- ✅ Formulaires collectent minimum de données
- ✅ Pas de tracking cookies
- ✅ Pas de géolocalisation
- ✅ TLS encryption en transit
- ⚠️ Pas de consentement explicite (à ajouter)
- ⚠️ Rétention de données indéfinies (email provider)
- ⚠️ Pas de consentement pour services tiers (Gemini, translation)

## 💡 Questions Fréquentes

**Q: Où sont stockées les données des formulaires?**
R: Dans l'inbox email du destinataire (Gmail/SendGrid/SMTP), pas dans une DB d'app. Rétention indéfinie.

**Q: Comment fonctionne l'envoi de CV?**
R: Base64 encodé dans le payload JSON, décódé côté serveur, envoyé comme attachment MIME via Nodemailer.

**Q: Quels fournisseurs d'email sont supportés?**
R: Gmail (SMTP + App Password), Custom SMTP (Outlook, Yahoo, etc.), SendGrid API.

**Q: L'IA (Gemini) a-t-elle accès aux données utilisateur?**
R: Non, seulement le message de chat. Pas d'identifiants. Check Google policy pour log retention.

**Q: Comment les traductions vers le français se font-elles?**
R: LibreTranslate (gratuit, défaut) ou DeepL (payant). Les textes des formulaires sont traduits avant d'être envoyés.

**Q: Comment gérer la sécurité des clés API?**
R: Chaque clé est un env var Vercel (chiffré). Si fuite: rotation immédiate.

---

## 📞 Support

Pour des questions spécifiques:
- **Code & Architecture:** Consulter les fichiers src/ et api/
- **Données & Sécurité:** Voir DATA_HANDLING.md + SECURITY_NOTICE.md
- **Déploiement:** Voir DEPLOYMENT_GUIDE.md
- **Technologies:** Voir TECH_STACK.md

**Dernier audit:** Mars 2026
