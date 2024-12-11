

# **Anleitung: Verbindung zwischen Node.js und MongoDB in Docker-Containern**

Diese Anleitung zeigt dir, wie du MongoDB und Node.js entweder auf einem Host-System oder innerhalb von Docker-Containern einrichtest, um miteinander zu kommunizieren. Es werden zwei Szenarien behandelt:

1. **Node.js auf dem Host-System und MongoDB im Docker-Container**
2. **Sowohl Node.js als auch MongoDB in Docker-Containern**

---

## **Szenario 1: Node.js auf dem Host-System, MongoDB im Docker-Container**


### 2. **Connection-String in Node.js anpassen**

Ändere den Connection-String in deiner Node.js-App (z. B. `app.js`), um `localhost` statt `mongo-container` zu verwenden:

```javascript
mongoose.connect(
  'mongodb://root:rootpassword@localhost:27017/todos?authSource=admin',
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      console.error("Fehler bei der Verbindung zu MongoDB:", err);
    } else {
      console.log("Verbindung zu MongoDB hergestellt");
    }
  }
);
```

---

## **Szenario 2: Sowohl Node.js als auch MongoDB in Docker-Containern**

Für dieses Szenario müssen beide Container in einem gemeinsamen Netzwerk laufen.

### 1. **Docker-Netzwerk erstellen**

Erstelle ein Docker-Netzwerk, das beiden Containern ermöglicht, miteinander zu kommunizieren:

```bash
docker network create app-network
```

### 2. **MongoDB-Container im Netzwerk starten**

Stoppe den MongoDB-Container und starte ihn im neuen Netzwerk:

```bash
docker stop mongo-container
docker rm mongo-container
docker run -d \
  --name mongo-container \
  --network app-network \
  -e MONGO_INITDB_ROOT_USERNAME=root \
  -e MONGO_INITDB_ROOT_PASSWORD=rootpassword \
  -e MONGO_INITDB_DATABASE=todos \
  -p 27017:27017 \
  mongo:latest
```

### 3. **Dockerfile für Node.js-Anwendung erstellen**

Erstelle ein Dockerfile für die Node.js-Anwendung:

```Dockerfile
# Verwende ein offizielles Node.js-Image
FROM node:16

# Arbeitsverzeichnis setzen
WORKDIR /app

# Paketdefinitionen kopieren und Abhängigkeiten installieren
COPY package*.json ./ 
RUN npm install

# Anwendungscode kopieren
COPY . .

# Port öffnen
EXPOSE 3000

# Startbefehl für die Anwendung
CMD ["node", "app.js"]
```

### 4. **Docker-Image für Node.js-Anwendung erstellen**

Erstelle das Docker-Image für deine Node.js-Anwendung:

```bash
docker build -t node-app .
```

### 5. **Node.js-Container im Netzwerk starten**

Starte den Node.js-Container und verbinde ihn mit dem Netzwerk:

```bash
docker run -d \
  --name node-container \
  --network app-network \
  -e MONGO_URI=mongodb://root:rootpassword@mongo-container:27017/todos?authSource=admin \
  -p 3000:3000 \
  node-app
```

### 6. **Verbindung zu MongoDB testen**

In deiner `app.js` solltest du den `MONGO_URI` aus den Umgebungsvariablen verwenden:

```javascript
const mongoose = require('mongoose');

const mongoURI = process.env.MONGO_URI;

mongoose.connect(
  mongoURI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      console.error("Fehler bei der Verbindung zu MongoDB:", err);
    } else {
      console.log("Verbindung zu MongoDB hergestellt");
    }
  }
);
```

### 7. **Container-Status überprüfen**

Stelle sicher, dass beide Container im selben Netzwerk laufen:

```bash
docker ps
docker network inspect app-network
```

### 8. **API testen**

Öffne die API in deinem Browser oder mit einem Tool wie Postman:

```
http://localhost:3000
```

Hinzufügen Daten

