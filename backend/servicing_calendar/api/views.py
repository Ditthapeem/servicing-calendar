from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import CustomerSerializer, ReservationSerializer, StoreSerializer, ManageReservationSerializer
from django.http import JsonResponse
from .models import Customer, Reservation, Store, ManageReservation
from .utils import is_reservation_valid
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
        }
    ]
    return JsonResponse(routes, safe=False)

@api_view(['GET'])
# Has to log in
def get_my_calendar(request, customer_username):
    """
    Return all reservation data of a particular username. 

    Args:
        request: GET all reservation data of a particular username.
        customer_username: The username of customer.

    Returns:
        GET: Response all reservation data of a particular username.
    """
    if request.method == 'GET':
        try:
            customer_object = Customer.objects.get(username=customer_username)
            data = Reservation.objects.all().filter(customer=customer_object)
            serializer = ReservationSerializer(data, many=True)
            return Response(serializer.data)
        except:
            return Response("User doesn't exist.")

@api_view(['GET', 'POST'])
def booking(request):
    """
    Return and get data from booking page 

    Args:
        request: GET all data of other reservated.
                 POST data from customer for new reservation. 

    Returns:
        GET: Response all reserved data from all customer.
        POST: Response sepecific data from customer for new reservation.
        POST: Fail response if customer reserve on invalid either date or time. 
    """
    if request.method == 'GET':
        already_reserved = Reservation.objects.all()
        serializer = ReservationSerializer(already_reserved, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        data = request.data
        if is_reservation_valid(data):
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

