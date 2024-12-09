require('dotenv').config();
const mongoose = require('mongoose');

// MongoDB-Verbindung herstellen
async function connectToDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Erfolgreich mit MongoDB verbunden');

        // Testdaten einfügen, falls noch keine Todos vorhanden sind
        const count = await Todo.countDocuments();
        if (count === 0) {
            console.log('Keine Todos gefunden. Testdaten werden hinzugefügt.');

            // Testdaten
            const todos = [
                { text: 'Python auffrischen', isComplete: false },
                { text: 'JavaScript üben', isComplete: false },
                { text: 'React lernen', isComplete: false },
            ];

            await Todo.insertMany(todos);
            console.log('Testdaten erfolgreich hinzugefügt');
        }
    } catch (err) {
        console.error('Fehler beim Verbinden mit MongoDB:', err.message);
        process.exit(1);
    }
}

// Datenbankschema für "todos"
const todoSchema = new mongoose.Schema({
    text: { type: String, required: true },
    isComplete: { type: Boolean, default: false },
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = { connectToDatabase, Todo };
