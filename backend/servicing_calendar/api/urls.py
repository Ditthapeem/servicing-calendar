from django.urls import path
from . import views

urlpatterns = [
    path('', views.getRoutes, name="routes"),
    path('my/calendar/', views.get_my_calendar, name='calendar'), # get customer data
    path('my/calendar/cancel', views.delete_booking, name='cancel'), # post delet reservation
    path('my/booking/', views.booking, name="booking"), # get aviable date and customor hours. & post new reservation.
    path('my/booking/date=<str:date>/course=<int:course>', views.get_time_booking, name="get_booking"), # get available time.
    path('login/', views.customer_login, name="login"),
    path('logout/', views.customer_logout, name="logout"),

    path('manager/calendar/', views.get_manager_calendar, name="manager_calendar")
]