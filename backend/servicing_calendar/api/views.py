from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import CustomerSerializer, ReservationSerializer, StoreSerializer, ManageReservationSerializer
from django.http import JsonResponse
from .models import Customer, Reservation, Store, ManageReservation
from .utils import is_reservation_valid, get_available_time, reduce_customer_couse, increse_customer_couse
from django.shortcuts import render, get_object_or_404
from django.contrib.auth import login, authenticate

@api_view(['GET'])
def getRoutes(request):
    """
    Specifide the end point of each path.

    Args:
        request: The request from web page.

    Returns:
        JsonResponse with list of end point.
    """
    routes = [
        {
            'Endpoint': '/<str:customer_username>/calendar/',
            'method': 'GET',
            'body': None,
            'description': 'GET all reservation data of a particular username.'
        },
        {
            'Endpoint': '/booking/',
            'method': 'GET, POST',
            'body': {
                        'customer': '',
                        'start': '',
                        'end': '',
                        'duration': '',
                        'note': ''
                    },
            'description': 'GET all reserved data and POST new reservation.'
        },
        {
            'Endpoint': '<str:customer_username>/calendar/cancel',
            'method': 'POST',
            'body': {
                        'customer': '',
                        'start': '',
                        'end': '',
                        'duration': '',
                        'note': ''
                    },
            'description': 'POST deleted reservated data.'

        },
        {
            'Endpoint': '<str:customer_username>/booking/date=<str:date>/course=<int:course>',
            'method': 'GET',
            'body': None,
            'description': 'GET a list of available time to reserve.'
        }
    ]
    return JsonResponse(routes, safe=False)

@api_view(['GET'])
# Has to log in
def get_my_calendar(request, customer_username):
    """
    Return all reservation data of a particular username. 

    Args:
        request: The request from web page.
        GET:     all reservation data of a particular username.
        customer_username:  The username of customer.

    Returns:
        GET:    Response all reservation data of a particular username.
        GET:    Response "User doesn't exist." in case of the 
                customer_username doesn't exist.
    """
    if request.method == 'GET':
        try:
            customer_object = Customer.objects.get(username=customer_username)
            reservation_object = Reservation.objects.all().filter(customer=customer_object)
            serializer = ReservationSerializer(reservation_object, many=True)
            return Response(serializer.data)
        except:
            return Response("User doesn't exist.")

@api_view(['POST'])
def delete_booking(request, customer_username):
    """
    TODO:   1. Edit '<str:customer_username>/calendar/cancel>' if we do not need to use customer_username
            2. Update new customer_min (user course)
            3. Use duration or not.

    Return response from deletetion. 

    Args:
        request: The request from web page.
        POST:     Delete reservation data of a particular username and booking id.
        customer_username:  The username of customer.
        booking_id: The id of reservation.

    Returns:
        POST:    Response of deletetion reservatied data of a particular username and booking id.
        POST:    Fail to delete reservation.
    """
    if request.method == 'POST':
        data = request.data
        try:
            increse_customer_couse(data)
            id = data['id']
            customer_object = Customer.objects.get(username=customer_username)
            customer_serializer = CustomerSerializer(customer_object, many=False)
            Reservation.objects.filter(id=id).delete()
            return Response([customer_serializer.data, data])
        except:
            return Response("Fail to delete reservation.")     

@api_view(['GET', 'POST'])
def booking(request, customer_username):
    """
    TODO:   1. Full and close date.

    Return and get data from booking page 

    Args:
        request: The request from web page.
        GET:   all data of other reservated and particular customer username.
        POST:  data from particular customer for new reservation. 

    Returns:
        GET:    Response all reserved data from all customer and data from particular 
                customer username.
        POST:   Response sepecific data from customer for new reservation.
        POST:   Fail response if customer reserve on invalid either date or time. 
    """
    if request.method == 'GET':
        customer_object = Customer.objects.get(username=customer_username)
        customer_serializer = CustomerSerializer(customer_object, many=False)
        already_reserved_object = Reservation.objects.all()
        reservation_serializer = ReservationSerializer(already_reserved_object, many=True)
        return Response([customer_serializer.data, reservation_serializer.data])
    elif request.method == 'POST':
        data = request.data
        if is_reservation_valid(data):
            reduce_customer_couse(data)
            reserve = Reservation.objects.create(
                customer = Customer.objects.get(id=data["customer"]),
                start = data["start"],
                end = data["end"],
                duration = data["duration"],
                note = data["note"]
            )
            serializer = ReservationSerializer(reserve, many=False)
            return Response(serializer.data)
        else:
            return Response("Fail to reserved.")

@api_view(['GET'])
def get_time_booking(request, customer_username, date, course):
    """
    Return a list of available time to reserve. 

    Args:
        request: The request from web page.
        GET:     A list of available time to reserve.
        customer_username:  The username of customer.
        date:   Date that customer want to reserve.
        course: The dutation of time that user want to reserve.

    Returns:
        GET:    A list of available time to reserve.
    """
    if request.method == 'GET':
        list_of_available_time = get_available_time(date, course)
        return Response(list_of_available_time)

