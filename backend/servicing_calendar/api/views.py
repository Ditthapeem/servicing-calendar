from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import CustomerSerializer, ReservationSerializer, StoreSerializer, ManageReservationSerializer, UserSerializer
from django.http import JsonResponse
from .models import Customer, Reservation, Store, ManageReservation
from .utils import is_reservation_valid, get_available_time, reduce_customer_couse, increse_customer_couse
from django.contrib.auth import login, authenticate, logout
from django.http import Http404
from django.contrib.auth.decorators import login_required

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
            'Endpoint': 'my/calendar/',
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
            'Endpoint': 'my/calendar/cancel',
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
            'Endpoint': 'my/booking/date=<str:date>/course=<int:course>',
            'method': 'GET',
            'body': None,
            'description': 'GET a list of available time to reserve.'
        }
    ]
    return JsonResponse(routes, safe=False)

@api_view(['GET'])
@login_required(login_url='login')
def get_my_calendar(request):
    """
    Return all reservation data of a particular username. 

    Args:
        request: The request from web page.
        GET:     all reservation data of a particular username.

    Returns:
        GET:    Response all reservation data of a particular username.
        GET:    Response "User doesn't exist." in case of the 
                customer_username doesn't exist.
    """
    if request.method == 'GET':
        try:
            customer_username = request.user
            customer_object = Customer.objects.get(username= customer_username)
            reservation_object = Reservation.objects.all().filter(customer=customer_object)
            reservation_serializer = ReservationSerializer(reservation_object, many=True)
            close_date_object = ManageReservation.objects.all()
            close_date_serializer = ManageReservationSerializer(close_date_object, many=True)
            return Response([reservation_serializer.data, close_date_serializer.data])
        except:
            return Response("User doesn't exist.")

@api_view(['POST'])
@login_required(login_url='login')
def delete_booking(request):
    """
    Return response from deletetion. 

    Args:
        request: The request from web page.
        POST:     Delete reservation data of a particular username and booking id.
        booking_id: The id of reservation.

    Returns:
        POST:    Response of deletetion reservatied data of a particular username and booking id.
        POST:    Fail to delete reservation.
    """
    if request.method == 'POST':
        data = request.data
        try:
            customer_username = request.user
            increse_customer_couse(data)
            id = data['id']
            customer_object = Customer.objects.get(username=customer_username)
            customer_serializer = CustomerSerializer(customer_object, many=False)
            Reservation.objects.filter(id=id).delete()
            return Response([customer_serializer.data, data])
        except:
            return Response("Fail to delete reservation.")     

@api_view(['GET', 'POST'])
@login_required(login_url='login')
def booking(request):
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
        customer_username = request.user
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
@login_required(login_url='login')
def get_time_booking(request, date, course):
    """
    Return a list of available time to reserve. 

    Args:
        request: The request from web page.
        GET:     A list of available time to reserve.
        date:   Date that customer want to reserve.
        course: The dutation of time that user want to reserve.

    Returns:
        GET:    A list of available time to reserve.
    """
    if request.method == 'GET':
        list_of_available_time = get_available_time(date, course)
        return Response(list_of_available_time)

@api_view(['POST'])
def customer_login(request):
    data = request.data
    if request.method == 'POST':    
        username = data['username']
        password = data['password']
        user = authenticate(username = username, password=password)
        if user:
            login(request,user)
            serializer = UserSerializer(user, many=False)
            return Response(serializer.data)
        return Http404("User does not exist")

@api_view(['POST'])
def customer_logout(request):
    customer_username = request.user
    if request.method == 'POST':   
        logout(request)
        return Response(f"Successfully logout")