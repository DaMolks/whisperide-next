# Guide d'Installation

## Installation pour le Développement

### 1. Configuration de l'Environnement

```bash
# Cloner le repo
git clone https://github.com/DaMolks/whisperide-next.git
cd whisperide-next

# Installer les dépendances
npm install

# Copier et configurer l'environnement
cp .env.example .env
```

### 2. Configuration OAuth GitHub

1. Créer une nouvelle OAuth App sur GitHub :
   - Aller sur GitHub → Settings → Developer settings → OAuth Apps
   - Nouveau OAuth App
   - Remplir :
     - Application name: WhisperIDE
     - Homepage URL: https://github.com/DaMolks/whisperide-next
     - Authorization callback URL: whisperide://oauth/callback

2. Copier les clés dans votre .env :
```env
GITHUB_CLIENT_ID=votre_client_id
GITHUB_CLIENT_SECRET=votre_client_secret
```

### 3. Lancement

```bash
# Mode développement
npm run dev

# Tests
npm test

# Lint
npm run lint
```

## Compilation pour la Production

```bash
# Compilation avec les clés OAuth
GITHUB_CLIENT_ID=xxx GITHUB_CLIENT_SECRET=yyy npm run package
```

Les fichiers compilés seront dans le dossier `release`.

## Structure du Projet

```
whisperide-next/
├── electron/        # Code Electron
├── src/             # Code React
├── shared/          # Types partagés
├── scripts/         # Scripts
└── tests/           # Tests
```

## Dépannage

### Problèmes Courants

1. **Erreur de compilation TypeScript**
   ```bash
   npm run build:types
   ```

2. **Erreur OAuth**
   - Vérifier les clés dans .env
   - Vérifier l'URL de callback

3. **Erreur Electron**
   ```bash
   npm run clean
   npm install
   ```