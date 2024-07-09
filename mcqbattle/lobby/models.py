from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, User
from django.utils import timezone
import json

class BaseLobby(models.Model):
    subject = models.CharField(max_length=50)
    participants = models.TextField(default='[]')  # Default to empty list in JSON format
    is_active = models.BooleanField(default=True)
    # lobbyID= models.CharField(max_length=100) #hex field
    lobbyID= models.UUIDField(primary_key=True, editable=False)

class publiclobby(BaseLobby):
    def host(self):
        participants_list = json.loads(self.participants)
        if(participants_list):
            return participants_list[0]
        return None
    
class privatelobby(BaseLobby):
    key= models.CharField(max_length=30)
    host = models.ForeignKey(User, on_delete=models.CASCADE, related_name='hosted_lobbies')
