from django.contrib import admin
from .models import Reservation, Customer, Store, ManageReservation

admin.site.register(Reservation)
admin.site.register(Customer)
admin.site.register(Store)
admin.site.register(ManageReservation)

