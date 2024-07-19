from django.urls import path
from .views import JoinLobbyView, UpdateScoreView

urlpatterns = [
    path('join-lobby/', JoinLobbyView.as_view(), name='join-lobby'),
    path('update-score/', UpdateScoreView.as_view(), name='update-score'),
]
