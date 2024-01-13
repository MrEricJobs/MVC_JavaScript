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

    def find_all_post(self, category_id):
        self.db.connect()
        result = self.db.fetch_query("""
                    SELECT post_id,
                           title,
                           content,
                           datetime(crt, 'localtime'),
                           view,
                           row_number() over(ORDER BY crt ASC)
                    FROM Post
                    WHERE category_id = ?
                    ORDER BY crt DESC
                """, category_id)
        self.db.disconnect()

        if len(result) == 0:
            return []

        for i in range(len(result)):
            result[i] = {
                'post_id': result[i][0],
                'title': result[i][1],
                'content': result[i][2],
                'crt': result[i][3],
                'view': result[i][4],
                'no': result[i][5]
            }
        return result

    def create_category(self, title):
        self.db.connect()

        self.db.execute_query("""
            INSERT INTO Category (title) 
            VALUES (?)
        """, title)

        self.db.disconnect()

    def create_post(self, category_id, title, content):
        self.db.connect()
        self.db.execute_query("""
            INSERT INTO Post(category_id, title, content)
            VALUES(?, ?, ?)
        """, category_id, title, content)
        self.db.disconnect()