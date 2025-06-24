# Self Hosting the Modded Game

This repository can be served locally or from GitHub Pages. To play the modded version locally you will need Node.js installed.

```bash
npm install
npm run serve
```

This starts a local web server at `http://localhost:4400`.

To deploy to GitHub Pages you can run:

```bash
npm run deploy
```

The command copies the needed game files into a `dist/` directory and publishes it to the `gh-pages` branch. Once the branch is published you can enable GitHub Pages in your repository settings and the game will be available from `https://<your username>.github.io/<repository>/`.
