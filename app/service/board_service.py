from app.model.board_access import BoardAccess

class BoardService:
    def __init__(self):
        self.board_access = BoardAccess()

    def get_categories(self):
        return self.board_access.find_all_category()