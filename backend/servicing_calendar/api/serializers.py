from rest_framework.serializers import ModelSerializer
from .models import Reservation, Customer, Store, ManageReservation

class CustomerSerializer(ModelSerializer):
    """Serializer of customer model."""

    class Meta:
        model = Customer
        fields = '__all__'


class ReservationSerializer(ModelSerializer):
    """Serializer of reservation model."""

    class Meta:
        model = Reservation
        fields = '__all__'

class StoreSerializer(ModelSerializer):
    """Serializer of store model."""

    class Meta:
        model = Store
        fields = '__all__'

class ManageReservationSerializer(ModelSerializer):
    """Serializer of management reservation model."""

    class Meta:
        model = ManageReservation
        fields = '__all__'