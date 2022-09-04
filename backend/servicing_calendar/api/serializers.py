from xml.etree.ElementInclude import include
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from .models import Reservation, Customer, Store, ManageReservation, Massage
from django.contrib.auth.models import User

class UserSerializer(ModelSerializer):

    class Meta:
        model = User
        exclude = ['password']


class CustomerSerializer(ModelSerializer):
    """Serializer of customer model."""
    username = serializers.StringRelatedField(many=False)

    class Meta:
        model = Customer
        fields = '__all__'


class ReservationSerializer(ModelSerializer):
    """Serializer of reservation model."""
    title = serializers.CharField(source="customer.username", read_only=True)
    massage_type = serializers.StringRelatedField(many=False)

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

class MassageTypeSerializer(ModelSerializer):
    """Serializer od massage type model."""

    class Meta:
        model = Massage
        fields = '__all__'