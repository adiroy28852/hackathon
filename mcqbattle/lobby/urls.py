from django.contrib import admin
from django.urls import path
from .views import *


urlpatterns = [
    # path('home', ShowAllLobbies.as_view()),
    path ('home', CreateLobby.as_view())
]