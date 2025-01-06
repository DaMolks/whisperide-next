# 🌟 WhisperIDE

<div align="center">

*Un environnement de développement moderne propulsé par l'IA*

[![Electron](https://img.shields.io/badge/Electron-47848F?style=for-the-badge&logo=electron&logoColor=white)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

</div>

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 16 ou supérieur
- npm ou yarn
- Git

### Installation pour le Développement

1. Cloner le repository
```bash
git clone https://github.com/DaMolks/whisperide-next.git
cd whisperide-next
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer l'environnement
```bash
cp .env.example .env
# Éditer .env avec vos configurations
```

4. Lancer en mode développement
```bash
npm run dev
```

### Compilation pour la Production

1. S'assurer d'avoir les clés OAuth GitHub

2. Compiler l'application
```bash
GITHUB_CLIENT_ID=votre_id GITHUB_CLIENT_SECRET=votre_secret npm run package
```

Les fichiers compilés seront disponibles dans le dossier `release`.

## 📝 Configuration

### GitHub OAuth

1. Créer une nouvelle OAuth App sur GitHub :
   - Aller sur GitHub → Settings → Developer settings → OAuth Apps
   - Cliquer sur "New OAuth App"
   - Remplir les informations :
     - Application name: WhisperIDE
     - Homepage URL: https://github.com/DaMolks/whisperide-next
     - Authorization callback URL: whisperide://oauth/callback

2. Obtenir les clés :
   - Client ID : Visible directement
   - Client Secret : Générer un nouveau secret

3. Utiliser pour la compilation :
```bash
GITHUB_CLIENT_ID=xxx GITHUB_CLIENT_SECRET=yyy npm run package
```

## 🛠️ Développement

### Structure du Projet

```
whisperide-next/
├── electron/        # Code principal Electron
├── src/             # Code React
├── shared/          # Types et configs partagés
├── scripts/         # Scripts utilitaires
└── tests/           # Tests
```

### Commandes Disponibles

- `npm run dev` : Lancer en mode développement
- `npm run build` : Compiler le code
- `npm run package` : Créer l'exécutable
- `npm test` : Lancer les tests
- `npm run lint` : Vérifier le code
- `npm run format` : Formater le code

## 📚 Documentation

- [Guide de contribution](CONTRIBUTING.md)
- [Documentation technique](docs/ARCHITECTURE.md)
- [Feuille de route](ROADMAP.md)

## 🤝 Contribution

Les contributions sont les bienvenues ! Consultez notre guide de contribution pour commencer.

## 📄 Licence

MIT
