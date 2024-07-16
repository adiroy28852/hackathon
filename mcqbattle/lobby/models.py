from django.db import models
from django.conf import settings
import uuid
import json

class BaseLobby(models.Model):
    STATUS_CHOICES = [
        ('waiting', 'Waiting'),
        ('open', 'Open'),
        ('session_full', 'Session Full'),
        # Add more choices as needed
    ]

    subject = models.CharField(max_length=50)
    participants = models.TextField(default='[]')  # Default to empty list in JSON format
    is_active = models.BooleanField(default=True)
    lobbyID = models.UUIDField(primary_key=True, editable=False, unique=True, default=uuid.uuid4)
    host = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='waiting')

    def __str__(self):
        return self.subject

    def get_active_participants(self):
        """Returns a list of active participants."""
        participants_list = json.loads(self.participants)
        return participants_list  # Assuming participants is a list of dicts with 'uuid' and 'is_active' keys

# class publiclobby(BaseLobby):
#     def host(self):
#         participants_list = json.loads(self.participants)
#         if(participants_list):
#             return participants_list[0]
#         return None
    
# class privatelobby(BaseLobby):
#     key= models.CharField(max_length=30)
#     host = models.ForeignKey(User, on_delete=models.CASCADE, related_name='hosted_lobbies')
