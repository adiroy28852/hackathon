from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from rest_framework import status
from .models import BaseLobby
from .serializers import *
from rest_framework.permissions import IsAuthenticated
import uuid
from views import *

class ShowAllLobbies(generics.ListAPIView):
    queryset = BaseLobby.objects.all()
    serializer_class = LobbySerializer

class CreateLobby(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CreatePrivateLobbySerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        serializer = self.serializer_class(data=request.data)
        
        if serializer.is_valid():
            subject = serializer.validated_data['subject']
            host = self.request.user  
            # Assume 'waiting' status upon creation
            lobby = BaseLobby(subject=subject, host=host, status='waiting')
            lobby.save()

            return Response(LobbySerializer(lobby).data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetLobby(APIView):
    serializer_class = LobbySerializer
    lookup_url_kwarg = 'lobbyID'

    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)
        if code is not None:
            try:
                lobby = BaseLobby.objects.get(lobbyID=uuid.UUID(code))
                if lobby:
                    # Example: Update status based on some condition
                    if lobby.is_active:
                        lobby.status = 'open'
                    else:
                        lobby.status = 'session_full'
                    lobby.save()

                    data = LobbySerializer(lobby).data
                    data['is_host'] = self.request.session.session_key == lobby.host
                    return Response(data, status=status.HTTP_200_OK)
                return Response({'error': 'Lobby not found'}, status=status.HTTP_404_NOT_FOUND)
            except BaseLobby.DoesNotExist:
                return Response({'error': 'Lobby not found'}, status=status.HTTP_404_NOT_FOUND)
            except ValueError:
                return Response({'error': 'Invalid lobby ID format'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'error': 'Lobby not found'}, status=status.HTTP_404_NOT_FOUND)

class JoinLobbyRequest(generics.CreateAPIView):
    queryset = JoinRequest.objects.all()
    serializer_class = JoinRequestSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        user = request.user
        lobby_id = request.data.get('lobby')
        
        # Check if the lobby exists and is active
        try:
            lobby = BaseLobby.objects.get(lobbyID=lobby_id, is_active=True)
        except BaseLobby.DoesNotExist:
            return Response({'error': 'Lobby not found or not active'}, status=status.HTTP_404_NOT_FOUND)
        
        # Create a join request
        join_request = JoinRequest.objects.create(lobby=lobby, user=user)
        serializer = self.get_serializer(join_request)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class ApproveJoinRequest(generics.UpdateAPIView):
    queryset = JoinRequest.objects.all()
    serializer_class = JoinRequestSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        join_request = self.get_object()
        if join_request.lobby.host != request.user:
            return Response({'error': 'Only the host can approve join requests'}, status=status.HTTP_403_FORBIDDEN)
        
        if join_request.approve():
            serializer = self.get_serializer(join_request)
            return Response(serializer.data)
        return Response({'error': 'Lobby is full or other issue'}, status=status.HTTP_400_BAD_REQUEST)