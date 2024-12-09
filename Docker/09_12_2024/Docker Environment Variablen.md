### Umgebungsvariablen in der Dockerfile

Wenn du in der Dockerfile `ENV` verwendest, um Umgebungsvariablen zu definieren, legst du **Standardwerte** fest. Diese Werte werden verwendet, **sofern** sie später zur Laufzeit nicht überschrieben werden. Das Festlegen von Umgebungsvariablen in der Dockerfile ist nützlich, weil:

- Es Standardwerte bereitstellt, die in den meisten Fällen funktionieren.
- Es hilfreich ist, wenn du das Docker-Image mit anderen teilst, die möglicherweise keine manuellen Umgebungsvariablen zur Laufzeit angeben möchten oder vergessen.
- Es sicherstellt, dass der Container mit funktionierenden Werten startet, auch wenn keine weiteren Konfigurationen vorgenommen werden.

Beispiel aus deiner Dockerfile:

```docker
ENV DB_USER=postgres
ENV DB_PASSWORD=yourpassword
ENV DB_HOST=postgres-db
ENV DB_PORT=5432
ENV DB_NAME=feedbackdb

```

### Umgebungsvariablen im `docker run` Befehl

Wenn du Umgebungsvariablen über den `docker run` Befehl mit der `-e`-Option übergibst, **überschreibst** du die in der Dockerfile angegebenen Standardwerte. Dies ist nützlich, wenn:

- Du das Verhalten des Containers basierend auf der Umgebung anpassen möchtest (z.B. verschiedene Konfigurationen für Entwicklung, Test, Produktion).
- Du sensible Werte (wie Datenbank-Passwörter) festlegen musst, die du nicht in die Dockerfile hartcodieren möchtest.

Beispiel aus dem `docker run` Befehl:

```bash
docker run --name feedback-app \\\\
  --network feedback-network \\\\
  -p 3000:3000 \\\\
  -e DB_USER=custom_user \\\\
  -e DB_PASSWORD=custom_password \\\\
  -e DB_HOST=custom_db_host \\\\
  -e DB_PORT=5432 \\\\
  -e DB_NAME=custom_feedbackdb \\\\
  -d feedback-app

```

### Überschreibt der Befehl die Werte der Dockerfile?

Ja, die Werte, die über den `docker run` Befehl übergeben werden, **überschreiben** die Standardwerte, die in der Dockerfile festgelegt wurden. Docker folgt dieser Priorität:

1. **Werte, die im `docker run` Befehl gesetzt werden**, haben die höchste Priorität.
2. **Werte, die in der Dockerfile mit `ENV` festgelegt wurden**, dienen als Standardwerte und werden verwendet, wenn zur Laufzeit keine Variablen übergeben werden.
3. Wenn keine Umgebungsvariablen gesetzt sind, verwendet die App entweder diese Standardwerte oder es tritt ein Fehler auf, falls bestimmte Variablen benötigt werden.

### Beispiel-Szenario

- Du setzt `ENV DB_USER=postgres` in der Dockerfile. Wenn du den Container ohne Überschreibung dieses Wertes baust und startest, verwendet der Container `postgres` als Datenbankbenutzer.
- Wenn du den Container mit `e DB_USER=custom_user` startest, verwendet der Container `custom_user` statt des in der Dockerfile festgelegten Wertes `postgres`.

### Zusammenfassung

- **Dockerfile**: Setzt Standard-Umgebungsvariablen, damit der Container mit minimaler Konfiguration funktioniert.
- **docker run Befehl**: Überschreibt diese Standardwerte mit umgebungsspezifischen Werten zur Laufzeit.

Dieser Ansatz bietet Flexibilität und stellt sicher, dass du dasselbe Image in verschiedenen Umgebungen (z.B. Entwicklung, Staging, Produktion) verwenden kannst, während du es bei Bedarf zur Laufzeit konfigurieren kannst.

## Feedback-App mit Umgebungsvariablen

### Aktualisiere den `feedback-app` Code

Stelle sicher, dass deine `feedback-app` die Umgebungsvariablen für die Verbindung zur PostgreSQL-Datenbank verwendet, wie im aktualisierten Anwendungscode gezeigt:

```jsx
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

```

Dieses Setup ermöglicht es der `feedback-app`, automatisch die in der `docker-compose.yml` angegebenen Verbindungsdetails für PostgreSQL zu verwenden.

### Aktualisierte Dockerfile für `feedback-app`

Wir müssen die Dockerfile aktualisieren, damit die Umgebungsvariablen für die Datenbankverbindung übergeben werden.

### Aktualisierte Dockerfile:

```docker
# Verwende das offizielle Node.js-Image
FROM node:18

# Setze das Arbeitsverzeichnis
WORKDIR /app

# Kopiere package.json und package-lock.json
COPY package*.json ./

# Installiere Abhängigkeiten
RUN npm install

# Kopiere den Rest der App-Dateien
COPY . .

# Stelle die App auf Port 3000 bereit
EXPOSE 3000

# Setze Standard-Umgebungsvariablen (können zur Laufzeit überschrieben werden)
ENV DB_USER=postgres
ENV DB_PASSWORD=yourpassword
ENV DB_HOST=postgres-db
ENV DB_PORT=5432
ENV DB_NAME=feedbackdb

# Starte die App
CMD ["npm", "start"]

```

