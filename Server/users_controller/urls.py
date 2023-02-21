from django.urls import path
from .views import getUserLists,registerUser,login

urlpatterns = [
    path('getUserLists/',getUserLists,name='getUserLists'),
    path('registerUser/',registerUser,name='registerUser'),
    path('login/',login,name='login'),
]