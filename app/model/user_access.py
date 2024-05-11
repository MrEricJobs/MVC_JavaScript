from app.model.db_interface import DBInterface

class UserAccess:
    """
    회원 정보에 접근하는
    Database Access Object(DAO)
    """

    def create_user(self, user_id, byte_hashed_password):
        """
        새로운 회원을 생성
        """
        db = DBInterface()
        db.connect()

        db.execute_query("""
            INSERT INTO User (id, pw)
            VALUES (?, ?)
        """, user_id, byte_hashed_password)

        db.disconnect()

    def find_user(self, _id):
        """
        회원 데이터를 찾음
        """
        db = DBInterface()
        db.connect()

        result = db.fetch_query("""
            SELECT user_id,
                   id,
                   pw
            FROM User
            WHERE id = ?
        """, _id)

        db.disconnect()

        # 검색결과 없음
        if len(result) == 0:
            return None

        return {
            'user_id': result[0][0],
            'id': result[0][1],
            'pw': result[0][2]
        }