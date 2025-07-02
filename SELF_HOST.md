# Self Hosting the Modded Game

This repository can be served locally or from GitHub Pages. To play the modded version locally you will need Node.js installed.

On Windows you can simply run `start.bat` located in the project root. The script installs the required dependencies and then launches the local server for you.
If you'd rather run the commands yourself, use the following:

```bash
npm install
npm run build   # use `npm run build-win` on Windows
npm run serve
```

This starts a local web server at `http://localhost:4400`.

To deploy to GitHub Pages you can run:

```bash
npm run deploy
```

The command copies the needed game files into a `dist/` directory and publishes it to the `gh-pages` branch. Once the branch is published you can enable GitHub Pages in your repository settings and the game will be available from `https://<your username>.github.io/<repository>/`.
