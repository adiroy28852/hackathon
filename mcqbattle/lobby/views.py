from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from rest_framework import status
from .models import BaseLobby
from .serializers import LobbySerializer, CreatePrivateLobbySerializer
from rest_framework.permissions import IsAuthenticated
import uuid

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

# class JoinLobby(APIView):
#     serializer_class = LobbySerializer

