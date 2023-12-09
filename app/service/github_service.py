from github import Github, Auth


class GithubService:
    def __init__(self):
        self.g = Github(auth=Auth.Token('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'))

    def get_user_info(self):
        user = self.g.get_user()
        return {
            'nickname': user.login,
            'name': user.name,
            'email': user.email,
            'bio': user.avatar_url,
            'img': user.avatar_url,
            'url': user.html_url
        }

    def get_repo_list(self):
        repo = self.g.get_user().get_repos()
        repo_list = []
        for r in repo:
            repo_list.append({
                'title': r.name,
                'url': r.html_url,
                'visibility': r.visibility,
                'lang': r.language
            })
        return repo_list

    def get_gist_list(self):
        gist = self.g.get_user().get_gists()
        gist_list = []
        for _g in gist:
            gist_list.append({
                'filename': list(_g.files.keys())[0],
                'url': _g.html_url + '#file-' + list(_g.files.keys())[0]
            })
        return gist_list