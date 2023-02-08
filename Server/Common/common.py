import hashlib

def encryptString(password:str) -> str:
    if password is None:
        raise 'Password should not be empty'
    return str(hashlib.sha256(password).hexdigest())