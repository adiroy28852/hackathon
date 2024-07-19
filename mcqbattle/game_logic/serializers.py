from rest_framework import serializers

class UpdateScoreSerializer(serializers.Serializer):
    player_uuid = serializers.UUIDField()
    correct = serializers.BooleanField()
    game_id = serializers.IntegerField()  # Add this if you need to pass the game_id

class JoinLobbySerializer(serializers.Serializer):
    player_uuid = serializers.UUIDField()
    game_id = serializers.IntegerField()