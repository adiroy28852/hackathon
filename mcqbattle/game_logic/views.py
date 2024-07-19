from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from rest_framework import status
from .models import *
from .serializers import *
from rest_framework.permissions import IsAuthenticated
import uuid
# Create your views here.
class JoinLobbyView(APIView):
    def post(self, request):
        serializer = JoinLobbySerializer(data=request.data)
        if serializer.is_valid():
            player_uuid = serializer.validated_data['player_uuid']
            game_id = serializer.validated_data['game_id']

            try:
                game = Game.objects.get(id=game_id)
                # Add player to game participants
                game.participants.append({'uuid': player_uuid, 'is_active': True, 'score': 0})
                game.update_game_status()
                return Response({'status': 'joined', 'game_status': game.game_status}, status=status.HTTP_200_OK)
            except Game.DoesNotExist:
                return Response({'error': 'Game not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)