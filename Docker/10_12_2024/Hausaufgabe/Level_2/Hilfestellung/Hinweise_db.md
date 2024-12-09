
```pseudocode
Lade Umgebungsvariablen aus ".env" Datei

VERSUCHE
    Verbinde mit MongoDB unter Verwendung der Umgebungsvariablen (MONGO_URI)
    Warte bis die Verbindung hergestellt ist
    Gib "Erfolgreich mit MongoDB verbunden" aus
    ZÄHLE alle Dokumente in der "Todo"-Datenbank
    WENN keine Todos existieren
        Füge Testdaten zu der Datenbank hinzu
        Gib "Testdaten erfolgreich hinzugefügt" aus
FANGE Fehler ab
    Gib "Fehler bei der Verbindung mit MongoDB" aus
    Beende das Programm

ERSTELLE ein Schema für Todos mit den Feldern:
    text (Pflichtfeld, Typ: String)
    isComplete (optional, Typ: Boolean, Standardwert: false)

ERSTELLE ein Modell basierend auf dem "Todo"-Schema

EXPORTIERE die Funktion zum Verbinden mit der Datenbank und das "Todo"-Modell
```