Diese Dockerfile ermöglicht es, die Umgebungsvariablen bei Bedarf zur Laufzeit zu überschreiben.

### Aktualisierte Anleitung zur manuellen Verwendung des Docker-Netzwerks mit persistentem Volume

Hier ist eine aktualisierte Anleitung zur manuellen Verwendung eines Docker-Netzwerks mit dem hinzugefügten persistenten Volume für PostgreSQL und den Umgebungsvariablen für die Datenbankverbindung.

### Schritt 1: Erstelle ein Docker-Netzwerk

Erstelle ein benutzerdefiniertes Docker-Netzwerk, das sowohl die PostgreSQL- als auch die `feedback-app`-Container zur Kommunikation verwenden:

```bash
docker network create feedback-network
```

### Schritt 2: Erstelle ein persistentes Volume für PostgreSQL

Erstelle ein Volume, um die PostgreSQL-Daten persistent zu speichern:

```bash
docker volume create postgres-data
```

Dieses Volume stellt sicher, dass die PostgreSQL-Daten auf dem Host gespeichert werden und auch dann bestehen bleiben, wenn der Container entfernt wird.

### Schritt 3: Starte den PostgreSQL-Container mit persistentem Volume

Starte den PostgreSQL-Container und füge das persistente Volume hinzu, um die Daten zu speichern:

```bash
docker run --name postgres-db \\\\
  --network feedback-network \\\\
  -e POSTGRES_PASSWORD=yourpassword \\\\
  -e POSTGRES_DB=feedbackdb \\\\
  -v postgres-data:/var/lib/postgresql/data \\\\
  -p 5432:5432 \\\\
  -d postgres

```

- `-network feedback-network`: Verbindet den PostgreSQL-Container mit dem benutzerdefinierten Docker-Netzwerk.
- `v postgres-data:/var/lib/postgresql/data`: Verknüpft das persistente Volume `postgres-data` mit dem Datenverzeichnis von PostgreSQL.
- `e POSTGRES_PASSWORD=yourpassword`: Setzt das Passwort für den Benutzer `postgres`.
- `e POSTGRES_DB=feedbackdb`: Erstellt beim Start eine Datenbank mit dem Namen `feedbackdb`.
- `p 5432:5432`: Stellt PostgreSQL auf Port 5432 bereit.

### Schritt 4: Baue und starte den `feedback-app`Container mit Umgebungsvariablen

Baue deinen `feedback-app`-Container:

```bash
docker build -t feedback-app .

```

Starte dann den `feedback-app`-Container im selben Netzwerk wie PostgreSQL und übergebe die erforderlichen Umgebungsvariablen:

```bash
docker run --name feedback-app \\\\
  --network feedback-network \\\\
  -p 3000:3000 \\\\
  -e DB_USER=postgres \\\\
  -e DB_PASSWORD=yourpassword \\\\
  -e DB_HOST=postgres-db \\\\
  -e DB_PORT=5432 \\\\
  -e DB_NAME=feedbackdb \\\\
  -d feedback-app

```

- `-network feedback-network`: Stellt sicher, dass die `feedback-app` mit dem PostgreSQL-Container kommunizieren kann.
- `e DB_USER=postgres`: Übergibt den PostgreSQL-Benutzernamen als Umgebungsvariable.
- `e DB_PASSWORD=yourpassword`: Übergibt das PostgreSQL-Passwort.
- `e DB_HOST=postgres-db`: Übergibt den Hostnamen des PostgreSQL-Containers.
- `e DB_PORT=5432`: Übergibt den Port des PostgreSQL-Containers.
- `e DB_NAME=feedbackdb`: Übergibt den Namen der Datenbank.

### Schritt 5: Überprüfe die persistente Speicherung

Du kannst den Inhalt des persistenten Volumes mit folgendem Befehl überprüfen:

```bash
docker volume inspect postgres-data

```

Wenn du den `postgres-db`-Container stoppst und entfernst, bleiben die Daten im Volume `postgres-data` gespeichert.

### Schritt 6: Stoppe und entferne die Container (optional)

Um die Container zu stoppen und zu entfernen, wenn du fertig bist, verwende:

```bash
docker stop postgres-db feedback-app
docker rm postgres-db feedback-app

```

Die PostgreSQL-Daten bleiben im Volume `postgres-data` gespeichert.

### Schritt 7: Entferne das Volume (optional)

Falls du das persistente Volume entfernen und die gespeicherten Daten löschen möchtest, führe folgenden Befehl aus:

```bash
docker volume rm postgres-data

```

### Fazit

Dieses Setup verwendet Umgebungsvariablen für alle Datenbankverbindungsdetails in der `feedback-app`, sorgt dafür, dass PostgreSQL-Daten mithilfe eines Docker-Volumes persistent gespeichert werden, und verbindet die beiden Container über ein benutzerdefiniertes Docker-Netzwerk. Du kannst nun beide Container einfach verwalten und die Datenbankverbindungsdetails auf umgebungsspezifische Weise konfigurieren.