```javascript
mongoose.connection.once('open', async () => {
  console.log('MongoDB-Verbindung ist aktiv.');
    // Prüfen, ob es bereits Todos in der Datenbank gibt
    const existingTodos = await Todo.find();
    if (existingTodos.length === 0) {
      // Testdaten einfügen, falls die Kollektion leer ist
      await Todo.insertMany([
        { id: Guid.newGuid(), description: 'Testaufgabe 1', isCompleted: false },
        { id: Guid.newGuid(), description: 'Testaufgabe 2', isCompleted: true },
      ]);
      console.log('Testdaten hinzugefügt.');
    } else {
      console.log('Testdaten bereits vorhanden. Keine neuen hinzugefügt.');
    }
});

```
---

## **Verwendung von `.env`-Dateien für Konfiguration**

Um MongoDB-Verbindungsdaten und andere sensible Informationen zu speichern, kannst du die Umgebungsvariablen in einer `.env`-Datei speichern.

### 1. **Installieren des `dotenv`-Moduls**

Installiere das `dotenv`-Modul in deinem Projekt:

```bash
npm install dotenv
```

### 2. **Erstellen der `.env`-Datei**

Erstelle eine `.env`-Datei im Stammverzeichnis deiner Anwendung und füge die MongoDB-Verbindungsdaten hinzu:

```ini
MONGO_URI=mongodb://root:rootpassword@mongo-container:27017/todos?authSource=admin
```

Stelle sicher, dass die `.env`-Datei in deiner `.gitignore`-Datei enthalten ist, um sie aus der Versionskontrolle auszuschließen.

### 3. **Verwendung der `.env`-Datei in Node.js**

Lade die Umgebungsvariablen zu Beginn deiner `app.js`:

```javascript
require('dotenv').config();

const mongoose = require('mongoose');

mongoose.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      console.error("Fehler bei der Verbindung zu MongoDB:", err);
    } else {
      console.log("Verbindung zu MongoDB hergestellt");
    }
  }
);
```

### 4. **Docker-Container mit `.env`-Datei starten**

Wenn du die `.env`-Datei in einem Docker-Container verwenden möchtest, kannst du sie beim Starten des Containers mit der Option `--env-file` angeben:

```bash
docker run --env-file .env -d --name node-container --network app-network -p 3000:3000 node-app
```

---

## **Zusammenfassung**

### **Szenario 1: Node.js auf dem Host, MongoDB im Container**

1. Starte MongoDB mit `-p 27017:27017`.
2. Verwende `localhost` im MongoDB-Verbindungs-String in Node.js.
3. Teste die Verbindung 

### **Szenario 2: Beide in Docker-Containern**

1. Erstelle ein Docker-Netzwerk und verbinde beide Container damit.
2. Erstelle Dockerfiles für beide Container.
3. Starte die Container und teste die API.

### **Verwendung von `.env`-Dateien**

1. Installiere `dotenv` und speichere die MongoDB-Verbindungsdaten in einer `.env`-Datei.
2. Nutze die Umgebungsvariablen in deiner Node.js-App.
3. Binde die `.env`-Datei in Docker-Containern ein.

Mit diesen Schritten kannst du MongoDB und Node.js in verschiedenen Konfigurationen und Umgebungen miteinander verbinden.

---

## **Verwendung von `.env`-Dateien für MongoDB-Container**

### 1. **Erstellen einer `.env`-Datei für den MongoDB-Container**

Erstelle eine `.env`-Datei (oder erweitere eine bestehende) und füge die benötigten Umgebungsvariablen hinzu. Beispiel:

```ini
MONGO_INITDB_ROOT_USERNAME=root
MONGO_INITDB_ROOT_PASSWORD=rootpassword
MONGO_INITDB_DATABASE=todos
```

### 2. **Docker-Container mit der `.env`-Datei starten**

Um diese Variablen in Docker zu verwenden, musst du die `.env`-Datei beim Starten des MongoDB-Containers angeben:

```bash
docker stop mongo-container
docker rm mongo-container
docker run -d \
  --name mongo-container \
  --network app-network \
  --env-file .env \
  -p 27017:27017 \
  mongo:latest
```

Dieser Befehl liest die Umgebungsvariablen aus der `.env`-Datei und startet den MongoDB-Container mit den konfigurierten Umgebungsvariablen.

So kannst du sicherstellen, dass deine MongoDB-Instanz mit den richtigen Konfigurationswerten aus der `.env`-Datei gestartet wird.