# Installazione e setup su Windows

*Per lo sviluppo di applicazioni Web3 su Internet Computer*

---

## Requisiti

* **Sistema operativo**

  * Windows 10 (versione 2004 o superiore, build 19041.xxx o superiore), oppure
  * Windows 11

* **Architettura**

  * PC a 64 bit (System type: x64-based)

---

## 1. Installazione di WSL (Windows Subsystem for Linux)

1. Apri il **menu Start**, cerca **Windows PowerShell**, fai clic con il tasto destro e seleziona
   **Esegui come amministratore**.

2. WSL (Windows Subsystem for Linux) permette di eseguire un ambiente Linux all’interno di Windows.
   Documentazione ufficiale:
   [https://learn.microsoft.com/windows/wsl/install](https://learn.microsoft.com/windows/wsl/install)

3. In PowerShell (come amministratore), esegui:

   ```powershell
   wsl --install
   ```

4. Al termine dell’installazione, **riavvia** il computer quando richiesto.

5. Al riavvio, verrà avviata la configurazione di **Ubuntu**:

   * scegli uno **username** Linux;

   * imposta una **password**.

   > Nota: mentre digiti la password non verrà visualizzato nulla, ma i caratteri saranno comunque registrati.

6. Per verificare che tutto sia installato correttamente, in PowerShell esegui:

   ```powershell
   wsl --list --verbose
   ```

   Dovresti vedere **Ubuntu** tra le distribuzioni installate.

---

## 2. Installazione di Visual Studio Code e estensioni

1. Scarica e installa l’ultima versione di **Visual Studio Code**:
   [https://code.visualstudio.com/](https://code.visualstudio.com/)
2. Apri VS Code e installa le seguenti estensioni:

   * **Motoko** (DFINITY):
     [https://marketplace.visualstudio.com/items?itemName=dfinity-foundation.vscode-motoko](https://marketplace.visualstudio.com/items?itemName=dfinity-foundation.vscode-motoko)

   * **Remote – WSL**:
     [https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-wsl](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-wsl)

   L’estensione *Remote – WSL* consente di lavorare direttamente nei file all’interno di Ubuntu/WSL.

---

## 3. Installazione di Node.js (tramite Homebrew su Ubuntu/WSL)

1. Dal menu Start, apri **Ubuntu** (distribuzione installata con WSL).

2. Nel terminale Ubuntu, installa **Homebrew**:

   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

   > In alternativa, puoi copiare il comando aggiornato direttamente dal sito ufficiale: [https://brew.sh/](https://brew.sh/)

3. Quando richiesto, inserisci la **password** dell’utente Ubuntu creato in precedenza.

4. Al termine, l’installer mostrerà dei comandi per aggiungere **brew** al tuo `PATH`.
   Eseguili tutti, uno alla volta. In genere sono simili a:

   ```bash
   echo 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"' >> ~/.profile
   eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"
   ```

5. Installa i pacchetti di base:

   ```bash
   sudo apt-get update
   sudo apt-get install build-essential
   ```

6. Verifica che Homebrew sia installato correttamente:

   ```bash
   brew --version
   ```

7. Installa **Node.js 18** (versione minima) tramite Homebrew:

   ```bash
   brew install node@18
   ```

8. Se hai altre versioni di Node installate, collega esplicitamente questa versione:

   ```bash
   brew link node@18
   ```

9. Controlla versione di Node.js e npm:

   ```bash
   node --version
   npm --version
   ```

   Assicurati che `node` sia almeno alla versione **18.x**.

---

## 4. Installazione di DFX (SDK Internet Computer)

1. Apri **Ubuntu** da Start (se non è già aperto).

2. Installa il **DFX SDK** eseguendo:

   ```bash
   sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
   ```

   (Script ufficiale per il toolkit di sviluppo dell’Internet Computer.)

3. Al termine dell’installazione, l’installer mostrerà il percorso di `dfx`, ad esempio:

   ```text
   dfx è stato installato in: /home/<username>/.local/share/dfx/bin
   ```

4. Verifica che `dfx` sia nel `PATH`:

   ```bash
   which dfx
   ```

   Se non restituisce nulla, aggiungi manualmente il percorso, ad esempio:

Aggiungi dfx al PATH:
    ```bash
    export PATH=$PATH:$HOME/.local/share/dfx/bin
    ```

    Verifica che sia stato aggiunto eseguendo:
    ```bash
    echo "${PATH//:/$'\n'}"
    ```

5. Controlla che `dfx` sia disponibile:

   ```bash
   dfx --version
   ```

---

## 5. Test dell’ambiente con il progetto di esempio “hello”

> Questa sezione è facoltativa ma consigliata per verificare che l’ambiente sia configurato correttamente.

1. In Ubuntu, crea una cartella di lavoro:

   ```bash
   mkdir ic-projects
   cd ic-projects
   ```

2. Crea il progetto di esempio:

   ```bash
   dfx new hello
   ```

3. Visualizza i file del progetto in Esplora File (Windows):

   ```bash
   explorer.exe .
   ```

4. Apri **VS Code**, clicca sull’icona verde in basso a sinistra (Remote) e scegli
   **“New WSL Window”**.

5. Nella nuova finestra di VS Code:

   * apri la cartella `ic-projects/hello`;
   * verifica che l’estensione **Remote – WSL** sia installata in **WSL: Ubuntu** (andare in estensioni e cliccare "Install in WSL: Ubuntu");
   
   * esplora la cartella `src`: il file `main.mo` contiene il codice Motoko principale.

### Deploy del DApp di esempio

1. In VS Code, apri un terminale integrato: **Terminal → New Terminal**.
   Assicurati di trovarti nella cartella `hello`.

2. Avvia la replica locale dell’Internet Computer:

   ```bash
   dfx start
   ```

   Attendi finché non compare una riga simile a:

   ```text
   INFO Starting server. Listening on 127.0.0.1:4943
   ```

3. Apri un **secondo terminale** (split del terminale VS Code) e, sempre nella cartella `hello`, esegui:

   ```bash
   dfx deploy
   ```

4. Al termine del deploy, avvia il frontend di sviluppo:

   ```bash
   npm start
   ```

5. Apri il browser sull’indirizzo indicato in console (di solito:
   `http://localhost:3000` oppure `http://localhost:8080`).

Se visualizzi la pagina di esempio, l’ambiente è configurato correttamente.

---

## 6. Scaricare e avviare il progetto

### 6.1 Prerequisiti

Assicurati che siano installati e funzionanti:

* **DFX SDK**

  * Documentazione ufficiale:
    [https://internetcomputer.org/docs/current/developer-docs/setup/install](https://internetcomputer.org/docs/current/developer-docs/setup/install)
  * Verifica:

    ```bash
    dfx --version
    ```

* **Node.js** (versione **≥ 18.0.0**)

  * Verifica:

    ```bash
    node --version
    npm --version
    ```

### 6.2 Clonare il repository da GitHub

1. In Ubuntu, vai nella cartella dove vuoi salvare il progetto, ad esempio:

   ```bash
   cd ~/ic-projects
   ```

2. Clona il repository:

   ```bash
   git clone <URL_DEL_REPOSITORY>
   ```

3. Entra nella cartella del progetto (ad esempio `dkeeper`):

   ```bash
   cd dkeeper
   ```

### 6.3 Installare le dipendenze npm

1. Installa le dipendenze del progetto:

   ```bash
   npm install
   ```

---

## 7. Avvio del progetto in locale

### Opzione A – Avvio completo (backend + frontend)

Avvia sia la replica locale IC, sia il frontend di sviluppo.

```bash
# Avvia la replica IC (in foreground)
dfx start
```

In un **secondo terminale**, sempre nella cartella del progetto:

```bash
# Deploy dei canister e generazione delle interfacce
dfx deploy

# Avvia il server di sviluppo frontend
npm start
```

* L’indirizzo del frontend (es. `http://localhost:8080` o `http://localhost:3000`) viene mostrato nel terminale al momento dell’avvio di `npm start`.

### Opzione B – Solo backend (replica + canister)

Se ti interessa solo il backend (canister) e non il frontend di sviluppo:

```bash
# Avvia la replica in background
dfx start --background

# Esegui il deploy dei canister
dfx deploy
```

L’applicazione sarà disponibile tramite la replica locale su:

```text
http://localhost:4943/?canisterId={asset_canister_id}
```

dove `{asset_canister_id}` è l’ID del canister degli asset (visualizzato in output da `dfx deploy`).

---

## 8. Comandi utili

* **Rigenerare le interfacce Candid** (se previsto negli script del progetto):

  ```bash
  npm run generate
  ```

* **Fermare la replica locale**:

  ```bash
  dfx stop
  ```

* **Visualizzare l’help di DFX**:

  ```bash
  dfx help
  ```

---

## 9. Note importanti

* La **prima esecuzione** di `dfx start` può richiedere qualche minuto per il download e l’inizializzazione delle componenti necessarie.
* Se modifichi il **backend** (Motoko o Rust), ricorda di eseguire nuovamente:

  ```bash
  dfx deploy
  ```

  per aggiornare i canister.
* Il comando `npm start` avvia un **server di sviluppo** con hot-reload: le modifiche al codice frontend vengono ricaricate automaticamente nel browser.
* È consigliato eseguire tutti i comandi (`dfx`, `npm`, `git`, ecc.) **all’interno di Ubuntu/WSL**, per evitare problemi di compatibilità tra ambiente Windows e ambiente Linux.
