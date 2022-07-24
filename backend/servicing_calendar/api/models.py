from django.db import models
from django.contrib.auth.models import User, AbstractBaseUser
import datetime

class Customer(AbstractBaseUser):
    """Customer model."""

    username = models.CharField(unique=True, null=False, max_length=255)
    name = models.CharField(null=False, max_length=255)
    surmane = models.CharField(null=False, max_length=255)
    email = models.EmailField(null=False, unique=True)
    address = models.TextField(max_length=255)
    note = models.TextField(blank=True) 
    course_minutes = models.IntegerField(null=False)

    USERNAME_FIELD = "username"

class Reservation(models.Model):
    """User reservation model."""

    class Time(datetime.time, models.Choices):
        """Reservation time that user can reserve."""

        MINIMUM = 1, 0, 0, '60 minutes'
        MEDIUM = 1, 15, 0, '75 minutes'
        MAXIMUM = 1, 30, 0, '90 minutes'

    customer = models.ForeignKey(Customer, related_name="Reservation", on_delete=models.CASCADE)
    start = models.DateTimeField(null=False)
    end = models.DateTimeField(null=False)
    duration = models.TimeField(choices=Time.choices)
    note = models.TextField(blank=True)

    def __str__(self) -> str:
        return str(f"{self.customer} has been reservated from {self.start} to {self.end} for {self.duration} min.")

class Store(models.Model):
    """Store model."""

    info = models.TextField(max_length=255)
    address = models.TextField(max_length=255)
    address_url = models.URLField()
    open = models.TimeField()
    close = models.TimeField()
    email = models.EmailField()
    phone = models.IntegerField()
    
class ManageReservation(models.Model):
    """Manage service date."""

    owner = models.ForeignKey(User,related_name="Manage_Reservation", on_delete=models.CASCADE)
    close_date = models.DateField(null=False, unique=True)

