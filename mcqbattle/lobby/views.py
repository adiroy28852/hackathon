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
    # Uncomment this line if you want to ensure only authenticated users can create a lobby
    permission_classes = [IsAuthenticated]
    serializer_class = CreatePrivateLobbySerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        serializer = self.serializer_class(data=request.data)
        
        if serializer.is_valid():
            print("Serializer is valid")
            print("Validated data:", serializer.validated_data)
            
            subject = serializer.validated_data['subject']
            host = self.request.user  
            lobby = BaseLobby(subject=subject, host=host)
            lobby.save()

            # Return the serialized lobby data, including the generated UUID
            return Response(LobbySerializer(lobby).data, status=status.HTTP_201_CREATED)

        # Debug prints to check errors
        print("Serializer errors:", serializer.errors)
        
        # If the data is not valid, return an error response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GetLobby(APIView):
    serializer_class = LobbySerializer
    lookup_url_kwarg = 'lobbyID'

    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)
        if code is not None:
            try:
                # Convert the code to a UUID object
                lobby = BaseLobby.objects.filter(lobbyID=uuid.UUID(code))
                if lobby.exists():
                    data = LobbySerializer(lobby.first()).data
                    data['is_host'] = self.request.session.session_key == lobby.first().host
                    return Response(data, status=status.HTTP_200_OK)
                return Response({'error': 'Lobby not found'}, status=status.HTTP_404_NOT_FOUND)
            except ValueError:
                # Handle invalid UUID format
                return Response({'error': 'Invalid lobby ID format'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'error': 'Lobby not found'}, status=status.HTTP_404_NOT_FOUND)
