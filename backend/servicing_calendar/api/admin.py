from django.contrib import admin
from .models import Reservation, Customer, Store, ManageReservation, Massage

admin.site.register(Reservation)
admin.site.register(Customer)
admin.site.register(Store)
admin.site.register(Massage)
admin.site.register(ManageReservation)

