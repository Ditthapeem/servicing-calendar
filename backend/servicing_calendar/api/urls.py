from django.urls import path
from . import views

urlpatterns = [
    path('', views.getRoutes, name="routes"),
    path('<str:customer_username>/calendar/', views.get_my_calendar, name='calendar'), # get customer data
    path('<str:customer_username>/calendar/<int:booking_id>', views.delete_booking, name='calendar'), # post delet reservation
    path('<str:customer_username>/booking/', views.booking, name="booking"), # get aviable date and customor hours. & post new reservation.
    path('<str:customer_username>/booking?date=<str:date>&course=<int:course>', views.get_booking, name="booking") # get available time.
]