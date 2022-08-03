from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import CustomerSerializer, ReservationSerializer, StoreSerializer, ManageReservationSerializer, UserSerializer
from .models import Customer, Reservation, Store, ManageReservation
from .utils import is_reservation_valid, get_available_time, reduce_customer_couse, increse_customer_couse
from django.contrib.auth import login, authenticate, logout
from django.http import Http404
from django.contrib.auth.decorators import login_required
from datetime import datetime, timedelta

WEEK = 6

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
            'description': 'Give all reservation data of a particular username.'
        },
        {
            'Endpoint': 'my/booking/',
            'method': 'GET, POST',
            'body': {
                        'customer': '',
                        'start': '',
                        'end': '',
                        'duration': '',
                        'note': ''
                    },
            'description': 'Give a full, close and available date for booking. And booking reservation for customer.'
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
            'description': 'Delete reservation data of a particular username and booking id.'
        },
        {
            'Endpoint': 'my/booking/date=<str:date>/course=<int:course>',
            'method': 'GET',
            'body': None,
            'description': 'GET a list of available time to reserve.'
        },
        {
            'Endpoint': 'login/',
            'method': 'POST',
            'body': {
                    'username':'',
                    'password':''
                    },
            'description': 'Login customer.'
        },
        {
            'Endpoint': 'logout/',
            'method': 'POST',
            'body': None,
            'description': 'Logout customer.'
        },
        {
            'Endpoint': 'manager/calendar/',
            'method': 'POST',
            'body': None,
            'description': 'Get all customer reservation and close date.'
        },
        {
            'Endpoint': 'manager/calendar/cancel',
            'method': 'POST',
            'body': {
                        'customer': '',
                        'start': '',
                        'end': '',
                        'duration': '',
                        'note': ''
                    },
            'description': 'Delete reservation data of a particular username and booking id.'
        }
    ]
    return Response(routes)

@api_view(['GET'])
@login_required(login_url='login')
def get_my_calendar(request):
    """
    Give all reservation data of a particular username. 

    Args:
        request: The request from web page.

    Returns:
        GET:    Response all reservation data of a particular username.
        GET:    Response "User doesn't exist." in case of the 
                customer_username doesn't exist.
    """
    if request.method == 'GET':
        try:
            customer_username = request.user
            customer_object = Customer.objects.get(username= customer_username)
            reservation_object = Reservation.objects.filter(customer=customer_object, start__gte=datetime.today())
            reservation_serializer = ReservationSerializer(reservation_object, many=True)
            close_date_object = ManageReservation.objects.filter(close_date__gte=datetime.today())
            close_date_serializer = ManageReservationSerializer(close_date_object, many=True)
            return Response([reservation_serializer.data, close_date_serializer.data])
        except:
            return Response("User doesn't exist.")

@api_view(['POST'])
@login_required(login_url='login')
def delete_booking(request):
    """
    Delete reservation data of a particular username and booking id.

    Args:
        request: The request from web page.

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
    Give a full, close and available date for booking. And booking reservation for customer.

    Args:
        request: The request from web page.

    Returns:
        GET:    A single list of full, close and available date
        POST:   Response sepecific data from customer for new reservation.
        POST:   Fail response if customer reserve on invalid either date or time. 
    """
    if request.method == 'GET':
        list_of_available_date = []
        list_of_full_date = []
        list_of_close_date = []
        close_date_object = ManageReservation.objects.filter(   close_date__gte=datetime.today(),
                                                                close_date__lte=(datetime.today() + timedelta(days=WEEK*7)))
        for date in close_date_object:
            list_of_close_date.append(date.close_date)
        for i in range(WEEK*7):
            date = datetime.today() + timedelta(days=i)
            if len(get_available_time(date.strftime('%Y-%m-%d'),60)) == 0:
                list_of_full_date.append(date.strftime('%Y-%m-%d'))
            else:
                list_of_available_date.append(date.strftime('%Y-%m-%d'))
        return Response([   {"close":   list_of_close_date},
                            {"full":    list_of_full_date},
                            {"available": list_of_available_date}])
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
    """
    Login customer.

    Args:
        request: The request from web page.

    Returns:
        POST:    A response login User data.
    """
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
    """
    Logout customer.

    Args:
        request: The request from web page.

    Returns:
        POST:    A response status.
    """
    customer_username = request.user
    if request.method == 'POST':   
        logout(request)
        return Response(f"Successfully logout")

@api_view(['GET'])
def get_manager_calendar(request):
    """
    Returns all customer reservation and close date.

    Args:
        request: The request from web page.

    Returns:
        GET: All customer reservation and close date.
    """
    admin = request.user
    if request.method == 'GET':
        if admin.is_superuser:
            reservation_object = Reservation.objects.filter(start__gte=datetime.today())
            reservation_serializer = ReservationSerializer(reservation_object, many=True)
            close_date_object = ManageReservation.objects.filter(close_date__gte=datetime.today())
            close_date_serializer = ManageReservationSerializer(close_date_object, many=True)
            return Response([reservation_serializer.data, close_date_serializer.data])
        else:
            return Response("You shall not PASS!!!")

@api_view(['POST'])
def manager_delete_booking(request):
    """
    Delete reservation data of a particular username and booking id.

    Args:
        request: The request from web page.

    Returns:
        POST:    Response of deletetion reservatied data of a particular username and booking id.
        POST:    Fail to delete reservation.
    """
    admin = request.user
    if request.method == 'POST':
        if admin.is_superuser:
            delete_booking(request)  
