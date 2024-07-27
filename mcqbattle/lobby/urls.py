from django.contrib import admin
from django.urls import path
from .views import *


urlpatterns = [
    # path('home', ShowAllLobbies.as_view()),
    path ('home', CreateLobby.as_view()),
    path('join-request/', JoinLobbyRequestView.as_view(), name='join-lobby-request'),
    path('approve-request/<int:pk>/', ApproveJoinRequestView.as_view(), name='approve-join-request'),
]