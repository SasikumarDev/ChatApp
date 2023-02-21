import hashlib
import json
from rest_framework.request import Request

def encryptString(password:str) -> str:
    if password is None or len(password) == 0:
        raise 'Password should not be empty'
    return str(hashlib.sha256(password.encode('utf-8')).hexdigest())

def validateRequestBody(**kwargs):
    res = {'Error':True,'Message':''}

    request = kwargs.get('request')._request
    serializer = kwargs.get('serializer')
    print(request)

    if request is None:
        res['Message'] = 'Request not find'
        return res

    request_body = Request(request= request)

    if request_body is None or request_body.body is None:
        res['Message'] = 'Request body not find'
        return res
    
    try:
        req = json.loads(request.body.decode("utf-8"))

        if serializer:
            validation_result = serializer(data = req)

            if not validation_result.is_valid():
              res['Message'] = validation_result.errors
              return res
              
        res['Error'] = False
        return res
    except json.JSONDecodeError as ex:
        res['Message'] = ex
        return res