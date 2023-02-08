from django.db import models
from rest_framework import serializers 
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

class CartItem(models.Model):
    product_name = models.CharField(max_length=200)
    product_price = models.FloatField()
    product_quantity = models.PositiveIntegerField()

class registerUserSerilizer(serializers.Serializer):
    fname =  serializers.CharField(required = True,max_length = 30,min_length = 3)
    lname =  serializers.CharField(required = True,max_length = 30,min_length = 3)
    email =  serializers.CharField(required = True,max_length = 60,min_length = 3)
    password =  serializers.CharField(required = True,max_length = 30,min_length = 8)

    def validate_email(self,value):
        try:
            validate_email(value=value)
        except ValidationError as ex:
            raise serializers.ValidationError("Invalid email format")
        return value