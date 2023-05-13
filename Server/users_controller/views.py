from django.shortcuts import render
import jwt
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.request import Request
from django.http import JsonResponse
from rest_framework import status
import pymongo
from bson.json_util import dumps
import json
from .models import registerUserSerilizer, loginUserSerializer
from Common.common import encryptString, validateRequestBody, generateJWT
import os


# Create your views here.
client = pymongo.MongoClient(str(os.getenv('mongoCon')))
db = client['sample_airbnb']


@api_view(['GET'])
def getUserLists(request):
    listingsAndReviews = db['listingsAndReviews']
    data_ = listingsAndReviews.find({"property_type": 'Apartment'}).limit(10)
    data = dumps(data_)
    responseData = {'reviews': data,
                    'Total': listingsAndReviews.count_documents({})}
    return Response(data=responseData)


@api_view(['POST'])
def registerUser(request):
    res = {}
    res['Error'] = False
    try:
        res = validateRequestBody(
            request=request, serializer=registerUserSerilizer)
        if res and res.get('Error') == True:
            return JsonResponse(res, status=status.HTTP_400_BAD_REQUEST)

        req = json.loads(request.body.decode("utf-8"))
        db = client['ChatApp']
        usersCollection = db['Users']

        email = str(req['email']).strip()
        extEmailID = usersCollection.count_documents({"email": email})
        print(f'Document count of email : {str(extEmailID)}')

        if extEmailID > 0:
            res['Message'] = f'email already exists {email}'
            res['Error'] = True
            return JsonResponse(res, status=status.HTTP_200_OK)

        encPass = encryptString(str(req['password']).strip())
        user_doc = {
            "fname": req['fname'],
            "lname": req['lname'],
            "email": email,
            "password": encPass
        }
        usersCollection.insert_one(user_doc)

    except json.JSONDecodeError as ex:
        res['Message'] = 'Invalid request body'
        return JsonResponse(res, status=status.HTTP_400_BAD_REQUEST)
    except Exception as ex:
        res['Message'] = ex
        return JsonResponse(res, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    res['Message'] = "Registered Successfully"
    return JsonResponse(res, status=status.HTTP_200_OK)


@api_view(['POST'])
def login(request):
    res = {'Error': False, 'Message': ''}
    try:
        res = validateRequestBody(
            request=request, serializer=loginUserSerializer)
        if res and res.get('Error') == True:
            return JsonResponse(res, status=status.HTTP_400_BAD_REQUEST)

        req = json.loads(request.body.decode("utf-8"))
        db = client['ChatApp']
        usersCollection = db['Users']
        usrs = usersCollection.find_one({'email': req['username']})

        if usrs is None:
            res['Message'] = "Invalid username/email"
            res['Error'] = True
            return JsonResponse(res, status=status.HTTP_400_BAD_REQUEST)
        
        if encryptString(req['password']) != usrs['password']:
            res['Message'] = "Invalid username/email"
            res['Error'] = True
            return JsonResponse(res, status=status.HTTP_400_BAD_REQUEST)
        
        _token = jwt.encode(payload={"id": str(
            usrs['_id']), "email": usrs['email']}, key=os.getenv('jwtScret'), algorithm='HS256')
        res['Token'] = _token

    except json.JSONDecodeError as ex:
        res['Message'] = ex
        res['Error'] = True
        return JsonResponse(res, status=status.HTTP_400_BAD_REQUEST)

    return JsonResponse(res, status=status.HTTP_200_OK)
