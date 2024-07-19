from django.db import models
from django.conf import settings
import uuid
import json
from lobby.models import BaseLobby

class Game(BaseLobby):
    STATUS_CHOICES = [
        ('waiting', 'Waiting'),
        ('active', 'Active'),
        ('completed', 'Completed'),
    ]

    game_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='waiting')
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

    def get_leaderboard(self):
        """Returns a sorted leaderboard of participants based on their scores."""
        participants = self.get_game_active_participants()
        player_scores = {participant['uuid']: participant['score'] for participant in participants if participant['is_active']}
        
        # Create a sorted leaderboard
        leaderboard = sorted(player_scores.items(), key=lambda item: item[1], reverse=True)
        return leaderboard

    def update_score(self, player_uuid, correct):
        """Updates the score of a player based on whether their action was correct."""
        participants = self.get_game_active_participants()
        for participant in participants:
            if participant['uuid'] == player_uuid and participant['is_active']:
                if correct:
                    participant['score'] += 1
                break

    def update_game_status(self):
        """Updates the game status based on the number of active participants."""
        participants = self.get_game_active_participants()
        if len(participants) < 2:
            # can be changed as per usage
            self.game_status = 'waiting'
        else:
            self.game_status = 'active'
        self.save()
