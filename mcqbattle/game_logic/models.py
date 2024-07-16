from django.db import models
from django.conf import settings
import uuid
import json

from lobby.models import BaseLobby

class Game(BaseLobby):
    STATUS_CHOICES = [
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
        # Add more choices as needed
    ]

    game_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ongoing')
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    score = models.IntegerField(default=0)

    def __str__(self):
        return f"Game in Lobby: {self.subject} - Status: {self.game_status}"

    def get_game_active_participants(self):
        """Uses the method from BaseLobby to get active participants."""
        return self.get_active_participants()

    def create_player_score_dict(self):
        """Creates a dictionary with player UUIDs as keys and their scores as values."""
        participants = self.get_game_active_participants()
        player_scores = {participant['uuid']: 0 for participant in participants if participant['is_active']}
        return player_scores
