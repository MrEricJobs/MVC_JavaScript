import bcrypt

class UserService:

    def __init__(self):
        pass

    def registration(self, user_id, user_pw):
        b_user_pw = bytes(user_pw, 'utf-8')
        b_hashed_pw = bcrypt.hashpw(password=b_user_pw, salt=bcrypt.gensalt())

        print('hased pw: ', b_hashed_pw)