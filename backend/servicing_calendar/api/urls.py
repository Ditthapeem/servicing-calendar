from django.urls import path
from . import views

urlpatterns = [
    path('', views.getRoutes, name="routes"),
    path('my/about/', views.about, name="about"),
    path('my/calendar/', views.get_my_calendar, name='calendar'), # get customer data
    path('my/calendar/cancel', views.delete_booking, name='cancel'), # post delet reservation
    path('my/booking/', views.booking, name="booking"), # get aviable date and customor hours. & post new reservation.
    path('my/booking/date=<str:date>/course=<int:course>', views.get_time_booking, name="get_booking"), # get available time.
    path('login/', views.customer_login, name="login"),
    path('logout/', views.customer_logout, name="logout"),

    path('manager/calendar/', views.get_manager_calendar, name="manager_calendar"),
    path('manager/calendar/cancel', views.manager_delete_booking, name="manager_cancel"),
    path('manager/calendar/close', views.manager_close_date, name="manager_close"),
    path('manager/customer/customer=<str:customer>', views.manage_customer, name="manage_customer"),
    path('manager/history/customer=<str:customer>', views.manage_history, name="manage_history"),
    path('manager/confirm', views.manager_confirmation, name="manager_confirmation"),
    path('manager/customer_list', views.customer_list, name="manage_customer_list"),
    path('manager/massage/type', views.manage_massage_type, name="manage_massage_type"),
    path('register/', views.register, name="register")
]