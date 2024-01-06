from app.model.db_interface import DBInterface


class BoardAccess:
    """DAO: DATA ACCESS OBJECT"""
    def __init__(self):
        self.db = DBInterface()

    def find_all_category(self):
        self.db.connect()
        result = self.db.fetch_query("""
            SELECT category_id,
                   title,
                   datetime(crt, 'localtime'),
                   datetime(amd, 'localtime')
            FROM Category
            ORDER BY title
        """)
        self.db.disconnect()

        if len(result) == 0:
            return []

        for i in range(len(result)):
            result[i] = {
                'category_id': result[i][0],
                'title': result[i][1],
                'crt': result[i][2],
                'amd': result[i][3]
            }
        return result

    def find_category_by_id(self, category_id):
        self.db.connect()

        result = self.db.fetch_query("""
            SELECT category_id,
                title,
                datetime(crt, 'localtime'),
                datetime(amd, 'localtime')
            FROM Category
            WHERE category_id = ?;
        """, category_id)

        self.db.disconnect()

        if len(result) == 0:
            return None

        return {
            'category_id': result[0][0],
            'title': result[0][1],
            'crt': result[0][2],
            'amd': result[0][3]
        }

    def create_category(self, title):
        self.db.connect()

        self.db.execute_query("""
            INSERT INTO Category (title) 
            VALUES (?)
        """, title)

        self.db.disconnect()

