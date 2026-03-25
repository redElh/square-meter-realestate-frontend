## 📖 Bienvenue dans l'Audit du Projet Square Meter Real Estate

Merci de votre intérêt ! Voici où trouver **rapidement** ce que vous cherchez.

---

## 🚀 Démarrage Rapide (5 min)

**Vous êtes:**

### 👔 Recruteur / Hiring Manager?
Allez à: **→ [DOCUMENTATION_GUIDE.md](DOCUMENTATION_GUIDE.md)** → Section « Recruteur »

Vous découvrirez:
- La qualité du code (TypeScript, React 19, patterns modernes)
- Les choix technologiques et leur justification
- L'architecture système
- La capacité à gérer la sécurité et la conformité

**Temps:** ~40 min

---

### 🔒 Audit de Sécurité / Conformité RGPD?
Allez à: **→ [DOCUMENTATION_GUIDE.md](DOCUMENTATION_GUIDE.md)** → Section « Audit de Conformité »

Vous y trouverez:
- **Exactement** où vont les données des formulaires (inbox email, indefini)
- Les modes de transmission (Gmail SMTP, Custom SMTP, SendGrid)
- Comment les données sont chiffrées (TLS) et où
- Conformité RGPD (Lawful Basis, User Rights, incidents)
- Points d'amélioration (consentement, rate-limiting, CAPTCHA)

**Documents clés:**
- [DATA_HANDLING.md](DATA_HANDLING.md) — Tout sur le stockage et la rétention
- [SECURITY_NOTICE.md](SECURITY_NOTICE.md) — Incident de fuite de clé API et corrections

**Temps:** ~30 min

---

### 💻 Développeur (Onboarding)?
Allez à: **→ [DOCUMENTATION_GUIDE.md](DOCUMENTATION_GUIDE.md)** → Section « Développeur »

Vous y trouverez:
- Structure du projet et navigation
- Comment modifier le code
- Les dépendances et leurs versions
- Comment déployer

**Documents clés:**
- [README.md](README.md) — Vue d'ensemble
- [ARCHITECTURE.md](ARCHITECTURE.md) — Flux système
- [TECH_STACK.md](TECH_STACK.md) — Toutes les dépendances
- `/api` folder — Endpoints (email, IA, google-reviews)
- `/src` folder — Code React

**Temps:** ~1h

---

## 📚 Tous les Documents Expliqués

| 📄 Fichier | ⏱️ Durée | 🎯 Objectif |
|-----------|--------|-----------|
| **[DOCUMENTATION_GUIDE.md](DOCUMENTATION_GUIDE.md)** | 5 min | **← COMMENCEZ PAR LÀ** Vous guide vers les bons documents |
| **[README.md](README.md)** | 5 min | Vue d'ensemble du projet |
| **[ARCHITECTURE.md](ARCHITECTURE.md)** | 10 min | Comment les composants (frontend, API, services) interagissent |
| **[TECH_STACK.md](TECH_STACK.md)** | 15 min | Technologies utilisées (React, Tailwind, Nodemailer, Vercel, etc.) |
| **[DATA_HANDLING.md](DATA_HANDLING.md)** | 20 min | **CRUCIAL pour audit** Où vont les données, comment elles sont envoyées, conservées |
| **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** | 10 min | Comment déployer sur Vercel |
| **[SECURITY_NOTICE.md](SECURITY_NOTICE.md)** | 5 min | Incident de fuite résolu (clé Gemini), bonnes pratiques |

---

## 🔑 Points Clés à Comprendre

### 💌 Comment Fonctionnent les Formulaires (Inquiry, Careers, Contact)

```
Utilisateur remplit formulaire
    ↓ (HTTPS POST)
Serveur Vercel reçoit les données
    ↓
Traduit en français (si langue ≠ FR)
    ↓
Envoie par email via:  Gmail SMTP  OU  Custom SMTP  OU  SendGrid
    ↓
Arrive dans l'inbox du destinataire
    ↓ (INDEFINI - pas de DB d'app)
```

