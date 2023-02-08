from django.urls import path
from .views import getUserLists,registerUser

urlpatterns = [
    path('getUserLists/',getUserLists,name='getUserLists'),
    path('registerUser/',registerUser,name='registerUser')
]