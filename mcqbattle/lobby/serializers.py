from rest_framework import serializers
from .models import *

class LobbySerializer(serializers.ModelSerializer):
    class Meta:
        model = BaseLobby
        fields = '__all__'

class CreatePrivateLobbySerializer(serializers.ModelSerializer):
    class Meta:
        model = BaseLobby
        fields = ['subject', 'status']  # Include other required fields if necessary
class JoinRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = JoinRequest
        fields = ['id', 'lobby', 'user', 'created_at', 'approved']
        read_only_fields = ['id', 'created_at', 'approved']