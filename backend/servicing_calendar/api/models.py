from django.db import models
from django.contrib.auth.models import User, AbstractBaseUser

class Customer(AbstractBaseUser):
    """Customer model."""

    username = models.CharField(unique=True, null=False, max_length=255)
    name = models.CharField(null=False, max_length=255)
    surmane = models.CharField(null=False, max_length=255)
    email = models.EmailField(null=False, unique=True)
    address = models.TextField(max_length=255)
    note = models.TextField(blank=True) 
    course_min = models.IntegerField(null=False)

    USERNAME_FIELD = "username"

class Reservation(models.Model):
    """User reservation model."""

    class Time(models.IntegerChoices):
        """Reservation time that user can reserve."""

        MINIMUM = 60
        MEDIUM = 75
        MAXIMUM = 90

    customer = models.ForeignKey(Customer, related_name="Reservation", on_delete=models.CASCADE)
    start = models.DateTimeField(null=False)
    end = models.DateTimeField(null=False)
    duration = models.IntegerField(choices=Time.choices)
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
    close_date = models.DateTimeField(null=False, unique=True)

