from django.db import models
from django.conf import settings
from django.contrib.auth.models import User
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

    def add_participant(self, user):
        participants_list = json.loads(self.participants)
        if len(participants_list) < self.lobbySize:
            participants_list.append({'uuid': str(user.id), 'is_active': True})
            self.participants = json.dumps(participants_list)
            self.save()
            return True
        return False

class JoinRequest(models.Model):
    lobby = models.ForeignKey(BaseLobby, on_delete=models.CASCADE, related_name='join_requests')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='join_requests')
    created_at = models.DateTimeField(auto_now_add=True)
    approved = models.BooleanField(default=False)

    def approve(self):
        if self.lobby.add_participant(self.user):
            self.approved = True
            self.save()
            return True
        return False
