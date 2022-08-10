from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import CustomerSerializer, ReservationSerializer, StoreSerializer, ManageReservationSerializer, UserSerializer
from .models import Customer, Reservation, Store, ManageReservation
from .utils import is_reservation_valid, get_available_time
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.models import User
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
        },
        {
            'Endpoint': 'manager/calendar/close',
            'method': 'POST',
            'body': {
                        'close_date': ''
                    },
            'description': 'Close date of reservation.'
        },
        {
            'Endpoint': 'manager/customer/customer=<str:customer>',
            'method': 'GET, POST',
            'body': {
                        'name' : '',
                        'surname' : '',
                        'email' : '',
                        'address' : '',
                        'note' : ''
                    },
            'description': 'Manage customer data.'           
        },
        {
            'Endpoint': 'manage/history/customer=<str:customer>',
            'method': 'GET, POST',
            'body': {
                        'id' : '',
                        'note' : ''
                    },
            'description': 'Manage customer history.'           
        },
        {
            'Endpoint': 'register/',
            'method': 'POST',
            'body': {
                        "username" :"",
                        "name" : "",
                        "surname" : "",
                        "email" :"",
                        "address" : "",
                        "note" : "",
                        "password" : ""
                    },
            'description': 'Register new customer.'           
        },
        {
            'Endpoint': 'my/about',
            'method': 'GET',
            'body': None,
            'description': 'A specific data from store.' 
        },
        {
            'Endpoint': 'manager/confirm',
            'method': 'GET, POST',
            'body': {
                        'id' : ''
                    },
            'description': 'Confirmation for each reservation.'           
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
@login_required(login_url='login')
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
@login_required(login_url='login')
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
        else:
            return Response("You shall not PASS!!!")

@api_view(['POST'])
@login_required(login_url='login')
def manager_close_date(request):
    """
    Close date of reservation.

    Args:
        request: The request from web page.

    Returns:
        POST: Response of close date of manage redervation.
    """
    admin = request.user
    data = request.data
    if request.method == 'POST':
        if admin.is_superuser:
            close_date_object = ManageReservation.objects.create(
                owner = admin,
                close_date = data["close_date"]
            )
            serializer = ManageReservationSerializer(close_date_object, many=False)
            return Response(serializer.data)
        else:
            return Response("You shall not PASS!!!")

@api_view(['GET', 'POST'])
@login_required(login_url='login')
def manage_customer(request, customer):
    """
    Manage customer data.

    Args:
        request: The request from web page.
        customer: customer name for query.

    Returns:
        GET: Customer data from a particular username.
        POST: New customer data from a particular username.
    """
    admin = request.user
    data = request.data
    if request.method == 'GET':
        if admin.is_superuser:
            try:
                user_object = User.objects.get(username=customer)
                customer_object = Customer.objects.get(username=user_object)
                customer_serializer = CustomerSerializer(customer_object, many=False)                                              
                return Response(customer_serializer.data)
            except:
                return Response("Customer doesn't exist.")
        else:
            return Response("You shall not PASS!!!")
    elif request.method == 'POST':
        if admin.is_superuser:
            try:
                user_object = User.objects.get(username=customer)
                customer_object = Customer.objects.filter(username=user_object).update( name = data["name"],
                                                                                        surname = data["surname"],
                                                                                        email = data["email"],
                                                                                        address = data["address"],
                                                                                        note = data["note"]),                                         
                return Response("Update Customer data successfully.")
            except:
                return Response("Customer doesn't exist.")
        else:
            return Response("You shall not PASS!!!")

@api_view(['GET', 'POST'])
@login_required(login_url='login')
def manage_history(request, customer):
    """
    Manage customer history.

    Args:
        request: The request from web page.
        customer: customer name for query.

    Returns:
        GET: Customer history from a particular username.
        POST: New customer history from a particular username.
    """
    admin = request.user
    data = request.data
    if request.method == 'GET':
        if admin.is_superuser:
            try:
                user_object = User.objects.get(username=customer)
                customer_object = Customer.objects.get(username=user_object)
                reservation_object = Reservation.objects.filter(customer=customer_object)
                reservation_serializer = ReservationSerializer(reservation_object, many=True)
                return Response(reservation_serializer.data)
            except:
                return Response("Customer doesn't exist.")
        else:
            return Response("You shall not PASS!!!")
    elif request.method == 'POST':
        if admin.is_superuser:
            try:
                user_object = User.objects.get(username=customer)
                customer_object = Customer.objects.get(username=user_object)
                update_reservation_object = Reservation.objects.filter(customer=customer_object, id=data["id"]).update(note=data["note"])
                return Response("Update Customer history successfully.")
            except:
                return Response("Customer doesn't exist.")
        else:
            return Response("You shall not PASS!!!")

@api_view(['POST'])
@login_required(login_url='login')
def register(request):
    """
    Register new customer.

    Args:
        request: The request from web page.

    Returns:
        POST: New customer.
    """
    admin = request.user
    data = request.data
    if request.method == 'POST':
        if admin.is_superuser:
            user = User.objects.create( username = data['username'],
                                        email = data['email'],
                                        first_name = data['name'],
                                        last_name = data['surname'])
            user.set_password(data['password'])
            user.save()
            customer = Customer.objects.create( username = user,
                                                name = data['name'],
                                                surname = data['surname'],
                                                email =data['email'],
                                                address = data['address'],
                                                note = data['note'])
            customer_reservation = CustomerSerializer(customer, many=False)
            return Response(customer_reservation.data)
        else:
            return Response("You shall not PASS!!!")

@api_view(['GET'])
@login_required(login_url='login')
def get_store(request):
    """
    Get store data.

    Args:
        request: The request from web page.

    Returns:
        GET: A specific data from store.
    """
    if request.method == 'GET':
        store_object = Store.objects.all()
        store_serializer = StoreSerializer(store_object, many=True)
        return Response(store_serializer.data)

@api_view(['GET', 'POST'])
@login_required(login_url='login')
def manager_confirmation(request):
    """
    Confirmation for each reservation.

    Args:
        request: The request from web page.

    Returns:
        GET: All reservation that haven't been confirm yet.
        POST: Confirm a reservation.
    """
    admin = request.user
    data = request.data
    if request.method == 'GET':
        if admin.is_superuser:
            try:
                reservation_object = Reservation.objects.filter(confirmation=False, start__gte=datetime.today())
                reservation_serializer = ReservationSerializer(reservation_object, many=True)
                return Response(reservation_serializer.data)
            except:
                return Response("All reservation are confirmed.")
        else:
            return Response("You shall not PASS!!!")
    elif request.method == 'POST':
        if admin.is_superuser:
            try:
                reservation_object = Reservation.objects.filter(id=data["id"]).update(confirmation=True)
                return Response("Reservation confirmed.")
            except:
                return Response("Reservation doesn't exist.")
        else:
            return Response("You shall not PASS!!!")