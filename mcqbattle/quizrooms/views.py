from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import QuizRoom
from .serializers import QuizRoomSerializer
from mcqs.models import MCQ  # Assuming MCQ model is defined in mcqs app

class CreateQuizRoomView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        name = request.data.get('name')
        is_random = request.data.get('is_random', False)

        quiz_room = QuizRoom.objects.create(name=name, host=request.user, is_random=is_random)

        if is_random:
            # Placeholder for future implementation of random quiz generation

            #  need to implement bard AI here
            pass

        quiz_room.save()
        serializer = QuizRoomSerializer(quiz_room)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class JoinQuizRoomView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, room_id):
        try:
            quiz_room = QuizRoom.objects.get(id=room_id)
        except QuizRoom.DoesNotExist:
            return Response({"error": "Room not found"}, status=status.HTTP_404_NOT_FOUND)

        # Limiting room to 16 participants
        max_participants = 16
        if quiz_room.participants.count() >= max_participants:
            return Response({"error": "Room is full. Maximum participants reached."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Check if user is already a participant
        if request.user in quiz_room.participants.all():
            return Response({"error": "You are already a participant in this room."},
                            status=status.HTTP_400_BAD_REQUEST)

        quiz_room.participants.add(request.user)
        quiz_room.save()

        serializer = QuizRoomSerializer(quiz_room)
        return Response(serializer.data, status=status.HTTP_200_OK)
