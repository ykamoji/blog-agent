from api.database.repository import Repository


def get_blogs():
    repo = Repository()

    return repo.get_all_digests()