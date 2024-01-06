import sqlite3


class DBInterface:
    """":memory:" 는 서버의 메모리안의 DB(테스트용)"""
    DB_NAME = "test.db"

    def __init__(self):
        self.connection = None
        self.cursor = None

    def connect(self):
        self.connection = sqlite3.connect(self.DB_NAME)
        self.cursor = self.connection.cursor()

    def disconnect(self):
        self.connection.close()
        self.connection = None
        self.cursor= None

    def execute_query(self, query, *param):
        """결과값 반환 X"""
        self.cursor.execute(query, param)
        self.connection.commit()

    def fetch_query(self, query, *param):
        """결과값 반환 O"""
        self.cursor.execute(query, param)
        return self.cursor.fetchall()


_initialized = False


def initialize_once():
    global _initialized
    if _initialized:
        return

    db = DBInterface()
    db.connect()

    db.execute_query("""
        CREATE TABLE IF NOT EXISTS Category (
            category_id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            crt DATETIME DEFAULT CURRENT_TIMESTAMP,
            amd DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    """)
    db.execute_query("""
        CREATE TABLE IF NOT EXISTS POST (
            post_id INTEGER PRIMARY KEY AUTOINCREMENT,
            category_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            crt DATETIME DEFAULT CURRENT_TIMESTAMP,
            amd DATETIME DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT category_fk FOREIGN KEY (category_id)
            REFERENCES Category(category_id) ON DELETE CASCADE
        );
    """)

    schema = db.fetch_query("SELECT * FROM sqlite_schema;")
    for s in schema:
        print(s[4])

    db.disconnect()
    _initialized = True


initialize_once()

