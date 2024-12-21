import sqlite3
from typing import Dict, List

class DatabaseService:
    def __init__(self):
        self.conn = sqlite3.connect(':memory:', check_same_thread=False)
        self.create_tables()
    
    def create_tables(self):
        cursor = self.conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                sender_id TEXT NOT NULL,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        self.conn.commit()

    def save_message(self, sender_id: str, content: str) -> Dict:
        cursor = self.conn.cursor()
        cursor.execute(
            'INSERT INTO messages (sender_id, content) VALUES (?, ?)',
            (sender_id, content)
        )
        self.conn.commit()
        return {
            'id': cursor.lastrowid,
            'sender_id': sender_id,
            'content': content
        }

    def get_messages(self) -> List[Dict]:
        cursor = self.conn.cursor()
        cursor.execute('SELECT * FROM messages')
        messages = cursor.fetchall()
        return [
            {
                'id': msg[0],
                'sender_id': msg[1],
                'content': msg[2],
                'created_at': msg[3]
            }
            for msg in messages
        ]

db = DatabaseService()