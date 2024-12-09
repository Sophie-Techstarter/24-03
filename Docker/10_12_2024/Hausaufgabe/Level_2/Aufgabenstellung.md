### Teil 1: Setup für Node.js Backend mit MongoDB und Testdaten

Diese Aufgabe soll ereichen, dass du das Backend unserer To Do Anwendung mit MongoDB einrichtest und Testdaten beim ersten Start hinzufügst.
Am Ende soll es einen Docker-Container für die MongoDB und einen für das Backend geben.

---

### 1. **Installiere die notwendigen Abhängigkeiten**
Nutze statt der aktuellen `app.js` die Datei, die hier im Repo liegt. Sie ist ein wenig kürzer, da der Swagger Teil entfernt wurde. 
Ansonsten ist der Code gleich. 
- Zuerst müssen die Pakete für MongoDB installiert werden:

### 2. **Erstelle eine `.env`-Datei**

Erstelle eine `.env`-Datei im Stammverzeichnis des Projekts, um sensible Umgebungsvariablen zu speichern, z. B. die Verbindungsdaten zur MongoDB-Datenbank:

### 3. **Erstelle die MongoDB-Verbindung und Testdatenlogik**

Erstelle eine Datei `database.js`, um die Verbindung zu MongoDB herzustellen und Testdaten einzufügen:
Solltest du Hilfe hierfür brauchen, kannst du dir [hier](https://github.com/Sophie-Techstarter/24-03/blob/main/Docker/10_12_2024/Hausaufgabe/Level_2/Hilfestellung/Hinweise_db.md) Hilfe für die Datei suchen. 


Sollte auch das nicht ausreichen, darfst du dir gerne noch weitere Hilfe suchen.
Aber Achtung! Versuche es gerne erst einmal alleine. 

Bereit? Dann [hier]((https://github.com/Sophie-Techstarter/24-03/blob/main/Docker/10_12_2024/Hausaufgabe/Level_2/Hilfestellung/database.js) entlang.

### 4. **Backend-Server erstellen (Express API)**

Ändere die Datei `app.js` für das Node.js-Backend mit MongoDB ab. Hier werden die Routen definiert, um Todos zu erstellen, abzurufen, zu aktualisieren und zu löschen.

**Hinweis**

SQLite-spezifische Befehle wie CREATE TABLE, SELECT, INSERT werden durch MongoDB-Methoden wie find, create, findByIdAndUpdate ersetzt.
Die Logik für Datenbankoperationen wechselt von SQL zu Mongoose-Abfragen.

**CRUD-Operationen**
In SQLite wurden SQL-Befehle direkt genutzt:
- Abrufen: `db.all('SELECT * FROM todos')`
- Erstellen: `db.run('INSERT INTO todos (text, isComplete) VALUES (?, ?)')`
- Löschen: `db.run('DELETE FROM todos WHERE id = ?')`
- Aktualisieren: `db.run('UPDATE todos SET text = ?, isComplete = ? WHERE id = ?')`
In MongoDB werden Mongoose-Methoden genutzt:
- Abrufen: `Todo.find()`
- Erstellen: `Todo.create({ text, isComplete })`
- Löschen: `Todo.findByIdAndDelete(id)`
- Aktualisieren: `Todo.findByIdAndUpdate(id, { text, isComplete })`

  ### Zusammenfassung:

- **SQLite** ist eine **synchrone** Datenbank, bei der die meisten Operationen sofort abgeschlossen sind. Daher sind keine `await`-Befehle nötig, da der Code direkt nach der Operation fortgesetzt wird.
- **MongoDB** ist eine **asynchrone** Datenbank, die über das Netzwerk arbeitet. Hier wird `await` benötigt, um auf das Ergebnis der Datenbankoperationen zu warten, ohne den Programmablauf zu blockieren.

### Beispiele:

### SQLite (Synchron):
In diesem Beispiel nehmen wir an, wir arbeiten mit einer Datenbank für **Benutzer**:

```javascript
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('users.db');

// Abrufen aller Benutzer
app.get('/users', (req, res) => {
  db.all('SELECT * FROM users', (err, rows) => {
    if (err) res.status(500).send('Fehler beim Abrufen der Benutzer');
    else res.json(rows);  // Gibt eine Liste aller Benutzer zurück
  });
});

// Erstellen eines neuen Benutzers
app.post('/users', (req, res) => {
  db.run('INSERT INTO users (name, email) VALUES (?, ?)', [req.body.name, req.body.email], function (err) {
    if (err) res.status(500).send('Fehler beim Erstellen des Benutzers');
    else res.status(201).json({ id: this.lastID, name: req.body.name, email: req.body.email });  // Gibt den neu erstellten Benutzer zurück
  });
});
```

### MongoDB (Asynchron mit `await`):
Nun ein Beispiel für die Arbeit mit einer MongoDB-Datenbank, die **Produkte** speichert:

```javascript
const Product = require('./models/Product');

// Abrufen aller Produkte
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();  // Wartet auf die Abfrage der Produkte
    res.json(products);  // Gibt eine Liste aller Produkte zurück
  } catch (err) {
    res.status(500).send('Fehler beim Abrufen der Produkte');
  }
});

// Erstellen eines neuen Produkts
app.post('/products', async (req, res) => {
  try {
    const newProduct = await Product.create({ name: req.body.name, price: req.body.price });  // Wartet auf die Erstellung des Produkts
    res.status(201).json(newProduct);  // Gibt das neu erstellte Produkt zurück
  } catch (err) {
    res.status(500).send('Fehler beim Erstellen des Produkts');
  }
});
```


### 5. **MongoDB-Container starten**

Starte einen MongoDB-Container.

### 6. **Backend-Container bauen und starten**

Baue und starte das Backend in einem Docker-Container:

### 7. **Testdaten in der MongoDB-Datenbank prüfen**

Um sicherzustellen, dass die Testdaten in der MongoDB-Datenbank eingefügt wurden, kannst du die MongoDB-Shell oder ein GUI-Tool wie MongoDB Compass verwenden.

- Verbinde dich zur MongoDB-Shell:

```bash
mongo -u root -p deinPasswort --authenticationDatabase admin
```

- Wähle die Datenbank und überprüfe die Todos:

```bash
use todos_db;
db.todos.find();
```

Du solltest jetzt die eingefügten Testdaten sehen:

```json
[
  { "_id": "5f3d55b7b8b88d3c6b8a0c1e", "text": "Python auffrischen", "isComplete": false },
  { "_id": "5f3d55b7b8b88d3c6b8a0c1f", "text": "JavaScript üben", "isComplete": false },
  { "_id": "5f3d55b7b8b88d3c6b8a0c20", "text": "React lernen", "isComplete": false }
]
```

### 8. **API testen**

Jetzt kannst du die API testen, indem du zu `http://localhost:5000/todos` gehst (z. B. über Postman oder den Browser).

- **GET `/todos`**: Zeigt alle Todos an.
- **POST `/todos`**: Erstelle ein neues Todo.
- **PUT `/todos/:id`**: Aktualisiere ein bestehendes Todo.
- **DELETE `/todos/:id`**: Lösche ein Todo.

---

### Zusammenfassung:

1. **Installiere die notwendigen Node.js-Abhängigkeiten**: Express, Mongoose, CORS, dotenv, etc.
2. **Erstelle die `.env`-Datei** mit der MongoDB-Verbindungs-URL und Port.
3. **Erstelle eine `database.js`**-Datei für die MongoDB-Verbindung und das Hinzufügen von Testdaten.
4. **Erstelle die Express API** in `app.js` für CRUD-Operationen.
5. **Starte den MongoDB-Container** über Docker.
6. **Starte den Backend-Container**, verbinde ihn mit MongoDB und stelle sicher, dass die Testdaten hinzugefügt werden.
7. **Teste die API** lokal über `http://localhost:5000/todos`.

Jetzt hast du ein Node.js-Backend, das mit MongoDB verbunden ist und beim ersten Start automatisch Testdaten hinzufügt.

----

### Teil 2: Environment Variablen nutzen
Erreiche, dass der folgende Befehl 

```bash
docker run --name mongo-container \
 --network app-network
  -e MONGO_INITDB_ROOT_USERNAME=root \
  -e MONGO_INITDB_ROOT_PASSWORD=deinPasswort \
  -e MONGO_INITDB_DATABASE=todos_db \
  -p 27017:27017 \
  -d mongo:latest
```

ohne 

```bash
-e MONGO_INITDB_ROOT_USERNAME=root \
-e MONGO_INITDB_ROOT_PASSWORD=deinPasswort \
-e MONGO_INITDB_DATABASE=todos_db \
```

korrekt ausgeführt werden kann. Dokumentiere deine Schritte dazu.
