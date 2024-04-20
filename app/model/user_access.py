from app.model.db_interface import DBInterface

class UserAccess:
    """
    회원 정보에 접근하는
    Database Access Object(DAO)
    """

    def create_user(self, user_id, byte_hashed_password):
        db = DBInterface()
        db.connect()

        db.execute_query("""
            INSERT INTO USER (id, pw)
            VALUES (?, ?)
        """, user_id, byte_hashed_password)

        db.disconnect()