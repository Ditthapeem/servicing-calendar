from rest_framework.serializers import ModelSerializer
from .models import Reservation


class NoteSerializer(ModelSerializer):
    class Meta:
        model = Reservation
        fields = '__all__'