from db_interface import DBInterface


class BoardAccess:
    """DAO: DATA ACCESS OBJECT"""
    @staticmethod
    def find_category_by_id(category_id):
        db = DBInterface()
        db.connect()

        result = db.fetch_query(f"""
            SELECT category_id,
                title,
                datetime(crt, 'localtime'),
                datetime(amd, 'localtime')
            FROM Category
            WHERE category_id = {category_id};
        """)

        db.disconnect()

        if len(result) == 0:
            return None

        return {
            'category_id': result[0][0],
            'title': result[0][1],
            'crt': result[0][2],
            'amd': result[0][3]
        }

    @staticmethod
    def create_category(title):
        db = DBInterface()
        db.connect()

        db.execute_query(f"""
            INSERT INTO Category (title) 
            VALUES ('{title}')
        """)

        db.disconnect()


print(BoardAccess.find_category_by_id(1))


#의도하지 않은 동작
print(BoardAccess.find_category_by_id("0 OR title LIKE '%자유게시판%'"))