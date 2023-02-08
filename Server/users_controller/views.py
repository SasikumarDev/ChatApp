from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.request import Request
from django.http import JsonResponse
from rest_framework import status
import pymongo
from bson.json_util import dumps
import json
from .models import registerUserSerilizer
import hashlib


# Create your views here.
client = pymongo.MongoClient("mongodb+srv://admin:UyDbxx3V8TybMPJH@cluster0.pqunsjt.mongodb.net/?retryWrites=true&w=majority")
db = client['sample_airbnb']

@api_view(['GET'])
def getUserLists(request):
    listingsAndReviews = db['listingsAndReviews']
    data_ = listingsAndReviews.find({"property_type":'Apartment'}).limit(10)
    data = dumps(data_)
    responseData = {'reviews': data,'Total':listingsAndReviews.count_documents({})}
    return Response(data= responseData)

@api_view(['POST'])
def registerUser(request):
    res ={}
    try:
        if not request.body:
            res['Message'] = 'Request body not found'
            return JsonResponse(res,status=status.HTTP_400_BAD_REQUEST)

        req = json.loads(request.body.decode("utf-8"))

        Serlizer = registerUserSerilizer(data= req)

        if not Serlizer.is_valid():
            res['Message'] = Serlizer.errors
            return JsonResponse(res,status=status.HTTP_400_BAD_REQUEST)
            
        db = client['ChatApp']
        usersCollection = db['Users']

        email = str(req['email']).strip()
        extEmailID = usersCollection.count_documents({"email":email})
        print(f'Document count of email : {str(extEmailID)}')
        
        if extEmailID > 0:
            res['Message'] = f'email already exists {email}'
            return JsonResponse(res,status=status.HTTP_200_OK)
        
        encPass = encryptString(str(req['password']).strip())
        user_doc = {
        "fname":req['fname'],
        "lname":req['lname'],
        "email":email,
        "password":encPass
        }
        usersCollection.insert_one(user_doc)

    except json.JSONDecodeError as ex:
        res['Message'] = 'Invalid request body'
        return JsonResponse(res,status=status.HTTP_400_BAD_REQUEST)
    except Exception as ex:
        res['Message'] = ex
        return JsonResponse(res,status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    res['Message']="Registered Successfully"
    return JsonResponse(res,status=status.HTTP_200_OK)

def encryptString(password:str) -> str:
    if password is None:
        raise 'Password should not be empty'
    return str(hashlib.sha256(password.encode('utf-8')).hexdigest())