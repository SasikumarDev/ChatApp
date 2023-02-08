from django.db import models
from rest_framework import serializers 
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from datetime import datetime

class CartItem(models.Model):
    product_name = models.CharField(max_length=200)
    product_price = models.FloatField()
    product_quantity = models.PositiveIntegerField()

class registerUserSerilizer(serializers.Serializer):
    MAX_AGE_ALLOWED = 18

    fname =  serializers.CharField(required = True,max_length = 30,min_length = 3)
    lname =  serializers.CharField(required = True,max_length = 30,min_length = 3)
    email =  serializers.CharField(required = True,max_length = 60,min_length = 3)
    password =  serializers.CharField(required = True,max_length = 30,min_length = 8)
    dob = serializers.DateTimeField(required = True)

    def validate_email(self,value):
        try:
            validate_email(value=value)
        except ValidationError as ex:
            raise serializers.ValidationError("Invalid email format")
        return value

    def validate_dob(self,value):
        try:
            year = datetime.now().year
            user_date = value.year
            if (year - user_date) < self.MAX_AGE_ALLOWED:
                raise serializers.ValidationError("Max allowd age is 18")
        except ValidationError as ex:
            raise ex
        return value