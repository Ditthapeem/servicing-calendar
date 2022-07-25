from django.urls import path
from . import views

urlpatterns = [
    path('', views.getRoutes, name="routes"),
    path('<str:customer_username>/calendar/', views.get_my_calendar, name='calendar'),
    path('booking/', views.booking, name="booking")
]