from rest_framework import serializers
from .models import BaseLobby

class LobbySerializer(serializers.ModelSerializer):
    class Meta:
        model = BaseLobby
        fields = '__all__'

class CreatePrivateLobbySerializer(serializers.ModelSerializer):
    class Meta:
        model = BaseLobby
        fields = ['subject']  # Include other required fields if necessary