**⚠️ Important:** Les données ne sont **PAS stockées** dans une base de données de l'app. Elles vont directement à l'email recipient. Rétention: voir [DATA_HANDLING.md](DATA_HANDLING.md)

### 🌍 Langues Supportées
- Français (FR)
- Anglais (EN)
- Espagnol (ES)
- Allemand (DE)
- Arabe (AR)
- Russe (RU)

### 🤖 IA Assistant (Chatbot)
- Powered by: Google Gemini API
- Stateless (pas de conversation logs de l'app)
- Message texts sent to Google (check their privacy policy)

### 📊 Données Collectées dans les Logs
- IP address
- Timestamp
- User-Agent
- Rétention: 30 jours (Vercel auto-purge)
- ⚠️ Peut contenir PII (emails, etc)

---

## ✅ Checklist pour Votre Audit

### Sécurité
- [ ] HTTPS/TLS utilisé partout
- [ ] API keys en environment variables (jamais dans le code)
- [ ] .env fichiers ignorés par Git
- [ ] Fuite historique (clé Gemini) bien documentée et résolvie
- ⚠️ [ ] Pas de rate-limiting sur formulaires (considérer l'ajouter)
- ⚠️ [ ] Pas de CAPTCHA (considérer l'ajouter pour spam protection)

### Conformité RGPD
- [ ] Données collectées minimales (what's necessary)
- [ ] Pas de tracking cookies
- [ ] Pas de géolocalisation
- [ ] TLS chiffrement en transit
- ⚠️ [ ] Pas de consentement explicite (recommandé: ajouter checkbox)
- ⚠️ [ ] Users peuvent demander effacement (processus manuel 5-10j)

### Qualité Code
- [ ] TypeScript pour type-safety
- [ ] React 19 moderne avec patterns actuels
- [ ] Tailwind CSS (structure, maintenabilité)
- [ ] i18n framework complet (6 langues)
- [ ] ESLint ruleset appliqué
- ⚠️ [ ] Quelques warnings ESLint (voir npm run build)

### Infrastructure
- [ ] Vercel deployment (CDN, edge functions)
- [ ] Build produit toutes les 2-3 min
- [ ] Configuration envVars sécurisée
- [ ] vercel.json bien configuré (timeouts, memory)

---

## 📞 Questions Rapides

**Q: Où sont les données des utilisateurs?**
→ Dans l'inbox email du destinataire. Voir [DATA_HANDLING.md](DATA_HANDLING.md) section 3.

**Q: Est-ce RGPD-compliant?**
→ Respecte les principes. Recommandations d'amélioration dans [DATA_HANDLING.md](DATA_HANDLING.md) section 7.

**Q: Comment les CVs sont envoyés?**
→ Base64 → Nodemailer email attachment. Détails dans [DATA_HANDLING.md](DATA_HANDLING.md) section 2.

**Q: Quelles technologies recommanderiez-vous de changer?**
→ Aucune critique majeure. Voir [TECH_STACK.md](TECH_STACK.md) pour justification de chaque choix.

**Q: Y a-t-il des incidents de sécurité?**
→ Un seul (Jan 2026, clé Gemini). Bien géré et résolu. Voir [SECURITY_NOTICE.md](SECURITY_NOTICE.md).

---

## 🚀 Prochaines Étapes

1. **Lisez** [DOCUMENTATION_GUIDE.md](DOCUMENTATION_GUIDE.md) (oriente vers le bon chemin)
2. **Consultez** les fichiers de votre profil (Recruiter/Compliance/Developer)
3. **Vérifiez** les points de votre checklist ci-dessus
4. **Contactez** l'équipe pour questions spécifiques

---

**Créé:** Mars 2026  
**Statut:** Prêt pour audit externe  
**Questions?** Consultez [DOCUMENTATION_GUIDE.md](DOCUMENTATION_GUIDE.md) section « Support »
