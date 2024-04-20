import bcrypt
from app.model.user_access import UserAccess

class UserService:

    def __init__(self):
        self.user_access = UserAccess()

    def registration(self, user_id, user_pw):
        """
        회원 등록 서비스 함수
        """

        b_user_pw = bytes(user_pw, 'utf-8')
        b_hashed_pw = bcrypt.hashpw(password=b_user_pw, salt=bcrypt.gensalt())

        self.user_access.create_user(user_id, b_hashed_pw)

